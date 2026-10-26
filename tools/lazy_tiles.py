"""Kachel-Cover (Startseite) ohne src im HTML, damit sie erst beim Hinscrollen laden.

Im HTML steht <div class="cover"><img data-src="…" data-srcset="…">; app.js (ABARD_LZ) setzt src/srcset,
sobald die Kachel in die Nähe kommt. Die Hilfsskripte arbeiten intern mit der normalen Form (to_plain)
und schreiben am Ende wieder die verzögerte Form (to_data). Neue Kacheln dürfen mit normalem src
eingetragen werden – build_share.py wandelt sie um.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_IMG = re.compile(r'(<div class="cover"><img )([^>]*>)')


def _webp(src):
    """Eigene Cover (z. B. room404.jpg?v=2): WebP in 300 und 600 px erzeugen (falls fehlend) und srcset liefern."""
    path, _, q = src.partition('?')
    if path.startswith(('http', '/')) or not path.lower().endswith(('.jpg', '.jpeg', '.png')):
        return None
    full = os.path.join(ROOT, path)
    if not os.path.exists(full):
        return None
    base = os.path.splitext(path)[0]
    try:
        from PIL import Image
    except ImportError:
        return None
    out = []
    for w in (300, 600):
        dst = os.path.join(ROOT, f'{base}-{w}.webp')
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(full):
            im = Image.open(full).convert('RGB')
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(dst, 'WEBP', quality=80, method=6)
        out.append(f'{base}-{w}.webp' + (('?' + q) if q else '') + f' {w}w')
    return ', '.join(out)


def to_data(s):
    def f(m):
        attrs = m.group(2)
        if 'srcset=' not in attrs:
            sm = re.search(r'(?<![-\w])src="([^"]+)"', attrs)
            ss = _webp(sm.group(1)) if sm else None
            if ss:
                attrs = attrs.replace(sm.group(0), sm.group(0) + f' srcset="{ss}" sizes="(max-width:520px) 46vw, 330px"', 1)
        attrs = re.sub(r'(?<![-\w])src="', 'data-src="', attrs, count=1)
        attrs = re.sub(r'(?<![-\w])srcset="', 'data-srcset="', attrs, count=1)
        return m.group(1) + attrs
    return _cards(_IMG.sub(f, s))


def _cards(s):
    """Bilder der unsichtbaren Release-Karten (#next) nie sofort laden – sie dienen nur als Datenquelle."""
    a = s.find('<section class="block" id="next"')
    if a < 0:
        return s
    b = s.find('<section class="block" id="top"', a)  # alle Karten-Abschnitte bis zu den Top-Songs
    if b < 0:
        return s
    part = re.sub(r'<img [^>]*>', lambda m: re.sub(r'(?<![-\w])src="', 'data-src="', m.group(0), count=1), s[a:b])
    return s[:a] + part + s[b:]


def to_plain(s):
    def f(m):
        attrs = m.group(2).replace('data-src="', 'src="', 1).replace('data-srcset="', 'srcset="', 1)
        return m.group(1) + attrs
    return _IMG.sub(f, s)
