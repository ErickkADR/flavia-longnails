import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTable } from '../../hooks/useTable';
import './StaffModule.css';
import { Icon } from '../../components/Icon';

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

interface AppointmentRef {
  id: string;
  client_id: string | null;
  client_name: string;
  status: string;
}

/**
 * A partir de quantas visitas a cliente vira VIP automaticamente.
 * Agendamento novo ja conta: cancelado e o unico status que fica de fora.
 */
const VIP_MIN_VISITS = 10;

function normalize(name: string) {
  return name.trim().toLowerCase();
}

export function Clientes() {
  const { rows, loading, error, insert, update, remove } = useTable<Client>('clients');
  const { rows: appointments } = useTable<AppointmentRef>('appointments');

  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  /**
   * Duas contagens em paralelo, e cada agendamento cai em exatamente uma delas:
   * - por `client_id`, que o autocomplete do agendamento passou a gravar;
   * - por nome normalizado, que e o unico vinculo que as 260 linhas importadas da
   *   planilha antiga tem.
   * Somar as duas fecha o historico sem contar ninguem duas vezes. Quando as linhas
   * antigas ganharem client_id, o segundo mapa simplesmente esvazia sozinho.
   */
  const visitCounts = useMemo(() => {
    const byId: Record<string, number> = {};
    const byName: Record<string, number> = {};
    for (const a of appointments) {
      if (a.status === 'cancelado') continue;
      if (a.client_id) byId[a.client_id] = (byId[a.client_id] ?? 0) + 1;
      else byName[normalize(a.client_name)] = (byName[normalize(a.client_name)] ?? 0) + 1;
    }
    return { byId, byName };
  }, [appointments]);

  const withVisits = useMemo(
    () =>
      rows.map((c) => ({
        ...c,
        visits: (visitCounts.byId[c.id] ?? 0) + (visitCounts.byName[normalize(c.name)] ?? 0),
      })),
    [rows, visitCounts]
  );
  const filtered = useMemo(() => {
    const q = normalize(search);
    if (!q) return withVisits;
    return withVisits.filter((c) => normalize(c.name).includes(q));
  }, [withVisits, search]);

  const vipClients = useMemo(
    () => filtered.filter((c) => c.visits >= VIP_MIN_VISITS).sort((a, b) => b.visits - a.visits),
    [filtered]
  );
  const otherClients = filtered.filter((c) => c.visits < VIP_MIN_VISITS);

  function startEdit(c: Client) {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone ?? '');
    setEmail(c.email ?? '');
    setNotes(c.notes ?? '');
    setFormError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cancelEdit() {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setFormError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const patch = { name, phone: phone || null, email: email || null, notes: notes || null };
      if (editingId) {
        await update(editingId, patch);
        setEditingId(null);
      } else {
        await insert(patch);
      }
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Registro de Clientes</div>
        <div className="mod-sub">Cadastro de clientes do studio</div>
      </div>

      {editingId && (
        <div className="mod-edit-bar">
          Editando cliente
          <button type="button" className="mod-table-del" onClick={cancelEdit}>cancelar</button>
        </div>
      )}

      <form className="mod-form" ref={formRef} onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Nome</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="mod-field">
          <span>WhatsApp</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 90000-0000" />
        </label>
        <label className="mod-field">
          <span>E-mail</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mod-field">
          <span>Observações</span>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alergias, preferências..." />
        </label>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Adicionar Cliente'}
        </button>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="mod-search">
        <Icon name="busca" className="mod-search-ico" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente pelo nome..."
          aria-label="Buscar cliente pelo nome"
        />
      </div>

      {vipClients.length > 0 && (
        <div className="vip-section">
          <div className="vip-header">
            <Icon name="brilho" className="vip-star" fill="currentColor" strokeWidth={0} /> Clientes VIP
            <span className="vip-note">{VIP_MIN_VISITS}+ visitas, canceladas não contam, calculado automaticamente</span>
          </div>
          <div className="vip-grid">
            {vipClients.map((c) => (
              <div className="vip-card" key={c.id}>
                <div className="vip-card-top">
                  <div className="vip-card-name">{c.name}</div>
                  <button
                    type="button"
                    className="vip-card-edit"
                    onClick={() => startEdit(c)}
                    aria-label={`Editar ${c.name}`}
                  >
                    <Icon name="editar" />
                  </button>
                </div>
                <div className="vip-card-visits">{c.visits} visitas</div>
                {c.phone && <div className="vip-card-phone">{c.phone}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : otherClients.length === 0 && vipClients.length === 0 ? (
          <p className="mod-empty">
            {search ? 'Nenhuma cliente encontrada com esse nome.' : 'Nenhuma cliente cadastrada ainda.'}
          </p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>WhatsApp</th>
                <th>E-mail</th>
                <th>Observações</th>
                <th>Visitas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {otherClients.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone ?? '—'}</td>
                  <td>{c.email ?? '—'}</td>
                  <td>{c.notes ?? '—'}</td>
                  <td>{c.visits}</td>
                  <td>
                    <button className="mod-table-edit" onClick={() => startEdit(c)}>editar</button>
                    <button className="mod-table-del" onClick={() => remove(c.id)}>remover</button>
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
