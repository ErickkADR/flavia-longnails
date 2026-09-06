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
    service: 'Alongamento em Gel',
    professional: 'Flávia',
    text: 'Simplesmente apaixonada pelo resultado! Minhas unhas nunca ficaram tão lindas. A Flávia tem um talento incrível e muito cuidado com cada detalhe.',
    avatar: 'images/review-ana-maria-stock.jpg',
    verified: true,
  },
  {
    initials: 'CR',
    name: 'Carolina R.',
    service: 'Nail Art + Blindagem',
    professional: 'Flávia',
    text: 'A melhor nail designer que já fui! Ela transforma o que eu pedi em algo ainda mais lindo. As unhas duraram mais de 3 semanas perfeitas.',
    avatar: 'images/review-carolina-stock.jpg',
    verified: true,
  },
  {
    initials: 'BF',
    name: 'Bruna Ferreira',
    service: 'Maquiagem para Noiva',
    professional: 'Jheny',
    text: 'A Jheny fez minha make de noiva e foi além das minhas expectativas. Durou o dia inteiro perfeita, e ela é super atenciosa do início ao fim.',
    avatar: 'images/review-bruna-stock.jpg',
    verified: true,
  },
  {
    initials: 'RN',
    name: 'Rafaela Nunes',
    service: 'Maquiagem Social',
    professional: 'Jheny',
    text: 'Pedi uma make social pra um evento e recebi muitos elogios a noite toda. A Jheny entende exatamente o que combina com cada rosto.',
    avatar: 'images/review-rafaela-stock.jpg',
    verified: true,
  },
  {
    initials: 'JF',
    name: 'Juliana F.',
    service: 'Coloração',
    professional: 'Vitória',
    text: 'Fiz a coloração com a Vitória e amei o resultado, ficou super natural. Ela é cuidadosa com a saúde do cabelo e explica cada etapa do processo.',
    avatar: 'images/review-juliana-stock.jpg',
    verified: true,
  },
  {
    initials: 'CD',
    name: 'Camila Duarte',
    service: 'Escova e Hidratação',
    professional: 'Vitória',
    text: 'Ambiente super agradável e atendimento de primeira do início ao fim! A escova da Vitória rende muitos dias e o brilho é incrível. Já indiquei pras amigas.',
    avatar: 'images/review-camila-stock.jpg',
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
  { name: 'Alongamento em Gel', professional: 'Flávia', category: 'Unhas', price: 'R$120' },
  { name: 'Coloração', professional: 'Vitória', category: 'Cabelo', price: 'R$180' },
  { name: 'Maquiagem para Noiva', professional: 'Jheny', category: 'Maquiagem', price: 'R$350' },
  { name: 'Escova Modelada', professional: 'Vitória', category: 'Cabelo', price: 'R$60' },
  { name: 'Manicure', professional: 'Flávia', category: 'Unhas', price: 'R$40' },
  { name: 'Design de Sobrancelha', professional: 'Jheny', category: 'Maquiagem', price: 'R$40' },
  { name: 'Blindagem', professional: 'Flávia', category: 'Unhas', price: 'R$80' },
];
