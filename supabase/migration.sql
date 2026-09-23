-- Afrodite Studio - Área da Colaboradora
-- Cole isto inteiro no SQL Editor do painel do Supabase e rode uma vez.
-- (Se você já rodou uma versão anterior deste arquivo sem ter criado nenhum
-- dado ainda, pode apagar as 4 tabelas antes e rodar este de novo.)

-- ============================================================
-- 1. Registro de Clientes
-- ============================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. Agendamento de Clientes
-- ============================================================
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  professional text not null check (professional in ('Flávia', 'Jheny', 'Vitória', 'Mayte')),
  service text not null,
  scheduled_at timestamptz not null,
  price numeric(10, 2),
  status text not null default 'agendado' check (status in ('agendado', 'concluido', 'cancelado')),
  created_at timestamptz not null default now()
);

-- Mayte entrou em 15/09/2026 (4ª profissional). A tabela já existia em produção com o
-- check antigo, então "create table if not exists" acima não altera o que já está lá —
-- precisa dropar e recriar o constraint explicitamente.
alter table public.appointments drop constraint if exists appointments_professional_check;
alter table public.appointments add constraint appointments_professional_check check (professional in ('Flávia', 'Jheny', 'Vitória', 'Mayte'));

-- Cada profissional só vê os próprios agendamentos (antes era compartilhado e a Jheny via
-- o histórico da Flávia inteiro). owner_id fica nullable de propósito: linhas antigas sem
-- correspondência ficam só órfãs (invisíveis pra todo mundo) em vez de travar a migração.
alter table public.appointments add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.appointments alter column owner_id set default auth.uid();

update public.appointments set owner_id = (
  select id from auth.users where email = case professional
    when 'Flávia' then 'flavia@studioflaviaalves.app'
    when 'Jheny' then 'jheny@studioflaviaalves.app'
    when 'Vitória' then 'vitoria@studioflaviaalves.app'
  end
) where owner_id is null;

-- Vinculo com a cliente cadastrada. Antes o cruzamento era por texto (clients.name x
-- appointments.client_name), o que so funciona enquanto ninguem digita diferente. O
-- autocomplete do formulario passa a gravar o id aqui, e o historico/VIP deixa de
-- depender de casar string. Fica nullable: as 260 linhas importadas da planilha antiga
-- nao tem id de cliente, e client_name continua sendo a fonte pra elas.
alter table public.appointments add column if not exists client_id uuid references public.clients(id) on delete set null;

-- Mais de um servico por atendimento, como [{"name":"Manicure","price":40}].
-- A coluna `service` (texto, singular) continua existindo e nao foi tocada: e o unico
-- dado que as linhas importadas tem. A tela le `services` e cai em `service` quando
-- o array esta vazio.
alter table public.appointments add column if not exists services jsonb not null default '[]'::jsonb;

-- Quanto tempo o atendimento ocupa. A agenda semanal desenha o bloco com isso e usa
-- pra saber se um horario esta livre de verdade (um alongamento de 2h fecha 4 encaixes).
alter table public.appointments add column if not exists duration_min integer not null default 60;

-- ============================================================
-- 3. Controle de Contas do Salão (compartilhado entre as 3)
-- ============================================================
create table if not exists public.salon_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('entrada', 'saida')),
  category text not null,
  description text,
  amount numeric(10, 2) not null,
  professional text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. Controle de Gastos Pessoais
-- Cada uma só vê e mexe no próprio; a Flávia (dona do studio) também
-- consegue LER (não editar) o das outras duas, pra ter noção do quanto
-- precisa faturar pra manter o salão.
-- ============================================================
create table if not exists public.personal_expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  professional text not null default '',
  type text not null default 'saida',
  category text not null,
  description text,
  amount numeric(10, 2) not null,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

-- Caso a tabela já existisse de uma versão anterior deste arquivo, sem essas colunas:
alter table public.personal_expenses add column if not exists professional text not null default '';
alter table public.personal_expenses add column if not exists type text not null default 'saida';
alter table public.personal_expenses drop constraint if exists personal_expenses_type_check;
alter table public.personal_expenses add constraint personal_expenses_type_check check (type in ('entrada', 'saida'));

-- Ambito do lancamento. Cada profissional tem dois bolsos distintos: o gasto da vida
-- dela e o que ela poe no salao (aluguel do posto, produtos, limpeza, comida). A Flavia
-- precisa somar o segundo por pessoa, e sem essa coluna os dois viravam a mesma pilha.
-- Default 'pessoal' de proposito: os 80 lancamentos importados da planilha antiga sao
-- de quando a Flavia era autonoma sozinha, entao entram como gasto de vida.
alter table public.personal_expenses add column if not exists scope text not null default 'pessoal';
alter table public.personal_expenses drop constraint if exists personal_expenses_scope_check;
alter table public.personal_expenses add constraint personal_expenses_scope_check check (scope in ('pessoal', 'salao'));

-- ============================================================
-- 5. Aluguel das colaboradoras (so a Flavia enxerga e mexe)
-- Controle de quem pagou os R$ 500 do mes. Hoje sao Jheny, Vitoria e Mayte (confirmado
-- pelo Erick em 15/09/2026); a Flavia e dona do studio e nao paga aluguel pra si mesma,
-- por isso ela nao entra no check.
-- A unique(professional, reference_month) e o que deixa a tela usar upsert e nao
-- duplicar linha quando a Flavia clica duas vezes no mesmo mes.
-- ============================================================
create table if not exists public.rent_payments (
  id uuid primary key default gen_random_uuid(),
  professional text not null check (professional in ('Jheny', 'Vitória', 'Mayte')),
  reference_month date not null,
  amount numeric(10, 2) not null default 500,
  paid boolean not null default false,
  paid_on date,
  notes text,
  created_at timestamptz not null default now(),
  unique (professional, reference_month)
);

-- A tabela ja existia em producao com o check antigo (so Jheny/Vitoria) quando a Mayte
-- entrou como quarta profissional, entao o "create table if not exists" acima nao altera
-- o que ja esta la. Mesmo padrao aplicado em appointments.professional.
alter table public.rent_payments drop constraint if exists rent_payments_professional_check;
alter table public.rent_payments add constraint rent_payments_professional_check check (professional in ('Jheny', 'Vitória', 'Mayte'));

-- ============================================================
-- 6. Retorno de clientes (painel RETORNO)
-- A LISTA de quem sumiu nao mora aqui: ela e calculada na tela, a partir da data do
-- ultimo atendimento em `appointments`. Esta tabela guarda so a EXCECAO, ou seja o
-- que a profissional decidiu sobre aquela cliente:
--   'recusado'   -> ela disse que nao quer agora; some ate `snooze_until`
--   'dispensado' -> a profissional apagou o card; some de vez
-- `client_key` e o nome normalizado (minusculo, sem espaco nas pontas) porque as 260
-- linhas importadas da planilha nao tem client_id, e sem isso metade da base ficaria
-- de fora. O client_id vai junto quando existe, so pra rastreabilidade.
-- ============================================================
create table if not exists public.client_returns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_key text not null,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null default '',
  status text not null check (status in ('recusado', 'dispensado')),
  snooze_until date,
  created_at timestamptz not null default now(),
  unique (owner_id, client_key)
);

-- ============================================================
-- 7. Catálogo de Serviços (tela "Meus Serviços", 23/09/2026)
-- Até aqui os serviços de cada profissional eram um array fixo no código
-- (src/data/professionals.ts), editado por mim. A partir de agora cada uma edita o
-- próprio catálogo pela Área da Colaboradora, e essa tabela alimenta tanto o
-- Agendamento quanto a página pública dela (`professional` funciona igual ao de
-- `appointments`: é o rótulo pro texto/consulta, quem manda na permissão de
-- escrita é `owner_id`).
-- ============================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade default auth.uid(),
  professional text not null check (professional in ('Flávia', 'Jheny', 'Vitória', 'Mayte')),
  icon text not null default 'estrela',
  name text not null,
  "desc" text not null default '',
  price numeric(10, 2) not null default 0,
  price_note text,
  popular boolean not null default false,
  duration_min integer not null default 60,
  created_at timestamptz not null default now()
);

-- Semente com o catálogo que já estava no ar em 23/09/2026 (professionals.ts), pra
-- rodar este arquivo não apagar o site: sem isso a página pública e o Agendamento
-- ficariam sem nenhum serviço até cada uma recadastrar tudo na mão. Roda só a
-- primeira vez (a tabela nasce vazia); rodar de novo duplica as linhas.
insert into public.services (professional, owner_id, icon, name, "desc", price, price_note, popular, duration_min)
select v.professional, u.id, v.icon, v.name, v."desc", v.price, v.price_note, v.popular, v.duration_min
from (values
  ('Flávia', 'manicure', 'Manicure Tradicional', 'Cuidado completo para as unhas naturais: cutícula, lixamento e esmaltação. Acréscimo de R$5 para francesinha.', 35.00, null::text, false, 40),
  ('Flávia', 'gel', 'Esmaltação em Gel (Mãos)', 'Esmaltação em gel sobre a unha natural, com mais brilho e durabilidade. Qualquer decoração já vem inclusa no preço.', 64.90, null::text, true, 60),
  ('Flávia', 'acrilica', 'Alongamento em Tips', 'Alongamento com molde de tip, acabamento uniforme. Manutenção R$79,90.', 165.90, null::text, false, 180),
  ('Flávia', 'acrilica', 'Alongamento em Molde F1', 'Alongamento esculpido em molde F1. Manutenção R$79,90.', 140.00, null::text, false, 180),
  ('Flávia', 'acrilica', 'Alongamento em Fibra de Vidro', 'Alongamento leve e resistente em fibra de vidro. Manutenção R$100.', 170.00, null::text, false, 180),
  ('Flávia', 'gel', 'Banho de Gel', 'Camada de gel sobre a unha já alongada, renovando o brilho e o reforço.', 89.00, null::text, false, 60),
  ('Flávia', 'blindagem', 'Blindagem', 'Proteção extra para suas unhas naturais. A blindagem fortalece e protege, ideal para quem tem unhas fracas ou quebradiças.', 55.00, null::text, false, 60),
  ('Flávia', 'remocao', 'Remoção', 'Retirada segura do alongamento, preservando a unha natural. R$10 por unha avulsa.', 49.90, null::text, false, 45),
  ('Flávia', 'pedicure', 'Pedicure Tradicional', 'Tratamento completo para os pés, com cutícula, lixamento e esmaltação.', 40.00, null::text, false, 50),
  ('Flávia', 'pedicure', 'Pedicure com Francesinha', 'Pedicure tradicional com acabamento em francesinha.', 45.00, null::text, false, 50),
  ('Flávia', 'pedicure', 'Esmaltação em Gel (Pés)', 'Esmaltação em gel nos pés, com mais brilho e durabilidade. Qualquer decoração já vem inclusa no preço.', 69.90, null::text, false, 60),
  ('Flávia', 'hidratacao', 'Plástica dos Pés', 'Higienização, esfoliação, emoliência, tratamento de cutículas, lixamento técnico e hidratação intensiva com óleo de girassol.', 89.90, null::text, false, 135),
  ('Flávia', 'nailart', 'Encapsulada', 'Acabamento encapsulado, acréscimo por unha.', 9.90, '/ unha', false, 10),
  ('Flávia', 'nailart', 'Baby Boomer', 'Degradê clássico entre os tons, acréscimo por unha.', 9.90, '/ unha', false, 10),
  ('Flávia', 'nailart', 'Nail Art 3D', 'Designs em relevo e detalhes 3D, acréscimo sobre o serviço escolhido.', 25.00, null::text, false, 15),

  ('Jheny', 'express', 'Maquiagem Express', 'Produção leve e prática, para quem gosta de uma beleza mais natural e delicada. Pele leve, olhos suaves e acabamento sofisticado, com técnicas mais rápidas.', 70.00, null::text, false, 60),
  ('Jheny', 'make', 'Maquiagem Social', 'Produção elaborada e detalhada, com pele bem construída, olhos trabalhados, contorno e iluminação definidos e cílios. Ideal para eventos, festas, formaturas e casamentos.', 90.00, null::text, true, 120),
  ('Jheny', 'blindada', 'Maquiagem Blindada', 'Produção completa com foco em fixação e durabilidade, feita em camadas. Para eventos longos, dias quentes e ocasiões em que a make precisa permanecer impecável por mais tempo.', 110.00, null::text, false, 150),

  ('Vitória', 'corte', 'Corte Feminino', 'Corte personalizado de acordo com o formato do rosto e a textura do seu cabelo.', 30.00, null::text, false, 60),
  ('Vitória', 'progressiva', 'Progressiva com Formol', 'Alisamento com formol. Cabelo pequeno R$80, médio R$100, grande R$120.', 80.00, null::text, false, 150),
  ('Vitória', 'progressiva', 'Progressiva sem Formol', 'Alisamento com fórmula sem formol. Cabelo pequeno R$150, médio R$180, grande R$200.', 150.00, null::text, true, 180),
  ('Vitória', 'selagem', 'Selagem', 'Selagem capilar para reduzir o volume e dar brilho. Mesmo preço para qualquer tamanho de cabelo.', 150.00, null::text, false, 120),
  ('Vitória', 'hidratacao', 'Hidratação com Vaporizador de Ozônio', 'Hidratação profunda com vaporizador de ozônio, que abre as cutículas do fio para o produto penetrar melhor.', 50.00, null::text, false, 45),

  ('Mayte', 'sobrancelha', 'Design de Sobrancelhas', 'Modelagem personalizada que analisa o formato do seu rosto para desenhar a sobrancelha ideal, com acabamento natural.', 40.00, null::text, false, 30),
  ('Mayte', 'henna', 'Design com Henna/Tintura', 'Modelagem com aplicação de henna ou tintura, que preenche falhas e reforça o desenho por mais tempo.', 50.00, null::text, false, 40),
  ('Mayte', 'depilacao', 'Depilação Buço', 'Depilação egípcia com linha, técnica delicada e precisa para a região do buço.', 10.00, null::text, false, 15),
  ('Mayte', 'dermaplaning', 'Dermaplaning', 'Esfoliação profunda que remove células mortas e buço fino, deixando a pele mais lisa e luminosa.', 100.00, null::text, false, 45),
  ('Mayte', 'cilios', 'Lash Lifting', 'Alonga e curva os cílios naturais, sem aplicação de fios, para um olhar aberto e descansado.', 120.00, null::text, false, 60),
  ('Mayte', 'cilios', 'Volume Brasileiro', 'Técnica com fio em formato Y, para um volume denso e natural.', 120.00, null::text, false, 120),
  ('Mayte', 'cilios', 'Volume Egípcio', 'Técnica com fios no formato W, para um volume marcante.', 120.00, null::text, false, 120),
  ('Mayte', 'cilios', 'Volume Luxo', 'Técnica feita com fio 5D, para quem gosta de um volume mais intenso.', 120.00, null::text, false, 150),
  ('Mayte', 'cilios', 'Volume Castanho', 'Fios em tom castanho, para um efeito mais suave e natural.', 120.00, null::text, false, 120),
  ('Mayte', 'cilios', 'Volume Fox', 'Efeito alongado e puxado para cima nos cantos externos, para um olhar felino.', 150.00, null::text, false, 150),
  ('Mayte', 'cilios', 'Mega Brasileiro', 'Mais fios por cílio natural que o volume brasileiro, para um resultado ainda mais denso.', 150.00, null::text, false, 150),
  ('Mayte', 'cilios', 'Mega Luxo', 'Mais fios por cílio natural que o volume luxo, para um resultado ainda mais denso.', 150.00, null::text, false, 150),
  ('Mayte', 'cilios', 'Mega Egípcio', 'Mais fios por cílio natural que o volume egípcio, para um resultado ainda mais denso.', 150.00, null::text, false, 150)
) as v(professional, icon, name, "desc", price, price_note, popular, duration_min)
join auth.users u on u.email = case v.professional
  when 'Flávia' then 'flavia@studioflaviaalves.app'
  when 'Jheny' then 'jheny@studioflaviaalves.app'
  when 'Vitória' then 'vitoria@studioflaviaalves.app'
  when 'Mayte' then 'mayte@studioflaviaalves.app'
end
where not exists (select 1 from public.services);

-- ============================================================
-- RLS
-- ============================================================
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.salon_transactions enable row level security;
alter table public.personal_expenses enable row level security;
alter table public.rent_payments enable row level security;
alter table public.client_returns enable row level security;
alter table public.services enable row level security;

drop policy if exists "staff logada acessa clients" on public.clients;
create policy "staff logada acessa clients" on public.clients
  for all to authenticated using (true) with check (true);

-- versão antiga deste arquivo compartilhava a agenda inteira entre as 3 — remove antes de recriar
drop policy if exists "staff logada acessa appointments" on public.appointments;
drop policy if exists "le proprio agendamento" on public.appointments;
drop policy if exists "insere proprio agendamento" on public.appointments;
drop policy if exists "edita proprio agendamento" on public.appointments;
drop policy if exists "apaga proprio agendamento" on public.appointments;

create policy "le proprio agendamento" on public.appointments
  for select to authenticated using (owner_id = auth.uid());

create policy "insere proprio agendamento" on public.appointments
  for insert to authenticated with check (owner_id = auth.uid());

create policy "edita proprio agendamento" on public.appointments
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "apaga proprio agendamento" on public.appointments
  for delete to authenticated using (owner_id = auth.uid());

-- Antes era "for all to authenticated using (true)": qualquer uma lia/escrevia tudo.
-- Trocado em 15/09/2026 (pedido do Erick): Contas do Salão passa a ser só da Flávia. As
-- outras usam Gastos Pessoais com âmbito "Salão" (personal_expenses.scope), que já soma
-- por pessoa pra ela em "Visão Geral da Equipe" — não precisou mexer em mais nada ali,
-- a RLS de personal_expenses já deixava a Flávia ler as linhas de todo mundo.
drop policy if exists "staff logada acessa salon_transactions" on public.salon_transactions;
drop policy if exists "so a dona acessa salon_transactions" on public.salon_transactions;
create policy "so a dona acessa salon_transactions" on public.salon_transactions
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app')
  with check (auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app');

-- versão antiga deste arquivo criava uma única policy "for all" aqui — remove antes de recriar
drop policy if exists "cada uma so acessa os proprios gastos" on public.personal_expenses;
drop policy if exists "leitura gastos pessoais" on public.personal_expenses;
drop policy if exists "insere gastos pessoais" on public.personal_expenses;
drop policy if exists "edita gastos pessoais" on public.personal_expenses;
drop policy if exists "apaga gastos pessoais" on public.personal_expenses;

-- leitura: cada uma vê o próprio; a dona do studio vê de todo mundo
create policy "leitura gastos pessoais" on public.personal_expenses
  for select to authenticated
  using (owner_id = auth.uid() or auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app');

-- escrita: sempre só no próprio nome, mesmo pra dona do studio
create policy "insere gastos pessoais" on public.personal_expenses
  for insert to authenticated with check (owner_id = auth.uid());

create policy "edita gastos pessoais" on public.personal_expenses
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "apaga gastos pessoais" on public.personal_expenses
  for delete to authenticated using (owner_id = auth.uid());

-- Retorno e por profissional, igual a agenda: cada uma cuida das proprias clientes.
drop policy if exists "cada uma cuida do proprio retorno" on public.client_returns;
create policy "cada uma cuida do proprio retorno" on public.client_returns
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Aluguel: leitura e escrita so pra dona do studio. A Jheny e a Vitoria nao veem esta
-- tabela nem o proprio status; se um dia isso mudar, o caminho e uma policy de select
-- extra comparando o e-mail com a coluna `professional`.
drop policy if exists "so a dona mexe no aluguel" on public.rent_payments;
create policy "so a dona mexe no aluguel" on public.rent_payments
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app')
  with check (auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app');

-- Serviços: leitura é pública (a página de cada profissional no site institucional não
-- loga ninguém, então precisa enxergar sem `authenticated`). Escrita continua só do
-- próprio dono, igual appointments/client_returns.
drop policy if exists "leitura publica de servicos" on public.services;
create policy "leitura publica de servicos" on public.services
  for select using (true);

drop policy if exists "cada uma cuida dos proprios servicos" on public.services;
create policy "cada uma cuida dos proprios servicos" on public.services
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ============================================================
-- Depois de rodar isso: vá em Authentication -> Users -> Add User
-- e crie as 4 colaboradoras com estes e-mails (a senha é você quem escolhe):
--   flavia@studioflaviaalves.app
--   jheny@studioflaviaalves.app
--   vitoria@studioflaviaalves.app
--   mayte@studioflaviaalves.app
-- No login do site elas digitam só "flavia" / "jheny" / "vitoria" / "mayte"
-- (sem o e-mail todo) + a senha que você definir. Marque "Auto Confirm User"
-- ao criar, senão o Supabase espera confirmação por e-mail que nunca vai
-- chegar (os e-mails acima não são caixas reais).
-- ============================================================
