# Vídeo do hero

## O que está no ar agora

`hero.mp4` é um vídeo de banco, **provisório**, posto em 05/09/2026 enquanto o MCP do
Magnific não estava conectado.

| | |
|---|---|
| Origem | Pexels, vídeo `7754857` ("A manicurist applying nail polish to the client") |
| Baixado de | `https://www.pexels.com/download/video/7754857/` |
| Licença | [Pexels License](https://www.pexels.com/license/): uso comercial livre, sem atribuição obrigatória |
| Arquivo | 1920x1080, 30fps, 4,8 MB |

Dois candidatos alternativos foram baixados na mesma leva e ficaram fora: `7754856`
(aplicando esmalte) e `7987790` (maquiagem numa cliente). Se quiser trocar, é o mesmo
endereço com o id trocado.

**4,8 MB está acima do ideal de 3 MB descrito abaixo.** Não deu pra comprimir porque não há
`ffmpeg` na máquina onde isso foi feito. Quando houver, o comando está no fim deste arquivo.

O hero da home ([src/components/Hero.tsx](../../src/components/Hero.tsx)) espera um arquivo
chamado exatamente **`hero.mp4`** nesta pasta.

Enquanto ele não existir, nada quebra: o `<video>` cai no `poster`
(`public/images/hero-nails-o-0j6oBo.jpg`) e o hero fica igual, só parado. Um `<source>` que
responde 404 não apaga o poster.

## O que o arquivo precisa ser

| | |
|---|---|
| Nome | `hero.mp4` |
| Codec | H.264 (`libx264`), perfil `high`, `yuv420p` |
| Resolução | 1920x1080. Não passa disso: o vídeo é fundo, ninguém olha detalhe |
| Duração | 8 a 15 segundos, cortado pra emendar em loop sem salto |
| Áudio | **Nenhum.** A trilha precisa ser removida, não só mutada |
| Tamanho | Idealmente abaixo de 3 MB, teto de 5 MB |

Sem áudio e com `muted` é o que faz o autoplay funcionar. Navegador nenhum deixa um vídeo
com som tocar sozinho, e se o autoplay for bloqueado o hero fica congelado no primeiro frame.

## Enquadramento

O conteúdo (título, botões, números) fica na **coluna da direita**, sobre um degradê que
vira bege sólido a partir de uns 60% da largura. Ou seja: **a parte interessante do vídeo
tem que estar do lado esquerdo do quadro.** Um assunto centralizado fica metade escondido
atrás do texto.

Movimento lento e contínuo funciona muito melhor que corte rápido: mão trabalhando na unha,
pincel de maquiagem, secador, detalhe de esmalte. Corte seco a cada segundo compete com a
leitura do texto e cansa.

## Comprimir

Com o arquivo bruto em `bruto.mp4`, o comando abaixo entrega o formato certo, sem áudio e
com o `faststart` (que deixa o vídeo começar a tocar antes de baixar inteiro):

```bash
ffmpeg -i bruto.mp4 -t 12 -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 26 -preset slow -movflags +faststart \
  hero.mp4
```

Se passar de 5 MB, sobe o `-crf` (28, 30). Quanto maior o número, menor o arquivo e pior a
imagem. Em vídeo de fundo velado por degradê dá pra ir longe sem ninguém perceber.

## Onde ele NÃO é carregado

Abaixo de 900px de largura, e para quem liga "reduzir movimento" no sistema, o `<source>`
nem chega a ser renderizado, então o mp4 não é baixado. Nesses casos aparece só o poster.
A regra está no `useEffect` do `Hero.tsx`, se quiser mudar o corte.

## Este arquivo vai pro git

Diferente do `.env` e do `projeto-expansao/`, o `hero.mp4` **precisa** estar commitado: o
GitHub Pages e a Vercel constroem o site a partir do repo, não tem storage separado. É por
isso que o limite de tamanho importa.
