export interface Testimonial {
  initials: string;
  name: string;
  service: string;
  professional: string;
  text: string;
  /** Foto de banco de imagens (ilustrativa) — não é uma foto real da cliente. */
  avatar: string;
  /**
   * Liga o selo de verificado no card.
   *
   * ATENÇÃO: hoje está `true` em todos, por decisão do Erick em 05/09/2026, mas
   * **nenhum destes depoimentos é real** — nome, texto e foto são inventados. O selo
   * não corresponde a verificação nenhuma; é elemento visual.
   *
   * O campo existe por depoimento justamente pra quando entrarem avaliações reais:
   * aí é marcar `true` só nas verdadeiras e `false` nas que ainda forem placeholder,
   * sem mexer no componente.
   */
  verified: boolean;
}

export const testimonials: Testimonial[] = [
  {
    initials: 'AM',
    name: 'Ana Maria S.',
    service: 'Alongamento em Tips',
    professional: 'Flávia',
    text: 'Simplesmente apaixonada pelo resultado! Minhas unhas nunca ficaram tão lindas. A Flávia tem um talento incrível e muito cuidado com cada detalhe.',
    avatar: 'images/review-ana-maria-stock.jpg',
    verified: true,
  },
  {
    initials: 'CR',
    name: 'Carolina R.',
    service: 'Nail Art 3D + Blindagem',
    professional: 'Flávia',
    text: 'A melhor nail designer que já fui! Ela transforma o que eu pedi em algo ainda mais lindo. As unhas duraram mais de 3 semanas perfeitas.',
    avatar: 'images/review-carolina-stock.jpg',
    verified: true,
  },
  {
    initials: 'JF',
    name: 'Juliana F.',
    service: 'Progressiva sem Formol',
    professional: 'Vitória',
    text: 'Fiz a progressiva sem formol com a Vitória e amei o resultado, ficou super natural e sem aquele cheiro forte. Ela é cuidadosa com a saúde do cabelo e explica cada etapa do processo.',
    avatar: 'images/review-juliana-stock.jpg',
    verified: true,
  },
  {
    initials: 'CD',
    name: 'Camila Duarte',
    service: 'Hidratação com Vaporizador de Ozônio',
    professional: 'Vitória',
    text: 'Ambiente super agradável e atendimento de primeira do início ao fim! A hidratação com vaporizador de ozônio da Vitória deixou meu cabelo com um brilho incrível. Já indiquei pras amigas.',
    avatar: 'images/review-camila-stock.jpg',
    verified: true,
  },
  {
    initials: 'LP',
    name: 'Larissa Prado',
    service: 'Volume Brasileiro',
    professional: 'Mayte',
    text: 'Meu olhar ficou completamente diferente, super natural e ao mesmo tempo marcante. A Mayte é cuidadosa demais com a aplicação, nem senti o tempo passar de tão relaxante.',
    avatar: 'images/review-larissa-stock.jpg',
    verified: true,
  },
  {
    initials: 'PG',
    name: 'Patrícia Gomes',
    service: 'Design de Sobrancelhas',
    professional: 'Mayte',
    text: 'Nunca tinha visto minhas sobrancelhas combinarem tanto com o meu rosto. A Mayte explica cada etapa e o ambiente é super acolhedor, saí de lá renovada.',
    avatar: 'images/review-patricia-stock.jpg',
    verified: true,
  },
];

export interface RankedService {
  name: string;
  professional: string;
  category: string;
  price: string;
}

export const mostBooked: RankedService[] = [
  { name: 'Esmaltação em Gel (Mãos)', professional: 'Flávia', category: 'Unhas', price: 'R$64,90' },
  { name: 'Progressiva sem Formol', professional: 'Vitória', category: 'Cabelo', price: 'R$150' },
  { name: 'Selagem', professional: 'Vitória', category: 'Cabelo', price: 'R$150' },
  { name: 'Manicure Tradicional', professional: 'Flávia', category: 'Unhas', price: 'R$35' },
  { name: 'Blindagem', professional: 'Flávia', category: 'Unhas', price: 'R$55' },
];
