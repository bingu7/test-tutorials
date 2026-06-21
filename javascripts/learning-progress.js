// ==================== 学习进度管理 2.0 ====================
// 使用 localStorage 保存学习状态，支持五阶段学习路径

(function() {
    'use strict';

    // 学习进度存储键
    var STORAGE_KEY = 'learning-progress-2.0';

    // 测验 ID → URL 映射
    var QUIZ_URLS = {
        'python-basics': '/基础理论/Python基础测验/',
        'sql-basics': '/工具操作/SQL基础测验/',
        'api-basics': '/专项测试/接口测试基础测验/',
        'playwright-basics': '/自动化测试/Playwright基础测验/'
    };

    // 测验 ID → 中文名映射
    var QUIZ_NAMES = {
        'python-basics': 'Python 基础测验',
        'sql-basics': 'SQL 基础测验',
        'api-basics': '接口测试基础测验',
        'playwright-basics': 'Playwright 基础测验'
    };

    // 五阶段学习路径配置
    var LEARNING_PHASES = {
        phase1: {
            name: '测试入门',
            description: '建立测试思维，理解测试流程、术语、用例设计和缺陷管理',
            tutorials: [
                { id: '基础理论/软件测试理论基础教程', name: '软件测试理论基础', url: '/基础理论/软件测试理论基础教程/' },
                { id: '基础理论/ISTQB软件测试术语速查', name: 'ISTQB 术语速查', url: '/基础理论/ISTQB软件测试术语速查/' },
                { id: '基础理论/测试金字塔与自动化分层策略', name: '测试金字塔与分层策略', url: '/基础理论/测试金字塔与自动化分层策略/' },
                { id: '基础理论/探索式测试教程', name: '探索式测试', url: '/基础理论/探索式测试教程-软件测试版/' },
                { id: '基础理论/敏捷测试教程', name: '敏捷测试', url: '/基础理论/敏捷测试教程-软件测试版/' }
            ],
            quizzes: ['python-basics'],
            practiceUrl: '/章节练习与参考答案/'
        },
        phase2: {
            name: '工具实战',
            description: '掌握 SQL、Linux、Git、Postman、Fiddler、网络知识等高频工具',
            tutorials: [
                { id: '工具操作/数据库SQL教程', name: '数据库 SQL', url: '/工具操作/数据库SQL教程-软件测试版/' },
                { id: '工具操作/SQL基础测验', name: 'SQL 基础测验', url: '/工具操作/SQL基础测验/' },
                { id: '工具操作/Linux实用教程', name: 'Linux 实用', url: '/工具操作/Linux实用教程-软件测试版/' },
                { id: '工具操作/Git版本控制教程', name: 'Git 版本控制', url: '/工具操作/Git版本控制教程-软件测试版/' },
                { id: '工具操作/Docker容器教程', name: 'Docker 容器', url: '/工具操作/Docker容器教程-软件测试版/' },
                { id: '工具操作/Postman接口测试教程', name: 'Postman 接口', url: '/工具操作/Postman接口测试教程-软件测试版/' },
                { id: '工具操作/Fiddler抓包教程', name: 'Fiddler 抓包', url: '/工具操作/Fiddler抓包教程-软件测试版/' },
                { id: '工具操作/正则表达式教程', name: '正则表达式', url: '/工具操作/正则表达式教程-软件测试版/' },
                { id: '工具操作/网络知识教程', name: '网络知识', url: '/工具操作/网络知识教程-软件测试版/' }
            ],
            quizzes: ['sql-basics'],
            practiceUrl: '/章节练习与参考答案/'
        },
        phase3: {
            name: '专项测试',
            description: '掌握接口测试、性能测试、安全测试等专项能力',
            tutorials: [
                { id: '专项测试/接口测试完整教程', name: '接口测试方法论', url: '/专项测试/接口测试完整教程-软件测试版/' },
                { id: '专项测试/JMeter性能测试教程', name: 'JMeter 性能测试', url: '/专项测试/JMeter性能测试教程-软件测试版/' },
                { id: '专项测试/Web安全测试教程', name: 'Web 安全测试', url: '/专项测试/Web安全测试教程-软件测试版/' },
                { id: '工具操作/Redis与MongoDB教程', name: 'Redis 与 MongoDB', url: '/工具操作/Redis与MongoDB教程-软件测试版/' },
                { id: '工具操作/接口抓包联调实战教程', name: '接口抓包联调实战', url: '/工具操作/接口抓包联调实战教程-软件测试版/' }
            ],
            quizzes: ['api-basics'],
            practiceUrl: '/章节练习与参考答案/'
        },
        phase4: {
            name: '自动化测试',
            description: '掌握 Python 接口自动化、Selenium、Playwright、Appium',
            tutorials: [
                { id: '基础理论/Python基础教程', name: 'Python 基础', url: '/基础理论/Python基础教程-软件测试版/' },
                { id: '基础理论/前端基础教程', name: '前端基础', url: '/基础理论/前端基础教程-软件测试版/' },
                { id: '自动化测试/Python+Requests+Allure接口自动化教程', name: 'Python 接口自动化', url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/' },
                { id: '自动化测试/Selenium-Web自动化教程', name: 'Selenium Web 自动化', url: '/自动化测试/Selenium-Web自动化教程-软件测试版/' },
                { id: '自动化测试/Playwright自动化测试教程', name: 'Playwright Web 自动化', url: '/自动化测试/Playwright自动化测试教程-软件测试版/' },
                { id: '自动化测试/Appium-App自动化教程', name: 'Appium App 自动化', url: '/自动化测试/Appium-App自动化教程-软件测试版/' }
            ],
            quizzes: ['playwright-basics'],
            practiceUrl: '/章节练习与参考答案/'
        },
        phase5: {
            name: '项目与面试',
            description: '完成项目实战，输出作品集材料，并能进行面试表达',
            tutorials: [
                { id: '项目实战/电商系统测试实战', name: '电商系统测试实战', url: '/项目实战/电商系统测试实战/' },
                { id: '项目实战/接口自动化项目实战', name: '接口自动化项目实战', url: '/项目实战/接口自动化项目实战/' },
                { id: '项目实战/Web自动化项目实战', name: 'Web 自动化项目实战', url: '/项目实战/Web自动化项目实战/' },
                { id: '项目实战/性能测试项目实战', name: '性能测试项目实战', url: '/项目实战/性能测试项目实战/' },
                { id: '项目实战/CICD自动化回归实战', name: 'CI/CD 自动化回归实战', url: '/项目实战/CICD自动化回归实战/' }
            ],
            quizzes: [],
            practiceUrl: '/项目实战/'
        }
    };

    // 使用 common.js 提供的共享函数
    var getBasePath = window.__getBasePath || function() { return ''; };
    var resolveUrl = window.__resolveUrl || function(u) { return u; };

    // 初始化学习进度数据
    function getProgressData() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch(e) {
                console.error('Failed to parse learning progress:', e);
            }
        }
        return {
            learned: {},
            practice: {},
            quiz: {},
            lastUpdated: new Date().toISOString()
        };
    }

    // 保存学习进度数据
    function saveProgressData(data) {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 标记教程为已学习
    window.markTutorialLearned = function(tutorialId) {
        var data = getProgressData();
        data.learned[tutorialId] = true;
        saveProgressData(data);
        updateAllProgressDisplays();
    };

    // 取消教程已学习标记
    window.unmarkTutorialLearned = function(tutorialId) {
        var data = getProgressData();
        delete data.learned[tutorialId];
        saveProgressData(data);
        updateAllProgressDisplays();
    };

    // 检查教程是否已学习
    window.isTutorialLearned = function(tutorialId) {
        var data = getProgressData();
        return data.learned[tutorialId] === true;
    };

    // 保存测验结果
    window.saveQuizResult = function(quizId, score, total) {
        var data = getProgressData();
        data.quiz[quizId] = {
            score: score,
            total: total,
            percentage: Math.round((score / total) * 100),
            completedAt: new Date().toISOString()
        };
        saveProgressData(data);
    };

    // 获取测验结果
    window.getQuizResult = function(quizId) {
        var data = getProgressData();
        return data.quiz[quizId] || null;
    };

    // 获取阶段完成度（带缓存，避免循环中重复读 localStorage）
    var _progressCache = null;
    var _progressCacheTime = 0;
    function getCachedProgressData() {
        var now = Date.now();
        if (!_progressCache || now - _progressCacheTime > 200) {
            _progressCache = getProgressData();
            _progressCacheTime = now;
        }
        return _progressCache;
    }
    function invalidateProgressCache() {
        _progressCache = null;
    }

    // 重写 saveProgressData 以清除缓存
    var _origSaveProgressData = saveProgressData;
    saveProgressData = function(data) {
        _origSaveProgressData(data);
        invalidateProgressCache();
    };

    window.getPhaseProgress = function(phaseId) {
        var phase = LEARNING_PHASES[phaseId];
        if (!phase) return { completed: 0, total: 0, percentage: 0 };

        var data = getCachedProgressData();
        var completed = 0;
        var total = phase.tutorials.length;

        phase.tutorials.forEach(function(tutorial) {
            if (data.learned[tutorial.id]) {
                completed++;
            }
        });

        return {
            completed: completed,
            total: total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    };

    // 获取当前推荐阶段
    window.getCurrentPhase = function() {
        var phases = Object.keys(LEARNING_PHASES);
        for (var i = 0; i < phases.length; i++) {
            var progress = getPhaseProgress(phases[i]);
            if (progress.percentage < 100) {
                return phases[i];
            }
        }
        return phases[phases.length - 1]; // 全部完成，返回最后阶段
    };

    // 获取下一步建议
    window.getNextRecommendation = function() {
        var currentPhaseId = getCurrentPhase();
        var phase = LEARNING_PHASES[currentPhaseId];
        var data = getCachedProgressData();

        // 找到当前阶段第一个未学习的教程
        for (var i = 0; i < phase.tutorials.length; i++) {
            if (!data.learned[phase.tutorials[i].id]) {
                return {
                    phaseId: currentPhaseId,
                    phaseName: phase.name,
                    tutorial: phase.tutorials[i],
                    message: '建议先学习：' + phase.tutorials[i].name
                };
            }
        }

        // 当前阶段所有教程都学完，检查测验
        if (phase.quizzes.length > 0) {
            for (var j = 0; j < phase.quizzes.length; j++) {
                if (!data.quiz[phase.quizzes[j]]) {
                    return {
                        phaseId: currentPhaseId,
                        phaseName: phase.name,
                        quizId: phase.quizzes[j],
                        message: '建议完成阶段测验'
                    };
                }
            }
        }

        // 当前阶段完成，推荐下一阶段
        var phases = Object.keys(LEARNING_PHASES);
        var currentIndex = phases.indexOf(currentPhaseId);
        if (currentIndex < phases.length - 1) {
            var nextPhase = LEARNING_PHASES[phases[currentIndex + 1]];
            return {
                phaseId: phases[currentIndex + 1],
                phaseName: nextPhase.name,
                tutorial: nextPhase.tutorials[0],
                message: '进入下一阶段：' + nextPhase.name
            };
        }

        return {
            phaseId: currentPhaseId,
            phaseName: phase.name,
            message: '🎉 恭喜！所有阶段已完成！'
        };
    };

    // 获取总体学习进度
    window.getOverallProgress = function() {
        var phases = Object.keys(LEARNING_PHASES);
        var totalTutorials = 0;
        var completedTutorials = 0;

        phases.forEach(function(phaseId) {
            var progress = getPhaseProgress(phaseId);
            totalTutorials += progress.total;
            completedTutorials += progress.completed;
        });

        return {
            completed: completedTutorials,
            total: totalTutorials,
            percentage: totalTutorials > 0 ? Math.round((completedTutorials / totalTutorials) * 100) : 0
        };
    };

    // 更新所有进度显示
    function updateAllProgressDisplays() {
        // 更新学习中心页面的进度显示
        document.querySelectorAll('[data-phase-progress]').forEach(function(el) {
            var phaseId = el.dataset.phaseProgress;
            var progress = getPhaseProgress(phaseId);
            var progressBar = el.querySelector('.progress-fill');
            var progressText = el.querySelector('.progress-text');
            if (progressBar) {
                progressBar.style.width = progress.percentage + '%';
            }
            if (progressText) {
                progressText.textContent = progress.completed + '/' + progress.total;
            }
        });

        // 更新总体进度
        var overallEl = document.querySelector('[data-overall-progress]');
        if (overallEl) {
            var overall = getOverallProgress();
            var overallBar = overallEl.querySelector('.progress-fill');
            var overallText = overallEl.querySelector('.progress-text');
            if (overallBar) {
                overallBar.style.width = overall.percentage + '%';
            }
            if (overallText) {
                overallText.textContent = '已完成 ' + overall.completed + '/' + overall.total + ' 个教程 (' + overall.percentage + '%)';
            }
        }
    }

    // 初始化学习中心页面
    window.initLearningCenter = function() {
        var container = document.querySelector('.learning-center-2');
        if (!container) return;

        // 渲染总体进度
        var overallProgress = getOverallProgress();
        var recommendation = getNextRecommendation();
        var currentPhaseId = getCurrentPhase();

        // 创建总体进度卡片
        var summaryHtml = '<div class="learning-summary">' +
            '<div class="summary-card">' +
            '<h3>学习进度总览</h3>' +
            '<div class="progress-tracker" data-overall-progress>' +
            '<div class="progress-bar"><div class="progress-fill" style="width: ' + overallProgress.percentage + '%"></div></div>' +
            '<div class="progress-text">已完成 ' + overallProgress.completed + '/' + overallProgress.total + ' 个教程 (' + overallProgress.percentage + '%)</div>' +
            '</div>' +
            '<div class="recommendation-box">' +
            '<strong>💡 下一步建议：</strong>' +
            '<p>' + recommendation.message + '</p>' +
            (recommendation.tutorial ? '<a href="' + resolveUrl(recommendation.tutorial.url) + '" class="recommendation-link">开始学习 →</a>' : '') +
            '</div>' +
            '</div>' +
            '</div>';

        // 创建五阶段卡片
        var phasesHtml = '<div class="phases-grid">';
        var phases = Object.keys(LEARNING_PHASES);

        phases.forEach(function(phaseId, index) {
            var phase = LEARNING_PHASES[phaseId];
            var progress = getPhaseProgress(phaseId);
            var isCurrent = phaseId === currentPhaseId;
            var isCompleted = progress.percentage === 100;

            phasesHtml += '<div class="phase-card' + (isCurrent ? ' phase-current' : '') + (isCompleted ? ' phase-completed' : '') + '">' +
                '<div class="phase-header">' +
                '<span class="phase-number">第 ' + (index + 1) + ' 阶段</span>' +
                '<span class="phase-status">' + (isCompleted ? '✅ 已完成' : isCurrent ? '📍 当前' : '⏳ 待学习') + '</span>' +
                '</div>' +
                '<h3 class="phase-name">' + phase.name + '</h3>' +
                '<p class="phase-desc">' + phase.description + '</p>' +
                '<div class="progress-tracker" data-phase-progress="' + phaseId + '">' +
                '<div class="progress-bar"><div class="progress-fill" style="width: ' + progress.percentage + '%"></div></div>' +
                '<div class="progress-text">' + progress.completed + '/' + progress.total + '</div>' +
                '</div>' +
                '<div class="phase-actions">' +
                '<a href="#phase-' + phaseId + '" class="phase-link">查看详情</a>' +
                (progress.percentage > 0 ? '<span class="phase-percentage">' + progress.percentage + '%</span>' : '') +
                '</div>' +
                '</div>';
        });

        phasesHtml += '</div>';

        // 创建各阶段详情
        var detailsHtml = '<div class="phases-details">';
        var data = getCachedProgressData();
        phases.forEach(function(phaseId, index) {
            var phase = LEARNING_PHASES[phaseId];

            detailsHtml += '<div class="phase-detail" id="phase-' + phaseId + '">' +
                '<h3>第 ' + (index + 1) + ' 阶段：' + phase.name + '</h3>' +
                '<p class="phase-detail-desc">' + phase.description + '</p>' +
                '<div class="tutorial-checklist">';

            phase.tutorials.forEach(function(tutorial) {
                var isLearned = data.learned[tutorial.id];
                detailsHtml += '<label class="tutorial-item' + (isLearned ? ' learned' : '') + '">' +
                    '<input type="checkbox" data-tutorial-id="' + tutorial.id + '" ' + (isLearned ? 'checked' : '') + '>' +
                    '<a href="' + resolveUrl(tutorial.url) + '">' + tutorial.name + '</a>' +
                    '</label>';
            });

            detailsHtml += '</div>';

            if (phase.quizzes.length > 0) {
                detailsHtml += '<div class="quiz-links"><strong>📝 阶段测验：</strong>';
                phase.quizzes.forEach(function(quizId) {
                    var quizResult = getQuizResult(quizId);
                    var quizName = QUIZ_NAMES[quizId] || quizId;
                    var quizUrl = QUIZ_URLS[quizId] || '#';
                    detailsHtml += '<a href="' + resolveUrl(quizUrl) + '" class="quiz-link">' +
                        quizName +
                        (quizResult ? ' (' + quizResult.percentage + '分)' : '') +
                        '</a>';
                });
                detailsHtml += '</div>';
            }

            detailsHtml += '</div>';
        });
        detailsHtml += '</div>';

        // 注入到页面
        container.innerHTML = summaryHtml + phasesHtml + detailsHtml;

        // 绑定复选框事件
        container.querySelectorAll('input[data-tutorial-id]').forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                var tutorialId = this.dataset.tutorialId;
                if (this.checked) {
                    markTutorialLearned(tutorialId);
                    this.closest('.tutorial-item').classList.add('learned');
                } else {
                    unmarkTutorialLearned(tutorialId);
                    this.closest('.tutorial-item').classList.remove('learned');
                }
            });
        });
    };

    // 初始化教程页面的完成状态
    window.initTutorialPage = function() {
        var content = document.querySelector('.md-content__inner');
        if (!content) return;

        // 获取当前教程ID
        var path = window.location.pathname;
        var basePath = getBasePath();
        var relativePath = basePath && path.indexOf(basePath) === 0 ? path.substring(basePath.length) : path;
        var tutorialId = null;

        // 从路径中提取教程ID
        Object.keys(LEARNING_PHASES).forEach(function(phaseId) {
            LEARNING_PHASES[phaseId].tutorials.forEach(function(tutorial) {
                if (relativePath.indexOf(tutorial.url) !== -1) {
                    tutorialId = tutorial.id;
                }
            });
        });

        if (!tutorialId) return;

        // 创建完成状态按钮
        var isLearned = isTutorialLearned(tutorialId);
        var buttonHtml = '<div class="tutorial-complete-btn">' +
            '<button class="complete-toggle' + (isLearned ? ' completed' : '') + '" data-tutorial-id="' + tutorialId + '">' +
            (isLearned ? '✅ 已完成学习' : '☐ 标记为已学习') +
            '</button>' +
            '</div>';

        // 插入到文章末尾
        var article = document.querySelector('article');
        if (article) {
            var btnContainer = document.createElement('div');
            btnContainer.innerHTML = buttonHtml;
            article.appendChild(btnContainer.firstElementChild);

            // 绑定点击事件
            var btn = article.querySelector('.complete-toggle');
            if (btn) {
                btn.addEventListener('click', function() {
                    var id = this.dataset.tutorialId;
                    if (isTutorialLearned(id)) {
                        unmarkTutorialLearned(id);
                        this.classList.remove('completed');
                        this.textContent = '☐ 标记为已学习';
                    } else {
                        markTutorialLearned(id);
                        this.classList.add('completed');
                        this.textContent = '✅ 已完成学习';
                    }
                });
            }
        }
    };

    // 暴露阶段配置供外部使用
    window.LEARNING_PHASES = LEARNING_PHASES;

})();
