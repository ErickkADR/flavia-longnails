import { Link } from 'react-router-dom';
import './Placeholder.css';

export function Placeholder({ title }: { title: string }) {
  return (
    <section className="placeholder">
      <div className="container placeholder-inner">
        <div className="sec-label" style={{ justifyContent: 'center' }}>Em breve</div>
        <h1 className="sec-title">{title}</h1>
        <p className="sec-sub">Essa página ainda está a caminho.</p>
        <Link to="/" className="btn-outline" style={{ marginTop: 32 }}>Voltar para o Studio</Link>
      </div>
    </section>
  );
}
