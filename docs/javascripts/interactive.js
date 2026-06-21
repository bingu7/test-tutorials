// ==================== MkDocs Material SPA 主入口 ====================
// 功能模块已拆分为独立文件：
//   - common.js      共享工具函数
//   - quiz.js        测验系统
//   - progress.js    进度追踪
//   - navigation.js  滚动导航 + 快捷键 + 阅读进度
//   - related.js     相关推荐
// 本文件仅负责初始化调度。

(function() {
    'use strict';

    function initAll() {
        if (typeof initHeaderTabsOnScroll === 'function') initHeaderTabsOnScroll();
        if (typeof initQuizzes === 'function') initQuizzes();
        if (typeof initProgressTracker === 'function') initProgressTracker();
        if (typeof initReadingProgress === 'function') initReadingProgress();
        if (typeof initRelatedTutorials === 'function') initRelatedTutorials();
        if (typeof initKeyboardShortcuts === 'function') initKeyboardShortcuts();
        if (typeof initScrollMemory === 'function') initScrollMemory();

        // 初始化学习进度系统（来自 learning-progress.js）
        if (typeof initTutorialPage === 'function') {
            initTutorialPage();
        }
    }

    document.addEventListener('DOMContentLoaded', initAll);
    if (typeof document$ !== 'undefined') {
        document$.subscribe(initAll);
    }
})();
