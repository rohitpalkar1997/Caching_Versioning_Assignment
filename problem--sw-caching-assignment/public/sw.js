self.addEventListener('install', function(event){
    console.log('[Service Worker]..... Installing the service worker', event);
    event.waitUntil(
        caches.open('astatic')
        .then(function(cache){
            console.log('[Service Worker]...Precahcing the app shell');
            cache.addAll([
                '/',
                '/index.html',
                '/src/app.css',
                '/src/main.css',
                '/src/js/prmoise.js',
                '/src/js/fetch.js',
                '/src/js/main.js',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
            ]);
        })
    )
});

self.addEventListener('activate', function(event){
    console.log('[Service Worker].... Activating the Service Worker');
    event.waitUntil(
        caches.keys() 
        .then(function(KeyList){
            return Promise.all(KeyList.map(function(key){
                if(key!=='astatic' && key!=='adynamic'){
                    console.log('[Service Worker]....Clearing the old cache');
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.cliam();
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response){
                return response;
            }
            else{
                return fetch(event.request)
                .then(function(res){
                    caches.open('adynamic')
                    .then(function(cache){
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
                })
                .catch(function(err){
                    
                });
            }
        })
    );
});
