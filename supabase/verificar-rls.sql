-- Afrodite Studio - verificação do RLS de `appointments`
--
-- Só leitura. Não altera nada, seguro rodar quantas vezes quiser.
-- Cole no SQL Editor do Supabase (projeto gpfdqnfaxyomzlqtqwsh) e leia as 4 saídas.
--
-- Serve pra responder uma pergunta só: o `migration.sql` atualizado em 04/09/2026 já foi
-- rodado? Enquanto não for, Jheny e Vitória enxergam o histórico inteiro da Flávia.

-- 1) A coluna owner_id existe?  Esperado: 1 linha, is_nullable = YES
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'appointments' and column_name = 'owner_id';

-- 2) As policies novas estão no lugar?
--    Esperado: exatamente 4 linhas (le / insere / edita / apaga "proprio agendamento").
--    Se aparecer "staff logada acessa appointments", a migração NÃO foi rodada.
select policyname, cmd, qual as using_expr, with_check as check_expr
from pg_policies
where schemaname = 'public' and tablename = 'appointments'
order by policyname;

-- 3) O backfill preencheu owner_id?
--    orfaos > 0 significa linha invisível pra todo mundo (sem match de e-mail no backfill).
select
  count(*)                                  as total,
  count(owner_id)                           as com_dono,
  count(*) - count(owner_id)                as orfaos
from public.appointments;

-- 4) Como ficou dividido por profissional, e quantos donos distintos.
--    Esperado hoje: Flávia com ~260 e 1 owner_id distinto.
select
  professional,
  count(*)                    as atendimentos,
  count(distinct owner_id)    as donos_distintos
from public.appointments
group by professional
order by atendimentos desc;

-- ============================================================
-- Parte 2: as mudanças de 05/09/2026
-- Sem elas as telas novas gravam em coluna que não existe e quebram.
-- ============================================================

-- 5) Colunas novas de appointments e personal_expenses.
--    Esperado: 4 linhas (client_id, services, duration_min, scope).
select table_name, column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'appointments'       and column_name in ('client_id', 'services', 'duration_min')) or
    (table_name = 'personal_expenses'  and column_name = 'scope')
  )
order by table_name, column_name;

-- 6) A tabela de aluguel existe?  Esperado: 1 linha.
select table_name
from information_schema.tables
where table_schema = 'public' and table_name = 'rent_payments';

-- 7) A policy do aluguel restringe à dona?
--    Esperado: 1 linha, cmd = ALL, com o e-mail da Flávia na expressão.
select policyname, cmd, qual as using_expr
from pg_policies
where schemaname = 'public' and tablename = 'rent_payments';
