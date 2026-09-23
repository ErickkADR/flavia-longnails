import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTable } from '../../hooks/useTable';
import type { Service } from '../../data/professionals';
import { formatPrice } from '../../data/professionals';
import { Icon } from '../../components/Icon';
import './StaffModule.css';

/**
 * Ícones que fazem sentido pra um serviço. Fica de fora o resto do mapa de
 * `Icon.tsx` (política de atendimento, interface do site) — mostrar tudo confundiria
 * mais do que ajudaria numa lista já longa.
 */
const ICON_OPTIONS = [
  'manicure', 'pedicure', 'gel', 'acrilica', 'nailart', 'blindagem', 'remocao',
  'express', 'make', 'blindada',
  'corte', 'escova', 'hidratacao', 'coloracao', 'luzes', 'penteado', 'progressiva', 'selagem',
  'cilios', 'sobrancelha', 'henna', 'depilacao', 'dermaplaning',
  'massagem', 'brilho', 'estrela', 'coracao', 'evolucao', 'alvo',
];

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

export function Servicos() {
  const { name } = useAuth();
  // Mesma tabela do Agendamento e da página pública — busca todo mundo, filtra pelo
  // nome logado. Editar/adicionar/remover aqui muda os outros dois na hora, sem
  // precisar mexer em nenhum dos dois arquivos.
  const { rows, loading, error, insert, update, remove } = useTable<Service>('services', 'created_at', true);
  const meus = rows.filter((s) => s.professional === name);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [nomeServ, setNomeServ] = useState('');
  const [icon, setIcon] = useState('estrela');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [duration, setDuration] = useState('60');
  const [popular, setPopular] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function startEdit(s: Service) {
    setEditingId(s.id);
    setNomeServ(s.name);
    setIcon(s.icon);
    setDesc(s.desc);
    setPrice(String(s.price));
    setPriceNote(s.price_note ?? '');
    setDuration(String(s.duration_min));
    setPopular(s.popular);
    setFormError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setNomeServ('');
    setIcon('estrela');
    setDesc('');
    setPrice('');
    setPriceNote('');
    setDuration('60');
    setPopular(false);
    setFormError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const patch = {
        name: nomeServ,
        icon,
        desc,
        price: Number(price),
        price_note: priceNote || null,
        duration_min: Number(duration),
        popular,
      };
      if (editingId) {
        await update(editingId, patch);
      } else {
        await insert({ ...patch, professional: name });
      }
      cancelEdit();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Meus Serviços</div>
        <div className="mod-sub">
          O catálogo que aparece na sua página do site e nos chips do Agendamento. Editar,
          criar ou remover aqui atualiza os dois na hora.
        </div>
      </div>

      {editingId && (
        <div className="mod-edit-bar">
          Editando serviço
          <button type="button" className="mod-table-del" onClick={cancelEdit}>cancelar</button>
        </div>
      )}

      <form className="mod-form" onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Nome</span>
          <input value={nomeServ} onChange={(e) => setNomeServ(e.target.value)} required />
        </label>
        <label className="mod-field">
          <span>Ícone</span>
          <span className="mod-icon-select">
            <Icon name={icon} />
            <select value={icon} onChange={(e) => setIcon(e.target.value)}>
              {ICON_OPTIONS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="mod-field">
          <span>Preço (R$)</span>
          <input
            type="number" step="0.01" min="0"
            value={price} onChange={(e) => setPrice(e.target.value)} required
          />
        </label>
        <label className="mod-field">
          <span>Duração (min)</span>
          <input
            type="number" step="5" min="5"
            value={duration} onChange={(e) => setDuration(e.target.value)} required
          />
        </label>
        <label className="mod-field">
          <span>Nota do preço</span>
          <input
            value={priceNote} onChange={(e) => setPriceNote(e.target.value)}
            placeholder="ex.: / unha, manutenção R$79,90"
          />
        </label>
        <label className="mod-field">
          <span>&nbsp;</span>
          <span className="mod-checkbox">
            <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
            Destacar como popular
          </span>
        </label>
        <label className="mod-field mod-field-wide">
          <span>Descrição (aparece no site)</span>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </label>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Adicionar Serviço'}
        </button>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : meus.length === 0 ? (
          <p className="mod-empty">Nenhum serviço cadastrado ainda.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Duração</th>
                <th>Popular</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {meus.map((s) => (
                <tr key={s.id}>
                  <td><Icon name={s.icon} /></td>
                  <td>{s.name}</td>
                  <td>{formatPrice(s.price)}{s.price_note ? ` ${s.price_note}` : ''}</td>
                  <td>{formatDuration(s.duration_min)}</td>
                  <td>{s.popular ? 'Sim' : '—'}</td>
                  <td>
                    <button className="mod-table-edit" onClick={() => startEdit(s)}>editar</button>
                    <button className="mod-table-del" onClick={() => remove(s.id)}>remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
