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
  professional text not null check (professional in ('Flávia', 'Jheny', 'Vitória')),
  service text not null,
  scheduled_at timestamptz not null,
  price numeric(10, 2),
  status text not null default 'agendado' check (status in ('agendado', 'concluido', 'cancelado')),
  created_at timestamptz not null default now()
);

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
-- Controle de quem pagou os R$ 500 do mes. Hoje sao Jheny e Vitoria; a Flavia e dona
-- do studio e nao paga aluguel pra si mesma, por isso ela nao entra no check.
-- A unique(professional, reference_month) e o que deixa a tela usar upsert e nao
-- duplicar linha quando a Flavia clica duas vezes no mesmo mes.
-- ============================================================
create table if not exists public.rent_payments (
  id uuid primary key default gen_random_uuid(),
  professional text not null check (professional in ('Jheny', 'Vitória')),
  reference_month date not null,
  amount numeric(10, 2) not null default 500,
  paid boolean not null default false,
  paid_on date,
  notes text,
  created_at timestamptz not null default now(),
  unique (professional, reference_month)
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.salon_transactions enable row level security;
alter table public.personal_expenses enable row level security;
alter table public.rent_payments enable row level security;

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

drop policy if exists "staff logada acessa salon_transactions" on public.salon_transactions;
create policy "staff logada acessa salon_transactions" on public.salon_transactions
  for all to authenticated using (true) with check (true);

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

-- Aluguel: leitura e escrita so pra dona do studio. A Jheny e a Vitoria nao veem esta
-- tabela nem o proprio status; se um dia isso mudar, o caminho e uma policy de select
-- extra comparando o e-mail com a coluna `professional`.
drop policy if exists "so a dona mexe no aluguel" on public.rent_payments;
create policy "so a dona mexe no aluguel" on public.rent_payments
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app')
  with check (auth.jwt() ->> 'email' = 'flavia@studioflaviaalves.app');

-- ============================================================
-- Depois de rodar isso: vá em Authentication -> Users -> Add User
-- e crie as 3 colaboradoras com estes e-mails (a senha é você quem escolhe):
--   flavia@studioflaviaalves.app
--   jheny@studioflaviaalves.app
--   vitoria@studioflaviaalves.app
-- No login do site elas digitam só "flavia" / "jheny" / "vitoria" (sem o
-- e-mail todo) + a senha que você definir. Marque "Auto Confirm User" ao
-- criar, senão o Supabase espera confirmação por e-mail que nunca vai chegar
-- (os e-mails acima não são caixas reais).
-- ============================================================
