// ==================== Mermaid 图表渲染 ====================
// 依赖：mermaid.min.js（本地 vendor，见 docs/javascripts/vendor/）
//
// 为什么不用 class="mermaid"：
//   mermaid 11 在 window load 时自动执行 run({querySelector: ".mermaid"})，
//   该自动扫描会抢先处理 <pre class="mermaid">，失败后把节点清空为 <div>，
//   导致源码丢失（见 CHANGELOG 中本次修复记录）。
//   而 extra_javascript 注入在 </body> 前，懒加载库必然晚于该自动扫描。
//   因此我们在 mkdocs.yml 里把围栏类名改为 mermaid-src，让内置扫描选择器失配，
//   再由本模块自行把源码渲染进 <div class="mermaid">。
//
// 其余约定：懒加载库、随 SPA 导航重渲染、失败保留源码、跟随明暗主题。

(function() {
    'use strict';

    // mermaid 库文件路径（相对站点根，由 common.js 解析）
    var VENDOR_PATH = '/javascripts/vendor/mermaid.min.js';
    // 与 mkdocs.yml 中 custom_fences.class 保持一致
    var SRC_CLASS = 'mermaid-src';
    var loadPromise = null;
    var uidSeq = 0;

    // 是否处于暗色模式：以 Material 主题的 body[data-md-color-scheme] 为准
    function isDark() {
        return document.body &&
            document.body.getAttribute('data-md-color-scheme') === 'slate';
    }

    // 懒加载 mermaid 库：同一次会话只加载一次，重复调用复用同一个 Promise
    function loadMermaid() {
        if (window.mermaid) return Promise.resolve(window.mermaid);
        if (loadPromise) return loadPromise;

        loadPromise = new Promise(function(resolve, reject) {
            var resolveUrl = window.__resolveUrl || function(u) { return u; };
            var script = document.createElement('script');
            script.src = resolveUrl(VENDOR_PATH);
            script.async = true;
            script.onload = function() {
                if (window.mermaid) {
                    // 关闭内置自动扫描，渲染时机完全由本模块掌控
                    try {
                        window.mermaid.initialize({ startOnLoad: false });
                    } catch(e) {}
                    resolve(window.mermaid);
                } else {
                    reject(new Error('mermaid 库已加载但未暴露全局对象'));
                }
            };
            script.onerror = function() {
                reject(new Error('mermaid 库加载失败：' + script.src));
            };
            document.head.appendChild(script);
        });

        return loadPromise;
    }

    function sources() {
        return document.querySelectorAll('.' + SRC_CLASS);
    }

    // 保存原始定义，供主题切换时重新渲染。
    // 必须在清空元素之前读取，且只读一次，否则重复初始化会把源码读成空串。
    function cacheSource(el) {
        if (el.dataset.mermaidSource === undefined) {
            el.dataset.mermaidSource = (el.textContent || '').trim();
        }
        return el.dataset.mermaidSource;
    }

    function renderAll(root) {
        var nodes = (root || document).querySelectorAll('.' + SRC_CLASS);
        if (nodes.length === 0) return Promise.resolve();

        // 先统一快照源码：无论渲染成功与否，源码都不会丢失
        var targets = [];
        nodes.forEach(function(el) {
            var source = cacheSource(el);
            if (source) targets.push({ el: el, source: source });
        });
        if (targets.length === 0) return Promise.resolve();

        return loadMermaid().then(function(mermaid) {
            mermaid.initialize({
                startOnLoad: false,      // 关闭自动扫描（兼容 SPA，由本模块控制时机）
                securityLevel: 'loose',  // 允许点击链接跳转，教程站点内容可信
                theme: isDark() ? 'dark' : 'default',
                fontFamily: 'inherit'
            });

            var jobs = targets.map(function(t) {
                var el = t.el;
                // 已渲染出 SVG 的节点跳过，避免 SPA 重复初始化时重复渲染
                if (el.querySelector('svg')) return null;

                var id = 'mermaid-' + (++uidSeq);
                // 渲染容器：把源码块本身变成承载 SVG 的 .mermaid 容器
                el.classList.add('mermaid');
                el.innerHTML = '';
                return mermaid.render(id, t.source).then(function(result) {
                    el.innerHTML = result.svg;
                    el.classList.add('mermaid-rendered');
                    return null;
                }).catch(function(err) {
                    // 单块图失败不影响其它图与正文：回退为原始文本
                    el.textContent = t.source;
                    el.classList.add('mermaid-error');
                    console.warn('Mermaid 渲染失败：', err);
                    return null;
                });
            }).filter(Boolean);

            return Promise.all(jobs);
        }).catch(function(err) {
            // 库加载失败：保留源码文本，教程仍可阅读
            console.warn('Mermaid 不可用：', err);
        });
    }

    // 主题切换时按当前配色重新渲染，保证暗色模式下图表可读
    function watchTheme() {
        if (!document.body || document.body.dataset.mermaidThemeWatched) return;
        document.body.dataset.mermaidThemeWatched = 'true';

        new MutationObserver(function() {
            if (sources().length > 0) renderAll();
        }).observe(document.body, {
            attributes: true,
            attributeFilter: ['data-md-color-scheme']
        });
    }

    window.initMermaid = function() {
        if (sources().length === 0) return;
        watchTheme();
        renderAll();
    };

    // 供其它模块复用（如需在动态插入图表后手动触发）
    window.__renderMermaid = renderAll;
})();
