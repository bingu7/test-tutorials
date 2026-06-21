// ==================== 共享工具函数 ====================
// 被 quiz.js / navigation.js / progress.js / related.js 共用

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

    // 暴露给其他模块使用
    window.__getBasePath = getBasePath;
    window.__resolveUrl = resolveUrl;
})();
