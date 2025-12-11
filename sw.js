// Service Worker for 케미테스트 PWA
const CACHE_NAME = 'chemi-test-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/App.js',
  '/data/constants.js',
  '/data/index.js',
  '/data/config.js',
  '/data/utils.js',
  '/data/subjects/human.js',
  '/data/subjects/cat.js',
  '/data/subjects/dog.js',
  '/data/subjects/rabbit.js',
  '/data/subjects/hamster.js',
  '/data/subjects/idealType.js',
  '/data/subjects/petMatch.js',
  '/data/subjects/plant.js',
  '/data/subjects/coffee.js',
  '/components/Icons.js',
  '/components/TraitBar.js',
  '/components/ModeTabs.js',
  '/services/ResultService.js',
  '/manifest.json',
  // PWA 아이콘
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// 외부 CDN은 runtime에 캐시
const CDN_URLS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Jua&display=swap'
];

// Install: 정적 자산 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Cache-first 전략 (오프라인 지원)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 요청은 네트워크 우선 (Supabase 연동 대비)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 정적 자산은 캐시 우선
  event.respondWith(cacheFirst(request));
});

// Cache-first 전략
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    // 성공적인 응답만 캐시
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // 오프라인 폴백
    console.log('[SW] Fetch failed, returning offline page');
    return new Response('오프라인 상태입니다', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-first 전략 (API용)
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 백그라운드 동기화 (Supabase 연동 시 결과 전송용)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-results') {
    event.waitUntil(syncPendingResults());
  }
});

async function syncPendingResults() {
  console.log('[SW] Syncing pending results...');

  // IndexedDB나 postMessage를 통해 메인 스레드의 ResultService에 동기화 요청
  const clients = await self.clients.matchAll({ type: 'window' });

  if (clients.length > 0) {
    // 활성 클라이언트에 동기화 메시지 전송
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_PENDING_RESULTS',
        timestamp: Date.now()
      });
    });
    console.log('[SW] Sync message sent to', clients.length, 'client(s)');
  } else {
    console.log('[SW] No active clients, sync will retry later');
  }
}

// 메인 스레드로부터 메시지 수신
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_COMPLETE') {
    console.log('[SW] Sync completed:', event.data.result);
  }

  // 수동 동기화 트리거
  if (event.data && event.data.type === 'TRIGGER_SYNC') {
    syncPendingResults();
  }
});
