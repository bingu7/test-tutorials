// MkDocs Material SPA 支持
function initAll() {
    initQuizzes();
    initProgressTracker();
    initReadingProgress();
    initRelatedTutorials();
    initKeyboardShortcuts();
}

document.addEventListener('DOMContentLoaded', initAll);
if (typeof document$ !== 'undefined') {
    document$.subscribe(initAll);
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
            } catch(e) {}
        }
    });
}

function checkQuizAnswers(quiz) {
    var items = quiz.querySelectorAll('.quiz-item');
    var correct = 0;
    var total = items.length;

    items.forEach(function(item) {
        var options = item.querySelectorAll('.quiz-option');
        var correctIndex = parseInt(item.dataset.correct);
        var selected = item.querySelector('input[type="radio"]:checked');
        var explanation = item.querySelector('.quiz-explanation');

        options.forEach(function(opt, i) {
            opt.classList.remove('correct', 'incorrect');
            if (i === correctIndex) opt.classList.add('correct');
        });

        if (selected) {
            var selectedIndex = Array.from(options).indexOf(selected.parentElement);
            if (selectedIndex !== correctIndex) {
                selected.parentElement.classList.add('incorrect');
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

    var scoreDiv = quiz.querySelector('.quiz-score');
    if (!scoreDiv) {
        scoreDiv = document.createElement('div');
        scoreDiv.className = 'quiz-score';
        quiz.appendChild(scoreDiv);
    }

    var percentage = Math.round((correct / total) * 100);
    var emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';
    scoreDiv.innerHTML = emoji + ' 得分：<strong>' + correct + '/' + total + '</strong> (' + percentage + '%)';
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
        link.href = item.url;
        link.innerHTML = '<span class="related-item-icon">' + item.icon + '</span><span class="related-item-text">' + item.title + '</span>';
        grid.appendChild(link);
    });

    var article = document.querySelector('article');
    if (article) article.appendChild(relatedDiv);
}

// ==================== 快捷键支持 ====================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.closest('input, textarea'))) {
            e.preventDefault();
            var searchInput = document.querySelector('.md-search__input');
            if (searchInput) searchInput.focus();
        }

        if (!e.target.closest('input, textarea, select')) {
            var navLinks = document.querySelectorAll('.md-footer__link');
            if (e.key === 'ArrowLeft' && navLinks[0]) {
                window.location.href = navLinks[0].href;
            } else if (e.key === 'ArrowRight' && navLinks[1]) {
                window.location.href = navLinks[1].href;
            }
        }
    });
}
