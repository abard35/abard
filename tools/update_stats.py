#!/usr/bin/env python3
"""Streamzahlen in index.html aktualisieren.

Aufruf:  python3 tools/update_stats.py stats.json
stats.json = {"spotify": {"Songtitel": 1234, ...}, "youtube": {"Videotitel": 567, ...}}
  - spotify: Titel wie in Spotify for Artists (Songs, Zeitraum "Insgesamt")
  - youtube: Titel wie in YouTube Studio (Inhalte des Kanals); Zusätze wie "(Official Audio)" stören nicht

Regeln:
  - data-sp nur ab 400 Spotify-Streams, data-ytv immer (falls Video vorhanden)
  - Zahlenzeile ("SP: … · YT: …") nur, wenn Spotify oder YouTube >= 400
  - Top 3 = höchste Summe Spotify + YouTube; Rest nach Datum (neueste zuerst)
"""
import difflib, json, re, sys, unicodedata

LIMIT = 400
ROOT = __file__.rsplit('/tools/', 1)[0]
HTML = ROOT + '/index.html'


def norm(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    t = re.split(r'\s[\(\[\|\-–]\s?|\s\|', t)[0] if re.search(r'\s[\(\[\|\-–]', t) else t
    return re.sub(r'[^a-z0-9]', '', t)


def fmt(n):
    return f'{n:,}'.replace(',', '’')


def best(title, table):
    """Wert aus table (normierter Titel -> Zahl) zum Kacheltitel suchen."""
    k = norm(title)
    if k in table:
        return table[k]
    m = difflib.get_close_matches(k, table.keys(), n=1, cutoff=0.8)
    return table[m[0]] if m else None


def main():
    data = json.load(open(sys.argv[1], encoding='utf-8'))
    sp = {norm(k): int(v) for k, v in data.get('spotify', {}).items()}
    yt = {norm(k): int(v) for k, v in data.get('youtube', {}).items()}
    s = open(HTML, encoding='utf-8').read()

    blocks = re.findall(r'        <a data-slug="[^"]+" class="rel[^"]*".*?\n        </a>\n', s, re.S)
    f0 = s.index('<div class="featured">\n') + len('<div class="featured">\n')
    f1 = s.index('      </div>\n', f0)
    r0 = s.index('<div class="releases">\n') + len('<div class="releases">\n')
    r1 = s.index('      </div>\n', r0)
    assert len(blocks) == s[f0:f1].count('<a data-slug') + s[r0:r1].count('<a data-slug')

    songs, report = [], []
    for b in blocks:
        title = re.search(r'<h3>(.*?)</h3>', b).group(1)
        has_sp = 'data-id="' in b
        old_sp = re.search(r' data-sp="(\d+)"', b)
        old_yt = re.search(r' data-ytv="(\d+)"', b)
        n_sp = best(title, sp) if has_sp else None
        n_yt = best(title, yt)
        if n_sp is None and old_sp: n_sp = int(old_sp.group(1))
        if n_yt is None and old_yt: n_yt = int(old_yt.group(1))
        # Attribute neu setzen
        b = re.sub(r' data-sp="\d+"', '', b)
        b = re.sub(r' data-ytv="\d+"', '', b)
        attrs = ''
        if n_sp is not None and n_sp >= LIMIT: attrs += f' data-sp="{n_sp}"'
        if n_yt is not None: attrs += f' data-ytv="{n_yt}"'
        b = re.sub(r'(class="rel[^"]*")', r'\1' + attrs, b, count=1)
        # Zahlenzeile
        b = re.sub(r'<span class="streams">[^<]*</span>', '', b)
        if (n_sp or 0) >= LIMIT or (n_yt or 0) >= LIMIT:
            parts = []
            if n_sp is not None and n_sp >= LIMIT: parts.append('SP: ' + fmt(n_sp))
            if n_yt is not None: parts.append('YT: ' + fmt(n_yt))
            b = re.sub(r'(<span class="meta">[^<]*</span>)', r'\1<span class="streams">' + ' · '.join(parts) + '</span>', b, count=1)
        date = re.search(r' data-date="([^"]*)"', b).group(1)
        total = (n_sp or 0) + (n_yt or 0)
        songs.append({'b': b, 'title': title, 'date': date, 'total': total})
        report.append(f'{title}: SP {n_sp} / YT {n_yt}')

    def to_big(b, rank):
        b = b.replace('class="rel"', 'class="rel big"', 1) if 'class="rel big"' not in b else b
        m = re.search(r'ab67616d00001e02([0-9a-f]+)', b)
        if m:
            h = m.group(1)
            b = re.sub(r'<img src="[^"]+" srcset="[^"]+" sizes="[^"]+" (alt="[^"]+") loading="lazy" width="300" height="300">',
                       rf'<img src="https://i.scdn.co/image/ab67616d0000b273{h}" \1 loading="lazy" width="640" height="640">', b)
        b = re.sub(r'<span class="rank">#\d</span>', '', b)
        return b.replace('<span class="play"', f'<span class="rank">#{rank}</span><span class="play"', 1)

    def to_normal(b):
        b = b.replace('class="rel big"', 'class="rel"', 1)
        b = re.sub(r'<span class="rank">#\d</span>', '', b)
        m = re.search(r'ab67616d0000b273([0-9a-f]+)', b)
        if m and 'srcset=' not in b:
            h = m.group(1)
            b = re.sub(r'<img src="[^"]+" (alt="[^"]+") loading="lazy" width="640" height="640">',
                       rf'<img src="https://i.scdn.co/image/ab67616d00001e02{h}" srcset="https://i.scdn.co/image/ab67616d00001e02{h} 300w, https://i.scdn.co/image/ab67616d0000b273{h} 640w" sizes="(max-width:520px) 45vw, 220px" \1 loading="lazy" width="300" height="300">', b)
        b = b.replace('width="640" height="640"><span class="play"', 'width="300" height="300"><span class="play"')
        return b

    ranked = sorted(songs, key=lambda x: -x['total'])
    top = ranked[:3]
    rest = [x for x in songs if x not in top]
    rest.sort(key=lambda x: x['date'], reverse=True)  # stabil: gleiche Daten behalten Reihenfolge
    featured = ''.join(to_big(x['b'], i + 1) for i, x in enumerate(top))
    releases = ''.join(to_normal(x['b']) for x in rest)
    s = s[:r0] + releases + s[r1:]
    s = s[:f0] + featured + s[f1:] if f1 < r0 else None
    open(HTML, 'w', encoding='utf-8').write(s)
    print('Top 3:', ', '.join(f"{x['title']} ({x['total']})" for x in top))
    print('\n'.join(report))


if __name__ == '__main__':
    main()
