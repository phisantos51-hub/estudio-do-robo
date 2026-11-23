/*
  ============================================================
  CONTEÚDO DO ESTÚDIO DO ROBÔ — arquivo para professores editarem
  ============================================================

  Aqui ficam TODOS os textos, perguntas, cenas e notícias fictícias do jogo.
  Você pode mudar os textos entre aspas "assim" à vontade.

  CUIDADOS AO EDITAR
  - Mantenha as aspas, as vírgulas e as chaves { } [ ] no lugar.
  - Depois de editar, abra o jogo e confira se a atividade aparece.
    Se a tela ficar em branco, provavelmente faltou uma vírgula ou aspas.
  - No 1º ano, escreva normalmente (com minúsculas): o jogo mostra tudo em
    LETRA DE IMPRENSA MAIÚSCULA sozinho, e a voz lê melhor assim.

  TIPOS DE ETAPA (cada atividade é uma lista de etapas)
  - "escolha":    uma pergunta com 2 a 4 opções. Marque a certa com  certa: true
  - "ordenar":    itens escritos JÁ NA ORDEM CERTA; o jogo embaralha sozinho.
                  Itens com o mesmo número em  ordem: 2  podem ficar em qualquer
                  ordem entre si.
  - "classificar": frases que a criança coloca em caixas (por exemplo FATO e OPINIÃO).
  - "montar":     peças de uma notícia que a criança encaixa no lugar certo.
  - "aviso":      passos para montar um aviso, cada passo com uma escolha.

  IMAGENS
  - Use  desenho: { cenario, personagens, objetos, enquadramento }  (veja a
    lista de nomes no começo do arquivo desenhos.js),
    ou  icone: "lixeira",  emoji: "feliz",  balao: "grito".
  - TODA imagem precisa de  descricao: "..."  — é o que a voz lê para
    estudantes cegos. Escreva frases curtas e claras.

  COMO ACRESCENTAR UMA PERGUNTA NOVA
  - Copie uma etapa inteira (de { até },), cole logo abaixo e troque os textos.
*/
"use strict";

/* ---------- Sentimentos (usados nos emojis e nas produções) ---------- */
// nome / nomeF: masculino e feminino. exemplo: aparece por escrito no Modo Calmo, junto do emoji.
const SENTIMENTOS = {
  feliz:    { nome: "Feliz",    nomeF: "Feliz",    exemplo: "Feliz: quando ganho um presente." },
  triste:   { nome: "Triste",   nomeF: "Triste",   exemplo: "Triste: quando meu brinquedo quebra." },
  bravo:    { nome: "Bravo",    nomeF: "Brava",    exemplo: "Bravo: quando pegam minhas coisas sem pedir." },
  medo:     { nome: "Com medo", nomeF: "Com medo", exemplo: "Com medo: quando escuto um barulho forte no escuro." },
  surpreso: { nome: "Surpreso", nomeF: "Surpresa", exemplo: "Surpreso: quando acontece algo que eu não esperava." },
  calmo:    { nome: "Calmo",    nomeF: "Calma",    exemplo: "Calmo: quando estou descansando." }
};

/* ---------- Nomes dos personagens ---------- */
const PERSONAGENS = {
  robo: "Robô", menina: "Lia", menino: "Téo", bia: "Bia", davi: "Davi",
  professora: "Professora", merendeira: "Merendeira", porteiro: "Porteiro",
  diretora: "Diretora", cachorro: "Cachorro", gato: "Gato"
};
const CENARIOS = {
  escola: "Escola", parque: "Parque", casa: "Casa", quadra: "Quadra",
  salaLeitura: "Sala de leitura", refeitorio: "Refeitório", portao: "Portão da escola", estudio: "Estúdio de rádio"
};

/* ---------- Mensagens do jogo ---------- */
const MENSAGENS = {
  acertos: ["Muito bem!", "Isso mesmo!", "Você acertou!", "Ótimo trabalho!"],
  acertoCalmo: "Resposta certa.",             // no Modo Calmo a mensagem é sempre a mesma
  erro: "Quase! Vamos tentar de novo.",
  erroCalmo: "Vamos tentar de novo.",
  ajudaVisivel: "A resposta certa está marcada com uma borda pontilhada.",
  fimAtividade: "Atividade concluída!",
  fimCalmo: "Atividade concluída.",
  privacidade: "Escreva só o seu primeiro nome ou apelido. Não escreva sobrenome, endereço ou telefone."
};

/* ---------- Partes da notícia (atividade "montar" do 3º ano) ---------- */
const PARTES_NOTICIA = {
  manchete: { nome: "Manchete", pergunta: "Qual peça é a manchete, o título da notícia?", dica: "A manchete é curta e conta o assunto." },
  quem:     { nome: "Quem",     pergunta: "Qual peça conta quem participou?", dica: "Procure pessoas ou turmas." },
  oque:     { nome: "O quê",    pergunta: "Qual peça conta o que aconteceu?", dica: "Procure o que as pessoas fizeram." },
  quando:   { nome: "Quando",   pergunta: "Qual peça conta quando aconteceu?", dica: "Procure um dia ou uma hora." },
  onde:     { nome: "Onde",     pergunta: "Qual peça conta onde aconteceu?", dica: "Procure um lugar." },
  como:     { nome: "Como",     pergunta: "Qual peça conta como aconteceu?", dica: "Procure o jeito que aconteceu." },
  porque:   { nome: "Por quê",  pergunta: "Qual peça conta por que aconteceu?", dica: "Procure o motivo. Muitas vezes começa com: para." }
};

/* ---------- Instruções em passos numerados (com pictogramas) ---------- */
const PASSOS = {
  escolha:     [{ picto: "olho", texto: "Olhe a pergunta." }, { picto: "clique", texto: "Clique na resposta." }, { picto: "estrela", texto: "Ganhe estrelas." }],
  ordenar:     [{ picto: "olho", texto: "Olhe todas as partes." }, { picto: "ordem", texto: "Escolha o que vem primeiro, depois o seguinte." }, { picto: "arrastar", texto: "Clique ou arraste para o espaço da vez." }],
  classificar: [{ picto: "olho", texto: "Leia a frase." }, { picto: "caixas", texto: "Escolha a caixa certa." }, { picto: "arrastar", texto: "Clique na caixa ou arraste a frase." }],
  montar:      [{ picto: "olho", texto: "Veja o espaço que está marcado." }, { picto: "pecas", texto: "Escolha a peça que combina." }, { picto: "arrastar", texto: "Clique ou arraste a peça." }],
  aviso:       [{ picto: "olho", texto: "Leia o que vai acontecer na escola." }, { picto: "clique", texto: "Escolha cada parte do aviso." }, { picto: "aviso", texto: "Veja o aviso pronto." }],
  producao:    [{ picto: "clique", texto: "Escolha cada parte." }, { picto: "lapis", texto: "Escreva seu primeiro nome ou apelido." }, { picto: "mural", texto: "Sua produção vai para o Mural." }]
};

/* ============================================================
   ESTÚDIOS — um para cada ano
   ============================================================ */
const ESTUDIOS = [
  /* ---------------------------------------------------------- */
  /*  1º ANO — ESTÚDIO DE IMAGEM                                 */
  /* ---------------------------------------------------------- */
  {
    ano: 1, id: "imagem", nome: "Estúdio de Imagem", tema: "Comunicar com imagens",
    cor: "azul", picto: "camera", maiusculas: true,
    boasVindas: "Bem-vindo ao Estúdio de Imagem! Aqui a gente conta coisas com imagens.",
    comoJogar: [
      { picto: "olho", texto: "Olhe as imagens com atenção." },
      { picto: "clique", texto: "Clique na imagem ou na resposta certa." },
      { picto: "lampada", texto: "Errou? Leia a dica e tente de novo." },
      { picto: "estrela", texto: "Cada atividade dá até 3 estrelas." },
      { picto: "mural", texto: "No fim, monte uma cena para o Mural." }
    ],
    atividades: [
      {
        id: "fotografo", nome: "Fotógrafo mirim", picto: "camera",
        intro: "O robô tirou várias fotos. Ajude a escolher a foto certa.",
        etapas: [
          {
            tipo: "escolha", prefixo: "Foto",
            pergunta: "Qual foto mostra o robô inteiro?",
            dica: "Procure a foto em que aparecem a cabeça e os pés do robô.",
            acerto: "Isso! Nessa foto o robô aparece inteiro, da cabeça aos pés.",
            opcoes: [
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "inteiro" }, descricao: "O robô aparece de corpo inteiro, da cabeça aos pés.", certa: true },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "rosto" }, descricao: "Só o rosto do robô, bem de perto." },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "cortado" }, descricao: "A cabeça do robô ficou de fora. Aparece só o corpo." }
            ]
          },
          {
            tipo: "escolha", prefixo: "Foto",
            pergunta: "Qual foto mostra só o rosto do robô?",
            dica: "Na foto do rosto, o robô está bem pertinho. Não dá para ver os pés.",
            acerto: "Muito bem! É uma foto de perto, só do rosto.",
            opcoes: [
              { desenho: { cenario: "escola", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "longe" }, descricao: "O robô aparece pequeno, de longe, na frente da escola." },
              { desenho: { cenario: "escola", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "rosto" }, descricao: "Só o rosto do robô, bem de perto.", certa: true },
              { desenho: { cenario: "escola", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "inteiro" }, descricao: "O robô inteiro, da cabeça aos pés." }
            ]
          },
          {
            tipo: "escolha", prefixo: "Foto",
            pergunta: "Qual foto mostra que o robô está feliz?",
            dica: "Olhe a boca do robô. Quem está feliz sorri.",
            acerto: "Isso! O robô está sorrindo. Ele está feliz.",
            opcoes: [
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "triste" }], enquadramento: "rosto" }, descricao: "O rosto do robô com a boca virada para baixo e uma lágrima. Ele está triste." },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "rosto" }, descricao: "O rosto do robô com um sorriso grande. Ele está feliz.", certa: true },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "bravo" }], enquadramento: "rosto" }, descricao: "O rosto do robô com as sobrancelhas para baixo. Ele está bravo." }
            ]
          },
          {
            tipo: "escolha", prefixo: "Foto",
            pergunta: "Qual foto foi tirada de longe?",
            dica: "Na foto de longe, o robô fica pequeno e aparece muita coisa em volta.",
            acerto: "Muito bem! De longe, o robô fica pequeno e vemos o lugar todo.",
            opcoes: [
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "calmo" }], enquadramento: "meio" }, descricao: "O robô de perto, da cintura para cima." },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "calmo" }], enquadramento: "longe" }, descricao: "O robô pequeno, de longe, com árvores e o parque todo em volta.", certa: true }
            ]
          },
          {
            tipo: "escolha", prefixo: "Foto",
            pergunta: "Qual foto ficou cortada?",
            dica: "Na foto cortada, falta um pedaço do robô.",
            acerto: "Isso! A cabeça do robô ficou fora da foto. Ela ficou cortada.",
            opcoes: [
              { desenho: { cenario: "casa", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "inteiro" }, descricao: "O robô inteiro, dentro de casa." },
              { desenho: { cenario: "casa", personagens: [{ quem: "robo", sentimento: "feliz" }], enquadramento: "cortado" }, descricao: "A cabeça do robô ficou de fora da foto.", certa: true }
            ]
          },
          {
            tipo: "escolha", prefixo: "Foto",
            pergunta: "O robô quer uma foto com a amiga Lia. Qual foto mostra os dois inteiros?",
            dica: "Procure a foto em que aparecem o robô e a Lia, da cabeça aos pés.",
            acerto: "Muito bem! O robô e a Lia aparecem inteiros.",
            opcoes: [
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }, { quem: "menina", sentimento: "feliz" }], visao: [-110, 0, 400, 300] }, descricao: "O robô inteiro. A Lia ficou cortada no canto da foto." },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }, { quem: "menina", sentimento: "feliz" }], enquadramento: "inteiro" }, descricao: "O robô e a Lia, os dois inteiros, lado a lado.", certa: true },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }, { quem: "menina", sentimento: "feliz" }], enquadramento: "rosto" }, descricao: "Só o rosto do robô. A Lia não aparece." }
            ]
          }
        ]
      },
      {
        id: "sinais", nome: "Ícones e sinais", picto: "sinal",
        intro: "Placas e ícones dão recados sem muitas palavras. Vamos descobrir o que eles querem dizer.",
        etapas: [
          {
            tipo: "escolha", pergunta: "O que esta placa quer dizer?",
            mostrar: { icone: "silencio", descricao: "Placa azul com um rosto amarelo. O rosto tem o dedo na frente da boca." },
            dica: "O dedo na frente da boca pede para ficar quieto.",
            acerto: "Isso! A placa pede silêncio.",
            opcoes: [{ texto: "Faça silêncio.", certa: true }, { texto: "Pode gritar." }, { texto: "Hora de comer." }]
          },
          {
            tipo: "escolha", pergunta: "Onde a placa de silêncio aparece?",
            mostrar: { icone: "silencio", descricao: "A placa de silêncio: um rosto com o dedo na frente da boca." },
            dica: "Silêncio ajuda quem está lendo.",
            acerto: "Muito bem! Na sala de leitura, o silêncio ajuda a ler.",
            opcoes: [
              { texto: "Na sala de leitura.", desenho: { cenario: "salaLeitura" }, descricao: "Na sala de leitura, com estantes cheias de livros.", certa: true },
              { texto: "Na quadra.", desenho: { cenario: "quadra", objetos: [{ obj: "bola", x: 200 }] }, descricao: "Na quadra, onde jogamos bola." }
            ]
          },
          {
            tipo: "escolha", pergunta: "O que este ícone quer dizer?",
            mostrar: { icone: "lixeira", descricao: "Ícone verde com o desenho de uma lixeira." },
            dica: "É o desenho de uma lixeira.",
            acerto: "Isso! O ícone mostra onde jogar o lixo.",
            opcoes: [{ texto: "Jogue o lixo aqui.", certa: true }, { texto: "Lave as mãos aqui." }, { texto: "Aqui é o banheiro." }]
          },
          {
            tipo: "escolha", pergunta: "O que esta placa quer dizer?",
            mostrar: { icone: "banheiro", descricao: "Placa azul com o desenho de um homem e de uma mulher, separados por uma linha." },
            dica: "Essa placa fica na porta de um lugar que todo mundo usa.",
            acerto: "Muito bem! É a placa do banheiro.",
            opcoes: [{ texto: "Sala de aula." }, { texto: "Banheiro.", certa: true }, { texto: "Parquinho." }]
          },
          {
            tipo: "escolha", pergunta: "O que esta placa quer dizer?",
            mostrar: { icone: "proibidoCorrer", descricao: "Placa com uma pessoa correndo, dentro de um círculo vermelho com um risco no meio." },
            dica: "O círculo vermelho com um risco quer dizer: não pode.",
            acerto: "Isso! O risco vermelho quer dizer que não pode correr.",
            opcoes: [{ texto: "Corra bem rápido." }, { texto: "Não pode correr aqui.", certa: true }, { texto: "Aqui é a pista de corrida." }]
          },
          {
            tipo: "escolha", pergunta: "Onde a placa de não correr aparece?",
            mostrar: { icone: "proibidoCorrer", descricao: "A placa de não correr: uma pessoa correndo com um risco vermelho." },
            dica: "Correr é perigoso onde passam muitas pessoas, como no corredor.",
            acerto: "Muito bem! No corredor, correr pode machucar alguém.",
            opcoes: [
              { texto: "Na quadra.", desenho: { cenario: "quadra" }, descricao: "Na quadra de esportes." },
              { texto: "No corredor da escola.", desenho: { cenario: "escola" }, descricao: "Na escola, perto da porta e do corredor.", certa: true }
            ]
          },
          {
            tipo: "escolha", pergunta: "O que esta placa quer dizer?",
            mostrar: { icone: "lavarMaos", descricao: "Placa com uma torneira pingando água em cima de duas mãos." },
            dica: "Olhe a torneira e as mãos.",
            acerto: "Isso! A placa pede para lavar as mãos.",
            opcoes: [{ texto: "Lave as mãos.", certa: true }, { texto: "Não pode beber água." }, { texto: "Desligue a luz." }]
          },
          {
            tipo: "escolha", pergunta: "A Lia ganhou um presente. Como ela se sente?",
            mostrar: { desenho: { cenario: "casa", personagens: [{ quem: "menina", sentimento: "feliz" }], objetos: [{ obj: "presente", x: 270 }] }, descricao: "A Lia em casa, sorrindo, ao lado de um presente." },
            dica: "Olhe o rosto da Lia. Ela está sorrindo.",
            acerto: "Isso! A Lia está feliz.",
            opcoes: [{ emoji: "feliz", certa: true }, { emoji: "triste" }, { emoji: "bravo" }]
          },
          {
            tipo: "escolha", pergunta: "O sorvete do robô caiu no chão. Como ele se sente?",
            mostrar: { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "triste" }], objetos: [{ obj: "sorveteChao", x: 270, frente: true }] }, descricao: "O robô no parque, com uma lágrima. O sorvete dele está no chão." },
            dica: "Olhe a lágrima no rosto do robô.",
            acerto: "Muito bem! O robô está triste.",
            opcoes: [{ emoji: "surpreso" }, { emoji: "feliz" }, { emoji: "triste", certa: true }]
          },
          {
            tipo: "escolha", pergunta: "O Téo escutou um barulho forte no escuro. Como ele se sente?",
            mostrar: { desenho: { cenario: "casa", personagens: [{ quem: "menino", sentimento: "medo" }], objetos: [] }, descricao: "O Téo com os olhos bem abertos e a boca tremendo." },
            dica: "Barulho forte no escuro pode assustar.",
            acerto: "Isso! O Téo está com medo.",
            opcoes: [{ emoji: "calmo" }, { emoji: "medo", certa: true }, { emoji: "feliz" }]
          },
          {
            tipo: "escolha", pergunta: "Pegaram o brinquedo da Bia sem pedir. Como ela se sente?",
            mostrar: { desenho: { cenario: "escola", personagens: [{ quem: "bia", sentimento: "bravo" }] }, descricao: "A Bia com as sobrancelhas para baixo e a boca fechada." },
            dica: "Olhe as sobrancelhas da Bia.",
            acerto: "Muito bem! A Bia está brava.",
            opcoes: [{ emoji: "bravo", certa: true }, { emoji: "calmo" }, { emoji: "surpreso" }]
          }
        ]
      },
      {
        id: "historia", nome: "História sem palavras", picto: "historia",
        intro: "Imagens também contam histórias. Coloque as imagens na ordem: começo, meio e fim.",
        etapas: [
          {
            tipo: "ordenar", prefixo: "Imagem",
            pergunta: "A história da plantinha. Coloque em ordem.",
            dica: "Primeiro a gente planta. Depois a gente rega. A flor aparece no fim.",
            acerto: "Muito bem! A Lia plantou, regou, a planta cresceu e deu flor.",
            itens: [
              { desenho: { cenario: "parque", personagens: [{ quem: "menina", sentimento: "calmo", x: 140 }], objetos: [{ obj: "vaso", x: 260, frente: true }] }, descricao: "A Lia ao lado de um vaso só com terra e uma semente." },
              { desenho: { cenario: "parque", personagens: [{ quem: "menina", sentimento: "feliz", x: 140 }], objetos: [{ obj: "vaso", x: 260, frente: true }, { obj: "regador", x: 200, y: 190, frente: true }] }, descricao: "A Lia regando o vaso com um regador." },
              { desenho: { cenario: "parque", personagens: [{ quem: "menina", sentimento: "surpreso", x: 140 }], objetos: [{ obj: "broto", x: 260, frente: true }] }, descricao: "Nasceu um brotinho verde no vaso. A Lia está surpresa." },
              { desenho: { cenario: "parque", personagens: [{ quem: "menina", sentimento: "feliz", x: 140 }], objetos: [{ obj: "planta", x: 260, frente: true }] }, descricao: "A planta cresceu e tem uma flor vermelha. A Lia está feliz." }
            ]
          },
          {
            tipo: "ordenar", prefixo: "Imagem",
            pergunta: "A história do sorvete. Coloque em ordem.",
            dica: "No começo o robô tem o sorvete. Depois o sorvete cai. No fim, o amigo ajuda.",
            acerto: "Isso! O sorvete caiu, o robô ficou triste e o Téo dividiu o sorvete com ele.",
            itens: [
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }], objetos: [{ obj: "sorvete", x: 244, y: 196, frente: true }] }, descricao: "O robô feliz, segurando um sorvete." },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "triste" }], objetos: [{ obj: "sorveteChao", x: 270, frente: true }] }, descricao: "O sorvete caiu no chão. O robô está triste." },
              { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }, { quem: "menino", sentimento: "feliz" }], objetos: [{ obj: "sorvete", x: 297, y: 196, frente: true }] }, descricao: "O Téo chega e oferece sorvete ao robô. Os dois estão felizes." }
            ]
          },
          {
            tipo: "ordenar", prefixo: "Imagem",
            pergunta: "A história da chuva. Coloque em ordem.",
            dica: "Primeiro tem sol. Depois vem a chuva. O arco-íris aparece depois da chuva.",
            acerto: "Muito bem! Tinha sol, choveu e depois apareceu o arco-íris.",
            itens: [
              { desenho: { cenario: "ceu", personagens: [{ quem: "davi", sentimento: "feliz" }], objetos: [{ obj: "sol", x: 70, y: 60 }, { obj: "bola", x: 270, frente: true }] }, descricao: "Dia de sol. O Davi brinca com uma bola." },
              { desenho: { cenario: "ceu", personagens: [{ quem: "davi", sentimento: "surpreso" }], objetos: [{ obj: "nuvem", x: 100, y: 50 }, { obj: "nuvem", x: 300, y: 40 }, { obj: "chuva" }, { obj: "guardaChuva", x: 225, y: 160, frente: true }] }, descricao: "Começa a chover. O Davi abre um guarda-chuva." },
              { desenho: { cenario: "ceu", personagens: [{ quem: "davi", sentimento: "feliz" }], objetos: [{ obj: "arcoiris", x: 200, y: 200 }, { obj: "sol", x: 340, y: 50 }] }, descricao: "A chuva parou. Apareceu um arco-íris no céu. O Davi está feliz." }
            ]
          }
        ]
      },
      {
        id: "cena", nome: "Minha cena", picto: "cena", producao: "cena",
        intro: "Agora é a sua vez! Monte uma cena para o Mural da Emissora."
      }
    ],
    // Atividade extra que só aparece no Modo Áudio.
    extraAudio: {
      id: "descreva", nome: "Descreva para mim", picto: "descrever",
      intro: "Pessoas cegas conhecem as imagens pelas descrições. Uma boa descrição conta quem aparece, o que está fazendo, como está e onde está. Isso se chama audiodescrição. Vamos escolher as melhores descrições.",
      etapas: [
        {
          tipo: "escolha", pergunta: "Qual descrição ajuda mais a imaginar esta imagem?",
          mostrar: { desenho: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "feliz" }], objetos: [{ obj: "sorvete", x: 244, y: 196, frente: true }] }, descricao: "Uma imagem do parque." },
          dica: "A boa descrição conta quem aparece, o que faz e onde está.",
          acerto: "Isso! Essa descrição conta quem, o que faz, como está e onde está.",
          opcoes: [
            { texto: "Uma imagem bonita." },
            { texto: "Um robô azul, sorrindo, segura um sorvete no parque.", certa: true }
          ]
        },
        {
          tipo: "escolha", pergunta: "Qual descrição é melhor para a placa da sala de leitura?",
          mostrar: { icone: "silencio", descricao: "Uma placa." },
          dica: "A melhor descrição fala o desenho e o recado da placa.",
          acerto: "Muito bem! Contar o desenho e o recado ajuda muito.",
          opcoes: [
            { texto: "Placa azul com um rosto que põe o dedo na frente da boca. Ela pede silêncio.", certa: true },
            { texto: "Tem uma placa aí." }
          ]
        },
        {
          tipo: "escolha", pergunta: "Qual descrição conta como a pessoa se sente?",
          mostrar: { desenho: { cenario: "escola", personagens: [{ quem: "menino", sentimento: "triste" }] }, descricao: "Um menino na escola." },
          dica: "Sentimentos também fazem parte da descrição.",
          acerto: "Isso! Contar que o Téo está triste ajuda a entender a cena.",
          opcoes: [
            { texto: "Um menino." },
            { texto: "O Téo está na frente da escola. Ele está triste e tem uma lágrima no rosto.", certa: true }
          ]
        },
        {
          tipo: "escolha", pergunta: "Qual é a melhor dica para descrever uma imagem?",
          dica: "Pense no que uma pessoa que não enxerga precisa saber.",
          acerto: "Muito bem! Você já sabe fazer audiodescrição!",
          opcoes: [
            { texto: "Falar só a cor da imagem." },
            { texto: "Falar quem aparece, o que está fazendo, como está e onde está.", certa: true },
            { texto: "Dizer só: olhe aqui." }
          ]
        }
      ]
    }
  },
  /* ---------------------------------------------------------- */
  /*  2º ANO — ESTÚDIO DE RÁDIO E FOTONOVELA                     */
  /* ---------------------------------------------------------- */
  {
    ano: 2, id: "radio", nome: "Estúdio de Rádio e Fotonovela", tema: "Contar o que acontece",
    cor: "laranja", picto: "microfone", maiusculas: false,
    boasVindas: "Bem-vindo ao Estúdio de Rádio e Fotonovela! Aqui a gente conta o que acontece na escola.",
    comoJogar: [
      { picto: "olho", texto: "Leia a pergunta e olhe as imagens." },
      { picto: "clique", texto: "Clique na resposta certa." },
      { picto: "ordem", texto: "Para pôr em ordem, escolha o que vem primeiro, depois o seguinte." },
      { picto: "lampada", texto: "Errou? Leia a dica e tente de novo." },
      { picto: "mural", texto: "No fim, crie uma fotonovela para o Mural." }
    ],
    atividades: [
      {
        id: "baloes", nome: "Balões da fotonovela", picto: "balao",
        intro: "Na fotonovela, os balões mostram o que os personagens falam ou pensam. Cada balão tem um jeito.",
        etapas: [
          {
            tipo: "escolha", prefixo: "Balão",
            pergunta: "A Bia está pensando no lanche, sem falar nada. Qual balão ela usa?",
            mostrar: { desenho: { cenario: "refeitorio", personagens: [{ quem: "bia", sentimento: "calmo" }] }, descricao: "A Bia no refeitório, de olhos fechados, imaginando o lanche." },
            dica: "Quando a pessoa só pensa, o balão parece uma nuvem com bolinhas.",
            acerto: "Isso! O balão de pensamento mostra o que a pessoa pensa.",
            opcoes: [{ balao: "fala", descricao: "Balão de fala: redondo, com uma pontinha." }, { balao: "pensamento", descricao: "Balão de pensamento: parece uma nuvem, com bolinhas.", certa: true }, { balao: "grito", descricao: "Balão de grito: cheio de pontas." }, { balao: "cochicho", descricao: "Balão de cochicho: com a borda tracejada." }]
          },
          {
            tipo: "escolha", prefixo: "Balão",
            pergunta: "O Davi viu o gol do time e gritou bem alto. Qual balão ele usa?",
            mostrar: { desenho: { cenario: "quadra", personagens: [{ quem: "davi", sentimento: "surpreso" }], objetos: [{ obj: "bola", x: 300, frente: true }] }, descricao: "O Davi na quadra, com a boca bem aberta, ao lado da bola." },
            dica: "Grito é falar muito alto. O balão tem muitas pontas.",
            acerto: "Muito bem! O balão de grito tem pontas.",
            opcoes: [{ balao: "fala", descricao: "Balão de fala: redondo, com uma pontinha." }, { balao: "pensamento", descricao: "Balão de pensamento: parece uma nuvem, com bolinhas." }, { balao: "grito", descricao: "Balão de grito: cheio de pontas.", certa: true }, { balao: "cochicho", descricao: "Balão de cochicho: com a borda tracejada." }]
          },
          {
            tipo: "escolha", prefixo: "Balão",
            pergunta: "O Robô conta um segredo bem baixinho para a Lia. Qual balão ele usa?",
            mostrar: { desenho: { cenario: "escola", personagens: [{ quem: "robo", sentimento: "calmo" }, { quem: "menina", sentimento: "surpreso" }] }, descricao: "O Robô perto da Lia, falando baixinho." },
            dica: "Cochicho é falar bem baixinho. O balão tem a borda tracejada, feita de risquinhos.",
            acerto: "Isso! O balão de cochicho tem a borda tracejada.",
            opcoes: [{ balao: "fala", descricao: "Balão de fala: redondo, com uma pontinha." }, { balao: "pensamento", descricao: "Balão de pensamento: parece uma nuvem, com bolinhas." }, { balao: "grito", descricao: "Balão de grito: cheio de pontas." }, { balao: "cochicho", descricao: "Balão de cochicho: com a borda tracejada.", certa: true }]
          },
          {
            tipo: "escolha", prefixo: "Balão",
            pergunta: "A professora diz bom dia para a turma, com voz normal. Qual balão ela usa?",
            mostrar: { desenho: { cenario: "escola", personagens: [{ quem: "professora", sentimento: "feliz" }] }, descricao: "A professora sorrindo na frente da escola." },
            dica: "Para falar normalmente, usamos o balão redondo com uma pontinha.",
            acerto: "Muito bem! O balão de fala é o mais usado.",
            opcoes: [{ balao: "fala", descricao: "Balão de fala: redondo, com uma pontinha.", certa: true }, { balao: "pensamento", descricao: "Balão de pensamento: parece uma nuvem, com bolinhas." }, { balao: "grito", descricao: "Balão de grito: cheio de pontas." }, { balao: "cochicho", descricao: "Balão de cochicho: com a borda tracejada." }]
          },
          {
            tipo: "escolha", pergunta: "Qual fala combina com este quadro?",
            mostrar: { quadro: { cenario: "parque", personagens: [{ quem: "robo", sentimento: "triste" }], objetos: [{ obj: "sorveteChao", x: 270, frente: true }], balao: { tipo: "fala", fala: "?" } }, descricao: "Quadro de fotonovela: o Robô está triste e o sorvete dele caiu no chão. O balão de fala está vazio." },
            dica: "Olhe o rosto do Robô e o sorvete no chão.",
            acerto: "Isso! O Robô está triste porque o sorvete caiu.",
            opcoes: [{ texto: "Oba! Que dia lindo!" }, { texto: "Ah, não! Meu sorvete caiu!", certa: true }, { texto: "Vamos jogar bola?" }]
          },
          {
            tipo: "escolha", pergunta: "Qual fala combina com este quadro?",
            mostrar: { quadro: { cenario: "casa", personagens: [{ quem: "davi", sentimento: "medo" }], balao: { tipo: "grito", fala: "?" } }, descricao: "Quadro de fotonovela: o Davi está com medo, em casa. O balão de grito está vazio." },
            dica: "O Davi está com medo e o balão é de grito.",
            acerto: "Muito bem! Quem leva um susto pode gritar.",
            opcoes: [{ texto: "Bom dia, turma!" }, { texto: "Estou com sono." }, { texto: "Socorro! Uma aranha!", certa: true }]
          },
          {
            tipo: "escolha", pergunta: "Qual fala combina com este quadro?",
            mostrar: { quadro: { cenario: "refeitorio", personagens: [{ quem: "menino", sentimento: "calmo" }], balao: { tipo: "pensamento", fala: "?" } }, descricao: "Quadro de fotonovela: o Téo no refeitório, de olhos fechados. O balão de pensamento está vazio." },
            dica: "O Téo está no refeitório e está pensando.",
            acerto: "Isso! No refeitório, ele pensa no lanche.",
            opcoes: [{ texto: "Hum... qual será o lanche de hoje?", certa: true }, { texto: "Gol!" }, { texto: "Silêncio na sala de leitura." }]
          }
        ]
      },
      {
        id: "entrevista", nome: "Entrevistador", picto: "microfone",
        intro: "Você vai preparar uma entrevista com alguém que trabalha na escola. Uma boa entrevista ajuda a conhecer o trabalho da pessoa.",
        perguntaPessoa: "Quem você quer entrevistar?",
        abertura: "Bom dia! Qual é o seu nome?",
        fechamento: "Obrigado pela entrevista!",
        dicaClassificar: "Uma pergunta boa ajuda a conhecer o trabalho da pessoa na escola.",
        dicaOrdenar: "A entrevista começa com o cumprimento: Bom dia! E termina com o agradecimento.",
        categorias: [
          { id: "boa", nome: "Pergunta boa", descricao: "Ajuda a conhecer o trabalho.", picto: "certo" },
          { id: "ruim", nome: "Não combina", descricao: "Não ajuda a conhecer o trabalho.", picto: "xis" }
        ],
        // Para acrescentar uma pessoa, copie um bloco { ... } e troque os textos.
        pessoas: [
          {
            nome: "a merendeira", quem: "merendeira", cenario: "refeitorio", descricao: "A merendeira, de touca e avental branco, no refeitório.",
            boas: ["O que você faz na cozinha da escola?", "Qual comida as crianças mais gostam?", "Do que você mais gosta no seu trabalho?"],
            ruins: ["Qual é a cor do meu tênis?", "Você sabe voar?", "Quantos dinossauros cabem na cozinha?"]
          },
          {
            nome: "o porteiro", quem: "porteiro", cenario: "portao", descricao: "O porteiro, de boné azul, no portão da escola.",
            boas: ["Como você cuida da entrada da escola?", "A que horas o portão abre?", "Do que você mais gosta no seu trabalho?"],
            ruins: ["A lua é feita de queijo?", "Qual é o nome do meu gato?", "Você prefere sorvete de pedra ou de nuvem?"]
          },
          {
            nome: "a diretora", quem: "diretora", cenario: "escola", descricao: "A diretora, de blusa roxa e crachá, na frente da escola.",
            boas: ["O que a diretora faz na escola?", "Como você ajuda os professores e os alunos?", "Que projeto novo a escola vai ter este ano?"],
            ruins: ["Quantos anos tem o meu primo?", "Você já foi à Lua de bicicleta?", "Qual é a cor do meu caderno?"]
          },
          {
            nome: "a professora da sala de leitura", quem: "professora", cenario: "salaLeitura", descricao: "A professora da sala de leitura, de óculos, segurando um livro.",
            boas: ["Como você escolhe os livros da sala de leitura?", "Qual livro você indica para a nossa turma?", "Como podemos cuidar bem dos livros?"],
            ruins: ["Os livros sabem dançar?", "Você come livros no almoço?", "Qual é o número do meu sapato?"]
          }
        ]
      },
      {
        id: "aviso", nome: "Aviso para o mural", picto: "aviso",
        intro: "Um aviso conta uma informação importante para todo mundo. Ele precisa dizer o quê, quando e onde.",
        etapas: [
          {
            tipo: "aviso", pergunta: "Monte o aviso da festa junina.",
            situacao: "A escola vai fazer uma festa junina no sábado, dia 20 de junho, às 10 horas, na quadra.",
            acerto: "O aviso está pronto! Ele conta o quê, quando e onde.",
            passos: [
              { campo: "titulo", nome: "Título", pergunta: "Escolha o título do aviso.", dica: "O título conta logo o assunto do aviso.",
                opcoes: [{ texto: "Festa junina da escola!", certa: true }, { texto: "Meu cachorro é muito fofo" }, { texto: "Aviso de nada" }] },
              { campo: "imagem", nome: "Imagem", pergunta: "Escolha a imagem do aviso.", prefixo: "Imagem", dica: "A imagem precisa combinar com a festa junina.",
                opcoes: [
                  { desenho: { cenario: "quadra", objetos: [{ obj: "bandeirinhas" }, { obj: "fogueira", x: 200 }] }, descricao: "Bandeirinhas coloridas e uma fogueira na quadra.", certa: true },
                  { desenho: { cenario: "ceu", objetos: [{ obj: "chuva" }, { obj: "guardaChuva", x: 200 }] }, descricao: "Um guarda-chuva na chuva." },
                  { desenho: { cenario: "salaLeitura", objetos: [{ obj: "livros", x: 200 }] }, descricao: "Uma pilha de livros na sala de leitura." }
                ] },
              { campo: "oque", nome: "O quê", pergunta: "O que vai acontecer?", dica: "Leia de novo o que a escola vai fazer.",
                opcoes: [{ texto: "Festa junina com comidas e dança.", certa: true }, { texto: "Aula de natação." }, { texto: "Passeio no zoológico." }] },
              { campo: "quando", nome: "Quando", pergunta: "Quando vai acontecer?", dica: "Procure o dia e a hora no texto.",
                opcoes: [{ texto: "Segunda-feira, de noite." }, { texto: "Sábado, 20 de junho, às 10 horas.", certa: true }, { texto: "Ontem." }] },
              { campo: "onde", nome: "Onde", pergunta: "Onde vai acontecer?", dica: "Procure o lugar no texto.",
                opcoes: [{ texto: "No refeitório." }, { texto: "Na praia." }, { texto: "Na quadra da escola.", certa: true }] }
            ]
          },
          {
            tipo: "aviso", pergunta: "Monte o aviso da troca de livros.",
            situacao: "Na sexta-feira, dia 5 de maio, às 14 horas, vai ter troca de livros na sala de leitura. Cada criança traz um livro e leva outro.",
            acerto: "Muito bem! Agora todos sabem o quê, quando e onde.",
            passos: [
              { campo: "titulo", nome: "Título", pergunta: "Escolha o título do aviso.", dica: "O título conta logo o assunto do aviso.",
                opcoes: [{ texto: "Hoje tem bolo" }, { texto: "Troca de livros!", certa: true }, { texto: "Cuidado com o cachorro" }] },
              { campo: "imagem", nome: "Imagem", pergunta: "Escolha a imagem do aviso.", prefixo: "Imagem", dica: "A imagem precisa combinar com livros.",
                opcoes: [
                  { desenho: { cenario: "quadra", objetos: [{ obj: "bola", x: 200 }] }, descricao: "Uma bola na quadra." },
                  { desenho: { cenario: "salaLeitura", objetos: [{ obj: "livros", x: 200 }] }, descricao: "Uma pilha de livros coloridos na sala de leitura.", certa: true }
                ] },
              { campo: "oque", nome: "O quê", pergunta: "O que vai acontecer?", dica: "Leia de novo: o que cada criança traz?",
                opcoes: [{ texto: "Campeonato de futebol." }, { texto: "Troca de livros: traga um e leve outro.", certa: true }] },
              { campo: "quando", nome: "Quando", pergunta: "Quando vai acontecer?", dica: "Procure o dia e a hora no texto.",
                opcoes: [{ texto: "Sexta-feira, 5 de maio, às 14 horas.", certa: true }, { texto: "Domingo de manhã." }, { texto: "No Natal." }] },
              { campo: "onde", nome: "Onde", pergunta: "Onde vai acontecer?", dica: "Procure o lugar no texto.",
                opcoes: [{ texto: "No parque." }, { texto: "Na sala de leitura.", certa: true }, { texto: "No portão." }] }
            ]
          }
        ]
      },
      {
        id: "roteiroRadio", nome: "Roteiro de rádio", picto: "radio",
        intro: "Um programa de rádio tem partes, uma depois da outra. Vamos organizar o programa da Rádio do Robô.",
        etapas: [
          {
            tipo: "ordenar", prefixo: "Parte",
            pergunta: "Coloque o programa de rádio em ordem.",
            dica: "O programa começa com a vinheta e termina com a despedida.",
            acerto: "O programa está em ordem. Agora ele pode começar!",
            itens: [
              { texto: "Vinheta", descricao: "Uma música curtinha com o nome da rádio: Rádio do Robô!" },
              { texto: "Apresentação", descricao: "Bom dia! Eu sou a Bia e este é o programa da nossa escola." },
              { texto: "Notícia", descricao: "Hoje a turma do 2º ano plantou flores na horta." },
              { texto: "Música", descricao: "Agora, uma música para alegrar o recreio." },
              { texto: "Despedida", descricao: "O programa terminou. Tchau e até amanhã!" }
            ]
          },
          {
            tipo: "escolha", pergunta: "Para que serve a vinheta?",
            dica: "A vinheta toca bem no começo do programa.",
            acerto: "Isso! A vinheta avisa que o programa vai começar e diz o nome da rádio.",
            opcoes: [{ texto: "Para avisar que o programa vai começar e dizer o nome da rádio.", certa: true }, { texto: "Para dar a notícia do dia." }, { texto: "Para dizer tchau." }]
          },
          {
            tipo: "escolha", pergunta: "Na rádio, as pessoas só escutam. Como contar que o sol está forte?",
            dica: "Quem escuta o rádio não vê nada. As palavras precisam explicar tudo.",
            acerto: "Muito bem! No rádio, as palavras precisam explicar tudo.",
            opcoes: [{ texto: "Olhem só esse sol!" }, { texto: "Hoje o sol está muito forte. Usem boné e bebam água.", certa: true }, { texto: "Vejam a foto." }]
          }
        ]
      },
      {
        id: "fotonovela", nome: "Minha fotonovela", picto: "balao", producao: "fotonovela",
        intro: "Agora é a sua vez! Crie uma fotonovela de 4 quadros para o Mural da Emissora."
      }
    ]
  },
  /* ---------------------------------------------------------- */
  /*  3º ANO — REDAÇÃO DO JORNAL                                 */
  /* ---------------------------------------------------------- */
  {
    ano: 3, id: "jornal", nome: "Redação do Jornal", tema: "Produzir notícia",
    cor: "verde", picto: "jornal", maiusculas: false,
    boasVindas: "Bem-vindo à Redação do Jornal! Aqui a gente escreve notícias e aprende a desconfiar de notícias falsas.",
    comoJogar: [
      { picto: "olho", texto: "Leia a pergunta com atenção." },
      { picto: "pecas", texto: "Para montar a notícia, escolha a peça que responde à pergunta marcada." },
      { picto: "lupa", texto: "Procure os sinais de notícia falsa." },
      { picto: "lampada", texto: "Errou? Leia a dica e tente de novo." },
      { picto: "jornal", texto: "No fim, escreva uma notícia para o Jornal do Robô." }
    ],
    atividades: [
      {
        id: "partes", nome: "Partes da notícia", picto: "pecas",
        intro: "Toda notícia responde a perguntas: quem, o quê, quando e onde. As mais completas também contam como e por quê.",
        etapas: [
          {
            tipo: "montar", pergunta: "Monte a notícia das árvores.",
            dica: "Leia a pergunta marcada e procure a peça que responde a ela.",
            acerto: "A notícia está completa!",
            // Partes possíveis: manchete, quem, oque, quando, onde, como, porque
            partes: [
              { id: "manchete", texto: "Escola planta 10 árvores no pátio" },
              { id: "quem", texto: "Os alunos do 3º ano e a professora Rita" },
              { id: "oque", texto: "plantaram 10 árvores" },
              { id: "quando", texto: "Na quinta-feira de manhã" },
              { id: "onde", texto: "No pátio da escola" }
            ]
          },
          {
            tipo: "montar", pergunta: "Monte a notícia da horta.",
            dica: "Leia a pergunta marcada e procure a peça que responde a ela.",
            acerto: "Muito bem! Mais uma notícia completa.",
            partes: [
              { id: "manchete", texto: "Horta da escola dá as primeiras alfaces" },
              { id: "quem", texto: "A merendeira e os alunos do 2º ano" },
              { id: "oque", texto: "colheram 20 alfaces" },
              { id: "quando", texto: "Na segunda-feira" },
              { id: "onde", texto: "Na horta, atrás da quadra" }
            ]
          },
          {
            tipo: "montar", pergunta: "Desafio: monte uma notícia com como e por quê.",
            dica: "Como conta o jeito que aconteceu. Por quê conta o motivo.",
            acerto: "Você montou uma notícia completa, com como e por quê!",
            partes: [
              { id: "manchete", texto: "Campeonato de futebol ajuda a sala de leitura" },
              { id: "quem", texto: "As turmas do 3º ano" },
              { id: "oque", texto: "fizeram um campeonato de futebol" },
              { id: "quando", texto: "No sábado à tarde" },
              { id: "onde", texto: "Na quadra da escola" },
              { id: "como", texto: "Cada pessoa da torcida trouxe um livro para entrar" },
              { id: "porque", texto: "Para ter mais livros na sala de leitura" }
            ]
          }
        ]
      },
      {
        id: "fatoOpiniao", nome: "Fato ou opinião", picto: "fatoOpiniao",
        intro: "Fato é o que aconteceu e dá para conferir. Opinião é o que alguém pensa ou sente.",
        etapas: [
          {
            tipo: "classificar", nomeItem: "Frase",
            pergunta: "Esta frase é um fato ou uma opinião?",
            dica: "Pergunte: dá para conferir? Se dá, é fato. Se é o que alguém acha, é opinião.",
            acerto: "Você separou os fatos das opiniões.",
            categorias: [
              { id: "fato", nome: "Fato", descricao: "Conta o que aconteceu. Dá para conferir.", picto: "certo" },
              { id: "opiniao", nome: "Opinião", descricao: "Mostra o que alguém pensa ou sente.", picto: "balao" }
            ],
            itens: [
              { texto: "A escola plantou 10 árvores.", cat: "fato" },
              { texto: "As árvores ficaram lindas.", cat: "opiniao" },
              { texto: "O recreio começa às 10 horas.", cat: "fato" },
              { texto: "O recreio é a melhor hora do dia.", cat: "opiniao" },
              { texto: "A sala de leitura tem 300 livros.", cat: "fato" },
              { texto: "Os livros de aventura são os mais legais.", cat: "opiniao" },
              { texto: "Choveu na segunda-feira.", cat: "fato" },
              { texto: "Dia de chuva é chato.", cat: "opiniao" }
            ]
          }
        ]
      },
      {
        id: "detetive", nome: "Detetive de notícias", picto: "lupa",
        intro: "Algumas notícias são falsas ou exageradas. Outras são propaganda disfarçada. Vamos procurar os sinais. Na dúvida, pergunte a um adulto e não compartilhe.",
        etapas: [
          {
            tipo: "escolha", pergunta: "Esta notícia parece confiável?",
            mostrar: { noticia: { manchete: "URGENTE!!! A ESCOLA VAI FECHAR PARA SEMPRE AMANHÃ!!!", texto: "Mande para todo mundo agora! Compartilhe antes que apaguem!", fonte: "", data: "" } },
            dica: "Olhe as letras, os pontos de exclamação e o pedido para compartilhar.",
            acerto: "Isso! Ela tem sinais de notícia falsa. Na dúvida, pergunte a um adulto e não compartilhe.",
            opcoes: [{ texto: "Sim, parece confiável." }, { texto: "Não. Tem sinais de notícia falsa ou exagerada.", certa: true }, { texto: "É propaganda de um produto." }]
          },
          {
            tipo: "escolha", pergunta: "Que sinais mostram que ela pode ser falsa?",
            mostrar: { noticia: { manchete: "URGENTE!!! A ESCOLA VAI FECHAR PARA SEMPRE AMANHÃ!!!", texto: "Mande para todo mundo agora! Compartilhe antes que apaguem!", fonte: "", data: "" } },
            dica: "Notícia de verdade não precisa gritar nem pedir pressa.",
            acerto: "Muito bem! Letras maiúsculas, muitas exclamações e pressa para compartilhar são sinais de alerta.",
            opcoes: [{ texto: "Letras maiúsculas, muitas exclamações e pedido urgente para compartilhar.", certa: true }, { texto: "Ela tem fonte e data." }, { texto: "O texto é calmo e explica tudo." }]
          },
          {
            tipo: "escolha", pergunta: "Esta notícia parece confiável?",
            mostrar: { noticia: { site: "Jornal do Bairro", manchete: "Sala de leitura recebe 50 livros novos", texto: "Os livros foram doados pelas famílias e já podem ser emprestados na sala de leitura da escola.", fonte: "Jornal do Bairro", data: "10/03/2026" } },
            dica: "Veja se ela tem fonte, data e se o texto combina com o título.",
            acerto: "Isso! Ela tem fonte, data, e o texto combina com o título.",
            opcoes: [{ texto: "Sim, parece confiável.", certa: true }, { texto: "Não. Tem sinais de notícia falsa ou exagerada." }, { texto: "É propaganda de um produto." }]
          },
          {
            tipo: "escolha", pergunta: "Esta notícia parece confiável?",
            mostrar: { noticia: { manchete: "Cientistas dizem que comer chocolate faz voar", texto: "Quem come três chocolates por dia consegue voar. Ninguém sabe o nome dos cientistas.", fonte: "", data: "" } },
            dica: "Pessoas conseguem voar comendo chocolate? Ela tem fonte e data?",
            acerto: "Muito bem! Ela não tem fonte nem data e conta uma coisa impossível.",
            opcoes: [{ texto: "Sim, parece confiável." }, { texto: "Não. Não tem fonte nem data e conta algo impossível.", certa: true }, { texto: "É propaganda de um produto." }]
          },
          {
            tipo: "escolha", pergunta: "O que é esta notícia?",
            mostrar: { noticia: { site: "Loja Pulo Alto", manchete: "Pesquisa revela: tênis Pulo Alto deixa as crianças mais inteligentes!", texto: "Compre já o seu tênis Pulo Alto com desconto! Só hoje!", fonte: "Loja Pulo Alto", data: "hoje" } },
            dica: "Quem escreveu essa notícia? O que ela quer que você faça?",
            acerto: "Isso! É propaganda disfarçada de notícia: ela quer vender um tênis.",
            opcoes: [{ texto: "Uma notícia confiável sobre ciência." }, { texto: "Propaganda disfarçada de notícia: ela quer vender um produto.", certa: true }, { texto: "Uma previsão do tempo." }]
          },
          {
            tipo: "escolha", pergunta: "O que está errado nesta notícia?",
            mostrar: { noticia: { site: "Jornal da Escola", manchete: "Dinossauro gigante invade o pátio da escola!", texto: "Os alunos do 3º ano fizeram uma exposição de dinossauros de massinha no pátio.", fonte: "Jornal da Escola", data: "02/09/2026" } },
            dica: "Leia o título e depois o texto. Eles contam a mesma coisa?",
            acerto: "Muito bem! O título exagera e não combina com o texto.",
            opcoes: [{ texto: "Não tem data." }, { texto: "Nada, está tudo certo." }, { texto: "O título é exagerado e não combina com o texto.", certa: true }]
          },
          {
            tipo: "escolha", pergunta: "Você recebeu uma notícia e ficou na dúvida. O que fazer?",
            dica: "Quando a gente compartilha uma notícia falsa, mais pessoas leem a mentira.",
            acerto: "Isso! Na dúvida, pergunte a um adulto e não compartilhe.",
            opcoes: [{ texto: "Compartilhar com todos os amigos." }, { texto: "Perguntar a um adulto e não compartilhar.", certa: true }, { texto: "Mandar correndo para o grupo da família." }]
          }
        ]
      },
      {
        id: "telejornal", nome: "Roteiro do telejornal", picto: "tv",
        intro: "O telejornal tem partes, uma depois da outra. Vamos organizar o Jornal do Robô na TV da escola.",
        etapas: [
          {
            tipo: "ordenar", prefixo: "Parte",
            pergunta: "Coloque o telejornal em ordem.",
            dica: "Começa com os apresentadores dizendo boa tarde e termina com o encerramento.",
            acerto: "O telejornal está em ordem. Agora ele pode começar!",
            itens: [
              { texto: "Abertura com os apresentadores", descricao: "Boa tarde! Começa agora o Jornal do Robô." },
              { texto: "Notícias", descricao: "A horta da escola deu as primeiras alfaces." },
              { texto: "Entrevista", descricao: "Conversamos com a merendeira sobre a horta." },
              { texto: "Previsão do tempo", descricao: "Amanhã vai fazer sol, com algumas nuvens." },
              { texto: "Encerramento", descricao: "O Jornal do Robô fica por aqui. Até amanhã!" }
            ]
          },
          {
            tipo: "escolha", pergunta: "Qual manchete deve abrir o telejornal?",
            dica: "A manchete de abertura é clara, verdadeira e conta o mais importante.",
            acerto: "Isso! Ela é clara e conta o mais importante, sem exagero.",
            opcoes: [{ texto: "Horta da escola dá as primeiras alfaces", certa: true }, { texto: "VOCÊ NÃO VAI ACREDITAR!!!" }, { texto: "Coisas aconteceram por aí" }]
          },
          {
            tipo: "escolha", pergunta: "O que a previsão do tempo conta?",
            dica: "Previsão é sobre o tempo de amanhã: sol, chuva, frio ou calor.",
            acerto: "Muito bem! A previsão conta como o tempo vai ficar.",
            opcoes: [{ texto: "O placar do jogo de futebol." }, { texto: "Se vai fazer sol, chuva, frio ou calor.", certa: true }, { texto: "O cardápio do lanche." }]
          }
        ]
      },
      {
        id: "noticia", nome: "Minha notícia", picto: "lapis", producao: "noticia",
        intro: "Agora é a sua vez! Escreva uma notícia sobre algo da escola para o Jornal do Robô."
      }
    ]
  }
];

/* ============================================================
   OPÇÕES DAS PRODUÇÕES
   ============================================================ */
const OPCOES_PRODUCAO = {
  // 1º ano: cena com cenário, personagens e um sentimento para cada personagem
  cena: {
    cenarios: ["escola", "parque", "casa", "quadra"],
    personagens: ["robo", "menina", "menino", "bia", "davi", "professora", "cachorro", "gato"],
    maxPersonagens: 3,
    sentimentos: ["feliz", "triste", "bravo", "medo", "surpreso", "calmo"]
  },

  // 2º ano: fotonovela de 4 quadros
  fotonovela: {
    titulos: ["O sorvete perdido", "Um dia no parque", "O segredo do Robô", "A grande descoberta"],
    cenarios: ["escola", "parque", "casa", "quadra", "salaLeitura", "refeitorio"],
    personagens: ["robo", "menina", "menino", "bia", "davi", "professora", "merendeira", "porteiro", "diretora", "cachorro", "gato"],
    maxPersonagens: 2,
    // explicação de cada balão (lida pela voz)
    baloes: {
      fala: "para falar normalmente.",
      pensamento: "para mostrar o que o personagem pensa.",
      grito: "para falar muito alto.",
      cochicho: "para falar bem baixinho."
    },
    // falas prontas para cada balão; sentimento muda o rosto de quem fala
    falas: {
      fala: [
        { texto: "Oi! Tudo bem?", sentimento: "feliz" },
        { texto: "Vamos brincar no recreio?", sentimento: "feliz" },
        { texto: "Você me empresta o lápis?", sentimento: "calmo" },
        { texto: "Obrigado pela ajuda!", sentimento: "feliz" },
        { texto: "Que pena, começou a chover.", sentimento: "triste" }
      ],
      pensamento: [
        { texto: "Será que vai chover?", sentimento: "calmo" },
        { texto: "Que ideia boa!", sentimento: "feliz" },
        { texto: "Onde eu deixei meu caderno?", sentimento: "surpreso" },
        { texto: "Estou com saudade da minha avó.", sentimento: "triste" }
      ],
      grito: [
        { texto: "Gol!", sentimento: "feliz" },
        { texto: "Socorro! Uma aranha!", sentimento: "medo" },
        { texto: "Cuidado com a bola!", sentimento: "surpreso" },
        { texto: "Oba! Chegou o lanche!", sentimento: "feliz" }
      ],
      cochicho: [
        { texto: "Tenho um segredo para contar.", sentimento: "calmo" },
        { texto: "Fale baixinho, a professora está lendo.", sentimento: "calmo" },
        { texto: "Vamos fazer uma surpresa para a turma?", sentimento: "feliz" }
      ]
    }
  },

  // 3º ano: notícia para o Jornal do Robô
  noticia: {
    ilustracoes: [
      { id: "arvores", nome: "Plantio de árvores", descricao: "A Lia e o Davi plantando mudas de árvore no parque, com um regador.",
        desenho: { cenario: "parque", personagens: [{ quem: "menina", sentimento: "feliz" }, { quem: "davi", sentimento: "feliz" }], objetos: [{ obj: "muda", x: 205, frente: true }, { obj: "muda", x: 340, frente: true }, { obj: "regador", x: 300, y: 200, frente: true }] } },
      { id: "horta", nome: "Horta da escola", descricao: "A merendeira e o Téo ao lado da horta cheia de verduras.",
        desenho: { cenario: "escola", personagens: [{ quem: "merendeira", sentimento: "feliz" }, { quem: "menino", sentimento: "feliz" }], objetos: [{ obj: "horta", x: 205, y: 262, frente: true }] } },
      { id: "festa", nome: "Festa na escola", descricao: "Festa na quadra, com bandeirinhas coloridas, fogueira e crianças felizes.",
        desenho: { cenario: "quadra", personagens: [{ quem: "bia", sentimento: "feliz" }, { quem: "davi", sentimento: "feliz" }], objetos: [{ obj: "bandeirinhas" }, { obj: "fogueira", x: 205, frente: true }] } },
      { id: "livros", nome: "Sala de leitura", descricao: "A professora da sala de leitura e a Bia com uma pilha de livros.",
        desenho: { cenario: "salaLeitura", personagens: [{ quem: "professora", sentimento: "feliz" }, { quem: "bia", sentimento: "surpreso" }], objetos: [{ obj: "livros", x: 205, frente: true }] } },
      { id: "futebol", nome: "Jogo na quadra", descricao: "O Davi e o Téo jogando futebol na quadra.",
        desenho: { cenario: "quadra", personagens: [{ quem: "davi", sentimento: "feliz" }, { quem: "menino", sentimento: "surpreso" }], objetos: [{ obj: "bola", x: 205, frente: true }] } },
      { id: "radio", nome: "Rádio da escola", descricao: "O Robô e a Lia apresentando um programa no estúdio de rádio.",
        desenho: { cenario: "estudio", personagens: [{ quem: "robo", sentimento: "feliz" }, { quem: "menina", sentimento: "feliz" }] } },
      { id: "chuva", nome: "Dia de chuva", descricao: "Chuva forte na escola. A Bia segura um guarda-chuva vermelho.",
        desenho: { cenario: "escola", personagens: [{ quem: "bia", sentimento: "surpreso" }], objetos: [{ obj: "chuva" }, { obj: "guardaChuva", x: 225, y: 160, frente: true }] } }
    ],
    // ideias que aparecem como botões; a criança também pode escrever
    sugestoes: {
      oque: ["A turma plantou árvores", "Teve campeonato de futebol", "A horta deu verduras", "Chegaram livros novos"],
      quem: ["Os alunos do 3º ano", "A turma e a professora", "Todas as turmas da escola"],
      quando: ["Ontem", "Na segunda-feira", "Hoje de manhã", "Na semana passada"],
      onde: ["No pátio", "Na quadra", "Na sala de leitura", "Na horta da escola"]
    }
  }
};
