'use strict';

// What should I cache?
var urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  // js assets
  'js/main.js',
  'js/services/NetworkConnectivityService.js',
  'js/components/CardList.js',
  'js/components/SideNavBar.js',
  'js/components/ToDoCard.js',
  'js/indexedDB/IndexedDBLayer.js',
  'js/indexedDB/TodoListDB.js',
  'js/web-workers/db.js',
  'js/vendor/cards.js',
  'js/vendor/vanillatoasts.js',
  'js/util/setDefaultTODOs.js',
  // css assets
  'style/css/main.css',
  'style/vendor/vanillatoasts.css',
  // img assets
  'imgs/offline-rex.jpg',
  'imgs/icon/favicon-96x96.png',
  'imgs/icon/favicon-144x144.png',
  'imgs/icon/favicon-196x196.png',
  'imgs/plus.svg'
];

// used for logging
const logTextColor = "black";
const logBackgroundColor = "#FFD700";

// Cache name - should be changed whenever significant changes are made
var version = 1;
var getISODate = () => {
  return new Date().toISOString().split('T')[0];
};
var getCacheName = () => {
  return `${getISODate()}-static-${version}`;
};

// just checking is cache the most recent
var isLatestCacheName = (key) => {
  return key == getCacheName();
};

// deletes all caches that are out of date / version
var deleteOldCaches = function () {
  console.log('%c Service workers: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Checking for old caches.');
  var getOldCacheKeys = function () {
    return caches.keys().then(function (keys) {
      return keys.filter(function (key) {
        return !isLatestCacheName(key);
      });
    });
  };
  return getOldCacheKeys().then(function (oldCacheKeys) {
    return Promise.all(oldCacheKeys.map(function (key) {
      return caches.delete(key);
    }));
  });
};

function updateCache() {
  return caches.open(getCacheName())
    .then(function (cache) {
      return cache.addAll(urlsToCache);
    });
};


// If all the files are successfully cached, then the service worker is installed.
self.addEventListener('install', function (event) {
  // Perform install steps
  console.log('%c Service workers: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, '2. Installed, all the files are downloaded and cached successfully. Activating...');
  event.waitUntil(updateCache());
});

// After the service worker is installed, it is then activated, meaning it can start controlling what the user gets!
self.addEventListener('activate', function (event) {
  console.log('%c Service workers: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, '3. Activated.  Now is a good moment if we want to manage old caches.');
  deleteOldCaches();
});

var deleteAllCache = function () {
  console.log('%c Service workers: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Deleting all cache :(');
  var cacheWhitelist = `this should never be a cache name!!! this thing cost me way too much time!!`;
  caches.keys().then(function (keyList) {
    return Promise.all(keyList.map(function (key) {
      if (cacheWhitelist.indexOf(key) === -1) {
        return caches.delete(key);
      }
    }));
  });
}

var doesRequestAcceptHtml = function (request) {
  return request.headers.get('Accept')
    .split(',')
    .some(function (type) {
      return type === 'text/html';
    });
};

self.addEventListener('fetch', function (event) {
  console.log('%c Service workers: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Fetch intercepted: ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          console.log('%c Service workers: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Cache hit! No need for the server to work here :)');
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method) {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();
            caches.open(getCacheName).then(function (cache) {
              cache.put(event.request, responseToCache);
            });

            return response;
          }
        );
      })
  );
});
