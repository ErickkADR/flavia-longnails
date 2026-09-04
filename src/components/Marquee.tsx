import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Marquee.css';

export function Marquee({ children, duration = 42 }: { children: ReactNode; duration?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(2);

  // Com poucos itens (ex.: só 3 fotos), um único grupo pode ser mais estreito que a tela em
  // monitores largos. Com só 2 cópias (a técnica clássica do translateX(-50%)), sobra um vão
  // vazio no fim de cada volta antes do laço reiniciar. Aqui a gente mede e repete o grupo o
  // quanto for preciso para cobrir a largura visível com folga, sempre em pares (as duas metades
  // do laço continuam idênticas, então o -50% nunca perde o encaixe).
  useLayoutEffect(() => {
    const measure = () => {
      const wrapW = wrapRef.current?.offsetWidth ?? 0;
      const groupW = groupRef.current?.scrollWidth ?? 0;
      if (!wrapW || !groupW) return;
      setRepeat(Math.max(2, Math.ceil(wrapW / groupW) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [children]);

  const renderHalf = (half: 'a' | 'b') =>
    Array.from({ length: repeat }, (_, i) => (
      <div
        className="marquee-group"
        key={`${half}-${i}`}
        ref={half === 'a' && i === 0 ? groupRef : undefined}
        aria-hidden={half === 'b' || i > 0 ? true : undefined}
      >
        {children}
      </div>
    ));

  return (
    <div className="marquee" ref={wrapRef}>
      <div className="marquee-fade marquee-fade-l" aria-hidden="true"></div>
      <div className="marquee-track" style={{ animationDuration: `${(duration * repeat) / 2}s` }}>
        {renderHalf('a')}
        {renderHalf('b')}
      </div>
      <div className="marquee-fade marquee-fade-r" aria-hidden="true"></div>
    </div>
  );
}