// ==================== 导航与交互 ====================
// 依赖：common.js（__resolveUrl）

(function() {
    'use strict';

    // ==================== 向上滚动时显示顶部主导航 ====================
    window.initHeaderTabsOnScroll = function() {
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
    };

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
    window.initScrollMemory = function() {
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

            // 只绑一次 TOC 滚动保存（用命名 handler + 标记）
            if (!tocWrap.dataset.scrollMemoryBound) {
                tocWrap.dataset.scrollMemoryBound = '1';
                tocWrap.addEventListener('scroll', function() {
                    var k = 'toc-' + window.location.pathname;
                    sessionStorage.setItem(k, tocWrap.scrollTop);
                }, { passive: true });
            }
        }

        // beforeunload / SPA location 订阅只初始化一次
        if (!window.__scrollMemoryGlobalBound) {
            window.__scrollMemoryGlobalBound = true;
            window.addEventListener('beforeunload', function() {
                sessionStorage.setItem('scroll-' + window.location.pathname, window.scrollY);
            });
            if (typeof location$ !== 'undefined') {
                location$.subscribe(function() {
                    // 在真正换页前 location$ 触发时，仍可取到当前 scroll
                    sessionStorage.setItem('scroll-' + window.location.pathname, window.scrollY);
                    var tw = document.querySelector('.md-sidebar--secondary .md-sidebar__scrollwrap');
                    if (tw) {
                        sessionStorage.setItem('toc-' + window.location.pathname, tw.scrollTop);
                    }
                });
            }
        }
    };

    // ==================== 阅读进度条 ====================
    window.initReadingProgress = function() {
        // 移除旧进度条与旧监听，避免 SPA 切换后重复绑定
        if (window.__readingProgressHandler) {
            window.removeEventListener('scroll', window.__readingProgressHandler);
            window.__readingProgressHandler = null;
        }
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

        window.__readingProgressHandler = updateProgress;
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    };

    // ==================== 快捷键支持 ====================
    window.initKeyboardShortcuts = function() {
        if (window.__keyboardShortcutsInitialized) return;
        window.__keyboardShortcutsInitialized = true;

        var navDebounce = false;
        document.addEventListener('keydown', function(e) {
            // e.target 一般是元素，但可能不是 Element（如 document），统一防护
            var targetEl = e.target instanceof Element ? e.target : null;
            var inEditable = !!(targetEl && targetEl.closest('input, textarea, select, [contenteditable]'));

            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !inEditable)) {
                e.preventDefault();
                var searchInput = document.querySelector('.md-search__input');
                if (searchInput) searchInput.focus();
            }

            if (!inEditable) {
                var prevLink = document.querySelector('.md-footer__link--prev');
                var nextLink = document.querySelector('.md-footer__link--next');
                if (e.key === 'ArrowLeft' && prevLink && !navDebounce) {
                    navDebounce = true;
                    window.location.href = prevLink.href;
                    setTimeout(function() { navDebounce = false; }, 500);
                } else if (e.key === 'ArrowRight' && nextLink && !navDebounce) {
                    navDebounce = true;
                    window.location.href = nextLink.href;
                    setTimeout(function() { navDebounce = false; }, 500);
                }
            }
        });
    };
})();
