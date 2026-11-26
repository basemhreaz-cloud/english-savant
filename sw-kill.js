/* Emergency self-destruct service worker. To use: copy this file over sw.js. Existing installs fetch it, delete caches, unregister and reload. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',(e)=>e.waitUntil((async()=>{for(const k of await caches.keys())await caches.delete(k);await self.registration.unregister();for(const c of await self.clients.matchAll({type:'window'}))try{c.navigate(c.url)}catch(_){}})()));
