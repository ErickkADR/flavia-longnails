# Afrodite Studio

Site institucional + área interna (login) de um studio de beleza com três profissionais:
Flávia (unhas, dona do studio), Jheny (maquiagem) e Vitória (cabelo).

No ar em dois lugares:
- **GitHub Pages**: https://erickkadr.github.io/flavia-longnails/ (branch `gh-pages`, deploy via `npm run deploy`)
- **Vercel**: https://afroditestudio.vercel.app (deploy automático a cada push na `main`, projeto Vercel se chama "afrodite_studio")

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
| Avatar da Jheny | stock, 700x700 | foto real dela, **150x150** |
| Avatar da Flávia | foto de trabalho, 682x788 | **ainda não mudou**, ver pendência |
| Vitória | tudo stock | **não mudou** (ela não tem Instagram) |

> **Isso rebaixou a resolução da galeria da Flávia**, e foi decisão consciente dele depois
> de eu levantar a ressalva. O Instagram comprime tudo pra 640px e **não deixa pedir maior**:
> trocar o parâmetro de tamanho na URL dá 403, porque a assinatura (`oh=`) cobre ele. O
> avatar da Jheny em 150x150 aparece num círculo de 240px, então amplia e fica macio.
>
> **O avatar do Instagram da Flávia é um desenho, não foto.** Por isso ela ficou com a foto
> de trabalho que já estava lá.

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
- **Avaliações (depoimentos)**: são fictícias — mas o Erick pediu explicitamente foto real
  (banco de imagens) em vez de iniciais, depois de eu ter optado por iniciais por padrão. Ele
  reafirmou o pedido, então está como ele pediu: `src/data/testimonials.ts` tem um campo
  `avatar` por depoimento.

## Área da Colaboradora (`/area-colaboradora`)

Login por **usuário + senha**, não e-mail — o Supabase Auth exige e-mail por baixo dos panos,
então `src/auth/staffUsers.ts` mapeia um apelido simples (`flavia`/`jheny`/`vitoria`) pra um
e-mail fixo e não-real (`<apelido>@studioflaviaalves.app`). As 3 colaboradoras nunca veem essa
parte — só digitam o apelido.

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

- ~~Rodar o `migration.sql`~~ → **rodado e confirmado em 05/09/2026.** Sondagem pelo REST
  devolveu 200 para `appointments.client_id/services/duration_min`, `personal_expenses.scope`
  e `rent_payments`. O banco está em dia com o código.

  Pra sondar de novo depois de qualquer mudança de schema, com a chave publishable no `.env`:
  ```bash
  KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d= -f2)
  curl -s -o /dev/null -w "%{http_code}
"     "https://gpfdqnfaxyomzlqtqwsh.supabase.co/rest/v1/rent_payments?select=id&limit=1"     -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
  ```
  200 = aplicado, 404 = falta rodar. O root `/rest/v1/` (spec OpenAPI) **não** serve pra
  isso: exige chave secreta e devolve 401 com a publishable.
- **VIP é por profissional, não do studio.** Consequência da RLS de `appointments`: o
  `Clientes.tsx` só enxerga os agendamentos de quem está logada, então uma cliente VIP com
  a Flávia não aparece como VIP no login da Jheny. O cadastro de clientes é compartilhado,
  a contagem não. Não mexi porque desfazer isso reabriria a privacidade que foi o motivo
  da mudança de 04/09. Se incomodar, o caminho é uma view ou RPC que devolve só a
  contagem agregada, sem expor as linhas.
- **O projeto usa o formato NOVO de chave do Supabase** (`sb_publishable_...` /
  `sb_secret_...`), não o par antigo `anon`/`service_role` em JWT. A publishable vai em
  `VITE_SUPABASE_ANON_KEY` e o supabase-js aceita normalmente. **A secret nunca entra em
  nada aqui**: o site é todo client-side e ela ignora RLS inteira, incluindo os 110 nomes
  de clientes.
  > A `sb_secret_` foi colada num chat em 05/09/2026 e **precisa ter sido rotacionada**.
  > Se ninguém rotacionou, rotacionar agora em Settings → API Keys.
- **`.env` não estava no `.gitignore`** até 05/09/2026: o `*.local` cobre `.env.local` mas
  não um `.env` puro. Como o repo é público, isso teria vazado no primeiro commit depois de
  criar o arquivo. Corrigido com `.env`, `.env.*` e `!.env.example`.
- ~~Falta a foto de rosto da Flávia~~ → **resolvido em 05/09/2026.**
  `public/images/flavia-perfil.jpg`, 640x640. É a primeira foto de rosto dela no projeto;
  até então o card da equipe usava `avatar-about-BtqxEbBP.png`, uma foto de trabalho (mão
  com luva aplicando esmalte), que continua no repo.
  > Registro pra próxima vez: **anexo de conversa não vira arquivo em disco.** Eu enxergo a
  > imagem que o Erick cola no chat mas não consigo gravá-la; ele precisa salvar à mão e me
  > dizer o caminho. Ele salvou como `flavia-perfil.jpg.png` (extensão dupla), era JPEG, foi
  > renomeado.
- **O rebrand ainda não subiu pros hosts.** Push na `main` cobre a Vercel sozinho; o GitHub
  Pages precisa de `npm run deploy` à parte.
- `salon_transactions` (Contas do Salão) está sem nenhum dado real ainda: só a Flávia tinha
  planilha, e ela não separava gasto do salão de gasto pessoal.
- Sem fluxo de troca de senha pelas próprias colaboradoras (só reset manual pelo Erick, em
  Authentication → Users → Reset Password).
- `phone`/`email`/`notes` dos 110 clientes importados estão vazios: a planilha antiga não
  tinha essas colunas, só nome.
- O Instagram da Vitória ainda não existe; o da Jheny (`@jhenyluanyybeauty`) é real.
