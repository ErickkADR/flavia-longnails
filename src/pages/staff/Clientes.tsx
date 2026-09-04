import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTable } from '../../hooks/useTable';
import './StaffModule.css';

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export function Clientes() {
  const { rows, loading, error, insert, remove } = useTable<Client>('clients');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({ name, phone: phone || null, email: email || null, notes: notes || null });
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

      <form className="mod-form" onSubmit={handleSubmit}>
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
          {saving ? 'Salvando...' : 'Adicionar Cliente'}
        </button>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : rows.length === 0 ? (
          <p className="mod-empty">Nenhuma cliente cadastrada ainda.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>WhatsApp</th>
                <th>E-mail</th>
                <th>Observações</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone ?? '—'}</td>
                  <td>{c.email ?? '—'}</td>
                  <td>{c.notes ?? '—'}</td>
                  <td><button className="mod-table-del" onClick={() => remove(c.id)}>remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
