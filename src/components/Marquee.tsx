import type { ReactNode } from 'react';
import './Marquee.css';

export function Marquee({ children, duration = 42 }: { children: ReactNode; duration?: number }) {
  return (
    <div className="marquee">
      <div className="marquee-fade marquee-fade-l" aria-hidden="true"></div>
      <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">{children}</div>
      </div>
      <div className="marquee-fade marquee-fade-r" aria-hidden="true"></div>
    </div>
  );
}
