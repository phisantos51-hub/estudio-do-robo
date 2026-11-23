/*
  DESENHOS DO JOGO
  ================
  Todas as ilustrações são desenhadas aqui, com formas simples (SVG).
  Não há fotos nem imagens da internet.

  Normalmente você NÃO precisa mexer neste arquivo. No conteudo.js, as imagens
  são pedidas com "receitas" como esta:

    { cenario: "parque",
      personagens: [ { quem: "robo", sentimento: "feliz" } ],
      objetos: [ { obj: "arvore", x: 330 } ],
      enquadramento: "inteiro" }

  Nomes que você pode usar:
    cenario:      escola, parque, casa, salaLeitura, quadra, refeitorio, portao, estudio, ceu
    quem:         robo, menina, menino, bia, davi, professora, merendeira, porteiro,
                  diretora, cachorro, gato
    sentimento:   feliz, triste, bravo, medo, surpreso, calmo, neutro
    obj:          arvore, muda, flor, vaso, broto, planta, regador, sorvete, sorveteChao,
                  bola, livro, livros, guardaChuva, sol, nuvem, chuva, arcoiris,
                  bandeirinhas, mesa, microfone, camera, blocos1, blocos2, blocos3,
                  blocosCaidos, horta, cartaz, presente, fogueira
    enquadramento: inteiro, longe, rosto, meio, cortado
                  (ou visao: [x, y, largura, altura] para escolher a parte da cena)
    icone:        silencio, lixeira, banheiro, proibidoCorrer, lavarMaos
    emoji:        feliz, triste, bravo, medo, surpreso, calmo
    balao:        fala, pensamento, grito, cochicho
*/
"use strict";

const Desenho = (function () {
  const CHAO = 250; // linha onde os personagens pisam

  function esc(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function svg(viewBox, corpo, rotulo, classe) {
    const acess = rotulo
      ? ` role="img" aria-label="${esc(rotulo)}"`
      : ` aria-hidden="true" focusable="false"`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${classe || "desenho"}"${acess} preserveAspectRatio="xMidYMid meet">${rotulo ? `<title>${esc(rotulo)}</title>` : ""}${corpo}</svg>`;
  }

  /* ---------- Rostos e sentimentos ---------- */
  function rosto(cx, cy, r, sent, robo) {
    const ox = r * 0.38, oy = cy - r * 0.12;
    const tinta = robo ? "#1d2b3a" : "#2b1d14";
    let olhos = "", sobr = "", boca = "", extra = "";
    const olho = (x, rr) => robo
      ? `<circle cx="${x}" cy="${oy}" r="${rr * 1.7}" fill="#fff"/><circle cx="${x}" cy="${oy}" r="${rr}" fill="${tinta}"/>`
      : `<circle cx="${x}" cy="${oy}" r="${rr}" fill="${tinta}"/>`;
    const rr = r * 0.11;
    const linha = (d, w) => `<path d="${d}" fill="none" stroke="${tinta}" stroke-width="${w || r * 0.09}" stroke-linecap="round"/>`;
    switch (sent) {
      case "feliz":
        olhos = olho(cx - ox, rr) + olho(cx + ox, rr);
        boca = `<path d="M${cx - r * 0.42},${cy + r * 0.25} Q${cx},${cy + r * 0.85} ${cx + r * 0.42},${cy + r * 0.25} Z" fill="${tinta}"/>`;
        if (!robo) extra = `<circle cx="${cx - r * 0.6}" cy="${cy + r * 0.25}" r="${r * 0.13}" fill="#f28b82" opacity=".6"/><circle cx="${cx + r * 0.6}" cy="${cy + r * 0.25}" r="${r * 0.13}" fill="#f28b82" opacity=".6"/>`;
        break;
      case "triste":
        olhos = olho(cx - ox, rr) + olho(cx + ox, rr);
        sobr = linha(`M${cx - ox - r * 0.2},${oy - r * 0.22} L${cx - ox + r * 0.15},${oy - r * 0.36}`) + linha(`M${cx + ox + r * 0.2},${oy - r * 0.22} L${cx + ox - r * 0.15},${oy - r * 0.36}`);
        boca = linha(`M${cx - r * 0.35},${cy + r * 0.55} Q${cx},${cy + r * 0.2} ${cx + r * 0.35},${cy + r * 0.55}`);
        extra = `<path d="M${cx + ox},${oy + r * 0.2} q${-r * 0.1},${r * 0.25} 0,${r * 0.3} q${r * 0.1},${-r * 0.05} 0,${-r * 0.3}Z" fill="#5aa9e6"/>`;
        break;
      case "bravo":
        olhos = olho(cx - ox, rr) + olho(cx + ox, rr);
        sobr = linha(`M${cx - ox - r * 0.22},${oy - r * 0.36} L${cx - ox + r * 0.2},${oy - r * 0.18}`) + linha(`M${cx + ox + r * 0.22},${oy - r * 0.36} L${cx + ox - r * 0.2},${oy - r * 0.18}`);
        boca = linha(`M${cx - r * 0.32},${cy + r * 0.5} Q${cx},${cy + r * 0.3} ${cx + r * 0.32},${cy + r * 0.5}`);
        break;
      case "medo":
        olhos = olho(cx - ox, rr * 1.4) + olho(cx + ox, rr * 1.4);
        sobr = linha(`M${cx - ox - r * 0.18},${oy - r * 0.3} Q${cx - ox},${oy - r * 0.42} ${cx - ox + r * 0.18},${oy - r * 0.34}`) + linha(`M${cx + ox + r * 0.18},${oy - r * 0.3} Q${cx + ox},${oy - r * 0.42} ${cx + ox - r * 0.18},${oy - r * 0.34}`);
        boca = linha(`M${cx - r * 0.35},${cy + r * 0.45} q${r * 0.12},${-r * 0.12} ${r * 0.23},0 q${r * 0.12},${r * 0.12} ${r * 0.23},0 q${r * 0.12},${-r * 0.12} ${r * 0.23},0`);
        break;
      case "surpreso":
        olhos = olho(cx - ox, rr * 1.5) + olho(cx + ox, rr * 1.5);
        sobr = linha(`M${cx - ox - r * 0.18},${oy - r * 0.32} Q${cx - ox},${oy - r * 0.5} ${cx - ox + r * 0.18},${oy - r * 0.32}`) + linha(`M${cx + ox - r * 0.18},${oy - r * 0.32} Q${cx + ox},${oy - r * 0.5} ${cx + ox + r * 0.18},${oy - r * 0.32}`);
        boca = `<ellipse cx="${cx}" cy="${cy + r * 0.45}" rx="${r * 0.16}" ry="${r * 0.22}" fill="${tinta}"/>`;
        break;
      case "calmo":
        olhos = linha(`M${cx - ox - r * 0.14},${oy} Q${cx - ox},${oy + r * 0.14} ${cx - ox + r * 0.14},${oy}`) + linha(`M${cx + ox - r * 0.14},${oy} Q${cx + ox},${oy + r * 0.14} ${cx + ox + r * 0.14},${oy}`);
        boca = linha(`M${cx - r * 0.25},${cy + r * 0.35} Q${cx},${cy + r * 0.55} ${cx + r * 0.25},${cy + r * 0.35}`);
        break;
      default:
        olhos = olho(cx - ox, rr) + olho(cx + ox, rr);
        boca = linha(`M${cx - r * 0.25},${cy + r * 0.42} L${cx + r * 0.25},${cy + r * 0.42}`);
    }
    return olhos + sobr + boca + extra;
  }

  /* ---------- Personagens ---------- */
  const PESSOAS = {
    menina: { pele: "#c68642", cabelo: "trancas", corCabelo: "#2b1b10", roupa: "#e8559a", saia: "#7b3fa0", calca: "#c68642" },
    menino: { pele: "#f1c27d", cabelo: "curto", corCabelo: "#6b3e1f", roupa: "#2f80ed", calca: "#33475b" },
    bia: { pele: "#ffdbac", cabelo: "rabo", corCabelo: "#c0602a", roupa: "#27ae60", calca: "#2c5282" },
    davi: { pele: "#5c3a21", cabelo: "crespo", corCabelo: "#1a1009", roupa: "#f2994a", calca: "#2d3748" },
    professora: { pele: "#e0ac69", cabelo: "coque", corCabelo: "#3b2a1a", roupa: "#2e9e7d", saia: "#25476a", calca: "#e0ac69", oculos: true, livro: true },
    merendeira: { pele: "#a0522d", cabelo: "curto", corCabelo: "#1f140c", roupa: "#ffffff", calca: "#4a5568", touca: true, avental: true },
    porteiro: { pele: "#d2a679", cabelo: "curto", corCabelo: "#4a3020", roupa: "#2b5797", calca: "#1f2d40", quepe: true },
    diretora: { pele: "#7a4a2a", cabelo: "cacheado", corCabelo: "#1a1009", roupa: "#7b4fc4", saia: "#3d2a66", calca: "#7a4a2a", cracha: true }
  };

  function pessoa(x, b, p, sent) {
    const hy = b - 128, r = 24;
    let s = "";
    // cabelo de trás
    if (p.cabelo === "trancas") s += `<rect x="${x - 30}" y="${hy - 5}" width="10" height="45" rx="5" fill="${p.corCabelo}"/><rect x="${x + 20}" y="${hy - 5}" width="10" height="45" rx="5" fill="${p.corCabelo}"/>`;
    if (p.cabelo === "cacheado") s += `<circle cx="${x - 22}" cy="${hy + 8}" r="16" fill="${p.corCabelo}"/><circle cx="${x + 22}" cy="${hy + 8}" r="16" fill="${p.corCabelo}"/><circle cx="${x - 20}" cy="${hy + 26}" r="12" fill="${p.corCabelo}"/><circle cx="${x + 20}" cy="${hy + 26}" r="12" fill="${p.corCabelo}"/>`;
    if (p.cabelo === "rabo") s += `<ellipse cx="${x + 28}" cy="${hy + 8}" rx="9" ry="20" fill="${p.corCabelo}"/>`;
    // pernas / saia
    s += `<rect x="${x - 13}" y="${b - 48}" width="10" height="46" rx="4" fill="${p.calca}"/><rect x="${x + 3}" y="${b - 48}" width="10" height="46" rx="4" fill="${p.calca}"/>`;
    s += `<ellipse cx="${x - 9}" cy="${b - 2}" rx="10" ry="5" fill="#3a2a22"/><ellipse cx="${x + 9}" cy="${b - 2}" rx="10" ry="5" fill="#3a2a22"/>`;
    // braços
    s += `<rect x="${x - 33}" y="${b - 102}" width="11" height="46" rx="5" fill="${p.roupa}" stroke="#0002"/><rect x="${x + 22}" y="${b - 102}" width="11" height="46" rx="5" fill="${p.roupa}" stroke="#0002"/>`;
    s += `<circle cx="${x - 27.5}" cy="${b - 54}" r="6" fill="${p.pele}"/><circle cx="${x + 27.5}" cy="${b - 54}" r="6" fill="${p.pele}"/>`;
    // corpo
    s += `<rect x="${x - 6}" y="${hy + 20}" width="12" height="10" fill="${p.pele}"/>`;
    s += `<rect x="${x - 23}" y="${b - 106}" width="46" height="62" rx="10" fill="${p.roupa}" stroke="#0002"/>`;
    if (p.saia) s += `<path d="M${x - 24},${b - 58} L${x + 24},${b - 58} L${x + 32},${b - 30} L${x - 32},${b - 30} Z" fill="${p.saia}"/>`;
    if (p.avental) s += `<rect x="${x - 16}" y="${b - 98}" width="32" height="52" rx="4" fill="#f4f1e8" stroke="#cbbfa5"/>`;
    if (p.cracha) s += `<rect x="${x + 4}" y="${b - 92}" width="12" height="15" rx="2" fill="#fff" stroke="#555"/>`;
    if (p.livro) s += `<rect x="${x + 18}" y="${b - 72}" width="22" height="28" rx="2" fill="#c0392b"/><rect x="${x + 21}" y="${b - 69}" width="16" height="22" fill="#f7e7c6"/>`;
    // cabeça
    s += `<circle cx="${x}" cy="${hy}" r="${r}" fill="${p.pele}"/>`;
    // cabelo da frente
    switch (p.cabelo) {
      case "curto": s += `<path d="M${x - 24},${hy - 2} Q${x - 22},${hy - 28} ${x},${hy - 27} Q${x + 22},${hy - 28} ${x + 24},${hy - 2} Q${x + 10},${hy - 14} ${x - 24},${hy - 2}Z" fill="${p.corCabelo}"/>`; break;
      case "crespo": s += `<path d="M${x - 25},${hy - 2} Q${x - 30},${hy - 32} ${x},${hy - 32} Q${x + 30},${hy - 32} ${x + 25},${hy - 2} Q${x},${hy - 16} ${x - 25},${hy - 2}Z" fill="${p.corCabelo}"/>`; break;
      case "coque": s += `<circle cx="${x}" cy="${hy - 28}" r="11" fill="${p.corCabelo}"/><path d="M${x - 24},${hy} Q${x - 22},${hy - 27} ${x},${hy - 26} Q${x + 22},${hy - 27} ${x + 24},${hy} Q${x},${hy - 16} ${x - 24},${hy}Z" fill="${p.corCabelo}"/>`; break;
      default: s += `<path d="M${x - 25},${hy + 2} Q${x - 24},${hy - 28} ${x},${hy - 27} Q${x + 24},${hy - 28} ${x + 25},${hy + 2} Q${x + 12},${hy - 14} ${x},${hy - 12} Q${x - 12},${hy - 14} ${x - 25},${hy + 2}Z" fill="${p.corCabelo}"/>`;
    }
    s += rosto(x, hy + 3, r, sent);
    if (p.oculos) s += `<circle cx="${x - 9}" cy="${hy}" r="7" fill="none" stroke="#333" stroke-width="2"/><circle cx="${x + 9}" cy="${hy}" r="7" fill="none" stroke="#333" stroke-width="2"/><line x1="${x - 2}" y1="${hy}" x2="${x + 2}" y2="${hy}" stroke="#333" stroke-width="2"/>`;
    if (p.touca) s += `<path d="M${x - 26},${hy - 8} Q${x - 26},${hy - 38} ${x},${hy - 36} Q${x + 26},${hy - 38} ${x + 26},${hy - 8} Z" fill="#fff" stroke="#bbb"/>`;
    if (p.quepe) s += `<path d="M${x - 25},${hy - 10} Q${x},${hy - 40} ${x + 25},${hy - 10} Z" fill="#1f3b70"/><rect x="${x - 27}" y="${hy - 13}" width="40" height="6" rx="3" fill="#152a50"/><circle cx="${x}" cy="${hy - 20}" r="4" fill="#f2c94c"/>`;
    return s;
  }

  function robo(x, b, sent) {
    let s = "";
    s += `<rect x="${x - 22}" y="${b - 45}" width="14" height="43" rx="5" fill="#7f8c9a"/><rect x="${x + 8}" y="${b - 45}" width="14" height="43" rx="5" fill="#7f8c9a"/>`;
    s += `<rect x="${x - 27}" y="${b - 8}" width="22" height="9" rx="4" fill="#4a5563"/><rect x="${x + 5}" y="${b - 8}" width="22" height="9" rx="4" fill="#4a5563"/>`;
    s += `<rect x="${x - 50}" y="${b - 108}" width="13" height="50" rx="6" fill="#7f8c9a"/><rect x="${x + 37}" y="${b - 108}" width="13" height="50" rx="6" fill="#7f8c9a"/>`;
    s += `<circle cx="${x - 43.5}" cy="${b - 55}" r="8" fill="#4a5563"/><circle cx="${x + 43.5}" cy="${b - 55}" r="8" fill="#4a5563"/>`;
    s += `<rect x="${x - 38}" y="${b - 114}" width="76" height="72" rx="14" fill="#3d8bd9" stroke="#2a6bb0" stroke-width="3"/>`;
    s += `<rect x="${x - 22}" y="${b - 100}" width="44" height="28" rx="6" fill="#d7ecff"/><circle cx="${x - 10}" cy="${b - 86}" r="5" fill="#f2c94c"/><circle cx="${x + 4}" cy="${b - 86}" r="5" fill="#eb5757"/><circle cx="${x + 15}" cy="${b - 86}" r="3" fill="#27ae60"/>`;
    s += `<rect x="${x - 8}" y="${b - 124}" width="16" height="12" fill="#7f8c9a"/>`;
    s += `<line x1="${x}" y1="${b - 178}" x2="${x}" y2="${b - 196}" stroke="#4a5563" stroke-width="4"/><circle cx="${x}" cy="${b - 199}" r="7" fill="#eb5757"/>`;
    s += `<rect x="${x - 36}" y="${b - 180}" width="72" height="58" rx="16" fill="#e3e9ef" stroke="#9aa8b5" stroke-width="3"/>`;
    s += `<rect x="${x - 42}" y="${b - 160}" width="7" height="18" rx="3" fill="#9aa8b5"/><rect x="${x + 35}" y="${b - 160}" width="7" height="18" rx="3" fill="#9aa8b5"/>`;
    s += rosto(x, b - 150, 30, sent || "feliz", true);
    return s;
  }

  function animal(tipo, x, b, sent) {
    const cor = tipo === "gato" ? "#f2994a" : "#a0703c";
    let s = `<ellipse cx="${x + 10}" cy="${b - 30}" rx="38" ry="20" fill="${cor}"/>`;
    s += `<rect x="${x - 18}" y="${b - 25}" width="9" height="25" rx="4" fill="${cor}"/><rect x="${x + 28}" y="${b - 25}" width="9" height="25" rx="4" fill="${cor}"/>`;
    s += tipo === "gato"
      ? `<path d="M${x + 45},${b - 35} Q${x + 70},${b - 60} ${x + 60},${b - 80}" stroke="${cor}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      : `<path d="M${x + 46},${b - 38} L${x + 64},${b - 55}" stroke="${cor}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<circle cx="${x - 22}" cy="${b - 58}" r="22" fill="${cor}"/>`;
    s += tipo === "gato"
      ? `<path d="M${x - 40},${b - 68} L${x - 36},${b - 92} L${x - 24},${b - 76}Z M${x - 4},${b - 68} L${x - 8},${b - 92} L${x - 20},${b - 76}Z" fill="${cor}"/>`
      : `<ellipse cx="${x - 42}" cy="${b - 58}" rx="7" ry="15" fill="#6b4423"/><ellipse cx="${x - 2}" cy="${b - 58}" rx="7" ry="15" fill="#6b4423"/>`;
    s += rosto(x - 22, b - 58, 18, sent);
    s += `<ellipse cx="${x - 22}" cy="${b - 54}" rx="4" ry="3" fill="#2b1d14"/>`;
    return s;
  }

  function personagem(quem, x, b, sent) {
    if (quem === "robo") return robo(x, b, sent);
    if (quem === "cachorro" || quem === "gato") return animal(quem, x, b, sent);
    return pessoa(x, b, PESSOAS[quem] || PESSOAS.menino, sent);
  }

  // Medidas de cada personagem (para enquadrar fotos)
  function medidas(quem, x, b) {
    if (quem === "robo") return { cx: x, topo: b - 206, cabeca: b - 150 };
    if (quem === "cachorro" || quem === "gato") return { cx: x, topo: b - 95, cabeca: b - 58 };
    return { cx: x, topo: b - 160, cabeca: b - 128 };
  }

  /* ---------- Cenários (desenhados bem largos para caber o "de longe") ---------- */
  const C = { ceu: "#bfe3ff", grama: "#7ccf6b", chao: "#d9c7a7" };
  function arvore(x, b, e) {
    e = e || 1;
    return `<rect x="${x - 8 * e}" y="${b - 70 * e}" width="${16 * e}" height="${70 * e}" fill="#8b5a2b"/><circle cx="${x}" cy="${b - 95 * e}" r="${40 * e}" fill="#3fa34d"/><circle cx="${x - 25 * e}" cy="${b - 75 * e}" r="${25 * e}" fill="#4cb85a"/><circle cx="${x + 25 * e}" cy="${b - 78 * e}" r="${25 * e}" fill="#4cb85a"/>`;
  }
  const CENARIOS = {
    ceu: () => `<rect x="-400" y="-300" width="1200" height="900" fill="${C.ceu}"/><rect x="-400" y="${CHAO}" width="1200" height="400" fill="${C.grama}"/>`,
    escola: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="${C.ceu}"/><rect x="-400" y="${CHAO - 20}" width="1200" height="420" fill="${C.chao}"/>`;
      s += `<rect x="-380" y="40" width="1160" height="${CHAO - 60}" fill="#f6d5a8" stroke="#c99a5b" stroke-width="3"/>`;
      s += `<path d="M-390,45 L200,-40 L790,45 Z" fill="#c0504d"/>`;
      for (let i = -340; i < 760; i += 110) { if (i > 150 && i < 250) continue; s += `<rect x="${i}" y="80" width="60" height="50" fill="#9fd3f5" stroke="#fff" stroke-width="4"/>`; }
      s += `<rect x="170" y="140" width="60" height="${CHAO - 160}" fill="#8b5a2b"/><circle cx="218" cy="185" r="4" fill="#f2c94c"/>`;
      s += `<circle cx="200" cy="20" r="16" fill="#fff" stroke="#555" stroke-width="3"/><line x1="200" y1="20" x2="200" y2="10" stroke="#555" stroke-width="3"/><line x1="200" y1="20" x2="208" y2="20" stroke="#555" stroke-width="3"/>`;
      s += `<rect x="70" y="150" width="70" height="20" rx="4" fill="#fff"/><text x="105" y="165" font-size="13" text-anchor="middle" fill="#333" font-family="Arial">ESCOLA</text>`;
      return s;
    },
    parque: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="${C.ceu}"/><circle cx="60" cy="40" r="28" fill="#ffd54f"/>`;
      s += `<rect x="-400" y="${CHAO - 40}" width="1200" height="440" fill="${C.grama}"/>`;
      s += `<path d="M-400,${CHAO - 40} Q-200,${CHAO - 90} 0,${CHAO - 40} T400,${CHAO - 40} T800,${CHAO - 40}" fill="#8edb7c"/>`;
      s += arvore(-120, CHAO - 30, 1.2) + arvore(350, CHAO - 30, 1) + arvore(620, CHAO - 30, 1.3);
      s += `<rect x="240" y="${CHAO - 48}" width="70" height="8" fill="#8b5a2b"/><rect x="245" y="${CHAO - 40}" width="6" height="22" fill="#6b4423"/><rect x="300" y="${CHAO - 40}" width="6" height="22" fill="#6b4423"/>`;
      for (let i = -380; i < 780; i += 70) s += `<circle cx="${i}" cy="${CHAO + 30}" r="5" fill="#ff8fab"/><circle cx="${i + 35}" cy="${CHAO + 60}" r="5" fill="#fff176"/>`;
      return s;
    },
    casa: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="#f3e3c3"/><rect x="-400" y="${CHAO - 30}" width="1200" height="430" fill="#b98a5a"/>`;
      for (let i = -400; i < 800; i += 40) s += `<line x1="${i}" y1="${CHAO - 30}" x2="${i - 30}" y2="${CHAO + 400}" stroke="#a87a4c" stroke-width="2"/>`;
      s += `<rect x="40" y="40" width="110" height="90" fill="#bfe3ff" stroke="#fff" stroke-width="6"/><line x1="95" y1="40" x2="95" y2="130" stroke="#fff" stroke-width="5"/>`;
      s += `<path d="M30,35 Q55,90 40,140 L30,140Z M160,35 Q135,90 150,140 L160,140Z" fill="#e57373"/>`;
      s += `<rect x="250" y="${CHAO - 85}" width="150" height="55" rx="12" fill="#5c6bc0"/><rect x="245" y="${CHAO - 110}" width="160" height="35" rx="12" fill="#7986cb"/>`;
      s += `<rect x="260" y="40" width="60" height="45" fill="#fff" stroke="#8d6e63" stroke-width="5"/><circle cx="280" cy="65" r="8" fill="#ffd54f"/><path d="M265,82 L285,62 L300,75 L315,62 L318,82Z" fill="#81c784"/>`;
      return s;
    },
    salaLeitura: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="#fdf0d5"/><rect x="-400" y="${CHAO - 30}" width="1200" height="430" fill="#c9a27c"/>`;
      const cores = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#ff8a65"];
      for (let est = -380; est < 760; est += 200) {
        s += `<rect x="${est}" y="10" width="170" height="${CHAO - 50}" fill="#a1887f"/>`;
        for (let pr = 0; pr < 3; pr++) {
          const y = 20 + pr * 62;
          s += `<rect x="${est + 5}" y="${y + 50}" width="160" height="6" fill="#795548"/>`;
          for (let l = 0; l < 9; l++) s += `<rect x="${est + 10 + l * 17}" y="${y + 10 + (l % 3) * 4}" width="13" height="${40 - (l % 3) * 4}" fill="${cores[(l + pr + est) % 6 < 0 ? 0 : (l + pr + Math.abs(est)) % 6]}"/>`;
        }
      }
      s += `<ellipse cx="200" cy="${CHAO + 25}" rx="150" ry="25" fill="#ef9a9a"/>`;
      return s;
    },
    quadra: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="${C.ceu}"/><rect x="-400" y="${CHAO - 60}" width="1200" height="460" fill="#4f9f6b"/>`;
      s += `<rect x="-300" y="${CHAO - 50}" width="1000" height="300" fill="none" stroke="#fff" stroke-width="4"/><line x1="200" y1="${CHAO - 50}" x2="200" y2="${CHAO + 250}" stroke="#fff" stroke-width="4"/><circle cx="200" cy="${CHAO + 20}" r="40" fill="none" stroke="#fff" stroke-width="4"/>`;
      s += `<rect x="-40" y="${CHAO - 150}" width="8" height="110" fill="#ddd"/><rect x="-40" y="${CHAO - 150}" width="80" height="8" fill="#ddd"/><rect x="40" y="${CHAO - 150}" width="8" height="110" fill="#ddd"/>`;
      s += `<rect x="-400" y="-300" width="1200" height="${CHAO - 120 + 300}" fill="#9e9e9e" opacity=".25"/>`;
      return s;
    },
    refeitorio: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="#e0f2f1"/>`;
      for (let x = -400; x < 800; x += 30) for (let y = 0; y < CHAO - 40; y += 30) s += `<rect x="${x + 1}" y="${y + 1}" width="28" height="28" fill="#fff" opacity=".7"/>`;
      s += `<rect x="-400" y="${CHAO - 40}" width="1200" height="440" fill="#90a4ae"/>`;
      s += `<rect x="-380" y="${CHAO - 110}" width="1160" height="70" fill="#b0bec5"/><rect x="-380" y="${CHAO - 118}" width="1160" height="10" fill="#78909c"/>`;
      s += `<ellipse cx="40" cy="${CHAO - 125}" rx="35" ry="10" fill="#607d8b"/><rect x="5" y="${CHAO - 160}" width="70" height="35" fill="#78909c"/><ellipse cx="330" cy="${CHAO - 125}" rx="28" ry="8" fill="#607d8b"/><rect x="302" y="${CHAO - 150}" width="56" height="25" fill="#78909c"/>`;
      return s;
    },
    portao: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="${C.ceu}"/><rect x="-400" y="${CHAO - 30}" width="1200" height="430" fill="#bdbdbd"/>`;
      s += `<rect x="-400" y="60" width="1200" height="${CHAO - 90}" fill="#f6d5a8"/>`;
      s += `<rect x="80" y="70" width="240" height="${CHAO - 100}" fill="#8fa9b8"/>`;
      for (let i = 90; i < 320; i += 20) s += `<rect x="${i}" y="75" width="6" height="${CHAO - 110}" fill="#37474f"/>`;
      s += `<rect x="70" y="50" width="260" height="22" fill="#37474f"/>`;
      return s;
    },
    estudio: () => {
      let s = `<rect x="-400" y="-300" width="1200" height="900" fill="#e8eaf6"/><rect x="-400" y="${CHAO - 30}" width="1200" height="430" fill="#9fa8da"/>`;
      for (let x = -400; x < 800; x += 50) s += `<rect x="${x + 4}" y="0" width="42" height="${CHAO - 40}" fill="#c5cae9" rx="4"/>`;
      s += `<rect x="20" y="20" width="110" height="40" rx="8" fill="#c62828"/><text x="75" y="48" font-size="22" font-weight="bold" text-anchor="middle" fill="#fff" font-family="Arial">NO AR</text>`;
      s += `<rect x="250" y="${CHAO - 70}" width="160" height="12" fill="#5d4037"/><rect x="260" y="${CHAO - 58}" width="10" height="40" fill="#5d4037"/><rect x="390" y="${CHAO - 58}" width="10" height="40" fill="#5d4037"/>`;
      s += objeto({ obj: "microfone", x: 290, y: CHAO - 70 });
      return s;
    }
  };

  /* ---------- Objetos ---------- */
  function objeto(o) {
    const x = o.x == null ? 200 : o.x, y = o.y == null ? CHAO : o.y, e = o.escala || 1;
    const g = (corpo) => `<g transform="translate(${x},${y}) scale(${e})">${corpo}</g>`;
    switch (o.obj) {
      case "arvore": return arvore(x, y, e);
      case "muda": return g(`<rect x="-2" y="-30" width="4" height="30" fill="#6b8e23"/><ellipse cx="-9" cy="-26" rx="9" ry="5" fill="#4caf50"/><ellipse cx="9" cy="-32" rx="9" ry="5" fill="#4caf50"/><ellipse cx="0" cy="0" rx="16" ry="5" fill="#795548"/>`);
      case "flor": return g(`<rect x="-2" y="-40" width="4" height="40" fill="#43a047"/><circle cx="0" cy="-48" r="7" fill="#fdd835"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 12}" cy="${-48 + Math.sin(a * Math.PI / 180) * 12}" r="7" fill="#ec407a"/>`).join("")}`);
      case "vaso": return g(`<path d="M-22,-35 L22,-35 L16,0 L-16,0 Z" fill="#d2691e"/><rect x="-25" y="-40" width="50" height="8" rx="2" fill="#b5541a"/><ellipse cx="0" cy="-38" rx="20" ry="3" fill="#5d4037"/><ellipse cx="0" cy="-41" rx="4" ry="3" fill="#a1887f"/>`);
      case "broto": return objeto({ obj: "vaso", x, y, escala: e }) + g(`<rect x="-2" y="-62" width="4" height="24" fill="#6b8e23"/><ellipse cx="-8" cy="-60" rx="8" ry="4" fill="#66bb6a"/><ellipse cx="8" cy="-64" rx="8" ry="4" fill="#66bb6a"/>`);
      case "planta": return objeto({ obj: "vaso", x, y, escala: e }) + g(`<rect x="-2" y="-95" width="4" height="58" fill="#43a047"/><ellipse cx="-12" cy="-70" rx="12" ry="5" fill="#66bb6a"/><ellipse cx="12" cy="-78" rx="12" ry="5" fill="#66bb6a"/><circle cx="0" cy="-102" r="8" fill="#fdd835"/>${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 13}" cy="${-102 + Math.sin(a * Math.PI / 180) * 13}" r="7" fill="#ef5350"/>`).join("")}`);
      case "regador": return g(`<rect x="-18" y="-30" width="32" height="28" rx="5" fill="#26a69a"/><path d="M14,-24 L36,-40 L38,-36 L16,-16Z" fill="#26a69a"/><path d="M-18,-26 Q-32,-20 -18,-8" fill="none" stroke="#00796b" stroke-width="4"/><circle cx="40" cy="-30" r="2" fill="#4fc3f7"/><circle cx="44" cy="-22" r="2" fill="#4fc3f7"/><circle cx="40" cy="-14" r="2" fill="#4fc3f7"/>`);
      case "sorvete": return g(`<path d="M-10,-30 L10,-30 L0,0Z" fill="#e0a050"/><circle cx="0" cy="-38" r="12" fill="#f48fb1"/><circle cx="0" cy="-52" r="10" fill="#fff59d"/>`);
      case "sorveteChao": return g(`<ellipse cx="0" cy="0" rx="22" ry="6" fill="#f48fb1"/><circle cx="-4" cy="-4" r="8" fill="#f48fb1"/><path d="M8,-4 L30,-14 L28,0Z" fill="#e0a050"/>`);
      case "bola": return g(`<circle cx="0" cy="-14" r="14" fill="#fff" stroke="#333" stroke-width="2"/><path d="M-6,-20 L6,-20 L9,-10 L0,-4 L-9,-10Z" fill="#333"/>`);
      case "livro": return g(`<rect x="-20" y="-28" width="40" height="28" rx="2" fill="#1e88e5"/><rect x="-16" y="-24" width="32" height="20" fill="#e3f2fd"/><line x1="0" y1="-24" x2="0" y2="-4" stroke="#1e88e5" stroke-width="2"/>`);
      case "livros": return g(`<rect x="-30" y="-14" width="60" height="14" fill="#e53935"/><rect x="-26" y="-28" width="52" height="14" fill="#43a047"/><rect x="-28" y="-42" width="56" height="14" fill="#fdd835"/><rect x="-22" y="-56" width="44" height="14" fill="#8e24aa"/>`);
      case "guardaChuva": return g(`<path d="M-40,-70 Q0,-115 40,-70 Q30,-78 20,-70 Q10,-78 0,-70 Q-10,-78 -20,-70 Q-30,-78 -40,-70Z" fill="#e53935"/><line x1="0" y1="-90" x2="0" y2="-20" stroke="#333" stroke-width="3"/><path d="M0,-20 q0,8 -8,8" fill="none" stroke="#333" stroke-width="3"/>`);
      case "sol": return g(`<circle cx="0" cy="0" r="26" fill="#ffd54f"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="${Math.cos(a * Math.PI / 180) * 32}" y1="${Math.sin(a * Math.PI / 180) * 32}" x2="${Math.cos(a * Math.PI / 180) * 44}" y2="${Math.sin(a * Math.PI / 180) * 44}" stroke="#ffb300" stroke-width="5" stroke-linecap="round"/>`).join("")}`);
      case "nuvem": return g(`<ellipse cx="0" cy="0" rx="45" ry="20" fill="#90a4ae"/><circle cx="-18" cy="-14" r="20" fill="#90a4ae"/><circle cx="14" cy="-18" r="24" fill="#90a4ae"/>`);
      case "chuva": { let s = ""; for (let i = -380; i < 780; i += 28) for (let j = -100; j < 400; j += 45) s += `<line x1="${i + (j % 2) * 14}" y1="${j}" x2="${i + (j % 2) * 14 - 6}" y2="${j + 16}" stroke="#4a90d9" stroke-width="3" stroke-linecap="round" opacity=".8"/>`; return `<rect x="-400" y="-300" width="1200" height="900" fill="#607d8b" opacity=".25"/>` + s; }
      case "arcoiris": return g(["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#8e24aa"].map((c, i) => `<path d="M${-120 + i * 9},0 A${120 - i * 9},${120 - i * 9} 0 0 1 ${120 - i * 9},0" fill="none" stroke="${c}" stroke-width="9"/>`).join(""));
      case "bandeirinhas": { let s = `<path d="M-400,20 Q200,70 800,20" fill="none" stroke="#555" stroke-width="2"/>`; const cs = ["#e53935", "#fdd835", "#1e88e5", "#43a047", "#fb8c00"]; for (let i = -380, k = 0; i < 780; i += 40, k++) { const yy = 20 + 50 * (1 - Math.pow((i - 200) / 600, 2)) * 0.95; s += `<path d="M${i - 12},${yy} L${i + 12},${yy} L${i},${yy + 22}Z" fill="${cs[k % 5]}"/>`; } return s; }
      case "fogueira": return g(`<rect x="-30" y="-8" width="60" height="8" rx="4" fill="#6d4c41" transform="rotate(10)"/><rect x="-30" y="-8" width="60" height="8" rx="4" fill="#795548" transform="rotate(-10)"/><path d="M-20,-8 Q-22,-40 0,-60 Q22,-40 20,-8Z" fill="#ff7043"/><path d="M-10,-8 Q-10,-30 0,-40 Q10,-30 10,-8Z" fill="#ffd54f"/>`);
      case "mesa": return g(`<rect x="-60" y="-50" width="120" height="10" fill="#8d6e63"/><rect x="-55" y="-40" width="8" height="40" fill="#6d4c41"/><rect x="47" y="-40" width="8" height="40" fill="#6d4c41"/>`);
      case "microfone": return g(`<rect x="-3" y="-40" width="6" height="40" fill="#555"/><rect x="-12" y="-4" width="24" height="5" rx="2" fill="#333"/><rect x="-10" y="-70" width="20" height="32" rx="10" fill="#424242"/><line x1="-8" y1="-60" x2="8" y2="-60" stroke="#9e9e9e" stroke-width="2"/><line x1="-8" y1="-52" x2="8" y2="-52" stroke="#9e9e9e" stroke-width="2"/>`);
      case "camera": return g(`<rect x="-30" y="-40" width="60" height="38" rx="6" fill="#37474f"/><rect x="-14" y="-48" width="20" height="10" rx="2" fill="#37474f"/><circle cx="0" cy="-21" r="13" fill="#90caf9" stroke="#263238" stroke-width="4"/><circle cx="20" cy="-33" r="3" fill="#ffeb3b"/>`);
      case "blocos1": return g(`<rect x="-45" y="-22" width="22" height="22" fill="#e53935"/><rect x="-5" y="-22" width="22" height="22" fill="#1e88e5"/><rect x="30" y="-22" width="22" height="22" fill="#fdd835"/><rect x="-25" y="-22" width="18" height="22" fill="#43a047" transform="rotate(15 -16 -11)"/>`);
      case "blocos2": return g(`<rect x="-11" y="-22" width="22" height="22" fill="#e53935"/><rect x="-11" y="-44" width="22" height="22" fill="#1e88e5"/><rect x="30" y="-22" width="22" height="22" fill="#fdd835"/><rect x="55" y="-22" width="22" height="22" fill="#43a047"/>`);
      case "blocos3": return g(`<rect x="-11" y="-22" width="22" height="22" fill="#e53935"/><rect x="-11" y="-44" width="22" height="22" fill="#1e88e5"/><rect x="-11" y="-66" width="22" height="22" fill="#fdd835"/><rect x="-11" y="-88" width="22" height="22" fill="#43a047"/>`);
      case "blocosCaidos": return g(`<rect x="-30" y="-22" width="22" height="22" fill="#e53935" transform="rotate(20 -19 -11)"/><rect x="0" y="-22" width="22" height="22" fill="#1e88e5" transform="rotate(-25 11 -11)"/><rect x="30" y="-22" width="22" height="22" fill="#fdd835"/><rect x="-60" y="-22" width="22" height="22" fill="#43a047" transform="rotate(40 -49 -11)"/>`);
      case "horta": { let s = `<rect x="-90" y="-20" width="180" height="22" rx="4" fill="#6d4c41"/>`; for (let i = -75; i <= 75; i += 30) s += `<ellipse cx="${i}" cy="-26" rx="12" ry="9" fill="#66bb6a"/><ellipse cx="${i}" cy="-32" rx="7" ry="6" fill="#43a047"/>`; return g(s); }
      case "cartaz": return g(`<rect x="-4" y="-70" width="8" height="70" fill="#8d6e63"/><rect x="-40" y="-120" width="80" height="55" rx="4" fill="#fffde7" stroke="#f9a825" stroke-width="3"/><line x1="-30" y1="-102" x2="30" y2="-102" stroke="#f9a825" stroke-width="4"/><line x1="-30" y1="-88" x2="20" y2="-88" stroke="#bdbdbd" stroke-width="3"/><line x1="-30" y1="-78" x2="25" y2="-78" stroke="#bdbdbd" stroke-width="3"/>`);
      case "presente": return g(`<rect x="-20" y="-32" width="40" height="32" fill="#ab47bc"/><rect x="-24" y="-40" width="48" height="10" fill="#8e24aa"/><rect x="-4" y="-40" width="8" height="40" fill="#fdd835"/><path d="M0,-40 q-14,-14 -16,-2 M0,-40 q14,-14 16,-2" stroke="#fdd835" stroke-width="4" fill="none"/>`);
      default: return "";
    }
  }

  /* ---------- Cena completa ---------- */
  const POSICOES = { 1: [200], 2: [140, 270], 3: [90, 200, 310] };

  function cena(spec, rotulo, classe) {
    spec = spec || {};
    const fundo = (CENARIOS[spec.cenario] || CENARIOS.ceu)();
    const pers = spec.personagens || [];
    const xs = POSICOES[Math.min(pers.length, 3)] || [];
    let atras = "", frente = "";
    (spec.objetos || []).forEach(o => { if (o.frente) frente += objeto(o); else atras += objeto(o); });
    let corpo = "";
    const med = [];
    pers.forEach((p, i) => {
      const x = p.x != null ? p.x : xs[i] != null ? xs[i] : 60 + i * 90;
      const b = p.y != null ? p.y : CHAO;
      corpo += personagem(p.quem, x, b, p.sentimento);
      const m = medidas(p.quem, x, b);
      med.push(m);
      // Emoji do sentimento em cima do personagem (usado nas produções).
      if (p.emoji && p.sentimento) corpo += `<g transform="translate(${x + 22},${m.topo - 22}) scale(.36)"><circle cx="50" cy="50" r="46" fill="#fff"/><circle cx="50" cy="50" r="44" fill="${COR_EMOJI[p.sentimento] || "#ffd54f"}" stroke="#0005" stroke-width="3"/>${rosto(50, 50, 44, p.sentimento)}</g>`;
    });
    let vb = "0 0 400 300";
    if (spec.visao) vb = spec.visao.join(" ");
    else if (spec.enquadramento && med.length) {
      const m = med[0];
      switch (spec.enquadramento) {
        case "longe": vb = "-260 -195 920 690"; break;
        case "rosto": vb = `${m.cx - 62} ${m.cabeca - 50} 124 93`; break;
        case "meio": vb = `${m.cx - 110} ${m.topo - 15} 220 165`; break;
        case "cortado": vb = `${m.cx - 150} ${m.cabeca + 8} 300 225`; break;
      }
    }
    return svg(vb, fundo + atras + corpo + frente, rotulo, classe || "desenho cena");
  }

  /* ---------- Ícones e placas ---------- */
  const ICONES = {
    silencio: `<circle cx="50" cy="50" r="46" fill="#1565c0"/><circle cx="50" cy="50" r="30" fill="#ffd54f"/><circle cx="40" cy="44" r="3.5" fill="#333"/><circle cx="60" cy="44" r="3.5" fill="#333"/><ellipse cx="50" cy="62" rx="7" ry="4" fill="#333"/><rect x="46" y="44" width="8" height="34" rx="4" fill="#ffb74d" stroke="#e65100" stroke-width="1.5"/>`,
    lixeira: `<rect x="4" y="4" width="92" height="92" rx="14" fill="#2e7d32"/><rect x="28" y="34" width="44" height="50" rx="4" fill="#fff"/><rect x="22" y="24" width="56" height="8" rx="3" fill="#fff"/><rect x="42" y="16" width="16" height="8" rx="2" fill="#fff"/><line x1="38" y1="42" x2="38" y2="76" stroke="#2e7d32" stroke-width="4"/><line x1="50" y1="42" x2="50" y2="76" stroke="#2e7d32" stroke-width="4"/><line x1="62" y1="42" x2="62" y2="76" stroke="#2e7d32" stroke-width="4"/>`,
    banheiro: `<rect x="4" y="4" width="92" height="92" rx="14" fill="#0277bd"/><circle cx="30" cy="24" r="7" fill="#fff"/><rect x="22" y="34" width="16" height="28" rx="4" fill="#fff"/><rect x="23" y="60" width="6" height="22" fill="#fff"/><rect x="31" y="60" width="6" height="22" fill="#fff"/><line x1="50" y1="14" x2="50" y2="86" stroke="#fff" stroke-width="3"/><circle cx="70" cy="24" r="7" fill="#fff"/><path d="M70,33 L84,64 L56,64Z" fill="#fff"/><rect x="63" y="62" width="5" height="20" fill="#fff"/><rect x="72" y="62" width="5" height="20" fill="#fff"/>`,
    proibidoCorrer: `<circle cx="50" cy="50" r="46" fill="#fff"/><circle cx="56" cy="22" r="7" fill="#222"/><path d="M52,32 L42,55 L30,62 M44,52 L58,62 L54,82 M48,40 L64,48 M48,40 L34,40" fill="none" stroke="#222" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="42" fill="none" stroke="#d32f2f" stroke-width="9"/><line x1="21" y1="21" x2="79" y2="79" stroke="#d32f2f" stroke-width="9"/>`,
    lavarMaos: `<rect x="4" y="4" width="92" height="92" rx="14" fill="#00838f"/><rect x="30" y="14" width="36" height="10" rx="4" fill="#fff"/><rect x="58" y="14" width="10" height="22" rx="3" fill="#fff"/><circle cx="63" cy="42" r="3" fill="#80deea"/><circle cx="60" cy="50" r="3" fill="#80deea"/><path d="M30,62 Q34,52 46,56 L62,58 Q70,60 66,66 L50,66 Q60,70 56,76 L36,78 Q26,76 30,62Z" fill="#ffcc80" stroke="#fff" stroke-width="2"/><path d="M70,66 Q72,76 60,80 L46,82" fill="none" stroke="#fff" stroke-width="3"/>`
  };

  function icone(nome, rotulo) { return svg("0 0 100 100", ICONES[nome] || "", rotulo, "desenho icone"); }

  const COR_EMOJI = { feliz: "#ffd54f", triste: "#90caf9", bravo: "#ff8a65", medo: "#b39ddb", surpreso: "#fff176", calmo: "#a5d6a7", neutro: "#e0e0e0" };
  function emoji(nome, rotulo) {
    return svg("0 0 100 100", `<circle cx="50" cy="50" r="44" fill="${COR_EMOJI[nome] || "#ffd54f"}" stroke="#0003" stroke-width="2"/>` + rosto(50, 50, 44, nome), rotulo, "desenho emoji");
  }

  function balao(tipo, rotulo) {
    let s = "";
    switch (tipo) {
      case "fala": s = `<ellipse cx="60" cy="38" rx="52" ry="30" fill="#fff" stroke="#222" stroke-width="3"/><path d="M38,62 L28,84 L54,66" fill="#fff" stroke="#222" stroke-width="3" stroke-linejoin="round"/><ellipse cx="60" cy="38" rx="49" ry="27" fill="#fff"/>`; break;
      case "pensamento": s = `<path d="M20,40 Q10,18 34,14 Q44,2 62,10 Q82,2 92,18 Q114,22 106,42 Q114,62 88,64 Q76,76 58,68 Q40,76 30,62 Q8,60 20,40Z" fill="#fff" stroke="#222" stroke-width="3"/><circle cx="30" cy="76" r="6" fill="#fff" stroke="#222" stroke-width="3"/><circle cx="20" cy="86" r="3.5" fill="#fff" stroke="#222" stroke-width="2.5"/>`; break;
      case "grito": s = `<path d="M60,2 L70,18 L90,6 L90,24 L114,22 L100,38 L118,50 L96,56 L104,76 L82,66 L76,86 L62,70 L46,86 L42,66 L20,74 L28,56 L4,48 L24,38 L10,20 L34,22 L36,4 L50,16Z" fill="#fff59d" stroke="#222" stroke-width="3" stroke-linejoin="round"/>`; break;
      case "cochicho": s = `<ellipse cx="60" cy="38" rx="52" ry="30" fill="#fff" stroke="#222" stroke-width="3" stroke-dasharray="7 6"/><path d="M38,64 L28,84 L52,67" fill="none" stroke="#222" stroke-width="3" stroke-dasharray="5 4"/>`; break;
    }
    return svg("0 0 120 90", s, rotulo, "desenho balao-desenho");
  }

  /* ---------- Pictogramas (instruções e botões) ---------- */
  const PICTOS = {
    olho: `<path d="M4,24 Q24,6 44,24 Q24,42 4,24Z" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="24" cy="24" r="7" fill="currentColor"/>`,
    ouvido: `<path d="M16,18 Q16,6 26,6 Q38,6 38,18 Q38,26 30,30 Q26,33 26,38 Q26,44 20,44" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M22,20 Q22,14 27,14 Q32,14 32,19" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>`,
    clique: `<path d="M16,6 L16,34 L23,28 L28,42 L33,40 L28,26 L37,26Z" fill="currentColor"/>`,
    arrastar: `<path d="M10,30 L10,16 Q10,12 14,12 Q18,12 18,16 L18,10 Q18,6 22,6 Q26,6 26,10 L26,12 Q26,8 30,8 Q34,8 34,12 L34,16 Q34,12 38,13 Q41,14 41,18 L41,32 Q41,44 28,44 Q18,44 14,38Z" fill="currentColor"/><path d="M2,6 L8,2 M2,6 L8,10 M2,6 L12,6" stroke="currentColor" stroke-width="2.5" fill="none"/>`,
    estrela: `<path d="M24,3 L30,17 L45,18 L33,28 L37,43 L24,35 L11,43 L15,28 L3,18 L18,17Z" fill="currentColor"/>`,
    camera: `<rect x="4" y="14" width="40" height="28" rx="5" fill="currentColor"/><rect x="16" y="8" width="16" height="8" rx="2" fill="currentColor"/><circle cx="24" cy="28" r="9" fill="#fff"/><circle cx="24" cy="28" r="5" fill="currentColor"/>`,
    microfone: `<rect x="17" y="4" width="14" height="24" rx="7" fill="currentColor"/><path d="M11,22 Q11,36 24,36 Q37,36 37,22" fill="none" stroke="currentColor" stroke-width="3.5"/><line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" stroke-width="3.5"/><line x1="15" y1="44" x2="33" y2="44" stroke="currentColor" stroke-width="3.5"/>`,
    jornal: `<rect x="4" y="6" width="40" height="36" rx="3" fill="none" stroke="currentColor" stroke-width="3.5"/><rect x="9" y="11" width="30" height="7" fill="currentColor"/><rect x="9" y="22" width="12" height="14" fill="currentColor"/><line x1="25" y1="24" x2="39" y2="24" stroke="currentColor" stroke-width="3"/><line x1="25" y1="30" x2="39" y2="30" stroke="currentColor" stroke-width="3"/><line x1="25" y1="36" x2="39" y2="36" stroke="currentColor" stroke-width="3"/>`,
    mural: `<rect x="3" y="6" width="42" height="34" rx="3" fill="none" stroke="currentColor" stroke-width="3.5"/><rect x="9" y="12" width="12" height="10" fill="currentColor"/><rect x="26" y="12" width="13" height="10" fill="currentColor"/><rect x="9" y="26" width="30" height="8" fill="currentColor"/><line x1="14" y1="40" x2="10" y2="46" stroke="currentColor" stroke-width="3"/><line x1="34" y1="40" x2="38" y2="46" stroke="currentColor" stroke-width="3"/>`,
    pausa: `<rect x="12" y="8" width="9" height="32" rx="2" fill="currentColor"/><rect x="27" y="8" width="9" height="32" rx="2" fill="currentColor"/>`,
    ajuda: `<circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M17,18 Q17,10 24,10 Q31,10 31,17 Q31,22 25,24 L24,29" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="36" r="2.8" fill="currentColor"/>`,
    voltar: `<path d="M20,10 L6,24 L20,38 M6,24 L42,24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
    avancar: `<path d="M28,10 L42,24 L28,38 M42,24 L6,24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
    cadeado: `<rect x="9" y="21" width="30" height="23" rx="4" fill="currentColor"/><path d="M15,21 L15,14 Q15,5 24,5 Q33,5 33,14 L33,21" fill="none" stroke="currentColor" stroke-width="4"/>`,
    teclado: `<rect x="2" y="12" width="44" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>${[8, 16, 24, 32, 40].map(x => `<rect x="${x - 3}" y="17" width="5" height="5" fill="currentColor"/>`).join("")}<rect x="12" y="29" width="24" height="5" fill="currentColor"/>`,
    lapis: `<path d="M8,40 L12,28 L34,6 L42,14 L20,36Z" fill="currentColor"/><path d="M8,40 L12,28 L20,36Z" fill="#fff" stroke="currentColor" stroke-width="2"/>`,
    certo: `<path d="M8,26 L19,37 L41,11" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
    lampada: `<path d="M24,4 Q38,4 38,18 Q38,26 30,32 L30,36 L18,36 L18,32 Q10,26 10,18 Q10,4 24,4Z" fill="currentColor"/><rect x="18" y="38" width="12" height="4" rx="1" fill="currentColor"/><rect x="20" y="43" width="8" height="3" rx="1" fill="currentColor"/>`,
    ordem: `<rect x="3" y="8" width="12" height="32" rx="3" fill="currentColor"/><rect x="18" y="8" width="12" height="32" rx="3" fill="currentColor" opacity=".7"/><rect x="33" y="8" width="12" height="32" rx="3" fill="currentColor" opacity=".45"/><text x="9" y="29" font-size="13" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">1</text><text x="24" y="29" font-size="13" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">2</text><text x="39" y="29" font-size="13" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">3</text>`,
    caixas: `<rect x="3" y="22" width="18" height="20" rx="3" fill="currentColor"/><rect x="27" y="22" width="18" height="20" rx="3" fill="currentColor" opacity=".6"/><rect x="16" y="4" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="3"/>`,
    pecas: `<path d="M6,6 L22,6 L22,11 Q27,11 27,15 Q27,19 22,19 L22,24 L6,24Z" fill="currentColor"/><path d="M26,26 L42,26 L42,42 L26,42 L26,37 Q21,37 21,33 Q21,29 26,29Z" fill="currentColor" opacity=".6"/>`,
    lupa: `<circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" stroke-width="5"/><line x1="30" y1="30" x2="43" y2="43" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,
    balao: `<ellipse cx="24" cy="20" rx="20" ry="14" fill="currentColor"/><path d="M14,30 L10,44 L24,32Z" fill="currentColor"/>`,
    radio: `<rect x="3" y="16" width="42" height="28" rx="4" fill="currentColor"/><line x1="10" y1="16" x2="34" y2="3" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="30" r="8" fill="#fff"/><rect x="29" y="24" width="12" height="3" fill="#fff"/><rect x="29" y="31" width="12" height="3" fill="#fff"/>`,
    tv: `<rect x="3" y="10" width="42" height="28" rx="4" fill="currentColor"/><rect x="8" y="15" width="32" height="18" rx="2" fill="#fff"/><line x1="16" y1="2" x2="24" y2="10" stroke="currentColor" stroke-width="3"/><line x1="32" y1="2" x2="24" y2="10" stroke="currentColor" stroke-width="3"/><rect x="14" y="40" width="20" height="4" fill="currentColor"/>`,
    aviso: `<rect x="6" y="4" width="36" height="40" rx="3" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="24" cy="4" r="3.5" fill="currentColor"/><rect x="12" y="12" width="24" height="6" fill="currentColor"/><line x1="12" y1="26" x2="36" y2="26" stroke="currentColor" stroke-width="3"/><line x1="12" y1="34" x2="30" y2="34" stroke="currentColor" stroke-width="3"/>`,
    cena: `<rect x="3" y="8" width="42" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="14" cy="18" r="4" fill="currentColor"/><path d="M6,38 L18,24 L26,32 L32,26 L43,38Z" fill="currentColor"/>`,
    sinal: `<path d="M24,3 L45,42 L3,42Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><rect x="22" y="16" width="4" height="14" fill="currentColor"/><circle cx="24" cy="35" r="2.5" fill="currentColor"/>`,
    historia: `<rect x="2" y="12" width="13" height="22" rx="2" fill="currentColor"/><rect x="18" y="12" width="13" height="22" rx="2" fill="currentColor" opacity=".7"/><rect x="34" y="12" width="12" height="22" rx="2" fill="currentColor" opacity=".45"/>`,
    pessoas: `<circle cx="16" cy="14" r="7" fill="currentColor"/><rect x="8" y="23" width="16" height="20" rx="6" fill="currentColor"/><circle cx="33" cy="16" r="6" fill="currentColor" opacity=".7"/><rect x="26" y="24" width="14" height="18" rx="5" fill="currentColor" opacity=".7"/>`,
    fatoOpiniao: `<rect x="3" y="10" width="18" height="28" rx="3" fill="currentColor"/><path d="M8,24 L12,28 L18,18" stroke="#fff" stroke-width="3" fill="none"/><ellipse cx="35" cy="20" rx="11" ry="9" fill="currentColor" opacity=".6"/><circle cx="29" cy="34" r="3" fill="currentColor" opacity=".6"/><circle cx="26" cy="41" r="2" fill="currentColor" opacity=".6"/>`,
    descrever: `<path d="M4,24 Q24,6 44,24 Q24,42 4,24Z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="currentColor"/><path d="M34,36 q4,4 0,8 M38,32 q8,8 0,16" fill="none" stroke="currentColor" stroke-width="2.5"/>`,
    som: `<path d="M6,18 L14,18 L24,8 L24,40 L14,30 L6,30Z" fill="currentColor"/><path d="M30,16 Q35,24 30,32 M35,11 Q43,24 35,37" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>`,
    calmo: `<path d="M4,30 Q14,22 24,30 Q34,38 44,30" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M4,18 Q14,10 24,18 Q34,26 44,18" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
    ajustes: `<circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="5"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="21" y="2" width="6" height="9" rx="1" fill="currentColor" transform="rotate(${a} 24 24)"/>`).join("")}`,
    casa: `<path d="M4,24 L24,6 L44,24 L38,24 L38,42 L10,42 L10,24Z" fill="currentColor"/><rect x="20" y="30" width="8" height="12" fill="#fff"/>`
  };
  function picto(nome, rotulo) { return svg("0 0 48 48", PICTOS[nome] || PICTOS.estrela, rotulo, "picto"); }

  return { cena, icone, emoji, balao, picto, personagem, esc, svg };
})();
