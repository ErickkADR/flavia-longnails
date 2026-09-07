# Afrodite Studio

Site institucional + área interna (login) de um studio de beleza com três profissionais:
Flávia (unhas, dona do studio), Jheny (maquiagem) e Vitória (cabelo).

No ar em dois lugares:
- **GitHub Pages**: https://erickkadr.github.io/flavia-longnails/ (branch `gh-pages`, deploy via `npm run deploy`)
- **Vercel**: https://afroditestudio.vercel.app (deploy automático a cada push na `main`, projeto Vercel se chama "afrodite_studio")

## Onde paramos (07/09/2026)

Última sessão fechou em `3233d8d`, tudo commitado e no ar na Vercel. Se você está
voltando depois de semanas, leia estes três pontos antes de qualquer coisa:

1. **Os preços da Flávia e da Vitória no site são invenção minha.** Nunca passaram por
   elas. Descobrimos isso pelo portfólio da Jheny, cujos 6 serviços inventados viraram os
   3 reais dela, com preços bem menores. É o risco aberto mais sério do projeto: o site
   anuncia valores que o salão pode não praticar. Detalhe na seção do portfólio.
2. **O banco está em dia com o código.** O `migration.sql` foi rodado e confirmado por
   sondagem. Não precisa rodar de novo, a menos que o schema mude.
3. **O GitHub Pages está desatualizado**, ainda com a marca antiga. Só a Vercel recebe
   deploy no push; o Pages precisa de `npm run deploy` à parte e ninguém rodou.

O que a sessão de 05 a 07/09 entregou: rebrand pra Afrodite Studio, hero de tela cheia
com três vídeos alternando, agenda semanal e dashboards na área da colaboradora, controle
de aluguel, cards de serviço abrindo o WhatsApp, fotos reais das três profissionais e a
página `/trabalhe-conosco`.

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

## Marca — o rebrand de 05/09/2026

O studio se chamava **Studio Flávia Alves** e virou **Afrodite Studio** em 05/09/2026, a
pedido do Erick. Fecha a questão de marca que estava em aberto desde o projeto de expansão:
"Long Nails" (e depois o nome próprio da Flávia) comunicava só uma pessoa e uma
especialidade, e o salão é multi-especialidade com três profissionais.

No logo, a ênfase é em **Afrodite**: o `<span>` do `.nav-logo` e do `.staff-sidebar-logo` é
a parte *leve* (accent-deep, weight 400), então a marcação ficou `Afrodite <span>Studio</span>`,
não o contrário. Trocar a ordem sem trocar o span inverte o destaque.

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

## Design

Paleta bege claro + terracota só como acento (nunca fundo grande sólido — já foi feedback
explícito: "ficou marrom, não quero isso"). Fontes Cinzel/Cinzel Decorative/Cormorant
Garamond/Jost, mesmas do site antigo.

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

Agora são três planos em `Resultados.css`: um contorno fino deslocado ao fundo, o arco
principal no meio (topo abaulado, base reta, proporção 3/4 igual à das fotos do Instagram,
então não corta nada) e um círculo menor à frente mordendo o canto inferior esquerdo.

A borda do círculo menor usa `var(--bg-alt)`, a cor de fundo da própria seção, e não branco:
é isso que faz ele parecer recortado de dentro do arco em vez de colado por cima.

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
- `salon_transactions` — contas do salão, compartilhado entre as 3 (RLS: qualquer
  `authenticated` lê/escreve tudo).
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

### Funcionalidades específicas

- **Clientes VIP** (`Clientes.tsx`): calculado automaticamente, não é campo manual. Cruza
  `clients.name` com `appointments.client_name` (case-insensitive, trim) e considera VIP quem
  tem **3+ atendimentos concluídos** (`VIP_MIN_VISITS`, ajustável no topo do arquivo).
  Validado contra a lista real de VIPs que a Flávia já mantinha na planilha (Maria, Dona
  Maria, Gabi, Thais) — bateu certo depois da importação dos dados reais.
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

### Decisões que ficaram registradas, não são pendência

- **VIP é por profissional, não do studio.** Consequência da RLS de `appointments`: o
  `Clientes.tsx` só enxerga os agendamentos de quem está logada, então uma cliente VIP com
  a Flávia não aparece como VIP no login da Jheny. Não mexi porque desfazer isso reabriria
  a privacidade que motivou a mudança de 04/09. Se incomodar, o caminho é uma view ou RPC
  que devolve só a contagem agregada, sem expor as linhas.
- **O selo de verificado está em depoimentos fictícios.** Ver a seção de fotos placeholder.
- **A galeria da Flávia perdeu resolução** ao migrar pro Instagram (1280x1920 → 640px).
  Decisão consciente dele depois da ressalva.

### Esperando dado de terceiro

- Depoimentos reais. A Flávia tem 110 clientes na base e VIPs identificadas (Maria, Dona
  Maria, Gabi, Thais). Com eles, o campo `verified` passa a ser verdade.
- Fotos em resolução cheia da Flávia e da Jheny. O que está no ar veio do Instagram em
  640px, exceto o avatar da Jheny (900x900, recortado do portfólio dela).
- Galeria de trabalhos da Vitória: continua banco de imagem, só o rosto dela é real. Ela
  também não tem Instagram; o da Jheny (`@jhenyluanyybeauty`) é real.
- Confirmar o encaixe de 30min da agenda com a Flávia. Dias (terça a domingo) e horário
  (fecha às 19h) já foram confirmados pelo Erick.
- `salon_transactions` (Contas do Salão) está sem nenhum dado real: só a Flávia tinha
  planilha, e ela não separava gasto do salão de gasto pessoal.
- `phone`/`email`/`notes` dos 110 clientes importados estão vazios: a planilha antiga não
  tinha essas colunas, só nome.

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
