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
    var __scrollMemoryInitialized = false;
    window.initScrollMemory = function() {
        if (__scrollMemoryInitialized) return;
        __scrollMemoryInitialized = true;

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

            // 保存 TOC 滚动位置
            tocWrap.addEventListener('scroll', function() {
                sessionStorage.setItem(tocKey, tocWrap.scrollTop);
            });
        }

        // 保存主页面滚动位置（页面离开前）
        window.addEventListener('beforeunload', function() {
            sessionStorage.setItem(key, window.scrollY);
        });

        // SPA 导航时也保存
        if (typeof location$ !== 'undefined') {
            location$.subscribe(function() {
                sessionStorage.setItem(key, window.scrollY);
                if (tocWrap) {
                    sessionStorage.setItem(tocKey, tocWrap.scrollTop);
                }
            });
        }
    };

    // ==================== 阅读进度条 ====================
    window.initReadingProgress = function() {
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
    };

    // ==================== 快捷键支持 ====================
    window.initKeyboardShortcuts = function() {
        var navDebounce = false;
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.closest('input, textarea'))) {
                e.preventDefault();
                var searchInput = document.querySelector('.md-search__input');
                if (searchInput) searchInput.focus();
            }

            if (!e.target.closest('input, textarea, select')) {
                var prevLink = document.querySelector('.md-footer__link--prev');
                var nextLink = document.querySelector('.md-footer__link--next');
                if (e.key === 'ArrowLeft' && prevLink && !navDebounce) {
                    navDebounce = true;
                    window.location.href = prevLink.href;
                } else if (e.key === 'ArrowRight' && nextLink && !navDebounce) {
                    navDebounce = true;
                    window.location.href = nextLink.href;
                }
            }
        });
    };
})();
