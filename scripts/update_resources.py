#!/usr/bin/env python3
"""Update data/resources.json from public Telegram channel previews.

Sources (link-out model: we store title/grade/date + link to the source post,
never host the files):
  - altfwok (موقع التفوق): all subjects, filter to #اللغة_الإنجليزية via ?q=
  - myenglibrary (مكتبتي الإنجليزية): all-English channel, no filter needed
"""
import html as h
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (compatible; english-savant-resources/1.0)'}
DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    'data', 'resources.json')

GRADE_MAP = [
    (re.compile(r'ابتدائ|الابتدائى|prim', re.I), 'ابتدائي'),
    (re.compile(r'اعداد|إعداد|prep', re.I), 'إعدادي'),
    (re.compile(r'ثانو|بكالوريا', re.I), 'ثانوي'),
]
TAG_GRADE = {
    'الصف_الأول_الابتدائى': 'ابتدائي', 'الصف_الثانى_الإبتدائى': 'ابتدائي',
    'الصف_الثالث_الإبتدائى': 'ابتدائي', 'الصف_الرابع': 'ابتدائي',
    'الصف_الخامس': 'ابتدائي', 'الصف_السادس_الإبتدائى': 'ابتدائي',
    'الصف_الأول_الإعدادى': 'إعدادي', 'الثاني_الاعدادي': 'إعدادي',
    'الصف_الثالث_الإعدادى': 'إعدادي', 'الثالثة_الإعدادية': 'إعدادي',
    'الصف_الأول_الثانوى': 'ثانوي', 'الصف_الثانى_الثانوى': 'ثانوي',
    'الثانوية_العامة': 'ثانوي',
}


def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            return urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'replace')
        except Exception as e:
            if attempt == retries - 1:
                raise
            time.sleep(3 * (attempt + 1))


def clean(raw):
    return h.unescape(' '.join(re.sub(r'<[^>]+>', ' ', raw).split()))


def grade_of(text, tags):
    for t in tags:
        if t in TAG_GRADE:
            return TAG_GRADE[t]
    for rx, g in GRADE_MAP:
        if rx.search(text):
            return g
    return ''


def term_of(text):
    m = re.search(r'الترم\s*(الأول|الثاني|الاول)', text)
    return 'الترم ' + ('الأول' if m and 'ول' in m.group(1) else 'الثاني') if m else ''


def parse_channel(handle, query=None, pages=2):
    items = {}
    before = None
    for _ in range(pages):
        url = 'https://t.me/s/' + handle
        if query:
            url += '?q=' + urllib.parse.quote(query)
            if before:
                url += '&before=' + str(before)
        elif before:
            url += '?before=' + str(before)
        doc = fetch(url)
        msgs = re.findall(r'<div class="tgme_widget_message_wrap.*?(?=<div class="tgme_widget_message_wrap|$)', doc, re.S)
        got = 0
        page_min = None
        for m in msgs:
            mid = re.search(r'data-post="' + handle + r'/(\d+)"', m)
            tm = re.search(r'class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', m, re.S)
            if not mid or not tm:
                continue
            raw = tm.group(1)
            text = clean(raw)
            if not text:
                continue
            tags = re.findall(r'#([\w؀-ۿ_]+)', text)
            title = re.sub(r'\s*#\S+', '', text).strip()
            if len(title) > 220:
                title = title[:217].rstrip() + '…'
            d = re.search(r'<time datetime="([^"]+)"', m)
            pid = int(mid.group(1))
            items[pid] = {
                'id': handle + ':' + str(pid),
                'title': title,
                'grade': grade_of(text, tags),
                'term': term_of(text),
                'date': (d.group(1)[:10] if d else ''),
                'url': 'https://t.me/%s/%d' % (handle, pid),
            }
            got += 1
            page_min = pid if page_min is None else min(page_min, pid)
        before = page_min
        if got == 0 or len(msgs) < 5:
            break
        time.sleep(1)
    return list(items.values())


def main():
    existing = {'items': []}
    if os.path.exists(DATA):
        with open(DATA, encoding='utf-8') as f:
            existing = json.load(f)
    by_id = {i['id']: i for i in existing.get('items', [])}

    new = 0
    for it in parse_channel('altfwok', '#اللغة_الإنجليزية'):
        it['source'] = 'موقع التفوق'
        if it['id'] not in by_id:
            new += 1
        by_id[it['id']] = it
    for it in parse_channel('myenglibrary'):
        it['source'] = 'مكتبتي الإنجليزية'
        if it['id'] not in by_id:
            new += 1
        by_id[it['id']] = it

    items = sorted(by_id.values(), key=lambda i: (i['date'], i['id']), reverse=True)[:300]
    out = {
        'updated': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'items': items,
    }
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('total %d items, %d new' % (len(items), new))


if __name__ == '__main__':
    sys.exit(main())
