// Fester Bio-Link (Instagram, TikTok …) für den aktuellen Release.
// Vor dem Release → Pre-Save (HyperFollow), ab Release → Song.
// Nach dem Release: Spotify-Album-ID bei "sp" eintragen. Solange leer → Song auf der Website.
// Beim nächsten Release nur diese vier Werte (und Titel/Bild oben) ändern.
var R={
  at:'2026-10-16T00:00:00+02:00',
  presave:'https://distrokid.com/hyperfollow/abard1/no-someday-left',
  sp:'',
  slug:'no-someday-left'
};
var url=Date.now()<Date.parse(R.at)?R.presave:(R.sp?'https://open.spotify.com/album/'+R.sp:'/#play-'+R.slug);
location.replace(url);
