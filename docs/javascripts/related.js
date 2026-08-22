// ==================== 相关推荐 ====================
// 依赖：common.js（__resolveUrl）

(function() {
    'use strict';

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

    window.initRelatedTutorials = function() {
        var resolveUrl = window.__resolveUrl || function(u) { return u; };
        var getPath = window.__getPath || function() { return window.location.pathname; };
        var content = document.querySelector('.md-content__inner');
        if (!content) return;
        // SPA：若上一页残留（极少），清掉后按当前路径重建
        document.querySelectorAll('.related-tutorials').forEach(function(el) { el.remove(); });

        var path = getPath();

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
    };
})();
