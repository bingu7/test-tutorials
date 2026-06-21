// ==================== 测验系统 ====================
// 依赖：common.js（__resolveUrl）

(function() {
    'use strict';

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
        },
        'playwright-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/自动化测试/Playwright自动化测试教程-软件测试版/', text: 'Playwright 自动化测试教程' }],
            reviewFocus: '重点关注：语义化定位器、自动等待机制、expect 断言、Page Object 模式、Trace 回放',
            passLinks: [
                { url: '/项目实战/Web自动化项目实战/', text: 'Web 自动化项目实战' },
                { url: '/自动化测试/Selenium-Web自动化教程-软件测试版/', text: 'Selenium Web 自动化' }
            ],
            passText: 'Playwright 基础已掌握，建议继续学习：',
            failText: '建议先巩固 Playwright 基础，再继续学习其他内容。'
        }
    };

    // 初始化测验
    window.initQuizzes = function() {
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
    };

    function checkQuizAnswers(quiz) {
        var resolveUrl = window.__resolveUrl || function(u) { return u; };
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
})();
