-- Studio Flávia Alves — Área da Colaboradora
-- Cole isto inteiro no SQL Editor do painel do Supabase e rode uma vez.

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
-- 4. Controle de Gastos Pessoais (privado — cada uma só vê o seu)
-- ============================================================
create table if not exists public.personal_expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null,
  description text,
  amount numeric(10, 2) not null,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS — só quem está logada mexe em qualquer coisa;
-- gastos pessoais, cada uma só vê e mexe nos próprios.
-- ============================================================
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.salon_transactions enable row level security;
alter table public.personal_expenses enable row level security;

create policy "staff logada acessa clients" on public.clients
  for all to authenticated using (true) with check (true);

create policy "staff logada acessa appointments" on public.appointments
  for all to authenticated using (true) with check (true);

create policy "staff logada acessa salon_transactions" on public.salon_transactions
  for all to authenticated using (true) with check (true);

create policy "cada uma so acessa os proprios gastos" on public.personal_expenses
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

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
