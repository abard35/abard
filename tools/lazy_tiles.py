"""Kachel-Cover (Startseite) ohne src im HTML, damit sie erst beim Hinscrollen laden.

Im HTML steht <div class="cover"><img data-src="…" data-srcset="…">; app.js (ABARD_LZ) setzt src/srcset,
sobald die Kachel in die Nähe kommt. Die Hilfsskripte arbeiten intern mit der normalen Form (to_plain)
und schreiben am Ende wieder die verzögerte Form (to_data). Neue Kacheln dürfen mit normalem src
eingetragen werden – build_share.py wandelt sie um.
"""
import re

_IMG = re.compile(r'(<div class="cover"><img )([^>]*>)')


def to_data(s):
    def f(m):
        attrs = m.group(2)
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
