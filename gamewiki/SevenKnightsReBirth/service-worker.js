/**
 * Service Worker for Seven Knights Re:Birth Wiki
 * PWA対応 + キャッシュ管理
 */

const CACHE_NAME = 'sk-rebirth-wiki-v1';
const CACHE_VERSION = Date.now(); // ビルド時に更新される

// キャッシュするリソース
const CACHE_URLS = [
  './',
  './index.html',
  './characters.html',
  './styles.css',
  './script.js',
  './i18n.js',
  './i18n/languages.json',
  './i18n/ui.json',
  './images/icon/rogo.webp',
  './images/icon/favicon-32.webp'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core files');
      return cache.addAll(CACHE_URLS);
    })
  );
  // 即座にアクティブ化
  self.skipWaiting();
});

// アクティブ化時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 即座にコントロール開始
  self.clients.claim();
});

// フェッチ戦略: Network First (オンライン優先、オフライン時はキャッシュ)
self.addEventListener('fetch', (event) => {
  // POSTリクエストやchrome-extension等はスキップ
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // 広告・アナリティクス関連はキャッシュしない（常にネットワークから取得）
  const noCachePatterns = [
    'pagead2.googlesyndication.com',
    'googleads.g.doubleclick.net',
    'adservice.google',
    'google-analytics.com',
    'googletagmanager.com',
    'ko-fi.com',
    'ofuse.me'
  ];
  
  if (noCachePatterns.some(pattern => event.request.url.includes(pattern))) {
    // 広告はキャッシュせずネットワークから直接取得
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功したらキャッシュを更新
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュから取得
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // HTMLリクエストの場合はオフラインページを返す
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// キャッシュクリアメッセージを受信
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing all caches...');
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      ).then(() => {
        console.log('[SW] All caches cleared');
        // クライアントにクリア完了を通知
        event.ports[0].postMessage({ success: true });
      });
    });
  }
});
