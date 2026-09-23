/**
 * Uma linha da tabela `services` no Supabase (migration.sql, seção 7).
 *
 * Até 23/09/2026 isso era um array fixo aqui no código, um por profissional, editado
 * por mim. Agora cada uma edita o próprio catálogo na tela "Meus Serviços" (Área da
 * Colaboradora) e essa tabela alimenta tanto o Agendamento quanto a página pública
 * dela — é por isso que os nomes dos campos são snake_case, iguais à coluna: mesma
 * convenção de `Appointment`/`Client` (ver Agendamento.tsx, Retorno.tsx), sem camada
 * de tradução entre o nome da coluna e o nome do campo em TS.
 */
export interface Service {
  id: string;
  owner_id: string | null;
  /** Igual ao `Professional.name` dela — é como a tabela filtra por profissional. */
  professional: string;
  /** Chave do mapa em `src/components/Icon.tsx`, nao emoji. */
  icon: string;
  name: string;
  desc: string;
  price: number;
  price_note: string | null;
  popular: boolean;
  duration_min: number;
  created_at: string;
}

/** 'R$35' pra valor redondo, 'R$64,90' quando tem centavo — mesmo padrão visual de sempre. */
export function formatPrice(n: number): string {
  return Number.isInteger(n) ? `R$${n}` : `R$${n.toFixed(2).replace('.', ',')}`;
}

export interface Professional {
  slug: 'flavia' | 'jheny' | 'vitoria' | 'mayte';
  name: string;
  role: string;
  avatar: string;
  photoIsPlaceholder: boolean;
  bio: string;
  instagram: string | null;
  instagramIsReal: boolean;
  /**
   * WhatsApp próprio da profissional (só dígitos, com DDI 55), pra quem já tem número
   * separado do studio (Jheny, Vitória, Mayte, desde 16/09/2026). `null` = usa o número
   * principal do salão (`WHATSAPP_NUMBER`) — é o caso da Flávia, que é a dona e sempre
   * foi esse número mesmo.
   */
  whatsapp: string | null;
  gallery: string[];
  /**
   * Regras de atendimento da profissional (sinal, atraso, domicilio, pagamento).
   * Opcional porque so a Jheny entregou material com isso ate agora: veio do
   * portfolio em PDF dela. Quando Flavia e Vitoria passarem as delas, e so
   * preencher aqui que a secao aparece sozinha na pagina.
   */
  policies?: { icon: string; title: string; text: string }[];
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
    // Trocado em 16/09/2026: @flavia_longnails era o Instagram antigo, pessoal. O novo
    // (@lummier_studiobeauty) é do salão, e também passa a ser o dela por ser a dona.
    instagram: 'lummier_studiobeauty',
    instagramIsReal: true,
    whatsapp: null,
    // Puxadas do @flavia_longnails em 05/09/2026, a pedido do Erick.
    // Em 16/09/2026 o Erick mandou 2 fotos novas por WhatsApp, em resolucao bem maior
    // (ate 1600px, contra os 480x640 do Instagram) — SOMADAS a estas, nao no lugar.
    gallery: [
      'images/ig-flavia-1.jpg',
      'images/ig-flavia-2.jpg',
      'images/ig-flavia-3.jpg',
      'images/ig-flavia-4.jpg',
      'images/ig-flavia-5.jpg',
      'images/ig-flavia-6.jpg',
      'images/flavia-trabalho-1.jpg',
      'images/flavia-trabalho-2.jpg',
    ],
    // Regras dela, do mesmo catálogo em PDF (23/09/2026). Antes só a Jheny tinha essa
    // seção: era a única com material. "Domicílio" ficou de fora de propósito — o
    // catálogo da Flávia não menciona atendimento a domicílio, diferente do da Jheny.
    policies: [
      { icon: 'sinal', title: 'Sinal de agendamento', text: 'Os agendamentos são feitos com antecedência e mediante pagamento de sinal para confirmação.' },
      { icon: 'cancelamento', title: 'Cancelamento e reagendamento', text: 'Pedimos, por gentileza, que sejam avisados com no mínimo 24h de antecedência.' },
      { icon: 'relogio', title: 'Atrasos', text: 'A tolerância é de 15 minutos. Depois desse período o atendimento pode ser cancelado.' },
      { icon: 'checklist', title: 'Atendimento exclusivo', text: 'Evite vir acompanhada, para mantermos um ambiente tranquilo e focado no seu momento. Siga as orientações pós-procedimento para o serviço durar mais.' },
      { icon: 'pagamento', title: 'Formas de pagamento', text: 'Dinheiro, Pix ou cartão.' },
      { icon: 'lixeira', title: 'Higiene e esterilização', text: 'Todo material passa por esterilização em autoclave, conforme as normas da Anvisa, e os instrumentos só são abertos na presença da cliente.' },
      { icon: 'aviso', title: 'Manutenção e reposição', text: 'Não realizo manutenção de trabalhos feitos por outra profissional. Reposição de unha quebrada: R$10 por unidade. Alongamento mal removido ou danificado pode exigir tempo extra, avaliado no atendimento.' },
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
    // Número dela, passado pelo Erick em 16/09/2026 (antes ia tudo pro número do studio).
    whatsapp: '5511967218862',
    // Makes que ela fez de verdade, do Instagram dela. Antes eram banco de imagem.
    // Em 16/09/2026 o Erick mandou 5 fotos novas por WhatsApp, em resolucao bem maior
    // (ate 1600px, contra os 480x640 do Instagram) — SOMADAS a estas, nao no lugar.
    gallery: [
      'images/ig-jheny-1.jpg',
      'images/ig-jheny-2.jpg',
      'images/ig-jheny-3.jpg',
      'images/jheny-trabalho-1.jpg',
      'images/jheny-trabalho-5.jpg',
    ],
    policies: [
      { icon: 'sinal', title: 'Sinal de agendamento', text: 'Para reservar o horário é necessário o pagamento de 30% do valor do serviço. O agendamento só é confirmado após o sinal, e o restante é pago no dia do atendimento.' },
      { icon: 'cancelamento', title: 'Cancelamento', text: 'Em caso de cancelamento por parte da cliente, o sinal de agendamento não é reembolsado.' },
      { icon: 'relogio', title: 'Atrasos', text: 'A tolerância é de 15 minutos. Depois desse período o atendimento pode ser cancelado ou sofrer alteração de horário.' },
      { icon: 'casa', title: 'Atendimento a domicílio', text: 'Disponível mediante agenda. O valor do serviço é o mesmo, acrescido do custo de deslocamento de ida e volta, calculado conforme a localização da cliente.' },
      { icon: 'pagamento', title: 'Formas de pagamento', text: 'Pix ou dinheiro.' },
      { icon: 'checklist', title: 'No dia do atendimento', text: 'Venha com a pele limpa e sem maquiagem, evitando óleos ou produtos pesados no rosto. Se possível use uma blusa que não precise passar pela cabeça. Traga referências, se tiver. A preparação da pele é feita por ela antes da maquiagem.' },
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
    // Número dela, passado pelo Erick em 16/09/2026 (antes ia tudo pro número do studio).
    whatsapp: '5511940498740',
    gallery: [
      'images/vitoria-look-1-stock.jpg',
      'images/vitoria-look-2-stock.jpg',
      'images/vitoria-look-3-stock.jpg',
      'images/vitoria-look-4-stock.jpg',
      'images/vitoria-look-5-stock.jpg',
    ],
  },
  {
    slug: 'mayte',
    name: 'Mayte',
    role: 'Cílios & Sobrancelhas',
    // Foto real dela, do post do Instagram @espaco.seixas que o Erick indicou (15/09/2026).
    // Baixada via oEmbed publico do Instagram (thumbnail_url), sem precisar de login.
    avatar: 'images/mayte-perfil.jpg',
    photoIsPlaceholder: false,
    // Texto passado pelo Erick em 16/09/2026, substituindo o trecho inicial que eu tinha escrito.
    bio: 'Seu atendimento vai além da técnica: é um momento de cuidado, acolhimento e autoestima. Cada procedimento é realizado com dedicação, atenção aos detalhes e compromisso com a qualidade, para que você se sinta especial em cada visita. Do olhar marcante à sobrancelha que valoriza seus traços, cada detalhe é pensado com carinho para proporcionar uma experiência de beleza, conforto e autocuidado.',
    instagram: 'espaco.seixas',
    instagramIsReal: true,
    // Número dela, passado pelo Erick em 16/09/2026 (antes ia tudo pro número do studio).
    whatsapp: '5511958290432',
    // Trabalhos reais dela, do feed do @espaco.seixas (15/09/2026). Mesma técnica das
    // outras: página renderizada via Playwright pra pegar as URLs assinadas do CDN
    // (curl direto na página não funciona, as imagens entram por JS), depois baixadas.
    // As 6 mais recentes marcadas como "Photo" (não vídeo/reel) no feed dela.
    gallery: [
      'images/ig-mayte-1.jpg',
      'images/ig-mayte-2.jpg',
      'images/ig-mayte-3.jpg',
      'images/ig-mayte-4.jpg',
      'images/ig-mayte-5.jpg',
      'images/ig-mayte-6.jpg',
    ],
  },
];

export function getProfessional(slug: string): Professional | undefined {
  return professionals.find((p) => p.slug === slug);
}

/**
 * Link de WhatsApp com a mensagem ja escrita. Os cards de servico do site publico usam
 * isso: a cliente chega no chat com "quero agendar X" digitado, em vez de cair num
 * "Ola" vazio que ela precisa completar sozinha.
 *
 * Nao adiciona botao nenhum na tela: o proprio card vira link. O CLAUDE.md registra
 * pedido explicito de nao encher o site de botao "Agendar pelo WhatsApp".
 */
/**
 * Número que recebe a mensagem: o da própria profissional, se ela tiver um cadastrado
 * (`Professional.whatsapp`), senão cai no número principal do salão. Assim o card de
 * serviço da Jheny manda a mensagem pro WhatsApp dela, não pro da Flávia.
 */
function numberFor(professionalName?: string): string {
  const pro = professionals.find((p) => p.name === professionalName);
  return pro?.whatsapp ?? WHATSAPP_NUMBER;
}

export function whatsappForService(serviceName: string, professionalName?: string): string {
  const comQuem = professionalName ? ` com a ${professionalName}` : '';
  const texto = `Oi! Vim pelo site do Lummier Studio e queria agendar ${serviceName}${comQuem}.`;
  return `https://wa.me/${numberFor(professionalName)}?text=${encodeURIComponent(texto)}`;
}

/** Mesma ideia do `whatsappForService`, pro botão "Agendar pelo WhatsApp" da página da
 * própria profissional (`ProHero.tsx`), que não está preso a um serviço específico. */
export function whatsappForProfessional(professionalName: string): string {
  const texto = `Oi! Vim pelo site do Lummier Studio e queria agendar um horário com a ${professionalName}.`;
  return `https://wa.me/${numberFor(professionalName)}?text=${encodeURIComponent(texto)}`;
}
