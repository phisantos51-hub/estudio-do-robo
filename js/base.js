/*
  BASE DO JOGO: memória do navegador, configurações, voz, sons, teclado,
  arrastar com o mouse, janelas e troca de telas.
  Nada aqui usa câmera, microfone ou internet.
*/
"use strict";

/* ---------- Atalhos para criar elementos ---------- */
function el(tag, attrs, ...filhos) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
  }
  for (const f of filhos.flat()) {
    if (f == null || f === false) continue;
    e.append(f instanceof Node ? f : document.createTextNode(String(f)));
  }
  return e;
}
function html(str) { const t = document.createElement("template"); t.innerHTML = str.trim(); return t.content.firstElementChild; }
function embaralhar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// Junta frases para a voz, sempre com um ponto entre elas (sem pontos repetidos).
function juntar(lista) {
  return lista.filter(Boolean).map(t => { t = String(t).trim(); return /[.!?:]$/.test(t) ? t : t + "."; }).join(" ");
}
function $(sel, raiz) { return (raiz || document).querySelector(sel); }

/* ---------- Memória do navegador (fica só neste computador) ---------- */
const Armazem = {
  prefixo: "estudioDoRobo.",
  ler(chave, padrao) {
    try { const v = localStorage.getItem(this.prefixo + chave); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; }
  },
  gravar(chave, valor) {
    try { localStorage.setItem(this.prefixo + chave, JSON.stringify(valor)); return true; } catch (e) { return false; }
  },
  apagar(chave) { try { localStorage.removeItem(this.prefixo + chave); } catch (e) { /* sem memória */ } }
};

/* ---------- Configurações ---------- */
const Config = {
  padrao: { modoAudio: false, vozPropria: true, modoCalmo: false, semAnimacoes: false, letrasGrandes: false, altoContraste: false, sons: false, velocidade: 1 },
  v: {},
  carregar() { this.v = Object.assign({}, this.padrao, Armazem.ler("config", {})); this.aplicar(); },
  mudar(nome, valor) { this.v[nome] = valor; Armazem.gravar("config", this.v); this.aplicar(); },
  aplicar() {
    const b = document.body.classList;
    b.toggle("modo-audio", !!this.v.modoAudio);
    b.toggle("calmo", !!this.v.modoCalmo);
    b.toggle("sem-animacoes", !!this.v.semAnimacoes);
    b.toggle("grande", !!this.v.letrasGrandes);
    b.toggle("contraste", !!this.v.altoContraste);
  }
};

/* ---------- Progresso (estrelas) ---------- */
const Progresso = {
  dados() { return Armazem.ler("progresso", { estrelas: {}, liberado: false }); },
  estrelas(chave) { return this.dados().estrelas[chave] || 0; },
  registrar(chave, n) {
    const d = this.dados();
    d.estrelas[chave] = Math.max(d.estrelas[chave] || 0, n);
    Armazem.gravar("progresso", d);
  },
  liberado() { return !!this.dados().liberado; },
  liberarTudo(sim) { const d = this.dados(); d.liberado = sim; Armazem.gravar("progresso", d); },
  apagar() { Armazem.apagar("progresso"); }
};

/* ---------- Produções (cenas, fotonovelas e notícias) ---------- */
const Producoes = {
  todas() { return Armazem.ler("producoes", []); },
  salvar(p) {
    const lista = this.todas();
    p.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    p.data = new Date().toISOString();
    lista.push(p);
    return Armazem.gravar("producoes", lista) ? p : null;
  },
  apagarTodas() { Armazem.apagar("producoes"); }
};

/* ---------- Voz (síntese de voz do próprio navegador) ---------- */
const Voz = {
  ultima: "",
  voz: null,
  disponivel: "speechSynthesis" in window,
  iniciar() {
    if (!this.disponivel) return;
    const escolher = () => {
      const vs = speechSynthesis.getVoices();
      const br = vs.filter(v => /pt[-_]BR/i.test(v.lang));
      const pt = vs.filter(v => /^pt/i.test(v.lang));
      // Preferimos uma voz instalada no computador (funciona sem internet).
      this.voz = br.find(v => v.localService) || br[0] || pt.find(v => v.localService) || pt[0] || null;
    };
    escolher();
    speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", escolher);
  },
  ativa() { return this.disponivel && Config.v.modoAudio && Config.v.vozPropria; },
  falar(texto, opcoes) {
    opcoes = opcoes || {};
    if (!texto) return;
    if (!opcoes.semGuardar) this.ultima = texto;
    if (!this.ativa() && !opcoes.forcar) return;
    if (!this.disponivel) return;
    if (!opcoes.fila) speechSynthesis.cancel();
    // Frases curtas: evita cortes em textos longos em alguns navegadores.
    const partes = String(texto).split(/(?<=[.!?:;])\s+/).filter(Boolean);
    partes.forEach(p => {
      const u = new SpeechSynthesisUtterance(p);
      u.lang = "pt-BR";
      if (this.voz) u.voice = this.voz;
      u.rate = Config.v.velocidade || 1;
      speechSynthesis.speak(u);
    });
  },
  parar() { if (this.disponivel) speechSynthesis.cancel(); },
  repetir() { if (this.ultima) this.falar(this.ultima, { semGuardar: true }); }
};

/* Escreve na região "aria-live" (lida pelo NVDA e pelo Narrador) e,
   no Modo Áudio, fala com a voz do jogo. */
function anunciar(texto) {
  const r = document.getElementById("anuncio");
  if (!r) return;
  r.textContent = "";
  setTimeout(() => { r.textContent = texto; }, 80);
}
function dizer(texto, opcoes) {
  anunciar(texto);
  Voz.falar(texto, opcoes);
}

/* ---------- Sons suaves (desligados por padrão) ---------- */
const Som = {
  ctx: null,
  tocar(tipo) {
    if (!Config.v.sons) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notas = { certo: [523, 659], erro: [330], clique: [440], fim: [523, 659, 784] }[tipo] || [440];
      const vol = Config.v.modoCalmo ? 0.04 : 0.08;
      notas.forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        const t = this.ctx.currentTime + i * 0.16;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.04);
        g.gain.linearRampToValueAtTime(0, t + 0.3);
        o.connect(g).connect(this.ctx.destination);
        o.start(t); o.stop(t + 0.32);
      });
    } catch (e) { /* sem som */ }
  }
};

/* ---------- Texto falado de um elemento ---------- */
function textoFalado(e) {
  if (!e) return "";
  if (e.dataset && e.dataset.fala) return e.dataset.fala;
  let t = e.getAttribute("aria-label") || "";
  if (!t) t = (e.innerText || e.textContent || "").replace(/\s+/g, " ").trim();
  if (e.tagName === "INPUT" || e.tagName === "TEXTAREA") {
    const rot = e.labels && e.labels[0] ? e.labels[0].innerText : (e.getAttribute("aria-label") || "");
    t = rot + ". Campo de texto. " + (e.value ? "Escrito: " + e.value : "Vazio.");
  }
  if (e.getAttribute("aria-pressed") === "true") t += ". Ligado.";
  if (e.getAttribute("aria-pressed") === "false") t += ". Desligado.";
  if (e.getAttribute("aria-disabled") === "true" && !/bloquead/i.test(t)) t += ". Indisponível.";
  return t;
}

/* ---------- Janela por cima da tela (Como jogar, Pausa, confirmações) ---------- */
const Janela = {
  aberta: null,
  abrir(opcoes) {
    this.fechar(true);
    const fundo = el("div", { class: "janela-fundo" + (opcoes.classe ? " " + opcoes.classe : "") });
    const caixa = el("div", { class: "janela", role: "dialog", "aria-modal": "true", "aria-labelledby": "janela-titulo" });
    const titulo = el("h2", { id: "janela-titulo", tabindex: "-1", text: opcoes.titulo });
    caixa.append(titulo);
    if (opcoes.conteudo) caixa.append(opcoes.conteudo);
    const botoes = el("div", { class: "janela-botoes" });
    (opcoes.botoes || [{ texto: "Fechar", acao: () => this.fechar() }]).forEach(b => {
      botoes.append(el("button", { class: "botao " + (b.classe || ""), type: "button", onclick: b.acao }, b.picto ? html(Desenho.picto(b.picto)) : null, b.texto));
    });
    caixa.append(botoes);
    fundo.append(caixa);
    document.body.append(fundo);
    document.getElementById("app").inert = true;
    this.aberta = { fundo, aoFechar: opcoes.aoFechar, foco: document.activeElement };
    focarSemFala(titulo);
    if (opcoes.fala) dizer(opcoes.fala);
  },
  fechar(silencioso) {
    if (!this.aberta) return;
    const a = this.aberta;
    this.aberta = null;
    a.fundo.remove();
    document.getElementById("app").inert = false;
    if (a.aoFechar && !silencioso) a.aoFechar();
    else if (!silencioso && a.foco && document.contains(a.foco)) focarSemFala(a.foco);
  }
};

/* Põe o foco num elemento sem a voz do jogo ler (usado quando a tela já fala sozinha). */
let silenciarFoco = false;
function focarSemFala(e) {
  if (!e) return;
  silenciarFoco = true;
  e.focus({ preventScroll: false });
  setTimeout(() => { silenciarFoco = false; }, 30);
}

/* ---------- Troca de telas ---------- */
const App = {
  pilha: [],
  telas: {},
  atual: null,
  registrar(nome, fn) { this.telas[nome] = fn; },
  ir(nome, params, opcoes) {
    opcoes = opcoes || {};
    if (this.atual && !opcoes.substituir) this.pilha.push(this.atual);
    this.atual = { nome, params: params || {} };
    this.desenhar();
  },
  voltar() {
    if (Janela.aberta) { Janela.fechar(); return; }
    if (!this.pilha.length) return;
    this.atual = this.pilha.pop();
    this.desenhar();
  },
  inicio() { this.pilha = []; this.atual = { nome: "inicio", params: {} }; this.desenhar(); },
  desenhar() {
    Voz.parar();
    const tela = this.telas[this.atual.nome](this.atual.params);
    const main = document.getElementById("tela");
    main.textContent = "";
    main.className = "tela " + (tela.classe || "");
    document.body.classList.toggle("ano1", !!tela.maiusculas);
    document.body.dataset.cor = tela.cor || "azul";
    $("#topo-titulo").textContent = tela.titulo;
    $("#botao-voltar").hidden = !this.pilha.length;
    $("#botao-ajuda").hidden = !tela.comoJogar;
    this.comoJogar = tela.comoJogar || null;
    document.title = tela.titulo + " · Estúdio do Robô";
    main.append(tela.conteudo);
    window.scrollTo(0, 0);
    const alvo = main.querySelector("[data-foco-inicial]") || main.querySelector("h1, h2");
    if (alvo) { if (!alvo.hasAttribute("tabindex") && !/^(BUTTON|INPUT|A)$/.test(alvo.tagName)) alvo.setAttribute("tabindex", "-1"); focarSemFala(alvo); }
    if (tela.fala) dizer(tela.fala);
    if (tela.depois) tela.depois();
  }
};

/* ---------- Navegação pelo teclado ---------- */
function focaveis(raiz) {
  return Array.from(raiz.querySelectorAll("button, a[href], input, textarea, select, [tabindex='0']"))
    .filter(e => !e.disabled && !e.hidden && e.offsetParent !== null && !e.closest("[hidden],[inert]"));
}
function moverFoco(passo) {
  let lista;
  if (Janela.aberta) lista = focaveis(Janela.aberta.fundo);
  else lista = focaveis(document.getElementById("tela")).concat(focaveis(document.getElementById("topo")));
  if (!lista.length) return;
  const i = lista.indexOf(document.activeElement);
  let j = i < 0 ? (passo > 0 ? 0 : lista.length - 1) : i + passo;
  if (j < 0) j = lista.length - 1;
  if (j >= lista.length) j = 0;
  lista[j].focus();
  lista[j].scrollIntoView({ block: "nearest" });
}
function digitando(e) {
  const t = e.target;
  return t && (t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && !/^(button|checkbox|radio)$/.test(t.type)));
}

const Teclado = {
  ajuda: null, // função que devolve a ajuda falada da tela atual
  setas: null, // usado na apresentação: setas para os lados trocam de produção
  iniciar() {
    document.addEventListener("keydown", (e) => {
      // F1 liga e desliga o Modo Áudio em qualquer tela.
      if (e.key === "F1") { e.preventDefault(); alternarModoAudio(); return; }
      if (e.key === "Escape") { e.preventDefault(); if (document.body.classList.contains("pausado")) { Pausa.sair(); } else App.voltar(); return; }
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const escrevendo = digitando(e);
      if (Config.v.modoAudio && !escrevendo) {
        if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); Voz.repetir(); anunciar(Voz.ultima); return; }
        if (e.key === "h" || e.key === "H") { e.preventDefault(); falarAjuda(); return; }
      }
      if (!escrevendo && (e.key === "p" || e.key === "P")) { e.preventDefault(); Pausa.entrar(); return; }
      if (Teclado.setas && !escrevendo && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault(); Teclado.setas(e.key === "ArrowRight" ? 1 : -1); return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (escrevendo && e.key === "ArrowRight") return;
        if (e.target.tagName === "SELECT") return;
        e.preventDefault(); moverFoco(1); return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (escrevendo && e.key === "ArrowLeft") return;
        if (e.target.tagName === "SELECT") return;
        e.preventDefault(); moverFoco(-1); return;
      }
      if (!escrevendo && /^[1-9]$/.test(e.key)) {
        const raiz = Janela.aberta ? Janela.aberta.fundo : document.getElementById("tela");
        const alvo = raiz.querySelector(`[data-num="${e.key}"]`);
        if (alvo) { e.preventDefault(); alvo.focus(); alvo.click(); }
      }
    }, true);

    // No Modo Áudio, o jogo lê em voz alta o que recebe o foco.
    document.addEventListener("focusin", (e) => {
      if (silenciarFoco || !Voz.ativa()) return;
      const t = e.target;
      if (t.id === "tela" || t.tagName === "H1" || t.tagName === "H2") return;
      Voz.falar(textoFalado(t));
    });
  }
};

function falarAjuda() {
  const geral = "Ajuda. Use as setas para andar pelas opções. Enter para escolher. Os números 1, 2, 3 escolhem a opção direto. Esc volta. Barra de espaço repete a última fala. P faz uma pausa. F1 liga e desliga o Modo Áudio.";
  const extra = Teclado.ajuda ? Teclado.ajuda() : "";
  dizer((extra ? extra + " " : "") + geral);
}

function alternarModoAudio() {
  const ligar = !Config.v.modoAudio;
  Config.mudar("modoAudio", ligar);
  if (ligar) {
    Voz.falar("Modo Áudio ligado. Use as setas para andar, Enter para escolher, Esc para voltar, barra de espaço para repetir e H para ajuda.", { forcar: true });
    anunciar("Modo Áudio ligado.");
  } else {
    Voz.parar();
    Voz.falar("Modo Áudio desligado.", { forcar: true, semGuardar: true });
    anunciar("Modo Áudio desligado.");
  }
  document.querySelectorAll("[data-config='modoAudio']").forEach(b => b.setAttribute("aria-pressed", String(ligar)));
  if (App.atual && App.atual.nome === "estudio") setTimeout(() => App.desenhar(), ligar ? 4500 : 0);
}

/* ---------- Pausa ---------- */
const Pausa = {
  entrar() {
    if (document.body.classList.contains("pausado")) return;
    Voz.parar();
    const tela = $("#pausa");
    tela.hidden = false;
    document.body.classList.add("pausado");
    document.getElementById("app").inert = true;
    if (Janela.aberta) Janela.aberta.fundo.inert = true;
    this.foco = document.activeElement;
    focarSemFala($("#botao-sair-pausa"));
    dizer("Pausa. Pode descansar. Quando quiser voltar, aperte Enter no botão Voltar ao jogo.");
  },
  sair() {
    $("#pausa").hidden = true;
    document.body.classList.remove("pausado");
    if (Janela.aberta) Janela.aberta.fundo.inert = false;
    else document.getElementById("app").inert = false;
    dizer("De volta ao jogo.");
    if (this.foco && document.contains(this.foco)) focarSemFala(this.foco);
  }
};

/* ---------- Arrastar com o mouse (também funciona com clique) ---------- */
function tornarArrastavel(item, aoSoltar) {
  item.classList.add("arrastavel");
  let inicio = null, fantasma = null, arrastou = false;
  item.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    inicio = { x: e.clientX, y: e.clientY };
    arrastou = false;
    item.setPointerCapture(e.pointerId);
  });
  item.addEventListener("pointermove", (e) => {
    if (!inicio) return;
    const dx = e.clientX - inicio.x, dy = e.clientY - inicio.y;
    if (!arrastou && Math.hypot(dx, dy) > 10) {
      arrastou = true;
      const r = item.getBoundingClientRect();
      fantasma = item.cloneNode(true);
      fantasma.classList.add("fantasma");
      fantasma.removeAttribute("id");
      fantasma.style.width = r.width + "px";
      fantasma.style.left = r.left + "px";
      fantasma.style.top = r.top + "px";
      fantasma.dataset.ox = r.left; fantasma.dataset.oy = r.top;
      document.body.append(fantasma);
      item.classList.add("sendo-arrastado");
    }
    if (arrastou) {
      fantasma.style.transform = `translate(${dx}px, ${dy}px)`;
      document.querySelectorAll(".alvo-soltar.sobre").forEach(a => a.classList.remove("sobre"));
      const alvo = alvoEm(e.clientX, e.clientY);
      if (alvo) alvo.classList.add("sobre");
    }
  });
  const terminar = (e) => {
    if (!inicio) return;
    inicio = null;
    if (!arrastou) return;
    const alvo = alvoEm(e.clientX, e.clientY);
    document.querySelectorAll(".alvo-soltar.sobre").forEach(a => a.classList.remove("sobre"));
    if (fantasma) fantasma.remove();
    fantasma = null;
    item.classList.remove("sendo-arrastado");
    item.dataset.acabouDeArrastar = "1";
    setTimeout(() => { delete item.dataset.acabouDeArrastar; }, 50);
    if (alvo) aoSoltar(alvo);
  };
  item.addEventListener("pointerup", terminar);
  item.addEventListener("pointercancel", terminar);
  function alvoEm(x, y) {
    if (fantasma) fantasma.style.display = "none";
    const debaixo = document.elementFromPoint(x, y);
    if (fantasma) fantasma.style.display = "";
    return debaixo ? debaixo.closest(".alvo-soltar") : null;
  }
}
/* Ignora o clique que o navegador gera logo depois de um arraste. */
function foiArraste(item) { return item.dataset.acabouDeArrastar === "1"; }
