# Studio Flávia Alves

Site institucional para um studio de beleza com três especialistas — Flávia (unhas), Jheny (maquiagem)
e Vitória (cabelo). Home one-page com resultados, equipe, avaliações e ranking de serviços, mais uma
página própria por profissional, com agendamento direto pelo WhatsApp.

🔗 **Site no ar:** [erickkadr.github.io/Flavia-LongNails](https://erickkadr.github.io/Flavia-LongNails/)

## Sobre o projeto

Landing page para negócio local, pensada para converter visita em agendamento: resultados do studio,
equipe com cards por profissional (cada uma com página própria — bio, serviços e preços), avaliações
de clientes, ranking dos serviços mais contratados e localização — com o botão de WhatsApp sempre
visível (fixo na tela) para o cliente marcar o horário sem fricção.

## Motivação

Evolução de um projeto real de portfólio (antes só sobre unhas) para representar o studio completo,
com as três profissionais. O objetivo continua sendo um site que **vende o serviço visualmente** e
torna o agendamento o mais direto possível, sem formulário — direto pro WhatsApp da Flávia.

## Funcionalidades

- **Hero** com estatísticas de credibilidade (anos de experiência, especialistas, avaliação média)
- **Resultados do studio** em galeria responsiva, misturando os três serviços
- **Equipe** com card por profissional, cada uma linkando pra sua própria página (bio + serviços + preços)
- **Avaliações** em carrossel horizontal com setas
- **Ranking dos serviços mais contratados** + faixa de tags em marquee
- **Botão de WhatsApp flutuante**, sempre visível, além de vários CTAs ao longo da página
- **Menu fixo (sticky)** que muda de estilo ao rolar a página
- **Menu mobile** responsivo
- **Animações de entrada (scroll reveal)** conforme o usuário rola a página

> As fotos e o carrossel de Jheny e Vitória usam imagens de banco (placeholder) — o Instagram da Jheny
> é real (@jhenyluanyybeauty), mas o carrossel dela também é estático/ilustrativo, já que puxar posts
> ao vivo exigiria token da API do Meta. Vitória ainda não tem Instagram cadastrado no site.

## Tecnologias

- **HTML5**
- **CSS3** (layout responsivo, animações, sticky header)
- **JavaScript** (IntersectionObserver para scroll reveal, menu mobile, header dinâmico)

## Como rodar localmente

Sem build, sem dependência — abra `index.html` no navegador ou sirva a pasta:

```bash
npx serve .
```

---

### Made with ♥ by Erick Dantas | [Contato](https://www.linkedin.com/in/erickkadr/)
