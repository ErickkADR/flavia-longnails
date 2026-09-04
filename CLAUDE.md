# Studio Flávia Alves

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

## Fotos placeholder — o que é real e o que não é

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
- `appointments` — agendamentos/histórico de atendimentos. **Privado por profissional**
  (RLS: só `owner_id = auth.uid()`), desde 04/09/2026 — era compartilhado no começo e a Jheny
  reportou estar vendo os 260 atendimentos históricos da Flávia junto. `professional` continua
  como texto livre (`'Flávia' | 'Jheny' | 'Vitória'`) só pra exibição/import; quem manda no
  RLS é `owner_id`. Formulário não deixa mais escolher profissional — sempre insere no nome
  de quem está logada (`useAuth().name`). `owner_id` é `nullable` de propósito: linha órfã
  (sem match de e-mail no backfill) fica invisível pra todo mundo em vez de travar a migração.
- `salon_transactions` — contas do salão, compartilhado entre as 3 (RLS: qualquer
  `authenticated` lê/escreve tudo).
- `personal_expenses` — gastos pessoais, **privado por padrão** (RLS: só o próprio
  `owner_id = auth.uid()`), **exceto a Flávia**, que tem uma policy de `select` extra
  liberando ler (não editar) o de todo mundo, comparando
  `auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app'`. Ela pediu isso porque é dona do
  studio e precisa ter noção de quanto o salão precisa faturar pra sustentar as 3.

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

## Pendências / observações

- **URGENTE pra próxima sessão: rodar de novo o `supabase/migration.sql` no SQL Editor.**
  Ele foi atualizado em 04/09/2026 (depois do commit anterior) pra tornar `appointments`
  privado por profissional — sem rodar essa parte, a Jheny e a Vitória continuam vendo o
  histórico inteiro da Flávia. É seguro rodar o arquivo inteiro de novo (idempotente).
- Identidade do git neste Mac não está configurada (commits saem como
  `erickk@iMac-de-Erick.local`) — mencionado ao Erick, ele não pediu pra mexer.
- `salon_transactions` (Contas do Salão) está sem nenhum dado real ainda — só a Flávia tinha
  planilha, e ela não separava gasto do salão de gasto pessoal.
- Sem fluxo de troca de senha pelas próprias colaboradoras (só reset manual pelo Erick/painel).
- `phone`/`email`/`notes` dos 110 clientes importados estão vazios — a planilha antiga não
  tinha essas colunas, só nome.
