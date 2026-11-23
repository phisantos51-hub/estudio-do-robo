/*
  PRODUÇÕES: a criança monta uma cena (1º ano), uma fotonovela (2º ano)
  ou uma notícia (3º ano). Tudo fica salvo só neste computador.
*/
"use strict";

const FEMININOS = ["menina", "bia", "professora", "merendeira", "diretora"];
function artigo(quem) { return FEMININOS.includes(quem) ? "a" : "o"; }
function nomeSentimento(sent, quem) {
  const s = SENTIMENTOS[sent];
  if (!s) return sent;
  return (FEMININOS.includes(quem) ? s.nomeF || s.nome : s.nome).toLowerCase();
}
function nomePersonagem(quem) { return PERSONAGENS[quem] || quem; }
function nomeCenario(c) { return CENARIOS[c] || c; }
function preposicaoCenario(c) {
  const fem = ["escola", "casa", "quadra", "salaLeitura"].includes(c);
  return (fem ? "na " : "no ") + nomeCenario(c).toLowerCase();
}
function soPrimeiroNome(t) { return String(t || "").trim().split(/\s+/)[0].slice(0, 15); }
function dataCurta(iso) { try { return new Date(iso).toLocaleDateString("pt-BR"); } catch (e) { return ""; } }

/* ============================================================
   Definições de cada produção
   ============================================================ */
const DEFINICOES = {};

/* ----- 1º ano: CENA ----- */
DEFINICOES.cena = {
  nome: "Cena", nomeMural: "cena",
  inicial: () => ({ cenario: null, personagens: [], sentimentos: {} }),
  passos(d) {
    const op = OPCOES_PRODUCAO.cena;
    const ps = [
      {
        tipo: "unica", titulo: "Escolha o lugar da cena.",
        opcoes: op.cenarios.map(c => ({ valor: c, rotulo: nomeCenario(c), visual: Desenho.cena({ cenario: c }), fala: nomeCenario(c) })),
        valorAtual: d.cenario,
        aplicar: (v) => { d.cenario = v; }
      },
      {
        tipo: "multipla", titulo: `Escolha até ${op.maxPersonagens} personagens.`, min: 1, max: op.maxPersonagens,
        opcoes: op.personagens.map(q => ({ valor: q, rotulo: nomePersonagem(q), visual: Desenho.cena({ personagens: [{ quem: q, sentimento: "feliz" }], visao: q === "cachorro" || q === "gato" ? [100, 120, 200, 150] : [100, 30, 200, 225] }), fala: nomePersonagem(q) })),
        valorAtual: d.personagens.slice(),
        aplicar: (v) => { d.personagens = v; Object.keys(d.sentimentos).forEach(k => { if (!v.includes(k)) delete d.sentimentos[k]; }); }
      }
    ];
    d.personagens.forEach(q => ps.push({
      tipo: "unica", titulo: `Como ${artigo(q)} ${nomePersonagem(q)} se sente?`,
      opcoes: op.sentimentos.map(s => ({ valor: s, rotulo: SENTIMENTOS[s].nome, visual: Desenho.emoji(s), fala: Config.v.modoCalmo ? SENTIMENTOS[s].exemplo : SENTIMENTOS[s].nome, sentimento: s })),
      valorAtual: d.sentimentos[q],
      aplicar: (v) => { d.sentimentos[q] = v; }
    }));
    return ps;
  },
  desenho(d, rotulo) {
    return Desenho.cena({ cenario: d.cenario || "ceu", personagens: d.personagens.map(q => ({ quem: q, sentimento: d.sentimentos[q] || "neutro", emoji: !!d.sentimentos[q] })) }, rotulo);
  },
  previa(d) { return el("div", { class: "previa-cena", html: this.desenho(d, this.descrever(d)) }); },
  descrever(d, nome) {
    let t = nome ? `Cena feita por ${nome}. ` : "";
    t += d.cenario ? `A cena acontece ${preposicaoCenario(d.cenario)}. ` : "Ainda sem lugar. ";
    if (d.personagens.length) t += d.personagens.map(q => `${artigo(q) === "a" ? "A" : "O"} ${nomePersonagem(q)}` + (d.sentimentos[q] ? ` está ${nomeSentimento(d.sentimentos[q], q)}` : "")).join(". ") + ".";
    else t += "Ainda sem personagens.";
    return t;
  }
};

/* ============================================================
   Tela da produção (passo a passo, com prévia ao lado)
   ============================================================ */
const Produtor = {
  tela(est, atv) {
    const def = DEFINICOES[atv.producao];
    const dados = def.inicial();
    const raiz = el("div", { class: "atividade producao" });
    const cab = el("div", { class: "cabecalho-atividade" },
      el("span", { class: "picto-grande", html: Desenho.picto(atv.picto) }),
      el("div", null, el("h1", { tabindex: "-1" }, atv.nome), el("p", { class: "intro" }, atv.intro)));
    const progresso = el("div", { class: "progresso", role: "progressbar", "aria-label": "Progresso da produção", "aria-valuemin": "0" });
    const barra = el("div", { class: "progresso-barra" });
    progresso.append(barra);
    const textoProgresso = el("p", { class: "progresso-texto" });
    const passosNum = caixaPassos("producao");
    const painel = el("section", { class: "painel-passo", "aria-label": "Escolhas" });
    const previa = el("aside", { class: "previa", "aria-label": "Como está ficando" });
    const retorno = el("div", { class: "retorno", hidden: true });
    raiz.append(cab, el("div", { class: "linha-progresso" }, progresso, textoProgresso), passosNum, el("div", { class: "producao-grade" }, painel, previa), retorno);

    let i = 0;
    let nome = "";

    function todosPassos() { return def.passos(dados).concat([{ tipo: "nome" }]); }

    function atualizarPrevia() {
      previa.textContent = "";
      previa.append(el("h2", { class: "previa-titulo" }, "Como está ficando"), def.previa(dados));
    }

    function mostrar(primeira) {
      const ps = todosPassos();
      const passo = ps[i];
      barra.style.width = (i / ps.length * 100) + "%";
      progresso.setAttribute("aria-valuemax", String(ps.length));
      progresso.setAttribute("aria-valuenow", String(i));
      textoProgresso.textContent = `Passo ${i + 1} de ${ps.length}`;
      retorno.hidden = true;
      atualizarPrevia();
      painel.textContent = "";
      const intro = primeira ? atv.intro + " " : "";
      if (passo.tipo === "nome") return passoNome(intro);
      if (passo.tipo === "texto") return passoTexto(passo, intro);
      return passoOpcoes(passo, intro);
    }

    function avancar() { i++; mostrar(false); }
    function botaoVoltarPasso() {
      if (i === 0) return null;
      return el("button", { class: "botao", type: "button", onclick: () => { i--; mostrar(false); } }, html(Desenho.picto("voltar")), "Passo anterior");
    }
    function avisar(texto) {
      retorno.hidden = false;
      retorno.className = "retorno dica";
      retorno.textContent = "";
      retorno.append(html(Desenho.picto("lampada")), el("p", null, texto));
      dizer(texto);
    }

    function passoOpcoes(passo, intro) {
      const multipla = passo.tipo === "multipla";
      let escolhidos = multipla ? (passo.valorAtual || []).slice() : null;
      const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, passo.titulo);
      const grade = el("div", { class: "opcoes " + (passo.soTexto ? "so-texto" : "com-imagem escolhas-producao"), role: "group", "aria-label": passo.titulo });
      const falas = [];
      passo.opcoes.forEach((op, k) => {
        const n = k + 1;
        const fala = `${n}: ${op.fala || op.rotulo}`;
        falas.push(fala);
        const marcado = multipla ? escolhidos.includes(op.valor) : passo.valorAtual === op.valor;
        const b = el("button", { class: "opcao" + (marcado ? " escolhida" : ""), type: "button", "data-num": n <= 9 ? String(n) : null, "data-fala": fala, "aria-label": fala },
          el("span", { class: "num", "aria-hidden": "true" }, String(n)),
          op.visual ? el("div", { class: "visual", html: op.visual }) : null,
          op.sentimento ? rotuloSentimento(op.sentimento) : el("span", { class: "opcao-texto" + (op.textoLongo ? " longo" : "") }, op.rotulo));
        if (multipla) b.setAttribute("aria-pressed", String(marcado));
        b.addEventListener("click", () => {
          if (!multipla) { Som.tocar("clique"); passo.aplicar(op.valor); avancar(); return; }
          const j = escolhidos.indexOf(op.valor);
          if (j >= 0) escolhidos.splice(j, 1);
          else {
            if (escolhidos.length >= passo.max) { avisar(`Você já escolheu ${passo.max}. Para trocar, clique de novo em um escolhido para tirar.`); return; }
            escolhidos.push(op.valor);
          }
          Som.tocar("clique");
          b.classList.toggle("escolhida", j < 0);
          b.setAttribute("aria-pressed", String(j < 0));
          passo.aplicar(escolhidos.slice());
          atualizarPrevia();
          dizer(`${op.rotulo}: ${j < 0 ? "escolhido" : "retirado"}. ${escolhidos.length} de ${passo.max}. ${escolhidos.length >= passo.min ? "Quando terminar, vá até o botão Pronto." : ""}`);
        });
        grade.append(b);
      });
      painel.append(titulo, grade);
      const linha = el("div", { class: "linha-botoes" });
      if (multipla) {
        linha.append(el("button", { class: "botao principal", type: "button", onclick: () => {
          if (escolhidos.length < passo.min) { avisar(`Escolha pelo menos ${passo.min}.`); return; }
          passo.aplicar(escolhidos.slice());
          avancar();
        } }, "Pronto", html(Desenho.picto("certo"))));
      }
      const v = botaoVoltarPasso();
      if (v) linha.append(v);
      painel.append(linha);
      focarSemFala(titulo);
      const ajudaMultipla = multipla ? ` Você pode escolher até ${passo.max}. Depois vá até o botão Pronto.` : "";
      const fala = intro + passo.titulo + ajudaMultipla + " " + juntar(falas) + " Use as setas e Enter, ou os números.";
      dizer(fala);
      Teclado.ajuda = () => fala;
    }

    function campoComVoz(campo) {
      // No Modo Áudio, a voz acompanha a digitação: lê cada letra e cada palavra completa.
      campo.addEventListener("input", (e) => {
        if (!Voz.ativa()) return;
        const v = campo.value;
        if (e.inputType && e.inputType.startsWith("delete")) { Voz.falar("apagou", { semGuardar: true }); return; }
        const ch = e.data || v.slice(-1);
        if (!ch) return;
        if (/[\s.,!?]/.test(ch)) {
          const palavras = v.slice(0, campo.selectionStart).trim().split(/\s+/);
          const ultima = palavras[palavras.length - 1] || "";
          Voz.falar(ultima.replace(/[.,!?]/g, "") + (ch === " " ? "" : " " + ({ ".": "ponto", ",": "vírgula", "!": "exclamação", "?": "interrogação" }[ch] || "")), { semGuardar: true });
        } else Voz.falar(ch, { semGuardar: true });
      });
    }

    function botaoOuvir(campo, rotulo) {
      return el("button", { class: "botao", type: "button", onclick: () => {
        const t = campo.value.trim() ? `${rotulo}: ${campo.value}` : `${rotulo}: ainda está vazio.`;
        Voz.falar(t, { forcar: Config.v.modoAudio }); anunciar(t);
      } }, html(Desenho.picto("som")), "Ouvir o que escrevi");
    }

    function passoTexto(passo, intro) {
      const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, passo.titulo);
      const id = "campo-" + i;
      const campo = el(passo.multilinha ? "textarea" : "input", { id, class: "campo-texto", maxlength: String(passo.max || 80), autocomplete: "off", spellcheck: "true", rows: passo.multilinha ? "4" : null, type: passo.multilinha ? null : "text" });
      campo.value = passo.valorAtual || "";
      const rotulo = el("label", { for: id, class: "rotulo-campo" }, passo.rotulo || passo.titulo);
      campoComVoz(campo);
      painel.append(titulo);
      if (passo.ajuda) painel.append(el("p", { class: "ajuda-campo" }, passo.ajuda));
      painel.append(rotulo, campo);
      if (passo.sugestoes && passo.sugestoes.length) {
        const sug = el("div", { class: "sugestoes", role: "group", "aria-label": "Ideias para usar" });
        passo.sugestoes.forEach((s, k) => sug.append(el("button", { class: "botao sugestao", type: "button", "data-fala": `Ideia ${k + 1}: ${s}`, onclick: () => { campo.value = s; campo.focus(); dizer("Escrito: " + s); } }, s)));
        painel.append(el("p", { class: "ajuda-campo" }, "Ou clique numa ideia:"), sug);
      }
      const linha = el("div", { class: "linha-botoes" },
        el("button", { class: "botao principal", type: "button", onclick: confirmar }, "Pronto", html(Desenho.picto("certo"))),
        botaoOuvir(campo, passo.rotulo || passo.titulo));
      const v = botaoVoltarPasso();
      if (v) linha.append(v);
      painel.append(linha);
      campo.addEventListener("keydown", (e) => { if (e.key === "Enter" && !passo.multilinha) { e.preventDefault(); confirmar(); } });
      function confirmar() {
        const valor = campo.value.trim();
        if (!valor && !passo.opcional) { avisar("Escreva alguma coisa ou clique numa ideia."); campo.focus(); return; }
        passo.aplicar(valor);
        avancar();
      }
      focarSemFala(campo);
      const fala = intro + passo.titulo + " " + (passo.ajuda || "") + (passo.sugestoes ? " Se quiser, use as setas para baixo para ouvir ideias prontas." : "") + " Escreva e aperte Enter quando terminar." + (passo.multilinha ? " Para terminar, vá até o botão Pronto." : "");
      dizer(fala);
      Teclado.ajuda = () => fala;
    }

    function passoNome(intro) {
      const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, "Quem fez? Escreva seu primeiro nome ou apelido.");
      const campo = el("input", { id: "campo-nome", class: "campo-texto", type: "text", maxlength: "15", autocomplete: "off", spellcheck: "false" });
      campo.value = nome;
      campoComVoz(campo);
      const aviso = el("p", { class: "aviso-privacidade" }, html(Desenho.picto("cadeado")), MENSAGENS.privacidade);
      painel.append(titulo, aviso, el("label", { for: "campo-nome", class: "rotulo-campo" }, "Primeiro nome ou apelido"), campo);
      const linha = el("div", { class: "linha-botoes" },
        el("button", { class: "botao principal", type: "button", onclick: salvar }, "Mandar para o Mural", html(Desenho.picto("mural"))),
        botaoOuvir(campo, "Nome"));
      const v = botaoVoltarPasso();
      if (v) linha.append(v);
      painel.append(linha);
      campo.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); salvar(); } });
      function salvar() {
        nome = soPrimeiroNome(campo.value);
        if (!nome) { avisar("Escreva seu primeiro nome ou apelido."); campo.focus(); return; }
        const p = Producoes.salvar({ tipo: atv.producao, ano: est.ano, estudio: est.id, nome, dados });
        Progresso.registrar(chaveAtividade(est, atv), 3);
        Som.tocar("fim");
        concluir(!!p);
      }
      focarSemFala(campo);
      const fala = intro + titulo.textContent + " " + MENSAGENS.privacidade + " Depois aperte Enter.";
      dizer(fala);
      Teclado.ajuda = () => fala;
    }

    function concluir(salvou) {
      barra.style.width = "100%";
      textoProgresso.textContent = "Pronto!";
      passosNum.hidden = true;
      painel.parentElement.replaceWith(painel);
      painel.textContent = "";
      const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, salvou ? `Pronto! ${def.artigoMural || "Sua"} ${def.nomeMural} foi para o Mural da Emissora.` : "Não foi possível salvar neste computador.");
      const leitura = def.descrever(dados, nome);
      const prod = { tipo: atv.producao, nome, dados, data: new Date().toISOString() };
      painel.append(titulo, desenhoEstrelas(3), renderizarProducao(prod, "grande"),
        el("div", { class: "linha-botoes" },
          el("button", { class: "botao principal", type: "button", "data-num": "1", onclick: () => { Voz.falar(leitura, { forcar: Config.v.modoAudio }); anunciar(leitura); } }, html(Desenho.picto("som")), "Ouvir minha produção"),
          el("button", { class: "botao", type: "button", "data-num": "2", onclick: () => App.ir("mural", {}, { substituir: true }) }, html(Desenho.picto("mural")), "Ver o Mural"),
          el("button", { class: "botao", type: "button", "data-num": "3", onclick: () => App.voltar() }, html(Desenho.picto("voltar")), "Voltar ao estúdio")));
      focarSemFala(titulo);
      const fala = titulo.textContent + " Você ganhou 3 estrelas. Vou ler a sua produção. " + leitura + " Aperte 1 para ouvir de novo, 2 para ver o Mural, 3 para voltar ao estúdio.";
      dizer(fala);
      Teclado.ajuda = () => "Aperte 1 para ouvir de novo, 2 para ver o Mural, 3 para voltar ao estúdio.";
    }

    return {
      titulo: est.nome, conteudo: raiz, maiusculas: est.maiusculas, cor: est.cor, comoJogar: est.comoJogar,
      depois: () => mostrar(true)
    };
  }
};

/* ============================================================
   Mostrar uma produção salva (no Mural e na Área do professor)
   ============================================================ */
function renderizarProducao(p, tamanho) {
  const def = DEFINICOES[p.tipo];
  const caixa = el("article", { class: "producao-salva tipo-" + p.tipo + " " + (tamanho || "") });
  if (!def) return caixa;
  const leitura = def.descrever(p.dados, p.nome);
  if (def.renderizar) caixa.append(def.renderizar(p.dados, leitura, tamanho));
  else caixa.append(el("div", { class: "previa-cena", html: def.desenho(p.dados, leitura) }));
  caixa.append(el("p", { class: "autor" }, `${def.nome} de ${p.nome}`, p.data ? el("span", { class: "data" }, " · " + dataCurta(p.data)) : null));
  return caixa;
}
function descreverProducao(p) {
  const def = DEFINICOES[p.tipo];
  return def ? def.descrever(p.dados, p.nome) : "";
}

/* ============================================================
   FOTONOVELA (2º ano)
   ============================================================ */
const VERBOS_BALAO = { fala: "fala", pensamento: "pensa", grito: "grita", cochicho: "cochicha" };
const SENTIMENTO_BALAO = { fala: "feliz", pensamento: "calmo", grito: "surpreso", cochicho: "calmo" };
const POSICOES_X = { 1: [200], 2: [140, 270], 3: [90, 200, 310] };

// Um quadro: cena desenhada + balão com o texto por cima.
function quadroFotonovela(q, numero) {
  const caixa = el("div", { class: "quadro" });
  caixa.innerHTML = Desenho.cena({ cenario: q.cenario || "ceu", personagens: q.personagens || [], objetos: q.objetos || [], visao: [-20, -70, 440, 330] });
  const b = q.balao;
  if (b && b.tipo) {
    const n = Math.max(1, Math.min((q.personagens || []).length, 3));
    const x = ((POSICOES_X[n][b.quem || 0] || 200) + 20) / 440 * 100;
    const largura = 50;
    const esquerda = Math.max(2, Math.min(98 - largura, x - largura / 2));
    const balao = el("div", { class: "balao-html balao-" + b.tipo }, el("span", null, b.fala || "…"));
    balao.style.left = esquerda + "%";
    balao.style.width = largura + "%";
    balao.style.setProperty("--cauda", Math.max(12, Math.min(88, (x - esquerda) / largura * 100)) + "%");
    caixa.append(balao);
  }
  if (numero) caixa.append(el("span", { class: "quadro-num", "aria-hidden": "true" }, String(numero)));
  return caixa;
}

DEFINICOES.fotonovela = {
  nome: "Fotonovela", nomeMural: "fotonovela",
  inicial: () => ({ titulo: "", cenario: null, personagens: [], quadros: [{}, {}, {}, {}] }),
  passos(d) {
    const op = OPCOES_PRODUCAO.fotonovela;
    const ps = [
      {
        tipo: "texto", titulo: "Qual é o título da fotonovela?", rotulo: "Título", max: 40,
        ajuda: "Escreva um título curto ou clique numa ideia.", sugestoes: op.titulos,
        valorAtual: d.titulo, aplicar: (v) => { d.titulo = v; }
      },
      {
        tipo: "unica", titulo: "Escolha o lugar da história.",
        opcoes: op.cenarios.map(c => ({ valor: c, rotulo: nomeCenario(c), visual: Desenho.cena({ cenario: c }), fala: nomeCenario(c) })),
        valorAtual: d.cenario, aplicar: (v) => { d.cenario = v; }
      },
      {
        tipo: "multipla", titulo: `Escolha 1 ou ${op.maxPersonagens} personagens.`, min: 1, max: op.maxPersonagens,
        opcoes: op.personagens.map(q => ({ valor: q, rotulo: nomePersonagem(q), visual: Desenho.cena({ personagens: [{ quem: q, sentimento: "feliz" }], visao: q === "cachorro" || q === "gato" ? [100, 120, 200, 150] : [100, 30, 200, 225] }), fala: nomePersonagem(q) })),
        valorAtual: d.personagens.slice(),
        aplicar: (v) => { d.personagens = v; d.quadros.forEach(qd => { if (qd.quem >= v.length) qd.quem = 0; }); }
      }
    ];
    d.quadros.forEach((qd, k) => {
      const n = k + 1;
      if (d.personagens.length > 1) ps.push({
        tipo: "unica", titulo: `Quadro ${n} de 4: quem fala?`,
        opcoes: d.personagens.map((q, i) => ({ valor: i, rotulo: nomePersonagem(q), visual: Desenho.cena({ personagens: [{ quem: q, sentimento: "feliz" }], visao: q === "cachorro" || q === "gato" ? [100, 120, 200, 150] : [100, 30, 200, 225] }), fala: nomePersonagem(q) })),
        valorAtual: qd.quem, aplicar: (v) => { qd.quem = v; }
      });
      ps.push({
        tipo: "unica", titulo: `Quadro ${n} de 4: qual balão?`,
        opcoes: Object.keys(op.baloes).map(t => ({ valor: t, rotulo: NOMES_BALOES[t], visual: Desenho.balao(t), fala: `${NOMES_BALOES[t]}: ${op.baloes[t]}` })),
        valorAtual: qd.tipo, aplicar: (v) => { if (qd.tipo !== v) { qd.fala = ""; qd.escrever = false; } qd.tipo = v; }
      });
      if (qd.tipo) {
        const falas = op.falas[qd.tipo] || [];
        ps.push({
          tipo: "unica", soTexto: true, titulo: `Quadro ${n} de 4: qual é a fala?`,
          opcoes: falas.map(f => ({ valor: f.texto, rotulo: f.texto })).concat([{ valor: "__escrever", rotulo: "Quero escrever a minha fala", fala: "Quero escrever a minha fala." }]),
          valorAtual: qd.escrever ? "__escrever" : qd.fala,
          aplicar: (v) => {
            if (v === "__escrever") { qd.escrever = true; qd.fala = qd.fala && !falas.some(f => f.texto === qd.fala) ? qd.fala : ""; qd.sentimento = null; }
            else { qd.escrever = false; qd.fala = v; const f = falas.find(x => x.texto === v); qd.sentimento = f ? f.sentimento : null; }
          }
        });
        if (qd.escrever) ps.push({
          tipo: "texto", titulo: `Quadro ${n} de 4: escreva a fala.`, rotulo: "Fala do balão", max: 60,
          ajuda: "Escreva uma frase curta.", valorAtual: qd.fala, aplicar: (v) => { qd.fala = v; }
        });
      }
    });
    return ps;
  },
  quadro(d, k) {
    const qd = d.quadros[k];
    const pers = d.personagens.map((q, i) => ({ quem: q, sentimento: i === (qd.quem || 0) && qd.tipo ? (qd.sentimento || SENTIMENTO_BALAO[qd.tipo]) : "feliz" }));
    return { cenario: d.cenario, personagens: pers, balao: qd.tipo ? { tipo: qd.tipo, quem: qd.quem || 0, fala: qd.fala } : null };
  },
  descreverQuadro(d, k) {
    const qd = d.quadros[k];
    if (!qd.tipo || !d.personagens.length) return `Quadro ${k + 1}: ainda vazio.`;
    const q = d.personagens[qd.quem || 0];
    return `Quadro ${k + 1}: ${artigo(q) === "a" ? "A" : "O"} ${nomePersonagem(q)} ${VERBOS_BALAO[qd.tipo]}: ${qd.fala || "..."}`;
  },
  renderizar(d, leitura) {
    const caixa = el("div", { class: "fotonovela", role: "group", "aria-label": "Fotonovela: " + (d.titulo || "sem título") });
    caixa.append(el("h3", { class: "fotonovela-titulo" }, d.titulo || "Título?"));
    const grade = el("div", { class: "quadros" });
    d.quadros.forEach((_, k) => {
      const q = quadroFotonovela(this.quadro(d, k), k + 1);
      q.setAttribute("role", "img");
      q.setAttribute("aria-label", juntar([this.descreverQuadro(d, k)]));
      grade.append(q);
    });
    caixa.append(grade);
    return caixa;
  },
  previa(d) { return this.renderizar(d); },
  descrever(d, nome) {
    const partes = [`Fotonovela: ${d.titulo || "sem título"}` + (nome ? `, feita por ${nome}` : "")];
    if (d.cenario) partes.push(`A história acontece ${preposicaoCenario(d.cenario)}`);
    if (d.personagens.length) partes.push("Personagens: " + d.personagens.map(q => `${artigo(q)} ${nomePersonagem(q)}`).join(" e "));
    d.quadros.forEach((_, k) => partes.push(this.descreverQuadro(d, k)));
    return juntar(partes);
  }
};
