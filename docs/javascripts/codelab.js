// ==================== 动手任务自动判分（Pyodide 沙箱） ====================
// 依赖：common.js（__resolveUrl）、vendor/pyodide/（本地托管，懒加载）
//
// 设计要点：
//   1. 懒加载：页面没有 .code-lab 容器时不加载 Pyodide，首屏零成本
//   2. 判分在学生自己写的代码上执行，用断言而非字符串比对
//      ——否则只要变量名不同就判错，无法反映"逻辑对了没"
//   3. 沙箱内执行，超时保护，异常回显给用户（报错信息本身就是学习材料）
//   4. 判分逻辑与任务数据由页面内的 <script type="application/json"> 提供，
//      这样题目可写在 Markdown 里，不需要改 JS
//
// 页面用法（写在 Markdown 中）：
//   <div class="code-lab" data-lab-id="sql-amount"></div>
//   <script type="application/json" class="code-lab-spec">
//   {
//     "title": "...",
//     "starterCode": "...",
//     "tests": [{"name": "...", "code": "...", "hint": "..."}]
//   }
//   </script>

(function() {
    'use strict';

    var PYODIDE_MODULE = '/javascripts/vendor/pyodide/pyodide.mjs';
    // 判分超时（毫秒）：防止死循环把页面卡死
    var RUN_TIMEOUT_MS = 15000;
    var loadPromise = null;

    // ---- Pyodide 懒加载 ----
    // 用动态 import() 加载 .mjs，而不是 <script> 加载 pyodide.js：
    // pyodide.js 是 ESM 打包产物，顶层 var 在经典脚本下不保证挂到 window，
    // 实测 window.loadPyodide 为 undefined；.mjs 有正规 export，import 更可靠。
    function loadPyodide() {
        if (window.__pyodideReady) return window.__pyodideReady;
        if (loadPromise) return loadPromise;

        var resolveUrl = window.__resolveUrl || function(u) { return u; };
        var modUrl = resolveUrl(PYODIDE_MODULE);

        loadPromise = import(/* webpackIgnore: true */ modUrl)
            .then(function(mod) {
                var loader = mod.loadPyodide || (window.loadPyodide);
                if (typeof loader !== 'function') {
                    throw new Error('pyodide.mjs 未导出 loadPyodide');
                }
                return loader({
                    // indexURL 必须指向本地目录，否则会去 CDN 取 wasm/stdlib
                    indexURL: resolveUrl('/javascripts/vendor/pyodide/')
                });
            })
            .then(function(py) {
                window.__pyodideReady = Promise.resolve(py);
                return py;
            })
            .catch(function(err) {
                // 失败后清掉缓存的 Promise，允许用户重试
                loadPromise = null;
                throw err;
            });

        return loadPromise;
    }

    // ---- 工具 ----
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // 从 Markdown 渲染出的 DOM 里取题面 JSON
    function readSpec(container) {
        // 题面脚本通常紧跟在容器后面
        var scope = container.parentNode || document;
        var nodes = scope.querySelectorAll('script.code-lab-spec');
        var idx = parseInt(container.dataset.specIndex || '0', 10);
        var node = nodes[idx];
        if (!node) {
            // 回退：按 id 找
            node = document.querySelector('script.code-lab-spec[data-for="' + container.dataset.labId + '"]');
        }
        if (!node) return null;
        try {
            return JSON.parse(node.textContent);
        } catch (e) {
            console.error('题面 JSON 解析失败：', e);
            return null;
        }
    }

    // ---- 组装要执行的 Python 代码 ----
    // 结构：学生代码 → 分隔 → 判分脚本（每条 test 跑一次，收集结果）
    //
    // 注意：用 print() 显式输出 JSON，而不是依赖「最后一行表达式的值」。
    // 后者是 Pyodide runPython 的隐式行为，换执行方式（如 py_compile 校验、
    // 或未来改用 Web Worker）就会失效；显式 print 更稳，也便于本地用 python 复现。
    function buildHarness(spec, userCode) {
        var testsJson = JSON.stringify(spec.tests.map(function(t) {
            return { name: t.name, code: t.code, hint: t.hint || '' };
        }));

        var lines = [
            '# ======== 题目预置数据 ========',
            spec.prelude || '',
            '# ======== 学生代码开始 ========',
            userCode,
            '# ======== 学生代码结束 ========',
            '',
            'import json as __json',
            '__TESTS = __json.loads(' + JSON.stringify(testsJson) + ')',
            '__results = []',
            'for __t in __TESTS:',
            '    try:',
            '        exec(__t["code"], globals())',
            '        __results.append({"name": __t["name"], "pass": True, "msg": "", "hint": ""})',
            '    except AssertionError as __e:',
            '        __results.append({"name": __t["name"], "pass": False,',
            '                          "msg": str(__e) or "断言未通过",',
            '                          "hint": __t.get("hint", "")})',
            '    except Exception as __e:',
            '        __results.append({"name": __t["name"], "pass": False,',
            '                          "msg": type(__e).__name__ + ": " + str(__e),',
            '                          "hint": __t.get("hint", "")})',
            'print("__CODELAB__" + __json.dumps(__results, ensure_ascii=False))'
        ];
        // prelude 为空时插入了空行，无害；保持结构对齐便于阅读
        return lines.join('\n');
    }

    // ---- 渲染单个 lab ----
    function renderLab(container, spec) {
        if (container.dataset.initialized) return;
        container.dataset.initialized = 'true';

        var labId = container.dataset.labId || ('lab-' + Math.random().toString(36).slice(2, 8));
        var storageKey = 'codelab-' + labId;
        var saved = null;
        try { saved = localStorage.getItem(storageKey); } catch (e) {}

        container.innerHTML =
            '<div class="codelab">' +
              '<div class="codelab-head">' +
                '<span class="codelab-title">' + escapeHtml(spec.title || '在线练习') + '</span>' +
                '<span class="codelab-badge">可在页内运行判分</span>' +
              '</div>' +
              '<textarea class="codelab-editor" spellcheck="false" ' +
                'aria-label="代码编辑器"></textarea>' +
              '<div class="codelab-actions">' +
                '<button type="button" class="codelab-run">运行并判分</button>' +
                '<button type="button" class="codelab-hint-btn">看提示</button>' +
                '<button type="button" class="codelab-reset">重置代码</button>' +
                '<span class="codelab-status"></span>' +
              '</div>' +
              '<div class="codelab-hints" hidden></div>' +
              '<div class="codelab-result" hidden></div>' +
            '</div>';

        var editor = container.querySelector('.codelab-editor');
        var runBtn = container.querySelector('.codelab-run');
        var hintBtn = container.querySelector('.codelab-hint-btn');
        var resetBtn = container.querySelector('.codelab-reset');
        var status = container.querySelector('.codelab-status');
        var hintsBox = container.querySelector('.codelab-hints');
        var resultBox = container.querySelector('.codelab-result');

        editor.value = saved || spec.starterCode || '';

        // 编辑时自动保存（换页/刷新不丢代码）
        editor.addEventListener('input', function() {
            try { localStorage.setItem(storageKey, editor.value); } catch (e) {}
        });

        // 提示按钮：主动查看每条检查的提示（不看答案，只给方向）
        hintBtn.addEventListener('click', function() {
            if (!hintsBox.hidden) {
                hintsBox.hidden = true;
                hintBtn.textContent = '看提示';
                return;
            }
            var tips = spec.tests.filter(function(t) { return t.hint; });
            if (tips.length === 0) {
                hintsBox.innerHTML = '<div class="codelab-hint">这道练习没有额外提示，读一遍要求里的注释即可。</div>';
            } else {
                var h = '<div class="codelab-hints-title">💡 提示（只给方向，不给答案）</div><ul class="codelab-hint-list">';
                tips.forEach(function(t) {
                    h += '<li><strong>' + escapeHtml(t.name) + '</strong>：' + escapeHtml(t.hint) + '</li>';
                });
                h += '</ul>';
                hintsBox.innerHTML = h;
            }
            hintsBox.hidden = false;
            hintBtn.textContent = '收起提示';
        });

        resetBtn.addEventListener('click', function() {
            editor.value = spec.starterCode || '';
            resultBox.hidden = true;
            hintsBox.hidden = true;
            hintBtn.textContent = '看提示';
            status.textContent = '';
            try { localStorage.setItem(storageKey, editor.value); } catch (e) {}
        });

        runBtn.addEventListener('click', function() {
            var code = editor.value;
            if (!code.trim()) {
                status.textContent = '请先写代码';
                return;
            }
            runBtn.disabled = true;
            status.textContent = '正在加载 Python 运行环境（首次约需数秒）…';
            resultBox.hidden = true;

            var timeoutId = setTimeout(function() {
                status.textContent = '运行超时（超过 ' + (RUN_TIMEOUT_MS / 1000) + ' 秒），请检查是否有死循环';
                runBtn.disabled = false;
            }, RUN_TIMEOUT_MS);

            loadPyodide().then(function(py) {
                status.textContent = '运行中…';
                var harness = buildHarness(spec, code);

                // Pyodide 里 print() 的返回值是 undefined（它写到 stdout），
                // 所以必须用 setStdout 捕获输出，不能依赖 runPython 的返回值。
                var captured = '';
                py.setStdout({ batched: function(s) { captured += s + '\n'; } });
                try {
                    py.runPython(harness);
                } finally {
                    // 复位为默认（转发到 JS console），避免影响后续其它调用
                    py.setStdout({});
                }
                clearTimeout(timeoutId);

                // 用标记行定位结果，避免被学生代码里的 print 干扰
                var marker = '__CODELAB__';
                var pos = captured.lastIndexOf(marker);
                if (pos < 0) {
                    runBtn.disabled = false;
                    status.textContent = '';
                    resultBox.hidden = false;
                    resultBox.innerHTML = '<div class="codelab-err">未能取得判分结果（代码可能有语法错误）。' +
                        '请检查括号、冒号与缩进。</div>';
                    return;
                }
                var line = captured.slice(pos + marker.length).split('\n')[0];
                var results;
                try {
                    results = JSON.parse(line);
                } catch (e) {
                    runBtn.disabled = false;
                    status.textContent = '';
                    resultBox.hidden = false;
                    resultBox.innerHTML = '<div class="codelab-err">判分结果解析失败。</div>';
                    return;
                }
                showResults(results, resultBox, status, labId, spec.title || '在线练习');
                runBtn.disabled = false;
            }).catch(function(err) {
                clearTimeout(timeoutId);
                runBtn.disabled = false;
                status.textContent = '';
                resultBox.hidden = false;
                resultBox.innerHTML = '<div class="codelab-err">运行环境出错：' +
                    escapeHtml(err.message || String(err)) + '</div>';
            });
        });
    }

    function showResults(results, resultBox, status, labId, labTitle) {
        var passed = results.filter(function(r) { return r.pass; }).length;
        var total = results.length;
        var allPass = passed === total;

        var html = '<div class="codelab-summary ' + (allPass ? 'ok' : 'bad') + '">' +
            (allPass ? '✅ ' : '⚠️ ') + '通过 ' + passed + '/' + total + ' 项检查' +
            (allPass ? ' —— 全部通过' : '') + '</div><ul class="codelab-list">';

        results.forEach(function(r, i) {
            html += '<li class="' + (r.pass ? 'ok' : 'bad') + '">' +
                '<span class="codelab-mark">' + (r.pass ? '✓' : '✗') + '</span>' +
                '<span class="codelab-name">' + escapeHtml(r.name) + '</span>';
            if (!r.pass) {
                html += '<div class="codelab-msg">' + escapeHtml(r.msg) + '</div>';
                if (r.hint) {
                    html += '<div class="codelab-hint">💡 ' + escapeHtml(r.hint) + '</div>';
                }
            }
            html += '</li>';
        });
        html += '</ul>';

        if (allPass) {
            html += '<div class="codelab-next">🎉 全部通过，已计入你的学习进度。' +
                '下一题或对照教程里的参考答案看看思路是否一致。</div>';
        }
        resultBox.hidden = false;
        resultBox.innerHTML = html;
        status.textContent = '';

        // 写入学习进度系统（learning-progress.js）。
        // 只有全部通过才算 completed，避免"跑一次拿到 4/5"就刷满进度。
        if (typeof window.saveLabResult === 'function') {
            try {
                window.saveLabResult(labId, passed, total, labTitle);
            } catch (e) {
                console.warn('练习结果写入进度失败：', e);
            }
        }

        // 全部通过时，自动把当前教程标记为「已学习」——
        // 练习做出来了，比手动勾一个框更能证明掌握。
        var autoLearned = false;
        if (allPass && typeof window.markCurrentTutorialLearnedByLab === 'function') {
            try {
                autoLearned = window.markCurrentTutorialLearnedByLab();
            } catch (e) {
                console.warn('自动标记教程学习状态失败：', e);
            }
        }

        if (allPass && autoLearned) {
            var tip = document.createElement('div');
            tip.className = 'codelab-autolearn';
            tip.textContent = '同时已把本教程标记为「已学习」。';
            resultBox.appendChild(tip);
        }
    }

    // ---- 练习总览页 ----
    // 读取本机记录，把总览表的状态列填上（未做 / N/M / ✅ 已通过）
    function renderOverview() {
        var table = document.querySelector('.lab-overview');
        if (!table) return;

        var getLabResult = window.getLabResult;
        if (typeof getLabResult !== 'function') return;

        var total = 0;
        var done = 0;

        table.querySelectorAll('tr[data-lab-id]').forEach(function(tr) {
            var id = tr.dataset.labId;
            var cell = tr.querySelector('.lab-td-status');
            if (!cell) return;
            total++;

            var r = getLabResult(id);
            if (!r) {
                cell.innerHTML = '<span class="lab-status lab-status-todo">未做</span>';
                return;
            }
            if (r.completed) {
                done++;
                cell.innerHTML = '<span class="lab-status lab-status-done">✅ 已通过</span>';
                tr.classList.add('lab-row-done');
            } else {
                cell.innerHTML = '<span class="lab-status lab-status-partial">' +
                    r.passed + '/' + r.total + '</span>';
            }
        });

        var summary = document.getElementById('lab-overview-summary');
        if (summary) {
            if (total === 0) {
                summary.textContent = '';
            } else {
                var pct = Math.round((done / total) * 100);
                summary.innerHTML = '<strong>已通过 ' + done + '/' + total + ' 道练习（' + pct + '%）</strong>' +
                    (done === total ? ' 🎉 全部完成' : ' — 滚到任一教程末尾的「动手任务」即可开做');
            }
        }
    }

    window.initCodeLabs = function() {
        renderOverview();

        var labs = document.querySelectorAll('.code-lab');
        if (labs.length === 0) return;
        // 逐个渲染；题面脚本按出现顺序编号
        var specs = document.querySelectorAll('script.code-lab-spec');
        labs.forEach(function(container, i) {
            var spec = null;
            var node = specs[i];
            if (node) {
                try { spec = JSON.parse(node.textContent); } catch (e) {
                    console.error('题面 JSON 解析失败：', e);
                }
            }
            if (!spec) {
                container.innerHTML = '<div class="codelab-err">题目数据缺失或格式错误</div>';
                return;
            }
            renderLab(container, spec);
        });
    };
})();
