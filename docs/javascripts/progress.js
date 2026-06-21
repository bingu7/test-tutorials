// ==================== 进度追踪 ====================
// 依赖：无

(function() {
    'use strict';

    window.initProgressTracker = function() {
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
    };

    function updateProgressBar(tracker, total, completed) {
        var fill = tracker.querySelector('.progress-fill');
        var text = tracker.querySelector('.progress-text');
        if (fill && text) {
            var percentage = Math.round((completed / total) * 100);
            fill.style.width = percentage + '%';
            text.textContent = '已完成 ' + completed + '/' + total + ' (' + percentage + '%)';
        }
    }
})();
