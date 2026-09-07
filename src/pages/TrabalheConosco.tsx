import { WHATSAPP_LINK } from '../data/professionals';
import { WhatsappIcon } from '../components/icons';
import './TrabalheConosco.css';

/**
 * Página pública de recrutamento de colaboradoras.
 *
 * O conteúdo vem do deck `projeto-expansao/apresentacao-colaboradoras.html`, que é
 * material INTERNO e não está no repo. Duas coisas do deck ficaram deliberadamente
 * de fora daqui:
 *
 * 1. O valor da locação (R$ 500/mês) e qualquer outra condição comercial.
 * 2. A divisão da plataforma de cursos (90/10).
 *
 * Motivo: o Erick já tinha tirado condição comercial dos documentos uma vez, em
 * 24/08/2026 ("vamos contar isso só depois"), e este aqui é um site público, onde
 * o número fica exposto a concorrente e trava a negociação antes da conversa. A
 * página vende a oportunidade e leva pro WhatsApp; o valor sai na entrevista.
 */

const WHATSAPP_VAGA = `${WHATSAPP_LINK}?text=${encodeURIComponent(
  'Oi! Vi a página Trabalhe Conosco no site do Afrodite Studio e queria conversar sobre a vaga.'
)}`;

const PILARES = [
  {
    titulo: 'Para a sua cliente',
    texto: 'Um lugar bonito, confortável e acolhedor, onde ela se sente cuidada do momento em que entra até a hora de ir embora.',
  },
  {
    titulo: 'Para você',
    texto: 'Estrutura, marca, presença digital e um caminho de crescimento com regras claras. Não um contrato de aluguel e boa sorte.',
  },
  {
    titulo: 'Para todas nós',
    texto: 'Um ambiente onde as mulheres se apoiam. O que uma aprende, a outra também aprende.',
  },
];

const PRIMEIRO_DIA = [
  { icone: '🌐', titulo: 'Espaço no site do studio', texto: 'Você aparece na vitrine que já traz cliente, com o nome e a credibilidade do studio por trás.' },
  { icone: '💎', titulo: 'Uma página só sua', texto: 'Com o seu nome, os seus serviços e os seus preços. Feita e mantida pelo studio, sem você mexer em nada técnico.' },
  { icone: '💬', titulo: 'WhatsApp direto', texto: 'A cliente escolhe o serviço na sua página e cai na sua conversa com a mensagem já escrita.' },
  { icone: '📊', titulo: 'Sistema interno', texto: 'Sua conta para registrar clientes, montar a agenda, controlar gastos e acompanhar os seus números.' },
];

const ESPECIALIDADES = ['💇‍♀️ Cabelo', '💅 Unhas', '💄 Maquiagem', '👁️ Lash', '💆‍♀️ Massagem'];

const JUNTAS = [
  { titulo: 'Cliente nova sem esforço', texto: 'Quem veio fazer o cabelo conhece o seu trabalho ali do lado.' },
  { titulo: 'Indicação entre colegas', texto: 'Suas colegas te indicam, e você indica elas. Todo mundo ganha com isso.' },
  { titulo: 'Sua agenda respira', texto: 'O movimento de uma área ajuda a encher os dias fracos da outra.' },
  { titulo: 'Você aprende junto', texto: 'Cinco áreas no mesmo lugar é troca de conhecimento todo dia.' },
];

const AVALIACAO = [
  { icone: '📈', titulo: 'Evolução', itens: 'Comprometimento, engajamento e vontade de crescer' },
  { icone: '🎯', titulo: 'Serviço', itens: 'Tempo de atendimento e qualidade do trabalho' },
  { icone: '🤍', titulo: 'Comportamento', itens: 'Gentileza, educação, compreensão e ética' },
  { icone: '⭐', titulo: 'Feedback das clientes', itens: 'Tempo, qualidade, valor e tratativa' },
];

const CAMINHO = [
  { quando: 'Hoje', titulo: 'Você entra', texto: 'Posto de trabalho pronto, sua página no ar, acesso ao sistema e o padrão da casa funcionando a seu favor.' },
  { quando: '6 meses', titulo: 'Você sobe de patamar', texto: 'Contrato estendido, grupo VIP do studio, mais ferramentas no sistema e acesso à plataforma de cursos.' },
  { quando: '1 ano+', titulo: 'Você vira referência', texto: 'Portfólio, trajetória e o seu próprio curso no ar. Outras profissionais passam a querer aprender com você.' },
  { quando: 'Depois', titulo: 'Você lidera uma unidade', texto: 'Uma nova unidade do studio em outra região de São Paulo, com você no comando e o método que já sabe de cor.' },
];

const COMPROMISSO_SEU = [
  'Cuidar da experiência da cliente, não só do serviço dela',
  'Registrar toda cliente no sistema, sem exceção',
  'Cumprir os horários da sua agenda e avisar com antecedência quando algo mudar',
  'Manter o seu posto impecável',
  'Estar na reunião mensal e levar as suas questões para ela',
  'Somar com as outras: aqui ninguém disputa cliente',
];

const COMPROMISSO_NOSSO = [
  'Manter o ambiente no padrão que faz o seu preço valer',
  'Divulgar você no site, nas redes e para as clientes da casa',
  'Ser honesta com você todo mês, mesmo quando for difícil',
  'Dar ferramentas para você crescer, não só espaço para trabalhar',
  'Cumprir o que está escrito aqui e no seu contrato',
];

const PASSOS = [
  { n: '01', titulo: 'Conversa', texto: 'Uma entrevista para você conhecer o studio e a gente conhecer você.' },
  { n: '02', titulo: 'Contrato', texto: 'Leitura tranquila, tira-dúvidas e assinatura das duas vias.' },
  { n: '03', titulo: 'Sua página', texto: 'Fotos suas e dos seus trabalhos, tabela de serviços e o site no ar.' },
  { n: '04', titulo: 'Sistema', texto: 'Sua conta criada e um treinamento rápido de como usar.' },
  { n: '05', titulo: 'Primeiro dia', texto: 'Seu posto pronto e a primeira cliente na agenda.' },
];

export function TrabalheConosco() {
  return (
    <>
      <section className="tc-hero">
        <div className="container tc-hero-inner">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Trabalhe conosco</div>
          <h1 className="tc-title">Seu lugar <span>é aqui</span></h1>
          <p className="tc-lead">
            Este é o convite para você fazer parte do Afrodite Studio. Aqui você não paga por um
            metro quadrado: você faz parte de uma experiência inteira que a sua cliente vai viver,
            e é essa experiência que faz o seu trabalho valer mais.
          </p>
          <a href={WHATSAPP_VAGA} className="btn-primary" target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="wa-icon" />
            Quero conversar sobre a vaga
          </a>
        </div>
      </section>

      <section className="tc-sec tc-alt">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>O que é este studio</div>
            <h2 className="sec-title">Não é um espaço alugado.<br /><span>É um lugar para crescer.</span></h2>
          </div>
          <div className="tc-grid-3">
            {PILARES.map((p, i) => (
              <div className="tc-card reveal" style={{ transitionDelay: `${i * .06}s` }} key={p.titulo}>
                <div className="tc-card-title">{p.titulo}</div>
                <p className="tc-card-text">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tc-sec">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>Desde o primeiro dia</div>
            <h2 className="sec-title">O que já é seu <span>assim que você entra</span></h2>
            <p className="sec-sub">Nada disso é promessa para o futuro. É o que você recebe na primeira semana.</p>
          </div>
          <div className="tc-grid-4">
            {PRIMEIRO_DIA.map((p, i) => (
              <div className="tc-card reveal" style={{ transitionDelay: `${i * .05}s` }} key={p.titulo}>
                <span className="tc-icon">{p.icone}</span>
                <div className="tc-card-title">{p.titulo}</div>
                <p className="tc-card-text">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tc-sec tc-alt">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>A casa completa</div>
            <h2 className="sec-title">Aqui você <span>não trabalha sozinha</span></h2>
            <p className="sec-sub">Cinco especialidades no mesmo espaço, e isso muda tudo para quem trabalha aqui</p>
          </div>
          <div className="tc-especialidades reveal">
            {ESPECIALIDADES.map((e) => <span className="tc-esp" key={e}>{e}</span>)}
          </div>
          <div className="tc-grid-4">
            {JUNTAS.map((j, i) => (
              <div className="tc-card reveal" style={{ transitionDelay: `${i * .05}s` }} key={j.titulo}>
                <div className="tc-card-title">{j.titulo}</div>
                <p className="tc-card-text">{j.texto}</p>
              </div>
            ))}
          </div>
          <p className="tc-nota reveal">
            Aqui ninguém disputa cliente. A gente divide a mesma cliente, e ela sai feliz, tendo
            passado por mais de uma de nós.
          </p>
        </div>
      </section>

      <section className="tc-sec">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>Transparência total</div>
            <h2 className="sec-title">Os quatro pontos <span>que a gente olha</span></h2>
            <p className="sec-sub">
              Todo mês a gente senta, olha os seus números e conversa sobre eles. Nada vai ser dito
              no sexto mês que não tenha sido dito no primeiro.
            </p>
          </div>
          <div className="tc-grid-4">
            {AVALIACAO.map((a, i) => (
              <div className="tc-card reveal" style={{ transitionDelay: `${i * .05}s` }} key={a.titulo}>
                <span className="tc-icon">{a.icone}</span>
                <div className="tc-card-title">{a.titulo}</div>
                <p className="tc-card-text">{a.itens}</p>
              </div>
            ))}
          </div>
          <p className="tc-nota reveal">
            Repare que só um desses quatro pontos é sobre técnica. Aqui, como você trata a cliente
            pesa tanto quanto o serviço que você entrega.
          </p>
        </div>
      </section>

      <section className="tc-sec tc-alt">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>O caminho completo</div>
            <h2 className="sec-title">Até onde <span>esse caminho vai</span></h2>
            <p className="sec-sub">
              O projeto do studio é abrir novas unidades em São Paulo, e quem vai comandar essas
              unidades são as colaboradoras formadas aqui dentro.
            </p>
          </div>
          <div className="tc-timeline">
            {CAMINHO.map((c, i) => (
              <div className="tc-step reveal" style={{ transitionDelay: `${i * .07}s` }} key={c.quando}>
                <div className="tc-step-when">{c.quando}</div>
                <div className="tc-step-title">{c.titulo}</div>
                <p className="tc-card-text">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tc-sec">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>De igual para igual</div>
            <h2 className="sec-title">O combinado <span>dos dois lados</span></h2>
          </div>
          <div className="tc-grid-2">
            <div className="tc-pact reveal">
              <div className="tc-pact-title">O seu compromisso</div>
              <ul className="tc-list">
                {COMPROMISSO_SEU.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <div className="tc-pact reveal is-studio">
              <div className="tc-pact-title">O compromisso do studio</div>
              <ul className="tc-list">
                {COMPROMISSO_NOSSO.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="tc-sec tc-alt">
        <div className="container">
          <div className="tc-head reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>Para começar</div>
            <h2 className="sec-title">Os próximos <span>passos</span></h2>
          </div>
          <div className="tc-passos">
            {PASSOS.map((p, i) => (
              <div className="tc-passo reveal" style={{ transitionDelay: `${i * .05}s` }} key={p.n}>
                <span className="tc-passo-n">{p.n}</span>
                <div>
                  <div className="tc-card-title">{p.titulo}</div>
                  <p className="tc-card-text">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="tc-nota reveal">
            O que trazer: documento com foto, CPF, comprovante de endereço e os dados do seu MEI,
            se já tiver. E as fotos dos seus melhores trabalhos, porque é com elas que a sua página
            vai ao ar.
          </p>
        </div>
      </section>

      <section className="tc-final">
        <div className="container tc-final-inner">
          <h2 className="tc-final-title">O seu lugar <span>está te esperando</span></h2>
          <p className="tc-lead">
            Se você chegou até aqui e sentiu que é isso que quer para a sua carreira, o próximo
            passo é uma conversa. Vem tomar um café com a gente e conhecer o espaço.
          </p>
          <a href={WHATSAPP_VAGA} className="btn-primary" target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="wa-icon" />
            Quero conversar sobre a vaga
          </a>
          <p className="tc-local">Jardim Peri, São Paulo</p>
        </div>
      </section>
    </>
  );
}
