# Lummier Studio

Site institucional + área interna (login) de um studio de beleza com quatro profissionais:
Flávia (unhas, dona do studio), Jheny (maquiagem), Vitória (cabelo) e Mayte (cílios,
sobrancelhas e pele, desde 15/09/2026).

**No ar só na Vercel**, https://lummier-studio.vercel.app (deploy automático a cada push na
`main`, projeto Vercel se chama `lummier-studio-oficial`). **Renomeado em 16/09/2026** — a
URL antiga (`afroditestudio.vercel.app`) continua funcionando, só redireciona (307) pra essa.

> **O GitHub Pages foi abandonado em 16/09/2026** (o Erick decidiu não usar mais). A infra
> dual-host continua no código (`vite.config.ts` detecta `VERCEL`, `public/404.html`, o
> `base: '/flavia-longnails/'`) porque removê-la é trabalho à parte e não muda nada
> funcionando hoje — só não vale mais **manter o Pages atualizado** (`npm run deploy`).
> Se algum dia quiser tirar essa infra de vez, é decisão dele, não faço sozinho.

## Onde paramos (15/09/2026)

Se você está voltando depois de um tempo, leia estes pontos antes de qualquer coisa:

0. ~~Rodar o `migration.sql`~~ → **rodado em 07/09/2026**, `client_returns` confirmada por
   sondagem (200). O banco está em dia com o código e a Vercel também.
1. **Os preços da Flávia e da Vitória no site são invenção minha.** Nunca passaram por
   elas. Descobrimos isso pelo portfólio da Jheny, cujos 6 serviços inventados viraram os
   3 reais dela, com preços bem menores. É o risco aberto mais sério do projeto: o site
   anuncia valores que o salão pode não praticar. Detalhe na seção do portfólio.
2. **As durações também são chute meu**, e o único corrigido foi Manicure (45min → 2h).
   A agenda desenha os blocos com esses números. Os da Mayte (adicionada em 15/09) também
   são chute, ainda sem correção nenhuma.
3. ~~O GitHub Pages está desatualizado~~ → **não é mais pendência**: o Erick abandonou o
   Pages em 16/09/2026, o site é só Vercel agora. Ver nota no topo deste arquivo.
4. ~~A Mayte só tinha metade do login~~ → **resolvida em 15/09/2026**: usuário criado no
   painel do Supabase e `migration.sql` atualizado já rodado (confirmado pelo Erick). Login
   dela funciona igual ao das outras 3.
5. ~~Renomear o projeto na Vercel~~ → **resolvido em 16/09/2026**, ver item 11 mais abaixo.
6. **A logo em PNG (`public/logo.png`) já substitui o texto em todo lugar** — nav, rodapé e
   sidebar da área interna.
7. ~~A galeria da Mayte só tinha a foto de perfil~~ → **resolvida em 15/09/2026**, 6 fotos
   reais de trabalho puxadas do `@espaco.seixas`.
8. **Sessão de 15/09 (parte 2)** somou: fundo removido do hero no mobile, 4º círculo
   (cílios) na seção Resultados, placeholder do login com a Mayte, Mayte entrou em
   `RENT_PAYERS` (paga aluguel de posto), 2 depoimentos fictícios da Mayte (mesmo esquema
   de todos os outros) e um manifest de PWA pra instalar a Área da Colaboradora como app.
9. **Contas do Salão virou exclusiva da Flávia (15/09/2026).** As outras colaboradoras não
   veem mais essa tela — usam Gastos Pessoais com âmbito "Salão", que já somava por pessoa
   pra ela. RLS de `salon_transactions` apertada pra só o e-mail dela. `migration.sql`
   atualizado já foi rodado pelo Erick (confirmado em 16/09/2026) — a policy nova está
   valendo de verdade, não só bloqueada no código.
10. **Galeria da Flávia e da Jheny trocada por fotos reais em resolução cheia (16/09/2026)**,
    e as capas da seção Resultados também. Bio da Mayte reescrita com o texto que o Erick
    passou. Ver "Fotos em resolução cheia, enviadas direto pelo Erick".
    Depois disso, ajuste fino: 2 fotos quase duplicadas da galeria da Jheny foram removidas
    a pedido dele (o pedido original era **somar** fotos novas às antigas, não substituir —
    eu tinha substituído na primeira tentativa e corrigi).
11. **URL da Vercel resolvida (16/09/2026): `lummier-studio.vercel.app`** já é o domínio de
    produção, `afroditestudio.vercel.app` agora só redireciona (307) pra ele. Não renomear
    o Project Name de novo sem necessidade — o domínio já está fixado explicitamente em
    Settings → Domains e não depende mais do nome do projeto.
12. **4º vídeo do hero, `hero-cilios.mp4` (16/09/2026)**, vídeo de banco do Pexels (mesma
    origem dos outros 3), recortado de um clipe vertical. Ver `public/videos/LEIA-ME.md`,
    que também foi reescrito (a versão anterior estava desatualizada desde o redesign do
    hero: dizia que o texto ficava na coluna da direita, e é o contrário).
13. **VIP passou de 3 para 10 visitas** (`Clientes.tsx`), a pedido do Erick — ver seção
    "Funcionalidades específicas" pra saber por que isso pode esvaziar a lista de VIPs.
14. **Cada profissional ganhou WhatsApp próprio (16/09/2026)** — antes todo mundo caía no
    número da Flávia. Endereço e Instagram do salão também atualizados. Ver seção
    "Contato, WhatsApp por profissional e Instagram do salão" logo abaixo.

O que a sessão de 05 a 07/09 entregou: rebrand pra Afrodite Studio, hero de tela cheia
com três vídeos alternando, agenda semanal e dashboards na área da colaboradora, controle
de aluguel, painel RETORNO, cards de serviço abrindo o WhatsApp, fotos reais das três
profissionais, a página `/trabalhe-conosco`, troca de toda a tipografia e substituição de
todo emoji por ícone SVG. A sessão de 14 a 15/09 trocou a tipografia de novo (Lora+Inter →
SF Pro/Inter), trocou a paleta de cor toda, rebrandou de novo (Afrodite → Lummier) e somou
a Mayte como quarta profissional.

## Stack

Vite + React 18 + TypeScript + CSS puro por componente (sem Tailwind/UI kit), React Router,
Supabase (Auth + Postgres) pra área da colaboradora. Todo o site público foi migrado de
HTML/CSS/JS estático pra este stack em 04/09/2026, a pedido do Erick, pra ficar no mesmo
padrão do portfólio dele.

```bash
npm install
npm run dev       # http://localhost:5173/flavia-longnails/
npm run build      # tsc -b && vite build
npm run deploy      # build + publica dist/ na branch gh-pages
```

## Deploy — dois hosts, um código só

`vite.config.ts` e `main.tsx` detectam o host pela env var `VERCEL` (a Vercel define sozinha
no build):
- **Vercel**: `base: '/'`, `BrowserRouter basename=""`. Rotas via `vercel.json` (rewrite de
  SPA nativo — qualquer caminho cai em `index.html`).
- **GitHub Pages**: `base: '/flavia-longnails/'` (página de projeto, não domínio próprio).
  Sem rewrite de servidor, então usa o truque clássico do `public/404.html` (redireciona
  preservando a rota; `index.html` decodifica de volta antes do React montar).

**Depois de mudar env var na Vercel, precisa forçar Redeploy manual** — ela não aplica em
builds já existentes sozinha.

**Regra permanente do Erick (16/09/2026): sempre commitar e dar push na `main` ao final de
qualquer tarefa neste projeto, sem perguntar antes.** Push na `main` já dispara o deploy
automático na Vercel, então "commita e sobe" são a mesma ação aqui. Isso é diferente do
`ERP Módulo Técnico`, onde push também publica na hora mas ainda assim exige perguntar antes
— lá o repo é de outra pessoa (o Victor); aqui é projeto do próprio Erick.

## Acesso tipo app (PWA), 15/09/2026

Pedido do Erick: as colaboradoras acessarem a Área da Colaboradora sem precisar digitar a
URL toda vez, tipo um app. Resolvido com um **manifest de PWA** (`public/manifest.json` +
ícones em `public/icons/`), sem service worker:

- `start_url` e `scope` no manifest usam **caminho relativo** (`"area-colaboradora"`, `"."`),
  não absoluto. Isso importa porque o manifest é resolvido contra a própria URL dele, e essa
  URL muda entre os dois hosts (`/manifest.json` na Vercel, `/flavia-longnails/manifest.json`
  no Pages) — com caminho relativo o mesmo arquivo funciona nos dois sem gerar dois manifests.
  Mesma lógica pros `icons.src`.
- O link no `index.html` usa `%BASE_URL%manifest.json`, igual já era feito pro favicon —
  o Vite substitui `%BASE_URL%` pelo `base` certo em cada build.
- Ícones gerados a partir do `public/logo.png` (400×400 com transparência), colados sobre
  fundo sólido `#F2EFEB` num canvas maior (logo ocupa ~62% do quadro) pra sobrar respiro nas
  bordas — sem isso o monograma fica colado na borda do ícone no celular.
- **Sem service worker de propósito.** Daria o prompt de instalação nativo do Chrome/Android
  (hoje só funciona via "Adicionar à Tela de Início" no menu do navegador, em iOS e Android),
  mas cache de service worker é fonte clássica de dor de cabeça: sem uma estratégia de
  invalidação bem pensada, ele serve JS/CSS antigo depois de um deploy novo e vira um bug
  difícil de depurar remotamente. Pro objetivo real (ícone na tela, abre direto sem
  navegador) o manifest sozinho já resolve. Se um dia quiser o prompt nativo ou uso offline
  de verdade, aí sim vale considerar `vite-plugin-pwa` com uma estratégia de cache pensada.

## Contato, WhatsApp por profissional e Instagram do salão (16/09/2026)

**Endereço mudou de rua** (`Contact.tsx`): agora é Rua Ministro Lins de Barros, 465 - cs 13.
O Erick disse que bairro/cidade/CEP continuavam os mesmos ("Jardim Peri - Alto ...
02281-206"), mas **isso não batia com a realidade**: consultei o ViaCEP pela rua nova e o
CEP oficial dela é `02674-000`, bairro **Jardim Santa Cruz** — outro bairro. Perguntei e ele
confirmou usar o CEP correto. Lição: **não confiar cegamente que só uma parte do endereço
mudou** quando a rua inteira é diferente — vale conferir no ViaCEP antes de publicar.
O `<iframe>` do mapa trocou de formato: era um embed com place ID específico (gerado pelo
"Compartilhar → Incorporar mapa" do Google, preso a um Google Business Profile antigo,
"Flávia LongNails") e virou uma busca por texto (`google.com/maps?q=<endereço>&output=embed`)
— não tenho como gerar um embed com place ID pra um endereço novo sem acesso ao Google
Business Profile do salão, mas o formato por texto funciona sem precisar de chave de API
nem de place ID, só geocodifica o endereço direto.

**Cada profissional ganhou WhatsApp próprio.** Antes, `whatsappForService` e o botão
"Agendar pelo WhatsApp" de cada página (`ProHero.tsx`) mandavam tudo pro mesmo número
(`WHATSAPP_NUMBER`, o da Flávia) — só o texto da mensagem dizia com quem era, quem recebia
tinha que redirecionar na mão. Agora `Professional` tem um campo `whatsapp: string | null`:
`null` cai no número principal (é o caso da Flávia, dona, sempre foi esse número mesmo),
as outras três têm o próprio:

| Profissional | Número |
|---|---|
| Jheny | 5511967218862 |
| Vitória | 5511940498740 |
| Mayte | 5511958290432 |

Função nova, `numberFor(nome)` (privada, `professionals.ts`), resolve o número certo; usada
tanto no `whatsappForService` (cards de serviço) quanto no `whatsappForProfessional`
(botão da página da profissional, que não está preso a um serviço específico). Os pontos de
contato **gerais** do site (CTA do Hero, do Nav, o WhatsApp do Contact/Footer, o botão
flutuante, `/trabalhe-conosco`) continuam todos no número principal — fazem sentido pra
Flávia/salão, não pra uma profissional específica.

**Instagram do salão trocou pra uma conta nova, `@lummier_studiobeauty`** — antes o rodapé e
o Contato linkavam pro Instagram pessoal da Flávia (`@flavia_longnails`). A conta nova é do
salão **e também da Flávia**, então o `instagram` dela em `professionals.ts` mudou junto
(era pessoal, virou a mesma do salão). Jheny, Vitória e Mayte mantêm os Instagrams próprios,
sem mudança.

## Marca — o rebrand de 05/09/2026

O studio se chamava **Studio Flávia Alves** e virou **Afrodite Studio** em 05/09/2026, a
pedido do Erick. Fecha a questão de marca que estava em aberto desde o projeto de expansão:
"Long Nails" (e depois o nome próprio da Flávia) comunicava só uma pessoa e uma
especialidade, e o salão é multi-especialidade com três profissionais.

No logo, a ênfase era em **Afrodite**: o `<span>` do `.nav-logo` e do `.staff-sidebar-logo` era
a parte *leve* (accent-deep, weight 400), então a marcação ficava `Afrodite <span>Studio</span>`,
não o contrário. **Isso não existe mais** — em 15/09/2026 o logo de texto foi substituído pela
imagem em todo lugar (ver seção "Segundo rebrand" abaixo).

> **Três nomes NÃO mudaram no rebrand, de propósito:**
>
> 1. **Os e-mails `@studioflaviaalves.app`** em `src/auth/staffUsers.ts` e no `migration.sql`.
>    Não são texto de marca: são a identidade real das 3 no Supabase Auth, e a policy que dá
>    visão de dona pra Flávia compara a string literal `flavia@studioflaviaalves.app`. Trocar
>    o domínio quebra os 3 logins e a visão de equipe dela. Migrar exigiria recriar os
>    usuários no painel e redefinir as senhas. Decisão do Erick: fica como está.
> 2. **O nome do repo, `flavia-longnails`.** É o que define `base: '/flavia-longnails/'` no
>    `vite.config.ts` e o `pathSegmentsToKeep` do `public/404.html`. Renomear o repo derruba
>    o GitHub Pages até o próximo deploy.
> 3. **`studio` em minúsculo** como substantivo comum ("clientes do studio", "Voltar para o
>    Studio") continua em vários componentes. Não é marca, lê bem com o nome novo.

### Segundo rebrand: Afrodite Studio → Lummier Studio (15/09/2026)

A pedido do Erick, junto com uma logo nova (monograma dourado "UL", entregue como PNG e
salva em `public/favicon.png`, substituindo a anterior). Mesmo mecanismo do primeiro
rebrand: busca-e-troca de `Afrodite` por `Lummier` nos arquivos de marca (`Nav.tsx`,
`Footer.tsx`, `StaffLayout.tsx`, `Contact.tsx`, `Resultados.tsx`, `TrabalheConosco.tsx`,
`Login.tsx`, `Retorno.tsx`, `professionals.ts`, `index.html`, `public/404.html`,
`README.md`). Os mesmos três nomes do item acima **continuaram intocados** pelo mesmo
motivo (e-mails de auth, nome do repo, "studio" minúsculo).

**Atualização 16/09/2026: o domínio da Vercel foi renomeado**, ver "Onde paramos" item 11.
Ficou registrado abaixo como funcionou de verdade, porque a primeira tentativa (renomear só
o Project Name) não bastou:

1. Trocar o **Project Name** (Settings → General) **não muda sozinho** o domínio de
   produção já fixado — só afeta URLs de deploy individual (as de hash tipo
   `<nome>-<hash>-<time>.vercel.app`, que ficam atrás de login SSO da Vercel, não são
   públicas).
2. O domínio público de verdade fica em **Settings → Domains**. Pra trocar, tem que
   **remover** o antigo (`afroditestudio.vercel.app`) de lá — só depois disso a Vercel
   libera `<project-name>.vercel.app` pra ser adicionado/assumido como o novo. Tentar
   adicionar um nome que não bate exatamente com o Project Name salvo é rejeitado (foi o
   que aconteceu numa tentativa no meio do caminho, com o nome errado).
3. O domínio antigo não precisa ser apagado de vez: a Vercel deixa ele como redirect (307)
   pro novo automaticamente, então links salvos não quebram.

**A logo em PNG passou a estar em uso em todo o site desde 15/09/2026**: substitui o texto
"Lummier Studio" no `.nav-logo` (`Nav.tsx`), no `.footer-logo` (`Footer.tsx`) e no
`.staff-sidebar-logo` (`StaffLayout.tsx`) — os três agora renderizam só `<img src={asset('logo.png')}>`
dentro do mesmo `<Link>` que já existia, sem span nem texto. O arquivo fonte é
`public/logo.png` (400×400, RGBA com transparência real, mesma arte do favicon).

## Design

Paleta bege claro + terracota só como acento (nunca fundo grande sólido — já foi feedback
explícito: "ficou marrom, não quero isso").

**Tipografia: foram três tentativas em 07/09/2026**, e vale saber o que já foi rejeitado
pra não voltar pra lá.

| Tentativa | Fontes | Por que saiu |
|---|---|---|
| 1a | Cinzel + Cinzel Decorative + Cormorant Garamond + Jost | Herdadas do site antigo. Puxavam pro lado convite-de-casamento |
| 2a | Fraunces + Manrope | Fraunces tem eixos SOFT e WONK: lê como "criativo", não como "profissional" |
| **3a** | **Lora + Inter** | Ficou |

O pedido literal do Erick foi "profissional e elegante, mas legível". Lora é serifa
desenhada **para tela**, com contraste moderado e curvas de pincel: dá elegância sem virar
enfeite e continua legível a 0.6rem em caixa alta. Inter é o padrão de legibilidade em
interface.

Os dois tokens estão no `:root` do `global.css` e **são os dois únicos lugares a mexer**
numa próxima troca, mais o `@import` no topo do arquivo.

> `font-feature-settings: 'cv05' 1` no `body` liga o "l" com cauda do Inter. Sem isso,
> `1`, `l` e `I` ficam quase idênticos, o que atrapalha justamente em preço e horário,
> que é o que a tela da colaboradora mais mostra.

> Regra aplicada na conversão: **rótulo em caixa alta usa a fonte de corpo, não a de
> display.** Serifa espaçada em `text-transform: uppercase` a 0.56rem fica pesada e
> ilegível. O script de troca decidiu isso lendo `text-transform: uppercase` na própria
> regra CSS.

**Nenhum emoji na interface** (desde 07/09/2026). Todo ícone vem de
`src/components/Icon.tsx`, que é um mapa nome → ícone da `lucide-react`. Emoji renderiza
diferente em cada sistema, não herda a cor da marca e não escala com o texto. O `<Icon>`
sai com `size="1em"`, então o tamanho vem do `font-size` do contexto.

> `lucide-react` **removeu os ícones de marca**: não existe `Instagram`. O contato usa
> `AtSign` no lugar. O `InstagramIcon` desenhado à mão continua em `components/icons.tsx`
> e é o que aparece nas redes do rodapé.

**Nunca usar travessão (—) em texto visível.** Feedback explícito do Erick: "parece site
feito por IA". Vale pra qualquer copy nova, não só aqui — está registrado na memória global
dele também (`sem-travessao-em-copy.md`).

Carrossel infinito (`src/components/Marquee.tsx`) usado em avaliações, tags e galerias:
- Fade nas bordas é feito com **duas divs de gradiente sobrepostas**, não `mask-image` — a
  máscara CSS junto com o `transform` animado do track piscava/sumia em alguns navegadores
  WebKit.
- **Repete o grupo de itens dinamicamente até cobrir a largura visível** (mede via
  `ResizeObserver`). Com poucos itens (ex.: só 3 fotos) um único grupo pode ser mais estreito
  que a tela num monitor largo, e a técnica clássica de "2 cópias + translateX(-50%)" deixa um
  vão vazio a cada volta. Não regredir pra 2 cópias fixas.

**Títulos quebrando com palavra órfã sozinha na última linha, corrigido em 16/09/2026**:
o hero ("Beleza que Transforma Você", `Hero.tsx`) virava "Beleza que Transforma" / "Você",
e o título da seção Resultados ("Resultados que Falam por Si", `Resultados.tsx`) virava
"...Falam por" / "Si". Duas voltas até fechar:

1. Primeira tentativa: `&nbsp;` entre as duas últimas palavras. Resolvia, mas estourava o
   texto pra fora da tela em telas muito estreitas (abaixo de ~315px — praticamente nenhum
   aparelho real, mas ainda assim um regressão).
2. Troquei pra `text-wrap: balance` em `.hero-title` (`Hero.css`) e `.sec-title`
   (`global.css`), que nunca estoura (só reequilibra entre pontos de quebra que já existem).
   **Só que eu tinha testado apenas o layout mobile (viewport < 900px, coluna full-width)**,
   nunca a coluna real do desktop: acima de 900px o `.hero-grid` vira
   `minmax(0, 620px) 1fr`, então o texto sempre disputa uma coluna de ~620px de largura
   **independente do quão largo é o monitor** — só a fonte cresce com o viewport (`clamp`
   até 3.6rem). O Erick mandou print do PC confirmando que ainda quebrava feio ali, porque
   nenhum dos meus testes (só até 900px) cobria esse caso.
3. **Solução final: os dois mecanismos juntos** — `&nbsp;` prendendo as duas últimas
   palavras (`Transforma&nbsp;Você`, `por&nbsp;Si`) garante o resultado em qualquer
   navegador, e o `text-wrap: balance` continua no CSS como reforço pros outros
   `.sec-title` do site (Contact, ServiceGrid, TrabalheConosco). Testado de 320px a
   2560px, sem estouro em nenhuma largura real.

> **Lição de processo**: ao testar responsividade de um elemento que muda de layout
> (`@media (max-width: 900px)`), testar as duas metades do breakpoint, não só a mobile.
> Larguras de teste que cobrem isso: uma bem estreita (~320px), uma perto do breakpoint
> de cada lado (~890px e ~920px), e pelo menos duas desktop reais (1440px, 1920px) —
> não só ir até ~900px e assumir que "mobile" cobre tudo.

### Hero sem fundo no mobile, e o 4º círculo dos Resultados (15/09/2026)

Dois ajustes pedidos pelo Erick depois de ver o site no celular:

- **`.hero-video`/`.hero-scrim` viraram `display: none` abaixo de 900px** (`Hero.css`). Antes,
  sem vídeo rodando, o que aparecia era só o poster (`images/hero-nails-o-0j6oBo.jpg`) com um
  degradê por cima — ele achou que brigava com o texto numa tela estreita. Sobrou o fundo
  sólido da seção (`var(--bg)`). O poster continua existindo e é usado normalmente acima de
  900px, só não referenciado mais no mobile.
- **A composição de círculos da seção Resultados ganhou um 4º** (`.rv-inset-cilios`), com
  a foto `images/ig-mayte-1.jpg` (o close de olho com extensão de cílios, uma das 6 baixadas
  do Instagram dela). Antes eram só 3 (unha grande + cabelo + make), pensados pra dizer "o
  studio faz três coisas" sem texto — com a Mayte esse número virou quatro. O círculo novo
  morde o canto inferior direito do principal, espelhando como o `.rv-inset-make` já mordia
  o topo. O texto da seção e as estatísticas "Especialistas" do Hero (`3` → `4`) também
  foram corrigidos, estavam desatualizados desde que ela entrou.

## Fotos — o que veio do Instagram (05/09/2026)

A pedido do Erick, galeria e avatares passaram a usar material puxado do Instagram das
profissionais. Os arquivos antigos **continuam todos no repo**: reverter é trocar a lista
em `src/data/professionals.ts`, nada foi apagado.

| | Antes | Agora |
|---|---|---|
| Galeria da Flávia | 9 fotos, 1280x1920 | 6 do `@flavia_longnails`, 480x640 |
| Galeria da Jheny | 3 de banco de imagem | 3 makes reais do `@jhenyluanyybeauty` |
| Avatar da Jheny | stock, 700x700 | recorte do portfólio dela, **900x900** (07/09) |
| Avatar da Flávia | foto de trabalho, 682x788 | **ainda não mudou**, ver pendência |
| Avatar da Vitória | stock, 700x700 | foto real dela, 485x565 (07/09) |
| Galeria da Vitória | stock | **continua stock**: só o rosto virou real |

> **Isso rebaixou a resolução da galeria da Flávia**, e foi decisão consciente dele depois
> de eu levantar a ressalva. O Instagram comprime tudo pra 640px e **não deixa pedir maior**:
> trocar o parâmetro de tamanho na URL dá 403, porque a assinatura (`oh=`) cobre ele. O
> avatar da Jheny em 150x150 aparece num círculo de 240px, então amplia e fica macio.
>
> **O avatar do Instagram da Flávia é um desenho, não foto.** Por isso ela ficou com a foto
> de trabalho que já estava lá.

### Fotos em resolução cheia, enviadas direto pelo Erick (16/09/2026)

**Resolveu a pendência de resolução** registrada acima: o Erick mandou fotos reais por
WhatsApp (`/Users/erickk/Downloads/imagens long nails/`, pasta local, fora do repo), em
resolução bem maior que o Instagram entregava (até 1600px no lado maior, contra 640px).
Processadas com Pillow: `ImageOps.exif_transpose` (uma tinha EXIF de rotação), redimensionado
pro lado maior não passar de 1000px, `quality=82` — equilíbrio entre nitidez e peso de
página, não o objetivo era manter o arquivo bruto de 1-2MB.

- **Galeria da Flávia**: as 2 fotos novas (`flavia-trabalho-1.jpg`, `-2.jpg`) foram
  **somadas** às 6 do Instagram (`ig-flavia-N.jpg`), não trocadas — na primeira tentativa
  eu substituí a lista inteira e o Erick corrigiu: o pedido era adicionar. Gallery final
  tem as 6 antigas + as 2 novas, nessa ordem.
- **Galeria da Jheny**: mesma coisa — as 5 fotos novas (`jheny-trabalho-1.jpg` a `-5.jpg`,
  do mesmo ensaio fotográfico) foram somadas às 3 do Instagram (`ig-jheny-N.jpg`), não
  trocadas. **Duas delas (`WhatsApp...23.21.11.jpeg` e a `(1)`) vieram com o conteúdo
  girado 90°** (sem EXIF de orientação pra corrigir sozinho) — corrigidas com
  `im.rotate(-90, expand=True)` antes de salvar.
- **Capas da seção Resultados** (`Resultados.tsx`, `.rv-main` e `.rv-inset-make`) trocaram
  de `ig-flavia-4.jpg`/`ig-jheny-3.jpg` pra `flavia-trabalho-1.jpg`/`jheny-trabalho-1.jpg`
  — os arquivos vieram nomeados "unha capa.jpeg"/"make capa.jpeg" na pasta original,
  claramente pensados pra esse uso.
- **Corrigi a legenda da galeria** (`InstaGallery.tsx`) de "Fotos reais dos trabalhos dela,
  direto do Instagram @X" pra "Fotos reais dos trabalhos dela. Mais no Instagram @X" — a
  frase antiga afirmava a origem errada agora que nem toda foto vem do Instagram (essas
  vieram do WhatsApp). Vale igual pra Flávia e pra Jheny.
- **Avatares não mudaram**, só a galeria. O pedido do Erick foi especificamente sobre o
  "portfólio" das duas.

### O portfólio da Jheny (07/09/2026) e o que ele corrigiu

Ela entregou um portfólio em PDF (9 páginas, 42 MB, export de Canva). Ele está no
`.gitignore` (`portfolio-*.pdf`): é pesado, o repo é público, e o que interessava já foi
transcrito pro `professionals.ts`.

**O que ele revelou: os serviços e preços dela no site estavam todos errados.** Eram 6
serviços que eu tinha inventado numa sessão anterior, com preços entre R$40 e R$350.
Ela oferece **três**, e mais baratos:

| Serviço | Preço | Tempo |
|---|---|---|
| Maquiagem Express | R$70 | 45min a 1h |
| Maquiagem Social | R$90 | 1h40 a 2h |
| Maquiagem Blindada | R$110 | 1h30 a 2h30 |

Sumiram do site: Maquiagem para Noiva (R$350), Maquiagem para Festa, Design de
Sobrancelha, Aplicação de Cílios e Aula de Automaquiagem. **Nenhum desses existe.** O
ranking em `testimonials.ts` e um depoimento citavam dois deles e foram corrigidos junto.

> Lição pro resto do projeto: **os serviços da Flávia e da Vitória também foram
> inventados por mim** e nunca passaram por elas. Se o desvio da Jheny foi esse, é
> provável que os outros também estejam errados. Vale pedir o material das duas antes
> que alguma cliente cobre um preço que o site anuncia.

A bio dela também virou texto próprio, do portfólio, e a página ganhou a seção
`ProPolicies` (sinal de 30%, cancelamento, tolerância de 15min, atendimento a domicílio,
formas de pagamento, orientações do dia). O campo `policies` é opcional: some sozinho
para quem não tem. **Não inventar conteúdo ali**, são condições comerciais e cada uma
define as suas.

O avatar dela virou um recorte da capa do portfólio renderizada a 300dpi: 900x900, contra
os 150x150 que o Instagram entregava.

### Curadoria feita em cima disso (05/09/2026, revisão do Erick)

Ele revisou foto a foto e mandou trocar três coisas. Vale saber o critério, porque é o
mesmo que se aplica quando entrar material novo:

- **Saiu a foto de pé/pedicure** da galeria da Flávia (`ig-flavia-3`). Entrou uma nail art
  temática no lugar. Pé em close não vende num hero de beleza, mesmo sendo serviço real.
- **Saiu a make vermelha dramática** da Jheny (`ig-jheny-1`), entrou uma de tom quente. A
  vermelha era boa tecnicamente mas brigava com a paleta bege/terracota do site.
- **A seção Resultados foi redesenhada** (ver abaixo) e trocou a foto de banco
  (`gallery-1-BmiSL3Sa.jpg`, a mão com anel dourado no terno cinza) por trabalho real.
  Essa foto **não é mais usada em lugar nenhum**, mas continua no repo.

> Critério que emergiu: **foto de banco sai, trabalho real entra**, mas trabalho real que
> destoa da paleta ou do enquadramento também sai. Ser real não basta.

### O visual da seção Resultados

Era um círculo único com borda branca de 6px sobre o bege, e o Erick chamou de "muito feio".
O recorte redondo cortava justamente as pontas das unhas, que é o assunto da foto.

Agora são três planos em `Resultados.css`: um contorno fino deslocado ao fundo, o círculo
principal no meio e dois círculos menores à frente mordendo o canto esquerdo. Chegou a ser
um arco (topo abaulado, base reta), mas o Erick pediu círculo nos três em 07/09.

> Como as fotos são 3/4 em retrato e o círculo é 1/1, o `object-fit: cover` corta topo e
> base. O `object-position: center 38%` puxa o enquadramento pro terço superior, que é onde
> estão unha, rosto e cabelo nas três. Trocar de foto pode exigir ajustar esse número.

A borda dos círculos menores usa `var(--bg-alt)`, a cor de fundo da própria seção, e não
branco: é isso que faz eles parecerem recortados de dentro do círculo grande em vez de
colados por cima.

**Desde 07/09/2026 são três fotos, não duas**, uma por especialidade: a grande é unha
(`ig-flavia-4`), e os dois círculos são cabelo e maquiagem. Serve pra dizer sem texto que
o studio faz três coisas. **A de cabelo (`vitoria-look-1-stock.jpg`) ainda é banco de
imagem**, a Vitória não passou material de trabalho.

> Cuidado ao escolher outra foto de cabelo no acervo: `vitoria-look-2-stock.jpg` é um
> retrato masculino, e a Vitória atende corte feminino. Sobrou da leva de stock original.

### Como esse material foi obtido, e por que não vale repetir sem pensar

As URLs do CDN do Instagram são **assinadas e expiram** (parâmetro `oe=`), então hotlink não
funciona: tem que baixar e commitar, que é o que foi feito. `curl` direto na página do perfil
devolve o shell do app sem as URLs (as imagens entram por JS). O caminho que funcionou foi
WebFetch na página pedindo as URLs completas, e mesmo assim **6 de 16 vieram corrompidas e
deram 403**. É frágil e não escala.

O caminho estável continua sendo pedir os originais pras duas no WhatsApp: resolução cheia,
sem URL que expira, sem scraping.

> **A Jheny autorizou** o uso das fotos dela no site (confirmado pelo Erick em 05/09/2026).
> Isso era decisão dela e não questão técnica: ela é colaboradora com contrato ainda sendo
> redigido, não dona do negócio.

## Mayte entra como quarta profissional (15/09/2026)

O Erick mandou o link de um post do Instagram dela (`@espaco.seixas`, negócio próprio
"Espaço Seixas": cílios, sobrancelhas e cuidados com a pele) e pediu pra usar a foto de lá
como avatar. Perfil e slug `mayte` adicionados em `src/data/professionals.ts`, com os 13
serviços e preços que ele passou (do catálogo dela no Instagram) e durações estimadas por
mim, como nos outros perfis — nenhuma delas foi confirmada com ela ainda.

**Técnica nova pra pegar foto de um post específico do Instagram, sem login e sem
scraping frágil:** o endpoint público de oEmbed devolve `thumbnail_url`, um link de CDN
que baixa direto:

```bash
curl -s "https://www.instagram.com/api/v1/oembed/?url=<link do post>"
# -> JSON com author_name, title (a legenda) e thumbnail_url (até 640x640)
```

Funciona pra um post específico (que foi o caso aqui); não serve pra puxar a galeria toda
de um perfil, que é o problema que a seção anterior (fotos da Flávia/Jheny) documenta como
frágil. Resolução sai limitada a 640x640, igual ao que já se via nas fotos da Flávia/Jheny.

> **Diferente da Jheny (ver nota abaixo), não há confirmação registrada de que a Mayte
> autorizou o uso dessa foto no site.** O pedido veio do Erick, não dela. Vale a mesma
> pergunta que foi feita pra Jheny antes de considerar isso resolvido.

**Galeria de trabalhos real, adicionada em 15/09/2026** (`images/ig-mayte-1.jpg` a `-6.jpg`):
as 6 fotos mais recentes marcadas como "Photo" (não vídeo/reel) no feed do
`@espaco.seixas`. Mesma ressalva de consentimento da foto de perfil acima.

**Técnica nova pra pegar a galeria inteira de um perfil** (a do oEmbed só serve pra um post
de cada vez): abrir o perfil com Playwright (`chromium.launch()` já instalado no scratchpad),
esperar a rede ficar ociosa e rodar `page.evaluate` coletando todo `img.src` e todo
`a[href*="/p/"]`/`a[href*="/reel/"]` da página. As URLs do CDN vêm com a assinatura completa
(`oh=`/`oe=`) porque o browser renderizou o JS — isso resolve o problema que a seção acima
("Como esse material foi obtido") documentava como frágil: `curl` direto na página não
funciona (imagens entram por JS) e `WebFetch` converte pra markdown e corta a query string,
o que devolve 403. O `alt` de cada `<img>` já vem como `"Photo by ... on <data>"` ou
`"Video by ..."`, então dá pra filtrar só foto sem abrir cada post. As 6 baixadas bateram
200 de primeira, sem nenhuma corrompida (diferente das 6 de 16 que falharam antes).

**Dois depoimentos fictícios pra ela, adicionados em 15/09/2026** (`src/data/testimonials.ts`,
Larissa Prado e Patrícia Gomes), mesmo esquema de todos os outros: nome, texto e foto
inventados, `verified: true` só como elemento visual (ver o comentário no topo do arquivo).
As fotos (`review-larissa-stock.jpg`, `review-patricia-stock.jpg`) vieram do
`randomuser.me` — serviço público feito justamente pra avatar de mockup/placeholder, ao
invés de puxar foto de uma pessoa real de algum lugar pra representar uma cliente que não
existe.

**Login na Área da Colaboradora — resolvido em 15/09/2026:**
1. ✅ `mayte` adicionada em `STAFF_USERS` (`src/auth/staffUsers.ts`), e-mail
   `mayte@studioflaviaalves.app`, mesmo padrão das outras 3.
2. ✅ Usuário criado no painel do Supabase pelo Erick (Authentication → Users → Add User,
   "Auto Confirm User" marcado). Senha sugerida por mim, no mesmo padrão das outras:
   `Mayte@Studio25`.
3. ✅ `check` de `professional` da tabela `appointments` em `migration.sql` já inclui
   `'Mayte'`, tanto no `create table` quanto num `alter table ... drop/add constraint`
   novo (pra funcionar mesmo com a tabela já existindo em produção).
4. ✅ `migration.sql` atualizado rodado pelo Erick no SQL Editor do Supabase (confirmado).

O placeholder do campo "Usuário" na tela de login (`src/pages/staff/Login.tsx`) também foi
corrigido pra citar a Mayte — antes só dizia "flavia, jheny ou vitoria".

## Fotos placeholder — o histórico

- **Flávia**: sem foto de rosto nos assets do projeto (nunca existiu). Hero e card da equipe
  usam uma foto real de trabalho dela (mão fazendo unha), não um rosto de banco de imagens.
- **Jheny e Vitória**: fotos de rosto são de banco de imagens (Unsplash), marcadas como
  "foto ilustrativa" na própria página. Instagram da Jheny é real (@jhenyluanyybeauty);
  Vitória ainda não tem.
- **Avaliações (depoimentos)**: os 6 são **fictícios**. Nome, texto e foto inventados; as
  fotos são de banco de imagens. `src/data/testimonials.ts` tem `avatar` por depoimento
  porque o Erick pediu foto em vez de iniciais, e reafirmou depois da ressalva.

  > **O selo de verificado está ligado em todos os 6** (campo `verified`, desde 05/09/2026),
  > e **não corresponde a verificação nenhuma**. Levantei que um selo de verificado afirma
  > pra cliente que alguém conferiu que a pessoa é real e esteve no salão, o que não é o
  > caso em nenhum dos 6, e o Erick mandou colocar assim mesmo. Fica registrado porque é
  > afirmação sobre experiência de terceiros num site de negócio real, não escolha de
  > design.
  >
  > O campo é por depoimento de propósito: quando entrarem avaliações reais, é marcar
  > `true` só nas verdadeiras e `false` nas que ainda forem placeholder, sem tocar no
  > componente. A Flávia já tem 110 clientes na base e VIPs identificadas (Maria, Dona
  > Maria, Gabi, Thais) — é de lá que sai depoimento de verdade.

## Cards de serviço levam pro WhatsApp

Desde 05/09/2026 os cards de serviço são links, não divs: `ServiceGrid` (páginas das
profissionais) e os dois formatos do ranking em `Pricing` (home). O link vem de
`whatsappForService()` no `professionals.ts` e **já leva a mensagem escrita**, então a
cliente cai no chat com "queria agendar Alongamento em Gel com a Flávia" digitado, em vez
de um "Oi" vazio que ela precisa completar.

**O card inteiro vira o link, e não um botão dentro dele.** É deliberado: existe pedido
antigo do Erick de não encher o site de botão "Agendar pelo WhatsApp". A dica textual
(`.svc-cta`) só aparece no hover, e em telas de toque (`@media (hover: none)`) fica sempre
visível, já que no celular não há estado intermediário pra revelar que o card é clicável.

## `/trabalhe-conosco`

Página pública de recrutamento, criada em 07/09/2026. O conteúdo vem do deck
`projeto-expansao/apresentacao-colaboradoras.html`, que é material **interno e fora do
git**. Se o deck mudar, esta página não muda sozinha: são cópias independentes.

> **Duas coisas do deck ficaram deliberadamente fora da página pública:** o valor da
> locação (R$ 500/mês) e a divisão da plataforma de cursos (90/10). Motivo: o Erick já
> tinha tirado condição comercial dos documentos uma vez, em 24/08/2026 ("vamos contar
> isso só depois"), e aqui é site público, onde o número fica exposto a concorrente e
> trava a negociação antes da conversa acontecer. A página vende a oportunidade e leva
> pro WhatsApp com mensagem pronta; o valor sai na entrevista. **Se for pra publicar o
> valor, é decisão dele, não esquecimento meu.**

A rota está declarada **antes** de `/:slug` no `App.tsx`. Aquele é catch-all de página de
profissional e engoliria qualquer rota estática nova declarada depois dele.

## Área da Colaboradora (`/area-colaboradora`)

Login por **usuário + senha**, não e-mail — o Supabase Auth exige e-mail por baixo dos panos,
então `src/auth/staffUsers.ts` mapeia um apelido simples (`flavia`/`jheny`/`vitoria`) pra um
e-mail fixo e não-real (`<apelido>@studioflaviaalves.app`). As 3 colaboradoras nunca veem essa
parte — só digitam o apelido.

**Sair volta pra home, não pra tela de login** (desde 07/09/2026). A ordem no
`handleLogout` importa: navega primeiro, derruba a sessão depois. Invertido, o guard de
`!session` dispararia o `<Navigate>` pra `/area-colaboradora` antes e a tela de login
piscaria no caminho. A logo da sidebar também virou link pra home; era um `<div>` e
clicar nela não fazia nada.

**Consequência: "esqueci a senha" não funciona** (os e-mails não recebem nada de verdade).
Reset é manual, pelo painel do Supabase: Authentication → Users → clica na pessoa → Reset
Password.

Projeto Supabase: `gpfdqnfaxyomzlqtqwsh` (criado pelo Erick em 04/09/2026, é dele, não é o
Supabase de produção da Jet IA/Bannerjet — são projetos totalmente separados).

### Schema (`supabase/migration.sql`, idempotente — seguro rodar de novo)

4 tabelas, RLS habilitada em todas:
- `clients` — registro de clientes. Sem `phone`/`email` reais ainda pra maioria (a planilha
  antiga da Flávia não tinha esses campos).
- `appointments` — agendamentos/histórico de atendimentos. Desde 05/09/2026 carrega
  também `client_id` (vínculo com `clients`, populado pelo autocomplete), `services`
  (jsonb, `[{name, price}]`, porque um atendimento pode ter vários serviços) e
  `duration_min` (quanto tempo o bloco ocupa na agenda). A coluna antiga `service`
  (texto, singular) **continua existindo e não foi tocada**: é o único dado de serviço
  que as 260 linhas importadas têm. As telas leem `services` e caem em `service` quando
  o array está vazio. **Privado por profissional**
  (RLS: só `owner_id = auth.uid()`), desde 04/09/2026 — era compartilhado no começo e a Jheny
  reportou estar vendo os 260 atendimentos históricos da Flávia junto. `professional` continua
  como texto livre (`'Flávia' | 'Jheny' | 'Vitória'`) só pra exibição/import; quem manda no
  RLS é `owner_id`. Formulário não deixa mais escolher profissional — sempre insere no nome
  de quem está logada (`useAuth().name`). `owner_id` é `nullable` de propósito: linha órfã
  (sem match de e-mail no backfill) fica invisível pra todo mundo em vez de travar a migração.
- `salon_transactions` — **desde 15/09/2026, é só da Flávia.** Virou de ledger
  compartilhado (`using (true)`) pra RLS igual `rent_payments`: compara
  `auth.jwt() ->> 'email'` com o e-mail dela. Decisão do Erick depois de eu sugerir juntar
  Contas do Salão com Gastos Pessoais numa tela só com abas — ele preferiu simplificar na
  direção oposta: **as outras colaboradoras nem veem mais essa tela.** O link some da
  sidebar pra quem não é `isOwner` (`StaffLayout.tsx`, `NAV_ITEMS[].ownerOnly`) e a própria
  página redireciona pra Gastos Pessoais se alguém tentar entrar direto pela URL
  (`ContasSalao.tsx`, `if (!isOwner) return <Navigate .../>`) — a RLS nova é a trava real,
  as outras duas são só UX. **O trecho anterior deste arquivo sobre travar só o campo
  "Profissional" (mantendo a tela visível pra todas) foi revertido**, durou poucas horas:
  o pedido evoluiu de "trava o campo" pra "a tela nem deveria existir pras outras".
  O que substitui Contas do Salão pras colaboradoras é o âmbito `scope: 'salao'` que
  `personal_expenses` **já tinha** desde 05/09/2026 (ver comentário na criação da coluna) —
  cada uma lança lá o que pôs no salão, e a Flávia já enxergava a soma por pessoa em
  "Visão Geral da Equipe" (`GastosPessoais.tsx`) sem precisar de nada novo. Isso já existia
  antes mesmo de o Erick pedir explicitamente; só faltava fechar a porta de `salon_transactions`.
- `rent_payments` — aluguel do posto de trabalho das colaboradoras, uma linha por pessoa
  por mês. **RLS deixa só a Flávia ler e escrever** (compara o e-mail no JWT), então pra
  Jheny e Vitória a consulta volta vazia e o painel nem renderiza. Elas não veem nem o
  próprio status; se isso mudar, o caminho é uma policy de `select` extra comparando o
  e-mail com a coluna `professional`. O `unique (professional, reference_month)` é o que
  permite a tela usar `upsert` sem duplicar linha ao clicar duas vezes no mesmo mês.
  Quem paga está em **dois** lugares que precisam concordar: a constante `RENT_PAYERS` no
  `ContasSalao.tsx` e o `check` da coluna `professional` no migration. Colaboradora nova
  entra nos dois, senão o banco recusa o insert.
- `personal_expenses` — gastos pessoais. Tem `scope` (`'pessoal' | 'salao'`) desde
  05/09/2026: cada profissional tem dois bolsos, o gasto da vida dela e o que ela põe no
  salão (aluguel do posto, produtos, limpeza, comida), e a Flávia precisa somar o segundo
  por pessoa. Default `'pessoal'`, o que classifica corretamente os 80 lançamentos
  importados (são de quando a Flávia era autônoma sozinha). **Privado por padrão** (RLS: só o próprio
  `owner_id = auth.uid()`), **exceto a Flávia**, que tem uma policy de `select` extra
  liberando ler (não editar) o de todo mundo, comparando
  `auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app'`. Ela pediu isso porque é dona do
  studio e precisa ter noção de quanto o salão precisa faturar pra sustentar as 3.

### A agenda semanal (`/area-colaboradora` > Agendamento)

Grade horária no formato do Google Agenda, sem biblioteca: colunas são dias, a régua da
esquerda são as horas, e cada atendimento é um bloco posicionado por `top`/`height`
calculados a partir do horário e da `duration_min`.

**Toda regra de horário mora em `src/lib/schedule.ts`**, em quatro constantes no topo.
Mudou o funcionamento do salão, muda ali e a grade, os horários vagos e a mensagem
acompanham juntos:

```
OPEN_HOUR  = 9        CLOSE_HOUR = 19
SLOT_MIN   = 30       WORK_DAYS  = [2,3,4,5,6,0]   // terça a domingo
```

> Dias e horário **confirmados pelo Erick em 05/09/2026**: terça a domingo, fecha às 19h.
> O encaixe de 30min segue como premissa minha, nunca foi questionado.

A semana do studio não casa com a do calendário: como abre na terça e fecha no domingo,
`weekStart()` acha a terça que abre o bloco, e a segunda (dia fechado) cai no bloco que
começa no dia seguinte, que é o que a profissional quer ver numa segunda.

`freeSlots()` testa **sobreposição de intervalo**, não de encaixe: um alongamento de 2h
fecha 4 slots de 30min, e nenhum deles sobra. Atendimento cancelado não bloqueia horário,
a vaga voltou a existir.

**A ordem da tela é formulário primeiro, agenda depois** (invertido em 05/09/2026 a
pedido do Erick). Marcar é a ação principal; a grade é consulta. Com a agenda em cima, uma
semana vazia empurrava o formulário pra fora da primeira dobra.

A grade tem linha cheia na hora e tracejada na meia hora, marca a coluna de hoje com uma
barra no topo (não com fundo cheio, que competia com os blocos dentro dela) e desenha uma
linha de "agora" que **anda de minuto em minuto** via `setInterval`: sem isso ela congela
no horário em que a aba abriu e passa a mentir.

Clicar num espaço vazio joga o horário no formulário. Clicar no cabeçalho do dia copia a
mensagem pronta pra WhatsApp (`availabilityMessage()`), com contagem e lista dos horários,
teto de 10 e "e mais N" acima disso. A área de transferência **só funciona em contexto
seguro** (https ou localhost); se falhar, a tela mostra o texto pra copiar na mão em vez
de sumir sem explicação.

### Duração dos serviços

`durationMin` em cada um dos 18 serviços do `src/data/professionals.ts`. **Continuam sendo
estimativas minhas, não medidas no salão**, com uma exceção: **Manicure é 2h**, corrigido
pelo Erick em 05/09/2026 (eu tinha chutado 45min, errei por bastante). Os outros 17 seguem
no chute e não foram validados. Não aparecem no site público, só na agenda.

> O erro da Manicure sugere que os outros chutes também estão curtos. Vale revisar a lista
> inteira com a Flávia antes de a agenda virar operação de verdade.

O preço continua sendo string (`'R$120'`), porque nasceu pro site público onde é texto
puro. `priceOf()` deriva o número. Preferi uma fonte só a dois campos que divergem.

### O painel RETORNO (`/area-colaboradora/retorno`)

Lista de quem sumiu, pra a profissional chamar de volta. Criado em 07/09/2026.

**A lista não é uma tabela no banco.** Ela é calculada na tela a partir da data do último
atendimento em `appointments`, cruzada com `clients` pra pegar o telefone. Isso é
deliberado: se fosse tabela, alguém teria que alimentar e ela envelheceria sozinha. Do
jeito que está, a cliente entra sem ninguém fazer nada e **sai no momento em que um
atendimento novo é marcado**, porque a data do último muda.

O que entra na lista: último atendimento há **14 dias ou mais** (`RETURN_AFTER_DAYS`),
sem cancelamento contando como visita e sem nenhum agendamento futuro.

`client_returns` guarda só a **exceção**, o que a profissional decidiu:

| status | efeito |
|---|---|
| `recusado` | some por 14 dias (`SNOOZE_DAYS`), volta sozinha depois |
| `dispensado` | some de vez, só volta se ela devolver na seção "Fora da lista" |

> **A marca só vale se for posterior ao último atendimento.** Se a cliente foi dispensada
> e depois voltou ao salão, a linha antiga é ignorada e o ciclo recomeça. Sem essa regra,
> um "dispensado" de um ano atrás esconderia pra sempre uma cliente que voltou a ser
> frequente.

`client_key` é o **nome normalizado**, não o `client_id`: as 260 linhas importadas da
planilha não têm id, e chavear por id deixaria metade da base de fora. O id vai junto
quando existe, só pra rastreabilidade.

As três ações do card:

- **Enviar mensagem** monta o texto com o nome, o tempo sem voltar e o último serviço.
  Com telefone no cadastro abre o WhatsApp direto; **sem telefone copia pra área de
  transferência**, que é o caso dos 110 clientes importados (vieram só com nome). O card
  avisa qual dos dois vai acontecer antes de ela clicar.
- **Contato feito** navega pro Agendamento passando a cliente no `state` da rota. O
  formulário preenche nome e id e deixa serviço e horário em aberto. O `useEffect` que lê
  isso limpa o state com `replace: true`: sem isso, um F5 reinjetaria a mesma cliente por
  cima do que estivesse sendo digitado.
- **Recusado** e a **lixeira** gravam em `client_returns`.

### Funcionalidades específicas

- **Clientes VIP** (`Clientes.tsx`): calculado automaticamente, não é campo manual. Cruza
  `clients.name` com `appointments.client_name` (case-insensitive, trim) e considera VIP quem
  tem **10+ atendimentos concluídos** (`VIP_MIN_VISITS`, ajustável no topo do arquivo).
  **Mudou de 3 pra 10 em 16/09/2026, a pedido do Erick.** O valor `3` original tinha sido
  validado contra a lista real de VIPs que a Flávia mantinha na planilha (Maria, Dona
  Maria, Gabi, Thais) e batia certo — com `10`, é bem provável que **menos gente** (ou
  ninguém dessas 4) ainda bata o critério. Não recontei quem continua VIP com o número
  novo porque é decisão de negócio dele, não bug a corrigir; se o quadro de VIPs sumir
  quase todo, é esse motivo.
- **Filtro de mês** (`useMonthFilter.ts`, usado em Contas do Salão e Gastos Pessoais): abre
  sempre no mês atual, navega com setas. É a tradução pra banco de dados do hábito antigo da
  Flávia de criar uma aba nova por mês na planilha — aqui os dados ficam numa tabela só, só a
  visão que é filtrada.
- **Gastos Pessoais** é entrada/saída (salário − gastos = saldo), não só uma lista de
  despesas — replica o formato exato da planilha real dela (ver "Importação de dados" abaixo).
- **Autocomplete de cliente** (`Agendamento.tsx`): combobox próprio, não `<datalist>`. O
  datalist devolve só o texto digitado, e o agendamento precisa saber **qual** cliente foi
  escolhida pra gravar o `client_id`. Digitar um nome que não existe é permitido: entra
  como texto solto naquele agendamento, sem criar cadastro.
- **Vários serviços por atendimento**: chips de múltipla escolha, alimentados pelo catálogo
  da profissional logada (`servicesForName()`, a mesma lista do site público). Preço e
  duração somam sozinhos; o campo de valor aceita sobrescrever o total quando o combinado
  foi outro.
- **Contagem de visitas** (`Clientes.tsx`): duas contagens em paralelo, e cada agendamento
  cai em exatamente uma. Por `client_id` (agendamentos novos) e por nome normalizado (as
  260 linhas importadas, que não têm id). Somar as duas fecha o histórico sem contar
  ninguém duas vezes.
- **Dashboards** de Contas do Salão e Gastos Pessoais (`Dashboard.tsx`): cartões de
  totais e barras por categoria. **Não existe cadastro de categoria em lugar nenhum** — os
  dois módulos derivam tudo dos lançamentos que já estão na tabela. Categoria nova aparece
  sozinha, categoria abandonada some. A escala das barras é relativa ao maior item da
  lista, não a um teto fixo, senão mês fraco deixaria tudo rente ao chão.
- **Controle de aluguel** (`ContasSalao.tsx`, só a Flávia): um cartão por colaboradora no
  mês selecionado, com botão de marcar/desmarcar pago. Grava por `upsert` na chave
  `(professional, reference_month)`.

## Importação de dados reais (04/09/2026)

A Flávia já usava uma planilha (`Controle de Clientes _ Flávia.xlsx`, 16 abas — uma por mês,
abril/2025 a agosto/2026) pra controlar clientes, atendimentos e gastos pessoais. Foi
importada pra já abrir o sistema com histórico real em vez de vazio:

- **110 clientes únicos**, **260 atendimentos** (todos `professional = 'Flávia'`, `status =
  'concluido'`, já que são anteriores à Jheny/Vitória entrarem) e **80 lançamentos** de
  gastos/salário pessoal.
- Datas: quando a planilha tinha só o dia do mês (comum — muita linha com data
  `00/00/00` de placeholder), o dia 1 do mês da aba foi usado como fallback. Não é 100% fiel
  pra essas linhas, mas preserva cliente/serviço/valor, que é o que importa pro cálculo de VIP
  e pro histórico de faturamento.
- Categorias de gasto (Cartão, Academia, Aluguel, Celular, Petlove, Plano, Produtos...) foram
  todas pra `personal_expenses`, não `salon_transactions` — a planilha antiga não distinguia
  gasto pessoal de gasto do salão (a Flávia era autônoma solo), então não dava pra separar
  com segurança. `salon_transactions` fica vazio até alguém lançar algo.

**O SQL gerado (`supabase/import-flavia-data.sql`) tem nome real de 110 clientes — nunca foi
commitado, está só localmente e no `.gitignore` de propósito** (é PII, o repo é público). Se
precisar reimportar ou gerar de novo: a planilha original está em
`~/Downloads/Controle de Clientes _ Flávia  (1).xlsx`, e o script Python que fez a extração
(openpyxl) não foi salvo em lugar nenhum — foi rodado uma vez inline. Se for refazer, a lógica
está descrita acima; não é complicado reconstruir.

## Fora do git: `projeto-expansao/`

Os 4 HTMLs autocontidos do projeto de crescimento do salão (deck estratégico da Flávia, deck
convite das colaboradoras, contrato de locação de R$ 500/mês e ata de reunião mensal) moram
em `projeto-expansao/`. **Estão no `.gitignore` desde 05/09/2026 e é para continuarem assim:
este repo é público**, e ali dentro tem o modelo de contrato, os valores e a estratégia de
expansão. Se for preciso levar o material pra outra máquina, o caminho é um repo privado
separado, nunca este. Hoje o conteúdo só existe no PC pessoal Windows do Erick.

## As máquinas

O projeto já foi mexido de mais de uma máquina, e nem tudo viaja no `git clone`:

- **Mac** — sessão de 04/09/2026 (migração pra React, área da colaboradora, importação dos
  dados reais). A identidade do git ali não estava configurada, então os commits daquele dia
  saem como `erickk@iMac-de-Erick.local`.
- **PC pessoal Windows** (`ARQUIVOS/CODE/Site Flavia`) — sessão de 05/09/2026 (rebrand pra
  Afrodite Studio). A pasta estava parada na versão HTML estática de maio e **nem era repo
  git**; levou `git init` + `fetch` da `main` em 05/09.

O que **não** chega numa máquina nova pelo clone e precisa ser refeito à mão: o `.env` (as
duas chaves do Supabase), o `supabase/import-flavia-data.sql` (PII) e o `projeto-expansao/`.

## Pendências / observações

### Aberto, em ordem de risco

- **Nada desta sessão foi conferido em tela.** Tipografia nova, ícones no lugar dos
  emojis, políticas em 3 colunas, Resultados com três fotos e o painel RETORNO inteiro
  passaram só por compilação e build. Vale abrir e olhar antes de considerar pronto.
- **Os serviços e preços da Flávia e da Vitória foram inventados por mim** e nunca foram
  validados com elas. O portfólio da Jheny provou que esse tipo de chute erra feio: os 6
  serviços dela que estavam no ar não existiam, e os preços reais são bem menores. **Pedir
  o material das duas** antes que alguma cliente cobre um preço que o site anuncia.
- **As durações dos serviços também são chute meu**, com uma exceção: Manicure é 2h,
  corrigido pelo Erick, e eu tinha posto 45min. Errar 75 minutos num serviço sugere que os
  outros 17 estão igualmente errados. A agenda semanal desenha os blocos com esses
  números, então isso vira erro operacional assim que ela for usada pra valer.
- **Rotacionar a `sb_secret_`**, se ainda não foi feito. Ela foi colada num chat em
  05/09/2026. Ignora RLS inteira, incluindo os 110 nomes de clientes. Settings → API Keys.
- **O GitHub Pages está com a marca antiga.** `npm run deploy` resolve. A Vercel está em
  dia, ela builda sozinha a cada push na `main`.
- **O header tem 4 itens agora** (Cursos, Trabalhe Conosco, Área da Colaboradora, Agendar
  Agora) e **não foi conferido visualmente em tela média**. Pode ter ficado apertado.
- **Publicar ou não o valor da locação** em `/trabalhe-conosco`. Hoje está fora de
  propósito, ver a seção daquela página. É decisão do Erick, não esquecimento.
- ~~A Mayte paga aluguel de posto ou não?~~ → **confirmado pelo Erick em 15/09/2026: paga,
  igual Jheny e Vitória.** Entrou em `RENT_PAYERS` (`ContasSalao.tsx`) e no `check` de
  `rent_payments` no `migration.sql`, com o mesmo `alter table drop/add constraint` que
  `appointments` já usava, pra funcionar mesmo com a tabela existindo em produção. **Falta
  rodar esse `migration.sql` atualizado no SQL Editor do Supabase** — sem isso o `alter
  table` só existe no arquivo, e marcar o aluguel da Mayte como pago seria rejeitado pelo
  banco.

### Decisões que ficaram registradas, não são pendência

- **VIP é por profissional, não do studio.** Consequência da RLS de `appointments`: o
  `Clientes.tsx` só enxerga os agendamentos de quem está logada, então uma cliente VIP com
  a Flávia não aparece como VIP no login da Jheny. Não mexi porque desfazer isso reabriria
  a privacidade que motivou a mudança de 04/09. Se incomodar, o caminho é uma view ou RPC
  que devolve só a contagem agregada, sem expor as linhas.
- **O selo de verificado está em depoimentos fictícios.** Ver a seção de fotos placeholder.
- ~~A galeria da Flávia perdeu resolução ao migrar pro Instagram~~ → **superado em
  16/09/2026**: a galeria atual usa fotos novas em resolução bem maior (ver "Fotos em
  resolução cheia, enviadas direto pelo Erick").

### Esperando dado de terceiro

- Depoimentos reais. A Flávia tem 110 clientes na base e VIPs identificadas (Maria, Dona
  Maria, Gabi, Thais). Com eles, o campo `verified` passa a ser verdade.
- ~~Fotos em resolução cheia da Flávia e da Jheny~~ → **resolvido em 16/09/2026**, galeria
  das duas trocada por fotos novas enviadas pelo Erick. Avatares continuam como estavam.
- Galeria de trabalhos da Vitória: continua banco de imagem, só o rosto dela é real. Ela
  também não tem Instagram; o da Jheny (`@jhenyluanyybeauty`) é real.
- Confirmar o encaixe de 30min da agenda com a Flávia. Dias (terça a domingo) e horário
  (fecha às 19h) já foram confirmados pelo Erick.
- `salon_transactions` (Contas do Salão) está sem nenhum dado real: só a Flávia tinha
  planilha, e ela não separava gasto do salão de gasto pessoal.
- `phone`/`email`/`notes` dos 110 clientes importados estão vazios: a planilha antiga não
  tinha essas colunas, só nome.
- ~~Galeria de trabalhos reais da Mayte~~ → **resolvida em 15/09/2026**, 6 fotos reais do
  `@espaco.seixas`. Ver seção "Mayte entra como quarta profissional".

### Coisas técnicas que valem lembrar

- **Sem fluxo de troca de senha** pelas colaboradoras. Reset é manual, em
  Authentication → Users → Reset Password.
- **Chave do Supabase no formato novo** (`sb_publishable_` / `sb_secret_`), não o par
  antigo em JWT. A publishable vai em `VITE_SUPABASE_ANON_KEY` e o supabase-js aceita.
  A Vercel já está configurada com ela.
- **Sondar o schema sem abrir o painel**, com a publishable no `.env`:

  ```bash
  KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d= -f2)
  curl -s -o /dev/null -w "%{http_code}\n" \
    "https://gpfdqnfaxyomzlqtqwsh.supabase.co/rest/v1/rent_payments?select=id&limit=1" \
    -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
  ```

  200 = tabela existe, 404 = falta rodar o migration. O root `/rest/v1/` **não** serve pra
  isso: exige chave secreta e devolve 401 com a publishable.
- **`.env` só entrou no `.gitignore` em 05/09/2026.** O `*.local` cobre `.env.local` mas
  não um `.env` puro, e o repo é público. Se alguém criar um `.env` numa máquina com o
  `.gitignore` antigo, vaza.
- **Anexo de conversa não vira arquivo em disco.** Eu enxergo a imagem que o Erick cola no
  chat mas não consigo gravá-la: ele precisa salvar à mão e me dizer o caminho.
- **Ferramentas instaladas nesta máquina** pra viabilizar o trabalho: `ffmpeg` (Gyan.FFmpeg,
  compressão e recorte dos vídeos do hero, e extração de frames pra eu conferir
  enquadramento) e `poppler` (oschwartz10612.Poppler, renderização do portfólio em PDF).
  Ambas via winget, e ambas precisam de `--source winget`: a fonte `msstore` falha com erro
  de certificado nesta máquina.
