// 퍼포먼스 리뷰 — 화면 파일을 새로 받게 하는 파일 (기록 앱 sw.js 방식과 같음)
// 인터넷이 되면 서버에 새 판이 있는지 매번 묻고(브라우저 보관본 10분 건너뜀), 안 되면 보관본을 쓴다
// 아래 판 번호는 build_letter.py --deploy 가 올린다. 손으로 고치지 않는다
const CACHE = 'review-v4';
const FILES = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
