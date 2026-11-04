/* PhenoDex offline cache. Bump VERSION when you upload a new index.html. */
var VERSION="phenodex-v8";
var CORE=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var u=new URL(e.request.url);
  var same=u.origin===location.origin, font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return;
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(e.request,{ignoreSearch:same}).then(function(hit){
      var net=fetch(e.request).then(function(r){if(r&&(r.ok||r.type==="opaque"))c.put(e.request,r.clone());return r;}).catch(function(){return hit;});
      return hit||net;
    });
  }));
});
