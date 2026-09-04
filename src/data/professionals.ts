export interface Service {
  icon: string;
  name: string;
  desc: string;
  price: string;
  priceNote?: string;
  popular?: boolean;
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
    avatar: 'images/avatar-about-BtqxEbBP.png',
    photoIsPlaceholder: false,
    bio: 'Especialista em unhas longas e nail art, com anos de experiência transformando as mãos das clientes em verdadeiras obras de arte. Cada atendimento é único e personalizado, com produtos de alta qualidade e técnicas modernas, resultados duradouros e acabamento impecável.',
    instagram: 'flavia_longnails',
    instagramIsReal: true,
    services: [
      { icon: '💅', name: 'Manicure', desc: 'Cuidado completo para suas unhas naturais, incluindo cutícula, lixa e esmaltação. Acabamento perfeito para o dia a dia.', price: 'R$40' },
      { icon: '👣', name: 'Pedicure', desc: 'Tratamento completo para os pés, com hidratação, esfoliação e esmaltação. Cuide dos seus pés com todo o carinho.', price: 'R$50' },
      { icon: '💎', name: 'Alongamento em Gel', desc: 'Unhas longas e naturais com gel de alta qualidade. Resultado durável e brilhante, perfeito para quem ama unhas compridas.', price: 'R$120', popular: true },
      { icon: '🔮', name: 'Unhas Acrílicas', desc: 'Alongamento resistente e versátil. As unhas acrílicas oferecem durabilidade excepcional e possibilidade de designs arrojados.', price: 'R$130' },
      { icon: '🌺', name: 'Nail Art', desc: 'Designs únicos e personalizados. Das flores delicadas aos padrões geométricos, crie o visual dos seus sonhos.', price: 'R$20', priceNote: '/ design' },
      { icon: '🛡️', name: 'Blindagem', desc: 'Proteção extra para suas unhas naturais. A blindagem fortalece e protege, ideal para quem tem unhas fracas ou quebradiças.', price: 'R$80' },
    ],
    gallery: [
      'images/gallery-1-BmiSL3Sa.jpg',
      'images/gallery-2-DcqYb2kp.jpg',
      'images/gallery-3-CfJ07KFu.jpg',
      'images/gallery-4-D86AdBP4.jpg',
      'images/gallery-5-DCuAuPD9.jpg',
      'images/gallery-6-Cm7G4Z85.jpg',
      'images/gallery-7-CosK5qJ0.jpg',
      'images/gallery-8-B1CqWwoN.jpg',
      'images/gallery-9-nc28CYqH.jpg',
    ],
  },
  {
    slug: 'jheny',
    name: 'Jheny',
    role: 'Maquiagem',
    avatar: 'images/jheny-avatar-stock.jpg',
    photoIsPlaceholder: true,
    bio: 'Jheny é maquiadora especializada em realçar a beleza natural de cada cliente, com técnicas voltadas para peles brasileiras e olhar atento a cada detalhe. Atende noivas, formandas e produções para eventos, sempre com produtos de alta fixação e acabamento impecável em fotos.',
    instagram: 'jhenyluanyybeauty',
    instagramIsReal: true,
    services: [
      { icon: '💄', name: 'Maquiagem Social', desc: 'Make para o dia a dia, ensaios ou compromissos, natural e elegante, feita sob medida para você.', price: 'R$150' },
      { icon: '👰', name: 'Maquiagem para Noiva', desc: 'Produção completa para o grande dia, com prova incluída e produtos de alta fixação para durar até o último brinde.', price: 'R$350', popular: true },
      { icon: '✨', name: 'Maquiagem para Festa', desc: 'Para debutantes, formaturas e festas, com acabamento mais intenso e efeito prolongado para fotos.', price: 'R$180' },
      { icon: '👁️', name: 'Design de Sobrancelha', desc: 'Modelagem que valoriza o formato do seu rosto, com técnica de fio a fio ou henna.', price: 'R$40' },
      { icon: '🎀', name: 'Aplicação de Cílios', desc: 'Cílios postiços fio a fio ou boneca, para um olhar mais marcante no seu evento.', price: 'R$90' },
      { icon: '🎨', name: 'Aula de Automaquiagem', desc: 'Aula individual e personalizada para você aprender a se maquiar sozinha no dia a dia.', price: 'R$120' },
    ],
    gallery: [
      'images/jheny-look-1-stock.jpg',
      'images/jheny-look-2-stock.jpg',
      'images/jheny-look-3-stock.jpg',
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
      { icon: '✂️', name: 'Corte Feminino', desc: 'Corte personalizado de acordo com o formato do rosto e a textura do seu cabelo.', price: 'R$70' },
      { icon: '💨', name: 'Escova Modelada', desc: 'Escova com acabamento liso ou volumoso, pronta para o seu dia ou a sua noite.', price: 'R$60' },
      { icon: '💧', name: 'Hidratação Profunda', desc: 'Tratamento que repõe nutrientes e devolve brilho e maciez para o fio.', price: 'R$90' },
      { icon: '🎨', name: 'Coloração', desc: 'Cobertura de fios brancos ou mudança de cor, com produtos que preservam a saúde do cabelo.', price: 'R$180', popular: true },
      { icon: '✨', name: 'Luzes / Mechas', desc: 'Iluminação personalizada para dar profundidade e movimento ao cabelo.', price: 'R$250' },
      { icon: '👑', name: 'Penteado (Festa/Noiva)', desc: 'Penteados para eventos especiais, com prova disponível para noivas.', price: 'R$150' },
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
