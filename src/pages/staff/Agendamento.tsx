import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTable } from '../../hooks/useTable';
import './StaffModule.css';

interface Appointment {
  id: string;
  client_name: string;
  professional: string;
  service: string;
  scheduled_at: string;
  price: number | null;
  status: 'agendado' | 'concluido' | 'cancelado';
  created_at: string;
}

const PROFESSIONALS = ['Flávia', 'Jheny', 'Vitória'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function Agendamento() {
  const { rows, loading, error, insert, remove } = useTable<Appointment>('appointments', 'scheduled_at');
  const [clientName, setClientName] = useState('');
  const [professional, setProfessional] = useState(PROFESSIONALS[0]);
  const [service, setService] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await insert({
        client_name: clientName,
        professional,
        service,
        scheduled_at: new Date(scheduledAt).toISOString(),
        price: price ? Number(price) : null,
        status: 'agendado',
      });
      setClientName('');
      setService('');
      setScheduledAt('');
      setPrice('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mod-header">
        <div className="mod-title">Agendamento de Clientes</div>
        <div className="mod-sub">Próximos atendimentos do studio</div>
      </div>

      <form className="mod-form" onSubmit={handleSubmit}>
        <label className="mod-field">
          <span>Cliente</span>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
        </label>
        <label className="mod-field">
          <span>Profissional</span>
          <select value={professional} onChange={(e) => setProfessional(e.target.value)}>
            {PROFESSIONALS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="mod-field">
          <span>Serviço</span>
          <input value={service} onChange={(e) => setService(e.target.value)} required />
        </label>
        <label className="mod-field">
          <span>Data e hora</span>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
        </label>
        <label className="mod-field">
          <span>Valor (R$)</span>
          <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Agendar'}
        </button>
      </form>

      {(error || formError) && <p className="mod-error">{error ?? formError}</p>}

      <div className="mod-table-wrap">
        {loading ? (
          <p className="mod-empty">Carregando...</p>
        ) : rows.length === 0 ? (
          <p className="mod-empty">Nenhum agendamento ainda.</p>
        ) : (
          <table className="mod-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Profissional</th>
                <th>Serviço</th>
                <th>Valor</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{formatDate(a.scheduled_at)}</td>
                  <td>{a.client_name}</td>
                  <td>{a.professional}</td>
                  <td>{a.service}</td>
                  <td>{a.price != null ? `R$${a.price}` : '—'}</td>
                  <td><span className={`mod-tag ${a.status}`}>{a.status}</span></td>
                  <td><button className="mod-table-del" onClick={() => remove(a.id)}>remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
