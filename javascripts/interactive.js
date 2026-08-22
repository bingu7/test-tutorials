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

    // 单个模块初始化失败不影响其他模块
    function safeInit(name) {
        try {
            var fn = window[name];
            if (typeof fn === 'function') fn();
        } catch(e) {
            console.error('Init failed: ' + name, e);
        }
    }

    function initAll() {
        safeInit('initHeaderTabsOnScroll');
        safeInit('initQuizzes');
        safeInit('initProgressTracker');
        safeInit('initReadingProgress');
        safeInit('initRelatedTutorials');
        safeInit('initKeyboardShortcuts');
        safeInit('initScrollMemory');

        // 初始化学习进度系统（来自 learning-progress.js）
        safeInit('initTutorialPage');
    }

    document.addEventListener('DOMContentLoaded', initAll);
    if (typeof document$ !== 'undefined') {
        document$.subscribe(initAll);
    }
})();
