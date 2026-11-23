#!/usr/bin/env python3
"""Build search-index.json for ENGLISH SAVANT sitewide search.
Run from the repo root after content changes (publish pipeline step):
    python3 tools/build_search_index.py
Indexes real records, not only root HTML:
  - every root *.html page (title/h1/data-search keywords)
  - every unit/lesson video record in lessons.json -> watch.html?lesson=<id>
Emits search-index.json: [{t:title, u:url, k:keywords, y:type}].
Free, static-host friendly; no external services."""
import html, json, os, re, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
SKIP = {'privacy.html', '404.html'}  # utility pages not useful as search hits

GRADES = {
    'kg1': 'تأسيس KG1 حضانة', 'kg2': 'تأسيس KG2 حضانة',
    'p1': 'الصف الأول الابتدائي', 'p2': 'الصف الثاني الابتدائي تانية ابتدائي',
    'p3': 'الصف الثالث الابتدائي', 'p4': 'الصف الرابع الابتدائي',
    'p5': 'الصف الخامس الابتدائي', 'p6': 'الصف السادس الابتدائي',
    'm1': 'الصف الأول الإعدادي', 'm2': 'الصف الثاني الإعدادي', 'm3': 'الصف الثالث الإعدادي',
    'sa-g1': 'المنهج السعودي أول ابتدائي We Can', 'sa-g2': 'المنهج السعودي تاني ابتدائي',
    'sa-g3': 'المنهج السعودي تالت ابتدائي', 'sa-g4': 'المنهج السعودي رابع ابتدائي',
    'sa-g5': 'المنهج السعودي خامس ابتدائي', 'sa-g6': 'المنهج السعودي سادس ابتدائي',
    'general': 'قواعد جرامر عامة',
}

def kind(path):
    if path.startswith(('grade-', 'course-')): return 'صف دراسي'
    if path.startswith('explain-'): return 'شرح تفاعلي'
    if 'assessment' in path or path.startswith(('test-', 'assess-', 'final-review-', 'practice-')): return 'تقييم'
    if path.startswith('videos-') or path in ('lessons.html', 'watch.html'): return 'فيديو'
    if path in ('tools.html', 'assistant.html', 'exam-generator.html'): return 'أداة'
    if path == 'booklets.html': return 'كتب ومراجعات'
    if path.startswith(('saudi', 'sa-')): return 'منهج سعودي'
    return 'صفحة'

out, seen = [], set()

def add(t, u, k, y):
    if not t or u in seen:
        return
    seen.add(u)
    out.append({'t': t, 'u': u, 'k': k.strip(), 'y': y})

# 1) root HTML pages
for fn in sorted(os.listdir(ROOT)):
    if not fn.endswith('.html') or fn in SKIP:
        continue
    try:
        t = open(os.path.join(ROOT, fn), encoding='utf-8').read()
    except OSError:
        continue
    m = re.search(r'<title>(.*?)</title>', t, re.S)
    title = html.unescape(re.sub(r'\s+', ' ', m.group(1)).split('|')[0].strip()) if m else ''
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
    h1t = html.unescape(re.sub(r'<[^>]+>|\s+', ' ', h1.group(1)).strip()) if h1 else ''
    kw = html.unescape(' '.join(re.findall(r'data-search="([^"]+)"', t)))
    label = title or h1t
    gm = re.search(r'(?:^|-)(kg[12]|p[1-6]|m[1-3]|sa-g[1-6])(?:-|\.)', fn)
    grade = GRADES.get(gm.group(1), '') if gm else ''
    um = re.search(r'-u(\d+)', fn)
    unitkw = ('الوحدة '+um.group(1)+' Unit '+um.group(1)) if um else ''
    add(label, fn, h1t + ' ' + kw + ' ' + grade + ' ' + unitkw, kind(fn))

# 2) real unit/lesson video records from lessons.json
lj = os.path.join(ROOT, 'lessons.json')
if os.path.exists(lj):
    data = json.load(open(lj, encoding='utf-8'))
    for e in data.get('lessons', []):
        if e.get('soon'):
            continue
        g = e.get('grade', '')
        label = ' · '.join(x for x in (e.get('part', ''), e.get('title', '')) if x)
        add(label, 'watch.html?lesson=' + e['id'],
            ' '.join([e.get('title', ''), e.get('part', ''), GRADES.get(g, g), 'فيديو شرح']),
            'فيديو')

# 3) real per-lesson assessment records from lesson-assessment-*.json banks
for fn in sorted(os.listdir(ROOT)):
    m = re.fullmatch(r'(lesson-assessment-[a-z0-9-]+)\.json', fn)
    if not m:
        continue
    page = m.group(1) + '.html'
    if not os.path.exists(os.path.join(ROOT, page)):
        continue
    try:
        data = json.load(open(os.path.join(ROOT, fn), encoding='utf-8'))
    except (OSError, json.JSONDecodeError):
        continue
    items = data if isinstance(data, list) else data.get('questions') or data.get('items') or []
    titles = {}
    for q in items:
        if isinstance(q, dict) and q.get('lesson'):
            titles.setdefault(int(q['lesson']), q.get('lesson_title', ''))
    gm = re.match(r'lesson-assessment-([a-z0-9]+)-u(\d+)', fn)
    glabel = GRADES.get(gm.group(1), gm.group(1)) if gm else ''
    unitlabel = ('الوحدة '+gm.group(2)+' Unit '+gm.group(2)) if gm else ''
    for n in sorted(titles):
        add('الدرس ' + str(n) + ' · ' + titles[n],
            page + '?lesson=' + str(n),
            ' '.join([titles[n], 'تقييم الدرس', str(n), glabel, unitlabel]),
            'تقييم درس')

with open(os.path.join(ROOT, 'search-index.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
print(f'search-index.json: {len(out)} entries')
