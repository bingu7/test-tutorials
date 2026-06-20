"""Check broken internal links in docs/*.md"""
import os, re

docs_dir = os.path.join(os.path.dirname(__file__), 'docs')
broken = []
all_files = set()

for root, dirs, files in os.walk(docs_dir):
    for f in files:
        if f.endswith('.md'):
            path = os.path.relpath(os.path.join(root, f), docs_dir).replace(os.sep, '/')
            all_files.add(path)

for root, dirs, files in os.walk(docs_dir):
    for f in files:
        if not f.endswith('.md'):
            continue
        filepath = os.path.join(root, f)
        rel = os.path.relpath(filepath, docs_dir).replace(os.sep, '/')
        with open(filepath, 'r', encoding='utf-8') as fh:
            content = fh.read()
        for m in re.finditer(r'\[([^\]]*)\]\(([^)]+)\)', content):
            url = m.group(2)
            if url.startswith('http') or url.startswith('#') or url.startswith('{') or url.startswith('mailto'):
                continue
            url_no_anchor = url.split('#')[0]
            if not url_no_anchor:
                continue
            cur_dir = os.path.dirname(rel)
            target = os.path.normpath(os.path.join(cur_dir, url_no_anchor)).replace(os.sep, '/')
            if target not in all_files:
                broken.append((rel, url, target))

if broken:
    print(f'Found {len(broken)} broken links:')
    for src, url, target in sorted(broken):
        print(f'  {src}: [{url}]')
else:
    print('No broken internal links found.')
