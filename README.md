# Afrodite Studio

Site institucional para um studio de beleza com três especialistas: Flávia (unhas), Jheny (maquiagem)
e Vitória (cabelo). Home one-page com resultados, equipe, avaliações e ranking de serviços, mais uma
página própria por profissional, com agendamento direto pelo WhatsApp.

🔗 **Site no ar:** [afroditestudio.vercel.app](https://afroditestudio.vercel.app) · espelho no [GitHub Pages](https://erickkadr.github.io/flavia-longnails/)

## Sobre o projeto

Landing page para negócio local, pensada para converter visita em agendamento: resultados do studio,
equipe com cards por profissional (cada uma com página própria, com bio, serviços e preços), avaliações
de clientes, ranking dos serviços mais contratados e localização, com o botão de WhatsApp sempre
visível (fixo na tela) para o cliente marcar o horário sem fricção.

## Motivação

Evolução de um projeto real de portfólio (antes só sobre unhas) para representar o studio completo,
com as três profissionais. O objetivo continua sendo um site que **vende o serviço visualmente** e
torna o agendamento o mais direto possível, sem formulário, direto pro WhatsApp da Flávia.

## Funcionalidades

- **Hero** com estatísticas de credibilidade (anos de experiência, especialistas, avaliação média)
- **Resultados do studio** em destaque, com foto e prova social
- **Equipe** com card por profissional, cada uma linkando pra sua própria página (bio + serviços + preços)
- **Avaliações** em esteira de auto-scroll infinito, com pausa no hover
- **Ranking dos serviços mais contratados**, com destaque pro top 3
- **Botão de WhatsApp flutuante**, sempre visível, além de vários CTAs ao longo da página
- **Menu fixo (sticky)** que muda de estilo ao rolar a página
- **Menu mobile** responsivo, com Cursos / Área da Colaboradora / Agendar Agora
- **Carrossel infinito** (avaliações, tags e galerias das profissionais) via `<Marquee>`, sem depender de clique
- **Animações de entrada (scroll reveal)** conforme o usuário rola a página

> As fotos e o carrossel de Jheny e Vitória usam imagens de banco (placeholder). O Instagram da Jheny
> é real (@jhenyluanyybeauty), mas o carrossel dela também é estático/ilustrativo, já que puxar posts
> ao vivo exigiria token da API do Meta. Vitória ainda não tem Instagram cadastrado no site. A foto da
> Flávia no hero e no card da equipe também é real (close-up de um trabalho dela), não um retrato de
> rosto: não existe nenhuma foto de rosto dela nos assets do projeto.

## Tecnologias

- **React 18 + TypeScript**, via **Vite**
- **React Router** (`BrowserRouter`, com o truque de `404.html` pra funcionar em página de projeto do GitHub Pages)
- **CSS puro** por componente (sem framework de UI)

## Como rodar localmente

```bash
npm install
npm run dev       # http://localhost:5173/flavia-longnails/
```

## Build e deploy

```bash
npm run build      # gera dist/
npm run deploy      # build + publica dist/ na branch gh-pages (via pacote gh-pages)
```

O GitHub Pages deste repositório está configurado pra servir da branch `gh-pages` (raiz), **não** da
`main`. Isso evita depender de GitHub Actions (o token usado aqui não tem escopo `workflow`).

---

### Made with ♥ by Erick Dantas | [Contato](https://www.linkedin.com/in/erickkadr/)
