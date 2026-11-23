/*
  ATIVIDADES: a tela de atividade e os "motores" de cada tipo de etapa
  (escolha, ordenar, classificar, montar, aviso).
  Os textos vêm do arquivo conteudo.js.
*/
"use strict";

const ORDINAIS = ["primeiro", "segundo", "terceiro", "quarto", "quinto", "sexto", "sétimo", "oitavo", "nono"];

/* ---------- Imagens e descrições ---------- */
function descricaoDe(item) {
  if (!item) return "";
  if (item.descricao) return item.descricao;
  if (item.emoji) return "Emoji " + (SENTIMENTOS[item.emoji] ? SENTIMENTOS[item.emoji].nome : item.emoji);
  if (item.balao) return NOMES_BALOES[item.balao] || item.balao;
  if (item.noticia) return textoDaNoticia(item.noticia);
  return item.texto || "";
}
const NOMES_BALOES = { fala: "Balão de fala", pensamento: "Balão de pensamento", grito: "Balão de grito", cochicho: "Balão de cochicho" };

// Desenha a imagem de um item. Se "rotulo" for vazio, a imagem fica escondida dos leitores de tela
// (porque o botão em volta já tem a descrição).
function visualDe(item, rotulo) {
  let s = "";
  if (item.desenho) s = Desenho.cena(item.desenho, rotulo);
  else if (item.icone) s = Desenho.icone(item.icone, rotulo);
  else if (item.emoji) s = Desenho.emoji(item.emoji, rotulo);
  else if (item.balao) s = Desenho.balao(item.balao, rotulo);
  if (!s) return null;
  return el("div", { class: "visual", html: s });
}

// Figura grande mostrada junto da pergunta.
function figuraDe(mostrar) {
  if (mostrar.noticia) return cartaoNoticiaFicticia(mostrar.noticia);
  const f = el("figure", { class: "figura" });
  const v = visualDe(mostrar, descricaoDe(mostrar));
  if (v) f.append(v);
  f.append(el("figcaption", { class: "so-leitor" }, descricaoDe(mostrar)));
  return f;
}

function rotuloSentimento(nome) {
  const s = SENTIMENTOS[nome] || { nome, exemplo: "" };
  return el("span", { class: "rotulo-sentimento" },
    el("strong", null, s.nome),
    s.exemplo ? el("span", { class: "exemplo-calmo" }, s.exemplo.replace(/^[^:]+:\s*/, "")) : null);
}

/* ---------- Estrelas ---------- */
function desenhoEstrelas(n, total) {
  total = total || 3;
  const caixa = el("span", { class: "estrelas", role: "img", "aria-label": `${n} de ${total} estrelas` });
  for (let i = 0; i < total; i++) caixa.append(html(`<span class="estrela ${i < n ? "cheia" : "vazia"}">${Desenho.picto("estrela")}</span>`));
  return caixa;
}
function calcularEstrelas(erros) { return erros <= 1 ? 3 : erros <= 3 ? 2 : 1; }

/* ---------- Passos numerados com pictogramas ---------- */
function caixaPassos(tipo) {
  const lista = el("ol", { class: "passos", "aria-label": "Como fazer" });
  (PASSOS[tipo] || []).forEach((p, i) => lista.append(el("li", null, el("span", { class: "passo-num", "aria-hidden": "true" }, String(i + 1)), html(Desenho.picto(p.picto)), el("span", null, p.texto))));
  return lista;
}

/* ---------- Controle de uma atividade ---------- */
class Controle {
  constructor(estudio, atividade, chave, raiz) {
    this.est = estudio;
    this.atv = atividade;
    this.chave = chave;
    this.raiz = raiz;
    this.etapas = atividade.etapas;
    this.i = 0;
    this.erros = 0;
  }

  iniciar() { this.mostrarEtapa(true); }

  atualizarProgresso() {
    const n = this.etapas.length;
    const feito = Math.min(this.i, n);
    this.barra.style.width = (feito / n * 100) + "%";
    this.progresso.setAttribute("aria-valuenow", String(feito));
    this.textoProgresso.textContent = this.i < n ? `Parte ${this.i + 1} de ${n}` : `Pronto! ${n} de ${n}`;
  }

  mostrarEtapa(primeira) {
    const et = this.etapas[this.i];
    this.tentativas = 0;
    this.atualizarProgresso();
    this.passos.replaceWith(this.passos = caixaPassos(et.tipo));
    this.area.textContent = "";
    this.limparRetorno();
    const intro = primeira ? (this.atv.intro || "") : "";
    Motores[et.tipo](et, this, intro);
  }

  // Mostra a pergunta da etapa e fala tudo o que a criança precisa saber.
  apresentar(titulo, fala, ajuda) {
    focarSemFala(titulo);
    dizer(fala);
    Teclado.ajuda = () => ajuda || fala;
  }

  limparRetorno() { this.retorno.textContent = ""; this.retorno.className = "retorno"; this.retorno.hidden = true; }

  mostrarRetorno(tipo, texto) {
    this.retorno.hidden = false;
    this.retorno.className = "retorno " + tipo;
    this.retorno.textContent = "";
    this.retorno.append(html(Desenho.picto(tipo === "certo" ? "certo" : "lampada")), el("p", null, texto));
    return this.retorno;
  }

  mensagemAcerto() {
    if (Config.v.modoCalmo) return MENSAGENS.acertoCalmo;
    const l = MENSAGENS.acertos;
    return l[Math.floor(Math.random() * l.length)];
  }

  // Erro: vira dica. Na segunda tentativa errada, a resposta certa fica marcada.
  errou(dica, mostrarAjuda) {
    this.erros++;
    this.tentativas++;
    Som.tocar("erro");
    const base = Config.v.modoCalmo ? MENSAGENS.erroCalmo : MENSAGENS.erro;
    let texto = base + (dica ? " Dica: " + dica : "");
    if (this.tentativas >= 2 && mostrarAjuda) { mostrarAjuda(); texto += " " + MENSAGENS.ajudaVisivel; }
    this.mostrarRetorno("dica", texto);
    dizer(texto);
  }

  // A etapa terminou bem: mostra a mensagem e o botão Continuar.
  etapaConcluida(texto) {
    Som.tocar("certo");
    // Se o texto da atividade já começa com um elogio ("Isso!", "Muito bem!"), não repete.
    // No Modo Calmo, a mensagem começa sempre igual e sem elogios variados.
    let resto = texto || "";
    const elogio = /^(Muito bem|Isso mesmo|Isso|Você acertou|Ótimo trabalho|Ótimo|Parabéns)[!.]\s*/i;
    let msg;
    if (Config.v.modoCalmo) msg = MENSAGENS.acertoCalmo + (resto ? " " + resto.replace(elogio, "") : "");
    else msg = elogio.test(resto) ? resto : this.mensagemAcerto() + (resto ? " " + resto : "");
    const caixa = this.mostrarRetorno("certo", msg);
    const ultimo = this.i === this.etapas.length - 1;
    const botao = el("button", { class: "botao principal", type: "button", onclick: () => this.proxima() }, ultimo ? "Terminar" : "Continuar", html(Desenho.picto("avancar")));
    caixa.append(botao);
    focarSemFala(botao);
    dizer(msg + " Aperte Enter para " + (ultimo ? "terminar." : "continuar."));
  }

  proxima() {
    this.i++;
    if (this.i >= this.etapas.length) this.finalizar();
    else this.mostrarEtapa(false);
  }

  finalizar() {
    this.atualizarProgresso();
    this.passos.hidden = true;
    const n = calcularEstrelas(this.erros);
    Progresso.registrar(this.chave, n);
    Som.tocar("fim");
    telaDeConclusao(this.area, this.est, this.atv, n, this);
    this.limparRetorno();
  }
}

/* Tela final de uma atividade (também usada pelas produções). */
function telaDeConclusao(area, est, atv, n, ctl) {
  area.textContent = "";
  const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, Config.v.modoCalmo ? MENSAGENS.fimCalmo : MENSAGENS.fimAtividade);
  const proxima = proximaAtividade(est, atv);
  const botoes = el("div", { class: "linha-botoes" });
  if (proxima) botoes.append(el("button", { class: "botao principal", type: "button", "data-num": "1", onclick: () => abrirAtividade(est, proxima.indice, { substituir: true }) }, "Próxima: " + proxima.atv.nome, html(Desenho.picto("avancar"))));
  botoes.append(el("button", { class: "botao", type: "button", "data-num": proxima ? "2" : "1", onclick: () => App.voltar() }, html(Desenho.picto("voltar")), "Voltar ao estúdio"));
  if (ctl) botoes.append(el("button", { class: "botao", type: "button", "data-num": proxima ? "3" : "2", onclick: () => abrirAtividade(est, est.atividades.indexOf(atv), { substituir: true, extra: atv === est.extraAudio }) }, "Fazer de novo"));
  area.append(el("div", { class: "conclusao" },
    el("div", { class: "robo-fim", html: Desenho.cena({ personagens: [{ quem: "robo", sentimento: "feliz" }], cenario: "estudio" }) }),
    titulo,
    desenhoEstrelas(n),
    el("p", { class: "frase-estrelas" }, `Você ganhou ${n} ${n === 1 ? "estrela" : "estrelas"}.`),
    botoes));
  focarSemFala(titulo);
  const opcoesFala = proxima ? `Aperte 1 para a próxima atividade, ${proxima.atv.nome}. Aperte 2 para voltar ao estúdio.` : "Aperte 1 para voltar ao estúdio.";
  dizer(`${titulo.textContent} Você ganhou ${n} ${n === 1 ? "estrela" : "estrelas"}. ${opcoesFala}`);
  Teclado.ajuda = () => opcoesFala;
}

function proximaAtividade(est, atv) {
  const i = est.atividades.indexOf(atv);
  if (i < 0 || i + 1 >= est.atividades.length) return null;
  return { indice: i + 1, atv: est.atividades[i + 1] };
}

function chaveAtividade(est, atv) { return est.id + "." + atv.id; }

function atividadeLiberada(est, i) {
  if (i === 0 || Progresso.liberado()) return true;
  return Progresso.estrelas(chaveAtividade(est, est.atividades[i - 1])) > 0;
}

function abrirAtividade(est, indice, opcoes) {
  opcoes = opcoes || {};
  App.ir("atividade", { estudio: est.id, indice, extra: !!opcoes.extra }, { substituir: !!opcoes.substituir });
}

/* ---------- Tela de atividade ---------- */
App.registrar("atividade", (p) => {
  const est = ESTUDIOS.find(e => e.id === p.estudio);
  const atv = p.extra ? est.extraAudio : est.atividades[p.indice];
  if (atv.producao) return Produtor.tela(est, atv);

  const raiz = el("div", { class: "atividade" });
  const cab = el("div", { class: "cabecalho-atividade" },
    el("span", { class: "picto-grande", html: Desenho.picto(atv.picto) }),
    el("div", null, el("h1", { tabindex: "-1" }, atv.nome), atv.intro ? el("p", { class: "intro" }, atv.intro) : null));
  const progresso = el("div", { class: "progresso", role: "progressbar", "aria-label": "Progresso da atividade", "aria-valuemin": "0", "aria-valuemax": String(atv.etapas.length), "aria-valuenow": "0" });
  const barra = el("div", { class: "progresso-barra" });
  progresso.append(barra);
  const textoProgresso = el("p", { class: "progresso-texto" });
  const passos = el("ol");
  const area = el("section", { class: "area", "aria-label": "Atividade" });
  const retorno = el("div", { class: "retorno", hidden: true });
  raiz.append(cab, el("div", { class: "linha-progresso" }, progresso, textoProgresso), passos, area, retorno);
  if (est.id === "jornal" && atv.id === "detetive") raiz.insertBefore(el("p", { class: "lembrete" }, html(Desenho.picto("pessoas")), "Na dúvida, pergunte a um adulto e não compartilhe."), area);

  const ctl = new Controle(est, atv, chaveAtividade(est, atv), raiz);
  Object.assign(ctl, { area, retorno, barra, progresso, textoProgresso, passos });

  return {
    titulo: est.nome, conteudo: raiz, maiusculas: est.maiusculas, cor: est.cor, comoJogar: est.comoJogar,
    depois: () => ctl.iniciar()
  };
});

/* ============================================================
   MOTORES
   ============================================================ */
const Motores = {};

/* ----- ESCOLHA: uma pergunta e algumas opções ----- */
Motores.escolha = function (et, ctl, intro) {
  const area = ctl.area;
  const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, et.pergunta);
  area.append(titulo);
  let falaFigura = "";
  if (et.mostrar) {
    area.append(figuraDe(et.mostrar));
    falaFigura = (et.mostrar.noticia ? "" : "Imagem: ") + descricaoDe(et.mostrar) + ". ";
  }
  const opcoes = et.manterOrdem ? et.opcoes.slice() : embaralhar(et.opcoes);
  const temImagem = opcoes.some(o => o.desenho || o.icone || o.emoji || o.balao);
  const grade = el("div", { class: "opcoes " + (temImagem ? "com-imagem" : "so-texto") + (opcoes.length === 2 ? " duas" : ""), role: "group", "aria-label": "Opções" });
  const prefixo = et.prefixo || "Opção";
  let resolvido = false;
  const falas = [];
  opcoes.forEach((op, k) => {
    const n = k + 1;
    let desc = descricaoDe(op);
    if (op.texto && (op.desenho || op.icone) && op.descricao) desc = op.texto + " " + op.descricao;
    if (op.emoji && Config.v.modoCalmo && SENTIMENTOS[op.emoji]) desc = SENTIMENTOS[op.emoji].exemplo;
    const fala = `${prefixo} ${n}: ${desc}`;
    falas.push(fala);
    const b = el("button", { class: "opcao", type: "button", "data-num": String(n), "aria-label": fala, "data-fala": fala },
      el("span", { class: "num", "aria-hidden": "true" }, String(n)),
      visualDe(op, ""),
      op.texto ? el("span", { class: "opcao-texto" }, op.texto) : null,
      op.emoji ? rotuloSentimento(op.emoji) : null,
      op.balao ? el("span", { class: "opcao-texto" }, NOMES_BALOES[op.balao]) : null);
    b.addEventListener("click", () => {
      if (resolvido) return;
      if (op.certa) {
        resolvido = true;
        b.classList.add("certa");
        grade.querySelectorAll(".opcao").forEach(x => { if (x !== b) x.setAttribute("aria-disabled", "true"); });
        ctl.etapaConcluida(et.acerto);
      } else {
        b.classList.add("tentada");
        ctl.errou(op.dica || et.dica, () => {
          const certa = Array.from(grade.children).find((x, j) => opcoes[j].certa);
          if (certa) certa.classList.add("ajuda");
        });
      }
    });
    grade.append(b);
  });
  area.append(grade);
  const fala = (intro ? intro + " " : "") + falaFigura + et.pergunta + " " + juntar(falas) + " Escolha com as setas e Enter, ou aperte o número.";
  ctl.apresentar(titulo, fala);
};

/* ----- ORDENAR: escolher o que vem primeiro, depois o seguinte... ----- */
Motores.ordenar = function (et, ctl, intro) {
  const area = ctl.area;
  const itens = et.itens.map((it, k) => Object.assign({}, it, { ordem: it.ordem || k + 1, id: k }));
  let restantes = embaralhar(itens);
  if (restantes.every((it, k) => it.id === k) && restantes.length > 1) restantes.push(restantes.shift());
  const prefixo = et.prefixo || "Opção";
  const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, et.pergunta);
  const temImagem = itens.some(i => i.desenho);
  const trilha = el("ol", { class: "trilha" + (temImagem ? " com-imagem" : ""), "aria-label": "Ordem montada" });
  const vagas = itens.map((_, k) => {
    const v = el("li", { class: "vaga" }, el("span", { class: "vaga-num" }, `${k + 1}º`), el("div", { class: "vaga-conteudo" }));
    trilha.append(v);
    return v;
  });
  const subpergunta = el("p", { class: "subpergunta" });
  const monte = el("div", { class: "opcoes monte " + (temImagem ? "com-imagem" : "so-texto"), role: "group", "aria-label": "Partes para colocar em ordem" });
  area.append(titulo, trilha, subpergunta, monte);
  let pos = 0;

  function textoItem(it) { return it.texto && it.descricao ? juntar([it.texto, it.descricao]) : (it.texto || it.descricao); }

  function desenharMonte() {
    monte.textContent = "";
    vagas.forEach((v, k) => { v.classList.toggle("da-vez", k === pos); v.classList.toggle("alvo-soltar", k === pos); });
    subpergunta.textContent = pos === 0 ? (et.perguntaPrimeiro || "O que vem primeiro?") : `O que vem em ${ORDINAIS[pos]} lugar?`;
    restantes.forEach((it, k) => {
      const n = k + 1;
      const fala = `${prefixo} ${n}: ${textoItem(it)}`;
      const b = el("button", { class: "opcao", type: "button", "data-num": String(n), "aria-label": fala, "data-fala": fala },
        el("span", { class: "num", "aria-hidden": "true" }, String(n)),
        visualDe(it, ""),
        it.texto ? el("span", { class: "opcao-texto" }, it.texto) : null);
      b.addEventListener("click", () => { if (!foiArraste(b)) escolher(it, b); });
      tornarArrastavel(b, (alvo) => { if (alvo.classList.contains("da-vez")) escolher(it, b); });
      monte.append(b);
    });
  }

  function listaFalada() { return juntar(restantes.map((it, k) => `${prefixo} ${k + 1}: ${textoItem(it)}`)); }

  function colocar(it) {
    const v = vagas[pos];
    v.classList.add("preenchida");
    const c = v.querySelector(".vaga-conteudo");
    const vis = visualDe(it, "");
    if (vis) c.append(vis);
    c.append(el("span", { class: it.texto ? "vaga-texto" : "so-leitor" }, it.texto || it.descricao));
    restantes = restantes.filter(r => r !== it);
    pos++;
  }

  function escolher(it, botao) {
    const menor = Math.min(...restantes.map(r => r.ordem));
    if (it.ordem !== menor) {
      botao.classList.add("tentada");
      ctl.errou(it.dica || et.dica, () => {
        const k = restantes.findIndex(r => r.ordem === menor);
        if (monte.children[k]) monte.children[k].classList.add("ajuda");
      });
      return;
    }
    Som.tocar("clique");
    ctl.tentativas = 0;
    ctl.limparRetorno();
    const posicaoFalada = ORDINAIS[pos];
    colocar(it);
    if (restantes.length === 1) colocar(restantes[0]);
    if (!restantes.length) {
      vagas.forEach(v => v.classList.remove("da-vez", "alvo-soltar"));
      monte.remove();
      subpergunta.textContent = "Tudo em ordem!";
      ctl.etapaConcluida(et.acerto);
      return;
    }
    desenharMonte();
    const f = juntar([`Certo! Em ${posicaoFalada} lugar: ${textoItem(it)}`, subpergunta.textContent, listaFalada()]);
    focarSemFala(subpergunta);
    subpergunta.setAttribute("tabindex", "-1");
    dizer(f);
  }

  desenharMonte();
  const fala = (intro ? intro + " " : "") + et.pergunta + " " + subpergunta.textContent + " " + listaFalada() + " Escolha um por vez, com as setas e Enter, ou com os números.";
  ctl.apresentar(titulo, fala, () => et.pergunta + " " + subpergunta.textContent + " " + listaFalada());
};

/* ----- CLASSIFICAR: colocar cada frase na caixa certa ----- */
Motores.classificar = function (et, ctl, intro) {
  const area = ctl.area;
  const itens = embaralhar(et.itens);
  let k = 0;
  const titulo = el("h2", { class: "pergunta", tabindex: "-1" }, et.pergunta);
  const contador = el("p", { class: "contador" });
  const cartao = el("div", { class: "cartao-frase", tabindex: "-1" });
  const caixas = el("div", { class: "caixas", role: "group", "aria-label": "Caixas" });
  const listas = {};
  et.categorias.forEach((c, i) => {
    const lista = el("ul", { class: "caixa-lista", "aria-label": "Já colocadas em " + c.nome });
    listas[c.id] = lista;
    const fala = `${i + 1}: ${c.nome}. ${c.descricao || ""}`;
    const b = el("button", { class: "caixa alvo-soltar", type: "button", "data-num": String(i + 1), "data-cat": c.id, "aria-label": fala, "data-fala": fala },
      el("span", { class: "num", "aria-hidden": "true" }, String(i + 1)),
      c.picto ? html(Desenho.picto(c.picto)) : null,
      el("strong", null, c.nome),
      c.descricao ? el("span", { class: "caixa-desc" }, c.descricao) : null);
    b.addEventListener("click", () => responder(c));
    caixas.append(el("div", { class: "caixa-coluna" }, b, lista));
  });
  area.append(titulo, contador, cartao, caixas);
  tornarArrastavel(cartao, (alvo) => {
    const c = et.categorias.find(x => x.id === alvo.dataset.cat);
    if (c) responder(c);
  });

  function opcoesFaladas() { return et.categorias.map((c, i) => `${i + 1} para ${c.nome}`).join(", ") + "."; }

  function mostrar() {
    const it = itens[k];
    contador.textContent = `${et.nomeItem || "Frase"} ${k + 1} de ${itens.length}`;
    cartao.textContent = "";
    const vis = visualDe(it, "");
    if (vis) cartao.append(vis);
    cartao.append(el("span", null, it.texto || it.descricao));
  }

  function responder(c) {
    const it = itens[k];
    if (!it) return;
    if (it.cat !== c.id) {
      ctl.errou(it.dica || et.dica, () => {
        const certa = caixas.querySelector(`[data-cat="${it.cat}"]`);
        if (certa) certa.classList.add("ajuda");
      });
      return;
    }
    Som.tocar("clique");
    caixas.querySelectorAll(".ajuda").forEach(x => x.classList.remove("ajuda"));
    ctl.tentativas = 0;
    ctl.limparRetorno();
    listas[c.id].append(el("li", null, it.texto || it.descricao));
    k++;
    if (k >= itens.length) {
      cartao.remove();
      contador.textContent = "Todas no lugar certo!";
      ctl.etapaConcluida(et.acerto);
      return;
    }
    mostrar();
    focarSemFala(cartao);
    dizer(`Certo! É ${c.nome}. ${contador.textContent}: ${itens[k].texto || itens[k].descricao}. ${opcoesFaladas()}`);
  }

  mostrar();
  const fala = (intro ? intro + " " : "") + et.pergunta + " " + contador.textContent + ": " + (itens[0].texto || itens[0].descricao) + ". Aperte " + opcoesFaladas();
  ctl.apresentar(titulo, fala, () => contador.textContent + ": " + (itens[k] ? itens[k].texto : "") + ". Aperte " + opcoesFaladas());
};
