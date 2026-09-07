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
  /**
   * Regras de atendimento da profissional (sinal, atraso, domicilio, pagamento).
   * Opcional porque so a Jheny entregou material com isso ate agora: veio do
   * portfolio em PDF dela. Quando Flavia e Vitoria passarem as delas, e so
   * preencher aqui que a secao aparece sozinha na pagina.
   */
  policies?: { title: string; text: string }[];
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
    // Retrato recortado da capa do portfolio dela em PDF, a 300dpi: 900x900, contra os
    // 150x150 que o Instagram entregava. A `ig-jheny-avatar.jpg` e a
    // `jheny-avatar-stock.jpg` continuam no repo.
    avatar: 'images/jheny-perfil.jpg',
    photoIsPlaceholder: false,
    // Texto dela, do portfolio. A bio anterior era escrita por mim e falava de servicos
    // que ela nao oferece (noiva, sobrancelha, cilios).
    bio: 'Tenho 21 anos e minha paixão pela maquiagem começou aos 15, quando comecei a me maquiar, praticar e descobrir o quanto eu amava transformar e realçar a beleza. Acredito que a maquiagem vai muito além da beleza: é sobre autoestima, confiança e se sentir bem consigo mesma. Por isso busco oferecer uma experiência personalizada, valorizando os traços e a personalidade de cada cliente.',
    instagram: 'jhenyluanyybeauty',
    instagramIsReal: true,
    // Os 3 servicos REAIS, com preco e tempo do portfolio em PDF que ela entregou em
    // 07/09/2026. Antes havia 6 servicos inventados por mim, com precos entre R$40 e
    // R$350: nao existiam. Nao repor sem material dela.
    services: [
      { icon: '✨', name: 'Maquiagem Express', desc: 'Produção leve e prática, para quem gosta de uma beleza mais natural e delicada. Pele leve, olhos suaves e acabamento sofisticado, com técnicas mais rápidas.', price: 'R$70', durationMin: 60 },
      { icon: '💄', name: 'Maquiagem Social', desc: 'Produção elaborada e detalhada, com pele bem construída, olhos trabalhados, contorno e iluminação definidos e cílios. Ideal para eventos, festas, formaturas e casamentos.', price: 'R$90', popular: true, durationMin: 120 },
      { icon: '🛡️', name: 'Maquiagem Blindada', desc: 'Produção completa com foco em fixação e durabilidade, feita em camadas. Para eventos longos, dias quentes e ocasiões em que a make precisa permanecer impecável por mais tempo.', price: 'R$110', durationMin: 150 },
    ],
    // Makes que ela fez de verdade, do Instagram dela. Antes eram banco de imagem.
    gallery: [
      'images/ig-jheny-1.jpg',
      'images/ig-jheny-2.jpg',
      'images/ig-jheny-3.jpg',
    ],
    policies: [
      { title: 'Sinal de agendamento', text: 'Para reservar o horário é necessário o pagamento de 30% do valor do serviço. O agendamento só é confirmado após o sinal, e o restante é pago no dia do atendimento.' },
      { title: 'Cancelamento', text: 'Em caso de cancelamento por parte da cliente, o sinal de agendamento não é reembolsado.' },
      { title: 'Atrasos', text: 'A tolerância é de 15 minutos. Depois desse período o atendimento pode ser cancelado ou sofrer alteração de horário.' },
      { title: 'Atendimento a domicílio', text: 'Disponível mediante agenda. O valor do serviço é o mesmo, acrescido do custo de deslocamento de ida e volta, calculado conforme a localização da cliente.' },
      { title: 'Formas de pagamento', text: 'Pix ou dinheiro.' },
      { title: 'No dia do atendimento', text: 'Venha com a pele limpa e sem maquiagem, evitando óleos ou produtos pesados no rosto. Se possível use uma blusa que não precise passar pela cabeça. Traga referências, se tiver. A preparação da pele é feita por ela antes da maquiagem.' },
    ],
  },
  {
    slug: 'vitoria',
    name: 'Vitória',
    role: 'Cabelo',
    // Foto real dela, entregue pelo Erick em 07/09/2026 (485x565). A galeria de
    // trabalhos dela CONTINUA sendo banco de imagem: so o rosto virou real.
    avatar: 'images/vitoria-perfil.png',
    photoIsPlaceholder: false,
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

/**
 * Link de WhatsApp com a mensagem ja escrita. Os cards de servico do site publico usam
 * isso: a cliente chega no chat com "quero agendar X" digitado, em vez de cair num
 * "Ola" vazio que ela precisa completar sozinha.
 *
 * Nao adiciona botao nenhum na tela: o proprio card vira link. O CLAUDE.md registra
 * pedido explicito de nao encher o site de botao "Agendar pelo WhatsApp".
 */
export function whatsappForService(serviceName: string, professionalName?: string): string {
  const comQuem = professionalName ? ` com a ${professionalName}` : '';
  const texto = `Oi! Vim pelo site do Afrodite Studio e queria agendar ${serviceName}${comQuem}.`;
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(texto)}`;
}
