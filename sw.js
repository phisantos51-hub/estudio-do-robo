/*
  Guarda uma cópia do jogo no navegador para ele abrir mesmo sem internet.
  Sempre tenta buscar a versão nova primeiro; sem internet, usa a cópia guardada.
  Não envia nenhum dado para lugar nenhum.
*/
const CACHE = "estudio-do-robo-v1";
const ARQUIVOS = [
  "./", "index.html", "css/estilo.css?v=1",
  "js/conteudo.js?v=1", "js/desenhos.js?v=1", "js/base.js?v=1",
  "js/atividades.js?v=1", "js/producoes.js?v=1", "js/telas.js?v=1"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
