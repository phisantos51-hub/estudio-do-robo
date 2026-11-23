/*
  TELAS: início, estúdios, Mural da Emissora, Área do professor,
  Como jogar, Ajustes e a apresentação em tela cheia.
*/
"use strict";

/* ---------- Botão que liga/desliga uma configuração ---------- */
function botaoConfig(nome, rotulo, picto, aoMudar) {
  const b = el("button", { class: "botao alternar", type: "button", "data-config": nome, "aria-pressed": String(!!Config.v[nome]) },
    picto ? html(Desenho.picto(picto)) : null, el("span", null, rotulo), el("span", { class: "estado", "aria-hidden": "true" }));
  b.addEventListener("click", () => {
    if (nome === "modoAudio") { alternarModoAudio(); return; }
    const novo = !Config.v[nome];
    Config.mudar(nome, novo);
    document.querySelectorAll(`[data-config='${nome}']`).forEach(x => x.setAttribute("aria-pressed", String(novo)));
    dizer(`${rotulo}: ${novo ? "ligado" : "desligado"}.`);
    if (aoMudar) aoMudar(novo);
  });
  return b;
}

function painelAjustes(completo) {
  const g = el("div", { class: "grade-ajustes" });
  if (completo) {
    g.append(botaoConfig("modoAudio", "Modo Áudio (F1)", "ouvido"));
    g.append(botaoConfig("modoCalmo", "Modo Calmo", "calmo"));
  }
  g.append(botaoConfig("letrasGrandes", "Letras e botões maiores", "olho"));
  g.append(botaoConfig("altoContraste", "Alto contraste", "olho"));
  g.append(botaoConfig("semAnimacoes", "Desligar animações", "pausa"));
  g.append(botaoConfig("sons", "Sons suaves", "som"));
  g.append(botaoConfig("vozPropria", "Voz do jogo no Modo Áudio", "microfone"));
  const vel = el("button", { class: "botao alternar", type: "button", "aria-pressed": String(Config.v.velocidade < 1) }, html(Desenho.picto("ouvido")), el("span", null, "Voz mais devagar"), el("span", { class: "estado", "aria-hidden": "true" }));
  vel.addEventListener("click", () => {
    const devagar = !(Config.v.velocidade < 1);
    Config.mudar("velocidade", devagar ? 0.8 : 1);
    vel.setAttribute("aria-pressed", String(devagar));
    dizer(`Voz mais devagar: ${devagar ? "ligado" : "desligado"}.`);
  });
  g.append(vel);
  return g;
}

function abrirAjustes() {
  Janela.abrir({
    titulo: "Ajustes",
    conteudo: el("div", null, el("p", null, "Clique para ligar ou desligar."), painelAjustes(false)),
    fala: "Ajustes. Use as setas para escolher e Enter para ligar ou desligar."
  });
}

/* ---------- Como jogar (instruções ilustradas) ---------- */
function abrirComoJogar(passos) {
  passos = passos || App.comoJogar || [];
  const lista = el("ol", { class: "como-jogar" });
  passos.forEach((p, i) => lista.append(el("li", null, el("span", { class: "passo-num", "aria-hidden": "true" }, String(i + 1)), html(Desenho.picto(p.picto)), el("span", null, p.texto))));
  const teclas = el("div", { class: "teclas" }, el("h3", null, html(Desenho.picto("teclado")), "Pelo teclado"),
    el("ul", null,
      el("li", null, el("kbd", null, "Setas"), " andam pelas opções"),
      el("li", null, el("kbd", null, "Enter"), " escolhe"),
      el("li", null, el("kbd", null, "1"), " ", el("kbd", null, "2"), " ", el("kbd", null, "3"), " escolhem direto"),
      el("li", null, el("kbd", null, "Esc"), " volta"),
      el("li", null, el("kbd", null, "P"), " pausa"),
      el("li", null, el("kbd", null, "F1"), " Modo Áudio; no Modo Áudio, ", el("kbd", null, "Espaço"), " repete e ", el("kbd", null, "H"), " dá ajuda")));
  const fala = "Como jogar. " + passos.map((p, i) => `${i + 1}: ${p.texto}`).join(" ") + " Pelo teclado: setas andam, Enter escolhe, Esc volta, barra de espaço repete e H dá ajuda.";
  Janela.abrir({ titulo: "Como jogar", conteudo: el("div", null, lista, teclas), fala, botoes: [{ texto: "Entendi", picto: "certo", classe: "principal", acao: () => Janela.fechar() }] });
}

/* ============================================================
   TELA INICIAL
   ============================================================ */
const COMO_JOGAR_GERAL = [
  { picto: "clique", texto: "Escolha o seu ano. Cada ano tem um estúdio." },
  { picto: "estrela", texto: "Faça as atividades e ganhe estrelas." },
  { picto: "lampada", texto: "Errou? Leia a dica e tente de novo." },
  { picto: "mural", texto: "No fim, sua produção vai para o Mural da Emissora." },
  { picto: "pausa", texto: "Cansou? Clique em Pausa." }
];

App.registrar("inicio", () => {
  const raiz = el("div", { class: "inicio" });
  raiz.append(el("div", { class: "inicio-topo" },
    el("div", { class: "robo-inicio", html: Desenho.cena({ cenario: "estudio", personagens: [{ quem: "robo", sentimento: "feliz", x: 150 }] }) }),
    el("div", { class: "inicio-texto" },
      el("h1", { tabindex: "-1" }, "Estúdio do Robô"),
      el("p", { class: "fala-robo" }, "Olá! Eu sou o Robô. Tenho uma pequena emissora na escola e preciso de ajudantes. Escolha o seu ano para começar."))));

  raiz.append(el("div", { class: "faixa-audio" },
    botaoConfig("modoAudio", "Modo Áudio", "ouvido"),
    el("p", { class: "dica-f1" }, "Para jogar com som, aperte ", el("kbd", null, "F1"), ".")));

  const anos = el("nav", { class: "anos", "aria-label": "Escolha o seu ano" });
  ESTUDIOS.forEach((est, i) => {
    const fala = `${i + 1}: ${est.ano}º ano. ${est.nome}. ${est.tema}.`;
    anos.append(el("button", { class: "cartao-ano cor-" + est.cor, type: "button", "data-num": String(i + 1), "data-fala": fala, onclick: () => App.ir("estudio", { id: est.id }) },
      el("span", { class: "num", "aria-hidden": "true" }, String(i + 1)),
      el("span", { class: "picto-ano", html: Desenho.picto(est.picto) }),
      el("span", { class: "ano-numero" }, `${est.ano}º ano`),
      el("span", { class: "ano-nome" }, est.nome),
      el("span", { class: "ano-tema" }, est.tema)));
  });
  raiz.append(anos);

  const nMural = ESTUDIOS.length + 1;
  raiz.append(el("div", { class: "linha-botoes centro" },
    el("button", { class: "botao grande-mural", type: "button", "data-num": String(nMural), "data-fala": `${nMural}: Mural da Emissora. Veja as produções.`, onclick: () => App.ir("mural") }, html(Desenho.picto("mural")), "Mural da Emissora"),
    botaoConfig("modoCalmo", "Modo Calmo", "calmo"),
    el("button", { class: "botao", type: "button", onclick: abrirAjustes }, html(Desenho.picto("ajustes")), "Ajustes")));

  raiz.append(el("footer", { class: "rodape" },
    el("button", { class: "link-professor", type: "button", onclick: () => App.ir("portaProfessor") }, "Área do professor"),
    el("p", null, "Território do Saber Comunicação e Novas Linguagens · Programa São Paulo Integral · Tudo fica salvo só neste computador.")));

  const anosFala = ESTUDIOS.map((e, i) => `${i + 1} para o ${e.ano}º ano`).join(", ");
  const fala = Config.v.modoAudio
    ? `Estúdio do Robô. Olá! Eu sou o Robô e preciso de ajudantes na minha emissora. Aperte ${anosFala}, ou ${nMural} para o Mural da Emissora. Use as setas para ouvir todas as opções.`
    : "";
  return { titulo: "Estúdio do Robô", conteudo: raiz, comoJogar: COMO_JOGAR_GERAL, fala, depois: () => { Teclado.ajuda = () => `Aperte ${anosFala}, ou ${nMural} para o Mural.`; } };
});

/* ============================================================
   ESTÚDIO (lista de atividades de um ano)
   ============================================================ */
App.registrar("estudio", (p) => {
  const est = ESTUDIOS.find(e => e.id === p.id);
  const raiz = el("div", { class: "estudio" });
  raiz.append(el("div", { class: "cabecalho-atividade" },
    el("span", { class: "picto-grande", html: Desenho.picto(est.picto) }),
    el("div", null, el("h1", { tabindex: "-1" }, `${est.nome}`), el("p", { class: "intro" }, `${est.ano}º ano · ${est.tema}. ${est.boasVindas}`))));

  const lista = el("ol", { class: "lista-atividades", "aria-label": "Atividades" });
  const falas = [];
  const itens = est.atividades.map((a, i) => ({ a, i }));
  if (Config.v.modoAudio && est.extraAudio) itens.push({ a: est.extraAudio, i: -1, extra: true });
  itens.forEach(({ a, i, extra }, k) => {
    const liberada = extra || atividadeLiberada(est, i);
    const n = Progresso.estrelas(chaveAtividade(est, a));
    const num = k + 1;
    const tipo = a.producao ? "Produção" : extra ? "Atividade extra do Modo Áudio" : "Atividade";
    const fala = `${num}: ${a.nome}. ${tipo}. ` + (liberada ? (n ? `${n} ${n === 1 ? "estrela" : "estrelas"}.` : "Ainda não feita.") : "Bloqueada. Termine a atividade anterior primeiro.");
    falas.push(fala);
    const b = el("button", { class: "cartao-atividade" + (liberada ? "" : " bloqueada") + (a.producao ? " producao" : "") + (extra ? " extra" : ""), type: "button", "data-num": num <= 9 ? String(num) : null, "data-fala": fala, "aria-label": fala, "aria-disabled": liberada ? null : "true" },
      el("span", { class: "num", "aria-hidden": "true" }, String(num)),
      el("span", { class: "picto-atividade", html: Desenho.picto(liberada ? a.picto : "cadeado") }),
      el("span", { class: "atividade-nome" }, a.nome),
      el("span", { class: "atividade-tipo" }, tipo),
      liberada ? desenhoEstrelas(n) : el("span", { class: "bloqueio" }, "Termine a anterior"));
    b.addEventListener("click", () => {
      if (!liberada) { dizer("Esta atividade está bloqueada. Termine a atividade anterior primeiro."); return; }
      abrirAtividade(est, i, { extra });
    });
    lista.append(el("li", null, b));
  });
  raiz.append(lista);
  raiz.append(el("div", { class: "linha-botoes centro" },
    el("button", { class: "botao", type: "button", onclick: () => abrirComoJogar(est.comoJogar) }, html(Desenho.picto("ajuda")), "Como jogar"),
    el("button", { class: "botao", type: "button", onclick: () => App.ir("mural") }, html(Desenho.picto("mural")), "Mural da Emissora")));

  const fala = `${est.nome}. ${est.boasVindas} Atividades: ${falas.join(" ")} Aperte o número da atividade ou use as setas.`;
  return {
    titulo: est.nome, conteudo: raiz, maiusculas: est.maiusculas, cor: est.cor, comoJogar: est.comoJogar, fala,
    depois: () => { Teclado.ajuda = () => `Atividades: ${falas.join(" ")}`; }
  };
});

/* ============================================================
   MURAL DA EMISSORA
   ============================================================ */
const SECOES_MURAL = [
  { tipo: "cena", titulo: "Cenas do Estúdio de Imagem", picto: "cena" },
  { tipo: "fotonovela", titulo: "Fotonovelas", picto: "balao" },
  { tipo: "noticia", titulo: "Jornal do Robô", picto: "jornal" }
];

function abrirProducao(p) {
  const leitura = descreverProducao(p);
  Janela.abrir({
    titulo: `${DEFINICOES[p.tipo] ? DEFINICOES[p.tipo].nome : "Produção"} de ${p.nome}`,
    classe: "janela-producao",
    conteudo: renderizarProducao(p, "grande"),
    fala: leitura + " Aperte Esc para fechar.",
    botoes: [
      { texto: "Ouvir", picto: "som", acao: () => { Voz.falar(leitura, { forcar: true }); anunciar(leitura); } },
      { texto: "Fechar", picto: "voltar", classe: "principal", acao: () => Janela.fechar() }
    ]
  });
}

App.registrar("mural", () => {
  const todas = Producoes.todas().slice().reverse();
  const raiz = el("div", { class: "mural" });
  raiz.append(el("div", { class: "cabecalho-atividade" },
    el("span", { class: "picto-grande", html: Desenho.picto("mural") }),
    el("div", null, el("h1", { tabindex: "-1" }, "Mural da Emissora"), el("p", { class: "intro" }, "Aqui ficam as produções feitas neste computador. Clique numa produção para ver grande."))));
  let falaResumo = "";
  if (!todas.length) {
    raiz.append(el("p", { class: "vazio" }, "O Mural ainda está vazio. Termine a produção de um estúdio para ela aparecer aqui!"));
    falaResumo = "O Mural ainda está vazio.";
  }
  let num = 0;
  SECOES_MURAL.forEach(sec => {
    const daSecao = todas.filter(p => p.tipo === sec.tipo);
    if (!daSecao.length) return;
    const grade = el("ul", { class: "grade-mural" + (sec.tipo === "noticia" ? " jornal" : "") });
    daSecao.forEach(p => {
      num++;
      const leitura = descreverProducao(p);
      const b = el("button", { class: "cartao-mural", type: "button", "data-num": num <= 9 ? String(num) : null, "data-fala": `${num}: ${DEFINICOES[p.tipo].nome} de ${p.nome}.`, onclick: () => abrirProducao(p) }, renderizarProducao(p, "pequena"));
      b.setAttribute("aria-label", `${DEFINICOES[p.tipo].nome} de ${p.nome}. Clique para ver grande e ouvir.`);
      grade.append(el("li", null, b));
    });
    raiz.append(el("section", { class: "secao-mural" + (sec.tipo === "noticia" ? " secao-jornal" : "") },
      el("h2", null, html(Desenho.picto(sec.picto)), sec.titulo, el("span", { class: "contagem" }, ` (${daSecao.length})`)), grade));
    falaResumo += `${sec.titulo}: ${daSecao.length}. `;
  });
  const fala = `Mural da Emissora. ${falaResumo} Use as setas para ouvir os nomes e Enter para abrir uma produção.`;
  return { titulo: "Mural da Emissora", conteudo: raiz, fala, depois: () => { Teclado.ajuda = () => fala; } };
});

/* ============================================================
   ÁREA DO PROFESSOR
   ============================================================ */
App.registrar("portaProfessor", () => {
  const a = 5 + Math.floor(Math.random() * 5), b = 5 + Math.floor(Math.random() * 5);
  const raiz = el("div", { class: "professor porta" });
  const campo = el("input", { id: "resposta-soma", class: "campo-texto curto", type: "text", inputmode: "numeric", maxlength: "3", autocomplete: "off" });
  const msg = el("p", { class: "mensagem-porta", role: "status" });
  const entrar = () => {
    if (parseInt(campo.value, 10) === a + b) App.ir("professor", {}, { substituir: true });
    else { msg.textContent = "Resposta incorreta. Tente de novo."; dizer(msg.textContent); campo.select(); }
  };
  campo.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); entrar(); } });
  raiz.append(el("h1", { tabindex: "-1" }, "Área do professor"),
    el("p", null, "Para entrar, responda:"),
    el("label", { for: "resposta-soma", class: "rotulo-campo" }, `Quanto é ${a} + ${b}?`),
    el("div", { class: "linha-botoes" }, campo, el("button", { class: "botao principal", type: "button", onclick: entrar }, "Entrar")),
    msg);
  return { titulo: "Área do professor", conteudo: raiz, fala: `Área do professor. Quanto é ${a} mais ${b}?`, depois: () => campo.focus() };
});

function confirmar(titulo, texto, acao) {
  Janela.abrir({
    titulo, conteudo: el("p", null, texto), fala: titulo + ". " + texto,
    botoes: [
      { texto: "Sim, apagar", classe: "perigo", acao: () => { Janela.fechar(true); acao(); } },
      { texto: "Não, cancelar", classe: "principal", acao: () => Janela.fechar() }
    ]
  });
}

App.registrar("professor", () => {
  const raiz = el("div", { class: "professor" });
  const nProd = Producoes.todas().length;
  const msg = el("p", { class: "mensagem-professor", role: "status" });
  const avisar = (t) => { msg.textContent = t; dizer(t); };

  const liberar = el("button", { class: "botao alternar", type: "button", "aria-pressed": String(Progresso.liberado()) }, html(Desenho.picto("cadeado")), el("span", null, "Liberar todas as fases"), el("span", { class: "estado", "aria-hidden": "true" }));
  liberar.addEventListener("click", () => {
    const novo = !Progresso.liberado();
    Progresso.liberarTudo(novo);
    liberar.setAttribute("aria-pressed", String(novo));
    avisar(novo ? "Todas as fases estão liberadas." : "As fases voltam a abrir uma de cada vez.");
  });

  raiz.append(
    el("h1", { tabindex: "-1" }, "Área do professor"),
    el("section", { class: "bloco-professor privacidade" },
      el("h2", null, html(Desenho.picto("cadeado")), "Privacidade"),
      el("p", null, "O jogo guarda o progresso e as produções só no navegador deste computador. Nada é enviado para a internet. O jogo não usa câmera, microfone nem gravação, e pede apenas o primeiro nome ou apelido da criança."),
      el("p", null, "Cada notebook tem o seu próprio Mural. Limpar os dados de navegação do navegador também apaga o progresso e as produções.")),
    el("section", { class: "bloco-professor" },
      el("h2", null, html(Desenho.picto("estrela")), "Fases e progresso"),
      el("div", { class: "linha-botoes" }, liberar,
        el("button", { class: "botao perigo", type: "button", onclick: () => confirmar("Apagar progresso?", "As estrelas de todas as atividades deste computador serão apagadas. As produções do Mural continuam.", () => { const lib = Progresso.liberado(); Progresso.apagar(); if (lib) Progresso.liberarTudo(true); avisar("Progresso apagado."); }) }, "Apagar progresso"))),
    el("section", { class: "bloco-professor" },
      el("h2", null, html(Desenho.picto("mural")), "Produções"),
      el("p", null, `Há ${nProd} ${nProd === 1 ? "produção salva" : "produções salvas"} neste computador.`),
      el("div", { class: "linha-botoes" },
        el("button", { class: "botao principal", type: "button", onclick: () => App.ir("apresentacao") }, html(Desenho.picto("tv")), "Ver produções (tela cheia)"),
        el("button", { class: "botao perigo", type: "button", onclick: () => confirmar("Apagar produções?", "Todas as cenas, fotonovelas e notícias deste computador serão apagadas para sempre.", () => { Producoes.apagarTodas(); avisar("Produções apagadas."); }) }, "Apagar produções"))),
    el("section", { class: "bloco-professor" },
      el("h2", null, html(Desenho.picto("ajustes")), "Acessibilidade"),
      el("p", null, "Modo Áudio: para estudantes cegos, com fones de ouvido. Pode ser ligado com a tecla F1. Se o estudante usa NVDA ou Narrador, desligue a voz do jogo para não ouvir duas vozes."),
      el("p", null, "Modo Calmo: visual limpo, sem animações, mensagens sempre iguais e neutras. Indicado para estudantes com TEA."),
      painelAjustes(true)),
    msg);
  return { titulo: "Área do professor", conteudo: raiz, fala: "Área do professor. Use as setas para navegar." };
});

/* ----- Apresentação das produções em tela cheia (para o projetor) ----- */
App.registrar("apresentacao", () => {
  const todas = Producoes.todas();
  const raiz = el("div", { class: "apresentacao" });
  let i = 0;
  const palco = el("div", { class: "palco", "aria-live": "polite" });
  const contador = el("p", { class: "contador" });
  const mostrar = () => {
    palco.textContent = "";
    if (!todas.length) { palco.append(el("p", { class: "vazio" }, "Ainda não há produções salvas neste computador.")); contador.textContent = ""; return; }
    palco.append(renderizarProducao(todas[i], "tela-cheia"));
    contador.textContent = `${i + 1} de ${todas.length}`;
  };
  const ir = (passo) => { if (!todas.length) return; i = (i + passo + todas.length) % todas.length; mostrar(); Voz.falar(descreverProducao(todas[i])); };
  const sair = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); Teclado.setas = null; App.voltar(); };
  raiz.append(el("h1", { class: "so-leitor", tabindex: "-1" }, "Produções do Mural"), palco,
    el("div", { class: "controles-apresentacao" },
      el("button", { class: "botao", type: "button", onclick: () => ir(-1) }, html(Desenho.picto("voltar")), "Anterior"),
      contador,
      el("button", { class: "botao", type: "button", onclick: () => { const t = todas[i] ? descreverProducao(todas[i]) : ""; Voz.falar(t, { forcar: true }); anunciar(t); } }, html(Desenho.picto("som")), "Ouvir"),
      el("button", { class: "botao", type: "button", onclick: () => ir(1) }, "Próxima", html(Desenho.picto("avancar"))),
      el("button", { class: "botao", type: "button", onclick: sair }, "Sair")));
  mostrar();
  return {
    titulo: "Produções", conteudo: raiz, classe: "tela-apresentacao",
    depois: () => {
      Teclado.setas = (d) => ir(d);
      try { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); } catch (e) { /* sem tela cheia */ }
    }
  };
});

/* ============================================================
   INÍCIO DO JOGO
   ============================================================ */
function iniciarJogo() {
  Config.carregar();
  Voz.iniciar();
  Teclado.iniciar();
  $("#botao-voltar").addEventListener("click", () => App.voltar());
  $("#botao-ajuda").addEventListener("click", () => abrirComoJogar());
  $("#botao-pausa").addEventListener("click", () => Pausa.entrar());
  $("#botao-sair-pausa").addEventListener("click", () => Pausa.sair());
  $("#pausa-robo").innerHTML = Desenho.cena({ cenario: "parque", personagens: [{ quem: "robo", sentimento: "calmo" }] });
  const antigoVoltar = App.voltar.bind(App);
  App.voltar = function () { Teclado.setas = null; antigoVoltar(); };
  App.inicio();

  // Fala curta ao abrir: "Para jogar com som, aperte F1."
  // Alguns navegadores só deixam falar depois que a pessoa aperta uma tecla;
  // por isso a fala também acontece na primeira tecla apertada.
  const aviso = "Para jogar com som, aperte F1.";
  let avisado = false;
  const falarAviso = () => {
    if (avisado) return;
    avisado = true;
    if (Config.v.modoAudio) Voz.falar("Modo Áudio ligado. " + (Voz.ultima || "Aperte H para ajuda."), { forcar: true });
    else Voz.falar(aviso, { forcar: true, semGuardar: true });
  };
  setTimeout(() => {
    anunciar(Config.v.modoAudio ? "Modo Áudio ligado." : aviso);
    if (Voz.disponivel && navigator.userActivation && navigator.userActivation.hasBeenActive) falarAviso();
  }, 600);
  window.addEventListener("keydown", (e) => { if (e.key !== "F1") falarAviso(); else avisado = true; }, { once: true, capture: true });

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
document.addEventListener("DOMContentLoaded", iniciarJogo);
