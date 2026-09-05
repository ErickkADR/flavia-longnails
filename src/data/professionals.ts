export interface Service {
  icon: string;
  name: string;
  desc: string;
  price: string;
  priceNote?: string;
  popular?: boolean;
  /**
   * Quanto tempo o servico ocupa na agenda, em minutos. Estimativa inicial minha, nao
   * medida no salao: a agenda semanal precisa de um numero pra desenhar o bloco e pra
   * calcular horario livre. Corrigir aqui quando a profissional disser o tempo real.
   * Nao aparece no site publico, so na Area da Colaboradora.
   */
  durationMin: number;
}

export interface Professional {
  slug: 'flavia' | 'jheny' | 'vitoria';
  name: string;
  role: string;
  avatar: string;
  photoIsPlaceholder: boolean;
  bio: string;
  instagram: string | null;
  instagramIsReal: boolean;
  services: Service[];
  gallery: string[];
}

const WHATSAPP_NUMBER = '5511946650392';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const professionals: Professional[] = [
  {
    slug: 'flavia',
    name: 'Flávia',
    role: 'Unhas & Nail Art',
    // Foto de rosto real dela, 640x640, entregue pelo Erick em 05/09/2026. Ate entao
    // nunca existiu rosto da Flavia nos assets: o card da equipe usava
    // `avatar-about-BtqxEbBP.png`, uma foto de trabalho (mao com luva aplicando
    // esmalte), que continua no repo.
    avatar: 'images/flavia-perfil.jpg',
    photoIsPlaceholder: false,
    bio: 'Especialista em unhas longas e nail art, com anos de experiência transformando as mãos das clientes em verdadeiras obras de arte. Cada atendimento é único e personalizado, com produtos de alta qualidade e técnicas modernas, resultados duradouros e acabamento impecável.',
    instagram: 'flavia_longnails',
    instagramIsReal: true,
    services: [
      { icon: '💅', name: 'Manicure', desc: 'Cuidado completo para suas unhas naturais, incluindo cutícula, lixa e esmaltação. Acabamento perfeito para o dia a dia.', price: 'R$40', durationMin: 120 },
      { icon: '👣', name: 'Pedicure', desc: 'Tratamento completo para os pés, com hidratação, esfoliação e esmaltação. Cuide dos seus pés com todo o carinho.', price: 'R$50', durationMin: 60 },
      { icon: '💎', name: 'Alongamento em Gel', desc: 'Unhas longas e naturais com gel de alta qualidade. Resultado durável e brilhante, perfeito para quem ama unhas compridas.', price: 'R$120', popular: true, durationMin: 120 },
      { icon: '🔮', name: 'Unhas Acrílicas', desc: 'Alongamento resistente e versátil. As unhas acrílicas oferecem durabilidade excepcional e possibilidade de designs arrojados.', price: 'R$130', durationMin: 120 },
      { icon: '🌺', name: 'Nail Art', desc: 'Designs únicos e personalizados. Das flores delicadas aos padrões geométricos, crie o visual dos seus sonhos.', price: 'R$20', priceNote: '/ design', durationMin: 30 },
      { icon: '🛡️', name: 'Blindagem', desc: 'Proteção extra para suas unhas naturais. A blindagem fortalece e protege, ideal para quem tem unhas fracas ou quebradiças.', price: 'R$80', durationMin: 60 },
    ],
    // Puxadas do @flavia_longnails em 05/09/2026, a pedido do Erick.
    // As `gallery-N-*.jpg` continuam no repo e sao MAIORES (1280x1920 contra 640px daqui):
    // o Instagram comprime tudo e nao deixa pedir resolucao maior (a assinatura da URL
    // cobre o parametro de tamanho). Reverter e so voltar a lista antiga.
    gallery: [
      'images/ig-flavia-1.jpg',
      'images/ig-flavia-2.jpg',
      'images/ig-flavia-3.jpg',
      'images/ig-flavia-4.jpg',
      'images/ig-flavia-5.jpg',
      'images/ig-flavia-6.jpg',
    ],
  },
  {
    slug: 'jheny',
    name: 'Jheny',
    role: 'Maquiagem',
    // Foto real dela, do @jhenyluanyybeauty. Sai em 150x150 (teto do Instagram pra foto
    // de perfil) e o card da equipe mostra em 240px, entao amplia e fica macia. A
    // `jheny-avatar-stock.jpg`, 700x700, continua no repo se precisar voltar.
    avatar: 'images/ig-jheny-avatar.jpg',
    photoIsPlaceholder: false,
    bio: 'Jheny é maquiadora especializada em realçar a beleza natural de cada cliente, com técnicas voltadas para peles brasileiras e olhar atento a cada detalhe. Atende noivas, formandas e produções para eventos, sempre com produtos de alta fixação e acabamento impecável em fotos.',
    instagram: 'jhenyluanyybeauty',
    instagramIsReal: true,
    services: [
      { icon: '💄', name: 'Maquiagem Social', desc: 'Make para o dia a dia, ensaios ou compromissos, natural e elegante, feita sob medida para você.', price: 'R$150', durationMin: 60 },
      { icon: '👰', name: 'Maquiagem para Noiva', desc: 'Produção completa para o grande dia, com prova incluída e produtos de alta fixação para durar até o último brinde.', price: 'R$350', popular: true, durationMin: 120 },
      { icon: '✨', name: 'Maquiagem para Festa', desc: 'Para debutantes, formaturas e festas, com acabamento mais intenso e efeito prolongado para fotos.', price: 'R$180', durationMin: 75 },
      { icon: '👁️', name: 'Design de Sobrancelha', desc: 'Modelagem que valoriza o formato do seu rosto, com técnica de fio a fio ou henna.', price: 'R$40', durationMin: 30 },
      { icon: '🎀', name: 'Aplicação de Cílios', desc: 'Cílios postiços fio a fio ou boneca, para um olhar mais marcante no seu evento.', price: 'R$90', durationMin: 60 },
      { icon: '🎨', name: 'Aula de Automaquiagem', desc: 'Aula individual e personalizada para você aprender a se maquiar sozinha no dia a dia.', price: 'R$120', durationMin: 90 },
    ],
    // Makes que ela fez de verdade, do Instagram dela. Antes eram banco de imagem.
    gallery: [
      'images/ig-jheny-1.jpg',
      'images/ig-jheny-2.jpg',
      'images/ig-jheny-3.jpg',
    ],
  },
  {
    slug: 'vitoria',
    name: 'Vitória',
    role: 'Cabelo',
    avatar: 'images/vitoria-avatar-stock.jpg',
    photoIsPlaceholder: true,
    bio: 'Vitória é cabeleireira especializada em cortes, coloração e tratamentos capilares, sempre buscando o equilíbrio entre saúde e estilo. Atenta às tendências, ela personaliza cada atendimento para valorizar a textura e o formato natural do seu cabelo.',
    instagram: null,
    instagramIsReal: false,
    services: [
      { icon: '✂️', name: 'Corte Feminino', desc: 'Corte personalizado de acordo com o formato do rosto e a textura do seu cabelo.', price: 'R$70', durationMin: 60 },
      { icon: '💨', name: 'Escova Modelada', desc: 'Escova com acabamento liso ou volumoso, pronta para o seu dia ou a sua noite.', price: 'R$60', durationMin: 45 },
      { icon: '💧', name: 'Hidratação Profunda', desc: 'Tratamento que repõe nutrientes e devolve brilho e maciez para o fio.', price: 'R$90', durationMin: 60 },
      { icon: '🎨', name: 'Coloração', desc: 'Cobertura de fios brancos ou mudança de cor, com produtos que preservam a saúde do cabelo.', price: 'R$180', popular: true, durationMin: 120 },
      { icon: '✨', name: 'Luzes / Mechas', desc: 'Iluminação personalizada para dar profundidade e movimento ao cabelo.', price: 'R$250', durationMin: 180 },
      { icon: '👑', name: 'Penteado (Festa/Noiva)', desc: 'Penteados para eventos especiais, com prova disponível para noivas.', price: 'R$150', durationMin: 90 },
    ],
    gallery: [
      'images/vitoria-look-1-stock.jpg',
      'images/vitoria-look-2-stock.jpg',
      'images/vitoria-look-3-stock.jpg',
      'images/vitoria-look-4-stock.jpg',
      'images/vitoria-look-5-stock.jpg',
    ],
  },
];

export function getProfessional(slug: string): Professional | undefined {
  return professionals.find((p) => p.slug === slug);
}

/**
 * Converte o preço de exibição ('R$120') no número que a agenda soma.
 * O campo `price` é string porque nasceu pro site público, onde ele é texto puro.
 * Preferi manter uma fonte só e derivar o número aqui, em vez de duplicar o valor
 * em dois campos que podem divergir com o tempo.
 */
export function priceOf(service: Service): number {
  const digits = service.price.replace(/[^\d,.-]/g, '').replace(',', '.');
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) ? n : 0;
}

/** Serviços de uma profissional pelo NOME (é o que a sessão de login carrega, não o slug). */
export function servicesForName(name: string): Service[] {
  return professionals.find((p) => p.name === name)?.services ?? [];
}
