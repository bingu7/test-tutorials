// MkDocs Material SPA 支持
(function() {
    'use strict';

    // 基础路径解析：从 canonical URL 推导站点子路径
    function getBasePath() {
        try {
            var canonical = document.querySelector('link[rel="canonical"]');
            if (canonical && canonical.href) {
                var pathname = new URL(canonical.href).pathname;
                if (pathname.length > 1 && pathname.endsWith('/')) {
                    return pathname.replace(/\/+$/, '');
                }
            }
        } catch(e) {}
        return '';
    }

    function resolveUrl(url) {
        if (url && url.charAt(0) === '/') {
            return getBasePath() + url;
        }
        return url;
    }

    // 测验 ID → 复习建议/下一步映射
    var QUIZ_REVIEW_MAP = {
        'python-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/Python基础教程-软件测试版/', text: 'Python 基础教程' }],
            reviewFocus: '重点关注：函数定义、数据类型、异常处理、模块导入',
            passLinks: [
                { url: '/工具操作/数据库SQL教程-软件测试版/', text: '数据库 SQL 教程' },
                { url: '/工具操作/Linux实用教程-软件测试版/', text: 'Linux 实用教程' }
            ],
            passText: 'Python 基础已掌握，建议继续学习：',
            failText: '建议先巩固 Python 基础，再继续学习其他内容。'
        },
        'sql-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/数据库SQL教程-软件测试版/', text: '数据库 SQL 教程' }],
            reviewFocus: '重点关注：JOIN 多表查询、GROUP BY 分组、NULL 值处理、LIMIT 分页',
            passLinks: [
                { url: '/工具操作/Postman接口测试教程-软件测试版/', text: 'Postman 接口测试' },
                { url: '/工具操作/Fiddler抓包教程-软件测试版/', text: 'Fiddler 抓包教程' }
            ],
            passText: 'SQL 基础已掌握，建议继续学习：',
            failText: '建议先巩固 SQL 基础，再继续学习其他内容。'
        },
        'api-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/专项测试/接口测试完整教程-软件测试版/', text: '接口测试方法论' }],
            reviewFocus: '重点关注：HTTP 方法、状态码、接口用例设计、断言策略',
            passLinks: [
                { url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/', text: 'Python 接口自动化' },
                { url: '/专项测试/JMeter性能测试教程-软件测试版/', text: 'JMeter 性能测试' }
            ],
            passText: '接口测试基础已掌握，建议继续学习：',
            failText: '建议先巩固接口测试基础，再继续学习其他内容。'
        }
    };

    function initAll() {
        initHeaderTabsOnScroll();
        initQuizzes();
        initProgressTracker();
        initReadingProgress();
        initRelatedTutorials();
        initKeyboardShortcuts();
        initScrollMemory();

        // 初始化学习进度系统
        if (typeof initTutorialPage === 'function') {
            initTutorialPage();
        }
    }

    document.addEventListener('DOMContentLoaded', initAll);
    if (typeof document$ !== 'undefined') {
        document$.subscribe(initAll);
    }

    // ==================== 向上滚动时显示顶部主导航 ====================
    function initHeaderTabsOnScroll() {
        syncScrollTabs();

        if (window.__headerTabsOnScrollInitialized) return;
        window.__headerTabsOnScrollInitialized = true;

        var root = document.documentElement;
        var lastY = window.scrollY || document.documentElement.scrollTop || 0;
        var revealThreshold = 120;
        var ticking = false;

        function syncHeaderHeight() {
            var header = document.querySelector('.md-header');
            if (!header) return;
            root.style.setProperty('--scroll-header-height', header.getBoundingClientRect().height + 'px');
        }

        function applyState() {
            syncHeaderHeight();

            var currentY = window.scrollY || document.documentElement.scrollTop || 0;
            var delta = currentY - lastY;
            var canRevealTabs = currentY > revealThreshold;

            root.classList.toggle('md-scroll-top', currentY <= 8);

            if (Math.abs(delta) >= 4) {
                root.classList.toggle('md-scroll-down', delta > 0 && currentY > 8);
                root.classList.toggle('md-scroll-up', delta < 0 && canRevealTabs);
                lastY = currentY;
            }

            if (!canRevealTabs) {
                root.classList.remove('md-scroll-up');
            }

            ticking = false;
        }

        function requestUpdate() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(applyState);
        }

        applyState();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', syncHeaderHeight);
    }

    function syncScrollTabs() {
        var source = document.querySelector('.md-tabs .md-tabs__list');
        if (!source) return;

        var nav = document.querySelector('.scroll-tabs');
        if (!nav) {
            nav = document.createElement('nav');
            nav.className = 'scroll-tabs';
            nav.setAttribute('aria-label', '主导航');
            nav.innerHTML = '<div class="md-grid scroll-tabs__inner"></div>';
            document.body.appendChild(nav);
        }

        var inner = nav.querySelector('.scroll-tabs__inner');
        inner.innerHTML = '';

        source.querySelectorAll('.md-tabs__link').forEach(function(link) {
            var item = document.createElement('a');
            item.className = 'scroll-tabs__link';
            item.href = link.href;
            item.textContent = link.textContent.trim();
            if (link.classList.contains('md-tabs__link--active')) {
                item.classList.add('scroll-tabs__link--active');
            }
            inner.appendChild(item);
        });
    }

    // ==================== 滚动位置记忆 ====================
    var __scrollMemoryInitialized = false;
    function initScrollMemory() {
        if (__scrollMemoryInitialized) return;
        __scrollMemoryInitialized = true;

        var key = 'scroll-' + window.location.pathname;
        var tocKey = 'toc-' + window.location.pathname;

        // 恢复主页面滚动位置
        var saved = sessionStorage.getItem(key);
        if (saved) {
            var pos = parseInt(saved, 10);
            if (pos > 0) {
                setTimeout(function() {
                    window.scrollTo(0, pos);
                }, 100);
            }
        }

        // 恢复右侧目录（TOC）滚动位置
        var tocWrap = document.querySelector('.md-sidebar--secondary .md-sidebar__scrollwrap');
        if (tocWrap) {
            var savedToc = sessionStorage.getItem(tocKey);
            if (savedToc) {
                var tocPos = parseInt(savedToc, 10);
                if (tocPos > 0) {
                    setTimeout(function() {
                        tocWrap.scrollTop = tocPos;
                    }, 100);
                }
            }

            // 保存 TOC 滚动位置
            tocWrap.addEventListener('scroll', function() {
                sessionStorage.setItem(tocKey, tocWrap.scrollTop);
            });
        }

        // 保存主页面滚动位置（页面离开前）
        window.addEventListener('beforeunload', function() {
            sessionStorage.setItem(key, window.scrollY);
        });

        // SPA 导航时也保存
        if (typeof location$ !== 'undefined') {
            location$.subscribe(function() {
                sessionStorage.setItem(key, window.scrollY);
                if (tocWrap) {
                    sessionStorage.setItem(tocKey, tocWrap.scrollTop);
                }
            });
        }
    }

    // ==================== 测验功能 ====================
    function initQuizzes() {
        document.querySelectorAll('.quiz-container').forEach(function(quiz) {
            if (quiz.dataset.initialized) return;
            quiz.dataset.initialized = 'true';

            var quizId = quiz.dataset.quizId || 'quiz-' + Math.random().toString(36).substr(2, 9);
            quiz.dataset.quizId = quizId;

            var submitBtn = quiz.querySelector('.quiz-submit');
            if (submitBtn) {
                submitBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    checkQuizAnswers(quiz);
                });
            }

            var saved = localStorage.getItem('quiz-' + quizId);
            if (saved) {
                try {
                    var answers = JSON.parse(saved);
                    var items = quiz.querySelectorAll('.quiz-item');
                    answers.forEach(function(answer, index) {
                        if (index < items.length && answer >= 0) {
                            var options = items[index].querySelectorAll('input[type="radio"]');
                            if (options[answer]) options[answer].checked = true;
                        }
                    });
                } catch(e) {
                    console.warn('Failed to restore quiz answers:', e);
                }
            }
        });
    }

    function checkQuizAnswers(quiz) {
        var items = quiz.querySelectorAll('.quiz-item');
        var correct = 0;
        var total = items.length;
        var wrongQuestions = [];

        items.forEach(function(item, index) {
            var options = item.querySelectorAll('.quiz-option');
            var correctIndex = parseInt(item.dataset.correct);
            var selected = item.querySelector('input[type="radio"]:checked');
            var explanation = item.querySelector('.quiz-explanation');
            var questionText = item.querySelector('.quiz-question').textContent;

            options.forEach(function(opt, i) {
                opt.classList.remove('correct', 'incorrect');
                if (i === correctIndex) opt.classList.add('correct');
            });

            if (selected) {
                var selectedIndex = Array.from(options).indexOf(selected.parentElement);
                if (selectedIndex !== correctIndex) {
                    selected.parentElement.classList.add('incorrect');
                    wrongQuestions.push({
                        index: index + 1,
                        question: questionText,
                        correctAnswer: options[correctIndex].textContent.trim()
                    });
                } else {
                    correct++;
                }
            }
            if (explanation) explanation.classList.add('show');
        });

        var quizId = quiz.dataset.quizId;
        var answers = [];
        items.forEach(function(q) {
            var s = q.querySelector('input[type="radio"]:checked');
            answers.push(s ? Array.from(q.querySelectorAll('input[type="radio"]')).indexOf(s) : -1);
        });
        localStorage.setItem('quiz-' + quizId, JSON.stringify(answers));

        // 保存测验结果到学习进度系统
        if (typeof saveQuizResult === 'function') {
            saveQuizResult(quizId, correct, total);
        }

        var scoreDiv = quiz.querySelector('.quiz-score');
        if (!scoreDiv) {
            scoreDiv = document.createElement('div');
            scoreDiv.className = 'quiz-score';
            quiz.appendChild(scoreDiv);
        }

        var percentage = Math.round((correct / total) * 100);
        var emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';

        // 构建反馈内容
        var feedbackHtml = '<div class="quiz-feedback">';
        feedbackHtml += '<div class="quiz-score-main">' + emoji + ' 得分：<strong>' + correct + '/' + total + '</strong> (' + percentage + '%)</div>';

        // 根据分数给出建议
        feedbackHtml += '<div class="quiz-advice">';
        if (percentage >= 80) {
            feedbackHtml += '<p class="advice-good">✅ 恭喜！你已经掌握了这部分知识，可以继续学习下一阶段。</p>';
        } else if (percentage >= 60) {
            feedbackHtml += '<p class="advice-ok">👍 基础掌握不错，但还有提升空间。建议复习错题相关知识点。</p>';
        } else {
            feedbackHtml += '<p class="advice-need-work">💪 建议回看基础教程，巩固薄弱知识点后再继续。</p>';
        }
        feedbackHtml += '</div>';

        // 显示错题分析
        var quizConfig = QUIZ_REVIEW_MAP[quizId];
        if (wrongQuestions.length > 0) {
            feedbackHtml += '<div class="quiz-wrong-analysis">';
            feedbackHtml += '<h4>📝 错题分析</h4>';
            feedbackHtml += '<p>你答错了 ' + wrongQuestions.length + ' 道题：</p>';
            feedbackHtml += '<ul>';
            wrongQuestions.forEach(function(q) {
                feedbackHtml += '<li><strong>第 ' + q.index + ' 题：</strong>' + q.question + '</li>';
            });
            feedbackHtml += '</ul>';

            // 根据测验类型给出复习建议
            if (quizConfig) {
                feedbackHtml += '<div class="quiz-review-suggestion">';
                feedbackHtml += '<h4>📚 复习建议</h4>';
                feedbackHtml += '<p>' + quizConfig.reviewText + '</p>';
                feedbackHtml += '<ul>';
                quizConfig.reviewLinks.forEach(function(link) {
                    feedbackHtml += '<li><a href="' + resolveUrl(link.url) + '">' + link.text + '</a></li>';
                });
                feedbackHtml += '<li>' + quizConfig.reviewFocus + '</li>';
                feedbackHtml += '</ul>';
                feedbackHtml += '</div>';
            }
            feedbackHtml += '</div>';
        }

        // 下一步建议
        feedbackHtml += '<div class="quiz-next-step">';
        feedbackHtml += '<h4>🎯 下一步建议</h4>';
        if (quizConfig) {
            if (percentage >= 80) {
                feedbackHtml += '<p>' + quizConfig.passText + '</p>';
                feedbackHtml += '<ul>';
                quizConfig.passLinks.forEach(function(link) {
                    feedbackHtml += '<li><a href="' + resolveUrl(link.url) + '">' + link.text + '</a></li>';
                });
                feedbackHtml += '</ul>';
            } else {
                feedbackHtml += '<p>' + quizConfig.failText + '</p>';
            }
        } else {
            // 通用 fallback
            if (percentage >= 80) {
                feedbackHtml += '<p>测验通过！可以继续学习下一阶段内容。</p>';
            } else {
                feedbackHtml += '<p>建议巩固当前知识点后再继续学习。</p>';
            }
        }
        feedbackHtml += '</div>';

        feedbackHtml += '</div>';

        scoreDiv.innerHTML = feedbackHtml;
        scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ==================== 进度追踪 ====================
    function initProgressTracker() {
        document.querySelectorAll('.progress-tracker').forEach(function(tracker) {
            if (tracker.dataset.initialized) return;
            tracker.dataset.initialized = 'true';

            var category = tracker.dataset.category;
            if (!category) return;

            var key = 'progress-' + category;
            var items = tracker.querySelectorAll('.progress-item');
            var saved = localStorage.getItem(key);
            var checked = saved ? JSON.parse(saved) : [];

            items.forEach(function(item, index) {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = checked.indexOf(index) !== -1;
                checkbox.style.marginRight = '0.5rem';
                checkbox.style.accentColor = 'var(--md-primary-fg-color)';

                checkbox.addEventListener('change', function() {
                    var currentChecked = [];
                    items.forEach(function(it, i) {
                        if (it.querySelector('input[type="checkbox"]').checked) currentChecked.push(i);
                    });
                    localStorage.setItem(key, JSON.stringify(currentChecked));
                    updateProgressBar(tracker, items.length, currentChecked.length);
                });

                item.insertBefore(checkbox, item.firstChild);
            });

            updateProgressBar(tracker, items.length, checked.length);
        });
    }

    function updateProgressBar(tracker, total, completed) {
        var fill = tracker.querySelector('.progress-fill');
        var text = tracker.querySelector('.progress-text');
        if (fill && text) {
            var percentage = Math.round((completed / total) * 100);
            fill.style.width = percentage + '%';
            text.textContent = '已完成 ' + completed + '/' + total + ' (' + percentage + '%)';
        }
    }

    // ==================== 阅读进度条 ====================
    function initReadingProgress() {
        var existing = document.querySelector('.reading-progress');
        if (existing) existing.remove();

        var progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        function updateProgress() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    // ==================== 相关推荐 ====================
    function initRelatedTutorials() {
        var content = document.querySelector('.md-content__inner');
        if (!content) return;
        if (document.querySelector('.related-tutorials')) return;

        var path = window.location.pathname;

        var relatedMap = {
            'Python基础教程-软件测试版': [
                { icon: '📝', title: 'Python 基础测验', url: '/基础理论/Python基础测验/' },
                { icon: '🧪', title: '接口自动化教程', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' },
                { icon: '🌐', title: '前端基础教程', url: '/基础理论/前端基础教程-软件测试版/' }
            ],
            '软件测试理论基础教程': [
                { icon: '📚', title: 'ISTQB 术语速查', url: '/基础理论/ISTQB软件测试术语速查/' },
                { icon: '🔍', title: '探索式测试教程', url: '/基础理论/探索式测试教程-软件测试版/' },
                { icon: '🏃', title: '敏捷测试教程', url: '/基础理论/敏捷测试教程-软件测试版/' }
            ],
            'ISTQB软件测试术语速查': [
                { icon: '📖', title: '软件测试理论基础', url: '/基础理论/软件测试理论基础教程/' },
                { icon: '🏔️', title: '测试金字塔与分层策略', url: '/基础理论/测试金字塔与自动化分层策略/' },
                { icon: '🔍', title: '探索式测试教程', url: '/基础理论/探索式测试教程-软件测试版/' }
            ],
            '测试金字塔与自动化分层策略': [
                { icon: '📖', title: '软件测试理论基础', url: '/基础理论/软件测试理论基础教程/' },
                { icon: '🧪', title: '接口自动化教程', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' },
                { icon: '🎭', title: 'Selenium Web 自动化', url: '/自动化测试/Selenium-Web自动化教程-软件测试版/' }
            ],
            '探索式测试教程': [
                { icon: '📖', title: '软件测试理论基础', url: '/基础理论/软件测试理论基础教程/' },
                { icon: '📋', title: '测试用例模板', url: '/模板库/测试用例模板/' },
                { icon: '🐛', title: '缺陷报告模板', url: '/模板库/缺陷报告模板/' }
            ],
            '前端基础教程': [
                { icon: '🐍', title: 'Python 基础教程', url: '/基础理论/Python基础教程-软件测试版/' },
                { icon: '🎭', title: 'Selenium Web 自动化', url: '/自动化测试/Selenium-Web自动化教程-软件测试版/' },
                { icon: '🎪', title: 'Playwright 自动化', url: '/自动化测试/Playwright自动化测试教程-软件测试版/' }
            ],
            '敏捷测试教程': [
                { icon: '📖', title: '软件测试理论基础', url: '/基础理论/软件测试理论基础教程/' },
                { icon: '📋', title: '测试计划模板', url: '/模板库/测试计划模板/' },
                { icon: '📊', title: '测试报告模板', url: '/模板库/测试报告模板/' }
            ],
            '数据库SQL教程': [
                { icon: '📝', title: 'SQL 基础测验', url: '/工具操作/SQL基础测验/' },
                { icon: '🗄️', title: 'Redis 与 MongoDB', url: '/工具操作/Redis与MongoDB教程-软件测试版/' },
                { icon: '🔗', title: '接口测试方法论', url: '/专项测试/接口测试完整教程-软件测试版/' }
            ],
            'Redis与MongoDB教程': [
                { icon: '🗃️', title: '数据库 SQL 教程', url: '/工具操作/数据库SQL教程-软件测试版/' },
                { icon: '🐳', title: 'Docker 容器教程', url: '/工具操作/Docker容器教程-软件测试版/' },
                { icon: '🚀', title: 'Jenkins CI/CD', url: '/持续集成/Jenkins-CICD教程-软件测试版/' }
            ],
            'Linux实用教程': [
                { icon: '📦', title: 'Docker 容器教程', url: '/工具操作/Docker容器教程-软件测试版/' },
                { icon: '🔄', title: 'Git 版本控制', url: '/工具操作/Git版本控制教程-软件测试版/' },
                { icon: '🚀', title: 'Jenkins CI/CD', url: '/持续集成/Jenkins-CICD教程-软件测试版/' }
            ],
            'Git版本控制教程': [
                { icon: '🐧', title: 'Linux 实用教程', url: '/工具操作/Linux实用教程-软件测试版/' },
                { icon: '🐳', title: 'Docker 容器教程', url: '/工具操作/Docker容器教程-软件测试版/' },
                { icon: '🚀', title: 'Jenkins CI/CD', url: '/持续集成/Jenkins-CICD教程-软件测试版/' }
            ],
            'Docker容器教程': [
                { icon: '🐧', title: 'Linux 实用教程', url: '/工具操作/Linux实用教程-软件测试版/' },
                { icon: '🚀', title: 'Jenkins CI/CD', url: '/持续集成/Jenkins-CICD教程-软件测试版/' },
                { icon: '🏗️', title: 'CI/CD 自动化回归实战', url: '/项目实战/CICD自动化回归实战/' }
            ],
            'Fiddler抓包教程': [
                { icon: '📮', title: 'Postman 接口教程', url: '/工具操作/Postman接口测试教程-软件测试版/' },
                { icon: '🔗', title: '接口抓包联调实战', url: '/工具操作/接口抓包联调实战教程-软件测试版/' },
                { icon: '🌐', title: '网络知识教程', url: '/工具操作/网络知识教程-软件测试版/' }
            ],
            'Postman接口测试教程': [
                { icon: '🕵️', title: 'Fiddler 抓包教程', url: '/工具操作/Fiddler抓包教程-软件测试版/' },
                { icon: '🔗', title: '接口抓包联调实战', url: '/工具操作/接口抓包联调实战教程-软件测试版/' },
                { icon: '🧪', title: '接口自动化教程', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' }
            ],
            '接口抓包联调实战教程': [
                { icon: '📮', title: 'Postman 接口教程', url: '/工具操作/Postman接口测试教程-软件测试版/' },
                { icon: '🕵️', title: 'Fiddler 抓包教程', url: '/工具操作/Fiddler抓包教程-软件测试版/' },
                { icon: '🔗', title: '接口测试方法论', url: '/专项测试/接口测试完整教程-软件测试版/' }
            ],
            '正则表达式教程': [
                { icon: '🗃️', title: '数据库 SQL 教程', url: '/工具操作/数据库SQL教程-软件测试版/' },
                { icon: '🐧', title: 'Linux 实用教程', url: '/工具操作/Linux实用教程-软件测试版/' },
                { icon: '📮', title: 'Postman 接口教程', url: '/工具操作/Postman接口测试教程-软件测试版/' }
            ],
            '网络知识教程': [
                { icon: '🕵️', title: 'Fiddler 抓包教程', url: '/工具操作/Fiddler抓包教程-软件测试版/' },
                { icon: '📮', title: 'Postman 接口教程', url: '/工具操作/Postman接口测试教程-软件测试版/' },
                { icon: '🔒', title: 'Web 安全测试', url: '/专项测试/Web安全测试教程-软件测试版/' }
            ],
            '接口测试完整教程': [
                { icon: '📮', title: 'Postman 接口教程', url: '/工具操作/Postman接口测试教程-软件测试版/' },
                { icon: '🧪', title: '接口自动化教程', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' },
                { icon: '📋', title: '接口测试用例模板', url: '/模板库/接口测试用例模板/' }
            ],
            'JMeter性能测试教程': [
                { icon: '🧪', title: '接口自动化教程', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' },
                { icon: '🐳', title: 'Docker 容器教程', url: '/工具操作/Docker容器教程-软件测试版/' },
                { icon: '🏗️', title: '性能测试项目实战', url: '/项目实战/性能测试项目实战/' }
            ],
            'Web安全测试教程': [
                { icon: '🌐', title: '网络知识教程', url: '/工具操作/网络知识教程-软件测试版/' },
                { icon: '🔗', title: '接口测试方法论', url: '/专项测试/接口测试完整教程-软件测试版/' },
                { icon: '📮', title: 'Postman 接口教程', url: '/工具操作/Postman接口测试教程-软件测试版/' }
            ],
            'Python+Requests+Allure接口自动化教程': [
                { icon: '🐍', title: 'Python 基础教程', url: '/基础理论/Python基础教程-软件测试版/' },
                { icon: '🎭', title: 'Selenium Web 自动化', url: '/自动化测试/Selenium-Web自动化教程-软件测试版/' },
                { icon: '🏗️', title: '接口自动化项目实战', url: '/项目实战/接口自动化项目实战/' }
            ],
            'Selenium-Web自动化教程': [
                { icon: '🎪', title: 'Playwright 自动化', url: '/自动化测试/Playwright自动化测试教程-软件测试版/' },
                { icon: '🌐', title: '前端基础教程', url: '/基础理论/前端基础教程-软件测试版/' },
                { icon: '🏗️', title: 'Web 自动化项目实战', url: '/项目实战/Web自动化项目实战/' }
            ],
            'Playwright自动化测试教程': [
                { icon: '🎭', title: 'Selenium Web 自动化', url: '/自动化测试/Selenium-Web自动化教程-软件测试版/' },
                { icon: '🌐', title: '前端基础教程', url: '/基础理论/前端基础教程-软件测试版/' },
                { icon: '🏗️', title: 'Web 自动化项目实战', url: '/项目实战/Web自动化项目实战/' }
            ],
            'Appium-App自动化教程': [
                { icon: '🎭', title: 'Selenium Web 自动化', url: '/自动化测试/Selenium-Web自动化教程-软件测试版/' },
                { icon: '🎪', title: 'Playwright 自动化', url: '/自动化测试/Playwright自动化测试教程-软件测试版/' },
                { icon: '🧪', title: '接口自动化教程', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' }
            ],
            'Jenkins-CICD教程': [
                { icon: '🐳', title: 'Docker 容器教程', url: '/工具操作/Docker容器教程-软件测试版/' },
                { icon: '🔄', title: 'Git 版本控制', url: '/工具操作/Git版本控制教程-软件测试版/' },
                { icon: '🏗️', title: 'CI/CD 自动化回归实战', url: '/项目实战/CICD自动化回归实战/' }
            ],
            'Python基础测验': [
                { icon: '🐍', title: 'Python 基础教程', url: '/基础理论/Python基础教程-软件测试版/' },
                { icon: '🗃️', title: 'SQL 基础测验', url: '/工具操作/SQL基础测验/' },
                { icon: '🔗', title: '接口测试方法论', url: '/专项测试/接口测试完整教程-软件测试版/' }
            ],
            'SQL基础测验': [
                { icon: '🗃️', title: '数据库 SQL 教程', url: '/工具操作/数据库SQL教程-软件测试版/' },
                { icon: '🐍', title: 'Python 基础测验', url: '/基础理论/Python基础测验/' },
                { icon: '🗄️', title: 'Redis 与 MongoDB', url: '/工具操作/Redis与MongoDB教程-软件测试版/' }
            ]
        };

        var currentKey = null;
        Object.keys(relatedMap).forEach(function(key) {
            if (path.indexOf(key) !== -1) currentKey = key;
        });

        if (!currentKey) return;

        var related = relatedMap[currentKey];
        if (!related || related.length === 0) return;

        var relatedDiv = document.createElement('div');
        relatedDiv.className = 'related-tutorials';
        relatedDiv.innerHTML = '<h4>📖 相关推荐</h4><div class="related-grid"></div>';

        var grid = relatedDiv.querySelector('.related-grid');
        related.forEach(function(item) {
            var link = document.createElement('a');
            link.className = 'related-item';
            link.href = resolveUrl(item.url);
            link.innerHTML = '<span class="related-item-icon">' + item.icon + '</span><span class="related-item-text">' + item.title + '</span>';
            grid.appendChild(link);
        });

        var article = document.querySelector('article');
        if (article) article.appendChild(relatedDiv);
    }

    // ==================== 快捷键支持 ====================
    function initKeyboardShortcuts() {
        var navDebounce = false;
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.closest('input, textarea'))) {
                e.preventDefault();
                var searchInput = document.querySelector('.md-search__input');
                if (searchInput) searchInput.focus();
            }

            if (!e.target.closest('input, textarea, select')) {
                var prevLink = document.querySelector('.md-footer__link--prev');
                var nextLink = document.querySelector('.md-footer__link--next');
                if (e.key === 'ArrowLeft' && prevLink && !navDebounce) {
                    navDebounce = true;
                    window.location.href = prevLink.href;
                } else if (e.key === 'ArrowRight' && nextLink && !navDebounce) {
                    navDebounce = true;
                    window.location.href = nextLink.href;
                }
            }
        });
    }

})();
