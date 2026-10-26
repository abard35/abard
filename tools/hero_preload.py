"""Kopfbereich vorbereiten (Ladezeit / Lighthouse).

Rechnet wie hero.js aus, welcher Clip beim Öffnen der Seite zuerst gezeigt wird, und
  - lädt dessen Standbild per <link rel="preload" fetchpriority="high"> sofort (grösstes Element = LCP),
  - markiert den Kopf als "no-reel", wenn gerade kein Release aktuell ist (sonst springt das Layout).
Wird von build_share.py und update_stats.py (täglich) aufgerufen.
"""
import datetime as dt
import os
import re

DAYS_AFTER = 7
V = '?v=1'


def _clips(root):
    js = open(os.path.join(root, 'hero.js'), encoding='utf-8').read()
    block = re.search(r'var CLIPS=\{(.*?)\};', js, re.S).group(1)
    return {m.group(1): re.findall(r"'(\w+)'", m.group(2))
            for m in re.finditer(r"'([^']+)':\[([^\]]*)\]", block)}


def apply(s, root='.'):
    clips = _clips(root)
    now = dt.datetime.now(dt.timezone.utc)
    rel = []
    for m in re.finditer(r'<div class="next"[^>]*>', s):
        tag = m.group(0)
        slug = re.search(r'data-slug="([^"]+)"', tag)
        at = re.search(r'data-at="([^"]+)"', tag)
        if not slug or not at or slug.group(1) not in clips:
            continue
        try:
            t = dt.datetime.fromisoformat(at.group(1))
        except ValueError:
            continue
        if now > t + dt.timedelta(days=DAYS_AFTER):
            continue
        rel.append((t, slug.group(1)))
    rel.sort()
    link = ''
    k = ''
    if rel:
        cur = rel[-1]
        for r in rel:
            if r[0] > now:
                cur = r
                break
        t, slug = cur
        kinds = clips[slug]
        if now >= t and 'out' in kinds:
            k = slug + '-out'
        elif 'teaser' in kinds:
            k = slug + '-teaser'
        else:
            k = slug + '-out'
        link = f'<link rel="preload" as="image" href="clips/{k}.jpg{V}" fetchpriority="high">'
    # Standbild des ersten Clips direkt ins HTML, damit es ohne JavaScript sofort erscheint
    rv = (f'<div class="rv"><video muted playsinline preload="none" poster="clips/{k}.jpg{V}"></video></div>' if rel else '')
    s = re.sub(r'<div class="reel" id="reel" role="region">(?:<div class="rv">.*?</div>)?</div>',
               lambda m: '<div class="reel" id="reel" role="region">' + rv + '</div>', s, count=1, flags=re.S)
    s = re.sub(r'<!--HEROPL-->.*?<!--/HEROPL-->', '<!--HEROPL-->' + link + '<!--/HEROPL-->', s, count=1, flags=re.S)
    cls = 'wrap hero' if rel else 'wrap hero no-reel'
    s = re.sub(r'<div class="wrap hero[^"]*">', f'<div class="{cls}">', s, count=1)
    return s


if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    p = os.path.join(root, 'index.html')
    s = open(p, encoding='utf-8').read()
    open(p, 'w', encoding='utf-8').write(apply(s, root))
