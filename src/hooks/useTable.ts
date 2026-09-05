import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/** CRUD simples contra uma tabela do Supabase — usado pelos 4 módulos da área da colaboradora. */
export function useTable<T extends { id: string }>(table: string, orderBy = 'created_at') {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: false });
    if (error) setError(error.message);
    else {
      setRows((data ?? []) as T[]);
      setError(null);
    }
    setLoading(false);
  }, [table, orderBy]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function insert(row: Partial<T>) {
    if (!supabase) throw new Error('Supabase não configurado');
    // Sem tipos gerados do schema (Database), o client trata .from(table) de forma genérica
    // e o TS não consegue casar Partial<T> com o shape esperado pelo insert.
    const { error } = await supabase.from(table).insert(row as never);
    if (error) throw error;
    await reload();
  }

  async function update(id: string, patch: Partial<T>) {
    if (!supabase) throw new Error('Supabase nao configurado');
    const { error } = await supabase.from(table).update(patch as never).eq('id', id);
    if (error) throw error;
    await reload();
  }

  /**
   * Grava criando ou sobrescrevendo, conforme a chave unica informada em `onConflict`.
   * Usado no controle de aluguel: a tela marca "pagou" num mes que pode nunca ter tido
   * linha, e clicar de novo no mesmo mes precisa atualizar em vez de duplicar.
   */
  async function upsert(row: Partial<T>, onConflict: string) {
    if (!supabase) throw new Error('Supabase nao configurado');
    const { error } = await supabase.from(table).upsert(row as never, { onConflict });
    if (error) throw error;
    await reload();
  }

  async function remove(id: string) {
    if (!supabase) throw new Error('Supabase não configurado');
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    await reload();
  }

  return { rows, loading, error, insert, update, upsert, remove, reload };
}
