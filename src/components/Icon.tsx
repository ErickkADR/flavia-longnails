import {
  AtSign, BarChart3, Brush, Check, Clock, Crown, Droplet, Eye, Flower2, Footprints,
  Gem, Globe, Hand, HandHeart, Heart, MapPin, MessageCircle, Palette,
  CalendarX, ClipboardCheck, House, Phone, Trash2, Scissors, Shield, ShieldCheck, Sparkle,
  Sparkles, Star, Sun, Target,
  TrendingUp, Wind, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Ícones do site, num mapa só.
 *
 * Antes tudo era emoji direto no JSX. Emoji renderiza diferente em cada sistema
 * (o mesmo glifo muda de desenho e de cor entre Windows, Android e iPhone), não herda
 * a cor da marca e não escala com o texto. Aqui é SVG da lucide: herda `color`,
 * acompanha o `font-size` e fica igual em todo lugar.
 *
 * Os nomes abaixo são a chave usada no `professionals.ts` e nas páginas. Se for
 * adicionar serviço novo com ícone que não existe aqui, importe da lucide e
 * acrescente no mapa: nome desconhecido não quebra a tela, só não desenha nada.
 */
const MAPA: Record<string, LucideIcon> = {
  // unhas
  manicure: Hand,
  pedicure: Footprints,
  gel: Gem,
  acrilica: Sparkle,
  nailart: Flower2,
  blindagem: Shield,
  // maquiagem
  express: Sparkles,
  make: Brush,
  blindada: ShieldCheck,
  olho: Eye,
  // cabelo
  corte: Scissors,
  escova: Wind,
  hidratacao: Droplet,
  coloracao: Palette,
  luzes: Sun,
  penteado: Crown,
  // interface e página de recrutamento
  site: Globe,
  whatsapp: MessageCircle,
  sistema: BarChart3,
  massagem: HandHeart,
  evolucao: TrendingUp,
  alvo: Target,
  coracao: Heart,
  estrela: Star,
  local: MapPin,
  telefone: Phone,
  relogio: Clock,
  instagram: AtSign, // lucide removeu icones de marca; @ lê bem num contato
  fechar: X,
  check: Check,
  brilho: Sparkle,
  // politicas de atendimento das profissionais
  sinal: Gem,
  cancelamento: CalendarX,
  casa: House,
  pagamento: Sparkles,
  checklist: ClipboardCheck,
  lixeira: Trash2,
};

interface Props {
  name: string;
  className?: string;
  /** Tamanho em px. Por padrão acompanha o `font-size` do contexto. */
  size?: number | string;
  strokeWidth?: number;
  fill?: string;
}

export function Icon({ name, className, size = '1em', strokeWidth = 1.6, fill = 'none' }: Props) {
  const Componente = MAPA[name];
  if (!Componente) return null;
  return (
    <Componente
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      fill={fill}
      aria-hidden="true"
      focusable="false"
    />
  );
}

/**
 * Fileira de estrelas da avaliação. Era uma string de estrelas, que dependia da fonte
 * do sistema pra desenhar e vinha em preto em alguns Android.
 */
export function Stars({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <span className={className ? `stars ${className}` : 'stars'} aria-label={`${count} de 5 estrelas`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size="1em" strokeWidth={0} fill="currentColor" aria-hidden="true" />
      ))}
    </span>
  );
}
