// Minimaler Service Worker: nötig, damit Handys die Seite als App installieren können.
// Absichtlich OHNE Zwischenspeicher – sonst würden nach Updates alte Fassungen angezeigt.
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(){}); // nichts abfangen: alles geht wie gewohnt übers Netz
