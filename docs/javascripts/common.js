// ==================== 共享工具函数 ====================
// 被 quiz.js / navigation.js / progress.js / related.js 共用

(function() {
    'use strict';

    // 基础路径解析：从 common.js 脚本 URL 反推站点根路径
    // ponytail: 原方案用 canonical URL，但 canonical 包含当前页面路径（如 /test-tutorials/学习中心/），
    // 导致子页面上 resolveUrl 拼出错误链接。改用脚本 src 的绝对 URL 更可靠。
    function getBasePath() {
        try {
            var script = document.querySelector('script[src*="common.js"]');
            if (script && script.src) {
                return new URL(script.src).pathname.replace(/\/javascripts\/common\.js$/, '');
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

    // 当前页面路径（解码后）。location.pathname 对中文返回百分号编码，
    // 直接用于中文标题匹配会全部失配，必须先 decodeURIComponent。
    function getPath() {
        try {
            return decodeURIComponent(window.location.pathname);
        } catch(e) {
            return window.location.pathname;
        }
    }

    // 暴露给其他模块使用
    window.__getBasePath = getBasePath;
    window.__resolveUrl = resolveUrl;
    window.__getPath = getPath;
})();
