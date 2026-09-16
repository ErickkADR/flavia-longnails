# Vídeos do hero

## O que está no ar agora

O hero da home ([src/components/Hero.tsx](../../src/components/Hero.tsx)) alterna 4 clipes,
um por especialidade, a cada 8s (`ROTATE_MS`). Todos são vídeo de banco do Pexels,
**nenhum é filmagem real do studio** — troca por material real é sempre bem-vinda.

| Arquivo | Especialidade | Pexels ID | Descrição |
|---|---|---|---|
| `hero-unhas.mp4` | Unhas | `7754857` | "A manicurist applying nail polish to the client" |
| `hero-cabelo.mp4` | Cabelo | — | ver histórico do commit que adicionou |
| `hero-make.mp4` | Maquiagem | — | ver histórico do commit que adicionou |
| `hero-cilios.mp4` | Cílios & Sobrancelhas | `5243789` | "Close-up video of an eye" — recorte fechado no olho/cílios (v3, ver nota abaixo) |

Baixado de `https://www.pexels.com/download/video/<id>/`. Licença
[Pexels License](https://www.pexels.com/license/): uso comercial livre, sem atribuição
obrigatória.

Todos somados: ~4,2 MB depois da compressão.

> **`hero-cilios.mp4` já teve duas trocas.** V1 (ID `7133220`, pinça aplicando extensão) era
> um close extremo demais e ficou ilegível/ruim segundo o Erick. V2 trocou pro `5243789`
> (olho abrindo) — mesma fonte usada até hoje —, com `hflip` porque o olho saía do lado
> esquerdo do quadro, exatamente onde o texto do hero fica. Lição da troca V1→V2: **testar
> o enquadramento final na tela antes de considerar pronto**, um frame estático isolado
> engana sobre como fica com o degradê e o texto por cima.
>
> **V3 (16/09/2026): mesma fonte (`5243789`), recorte muito mais fechado.** O V2 era um
> plano de meio-rosto (testa, bochecha, cabelo, olho só uma fração do quadro) — o Erick
> achou "muito pequeno" e pediu foco no olho e nos cílios. V3 parte do **master 4K
> (3840x2160) do mesmo vídeo Pexels**, não do arquivo já cortado em 1920x1080, pra não
> ampliar um recorte que já tinha perdido nitidez. Recorte novo:
> `crop=1550:872:210:340,scale=1920:1080` (ainda 16:9), sobre o trecho `-ss 0.8 -t 2.2`
> do clipe de 5.64s — esse intervalo é o miolo sem piscada (o clipe original pisca perto
> de 0s e de novo em ~3.2-3.4s, então o trecho usado evita as duas). Sem `hflip` desta vez:
> o olho já cai do lado direito do quadro nesse recorte. Master 4K guardado no scratchpad
> da sessão que fez a troca, não no repo (pesado demais pra git).

Enquanto um arquivo não existir, nada quebra: o `<video>` cai no `poster`
(`public/images/hero-nails-o-0j6oBo.jpg`) e o hero fica igual, só parado. Um `<source>` que
responde 404 não apaga o poster.

## O que cada arquivo precisa ser

| | |
|---|---|
| Codec | H.264 (`libx264`), perfil `high`, `yuv420p` |
| Resolução | 1920x1080. Não passa disso: o vídeo é fundo, ninguém olha detalhe |
| Duração | Curto, ele já roda em `loop`. Não precisa bater exato com os 8s da rotação |
| Áudio | **Nenhum.** A trilha precisa ser removida, não só mutada |
| Tamanho | Idealmente abaixo de 1,5 MB por clipe |

Sem áudio e com `muted` é o que faz o autoplay funcionar. Navegador nenhum deixa um vídeo
com som tocar sozinho, e se o autoplay for bloqueado o hero fica congelado no poster.

## Enquadramento

**O texto (título, botões, números) fica na coluna da ESQUERDA**, sobre um degradê que sai
opaco ali e abre limpo pro vídeo à direita (`.hero-scrim` em `Hero.css`, gradiente a 96deg).
Ou seja: **a parte interessante do vídeo tem que estar do lado DIREITO do quadro.** Um
assunto centralizado ou à esquerda fica escondido atrás do texto.

> Isso já inverteu uma vez: a versão antiga deste arquivo dizia "coluna da direita" pro
> texto, de quando o layout era diferente. Conferir sempre o `Hero.css` atual antes de
> confiar neste texto — ele pode voltar a ficar desatualizado.

Movimento lento e contínuo funciona muito melhor que corte rápido: mão trabalhando na unha,
pincel de maquiagem, secador, pinça de cílios. Corte seco a cada segundo compete com a
leitura do texto e cansa.

## Comprimir / cortar um vídeo novo

`ffmpeg` não vem instalado neste Mac nem tem Homebrew. Caminho que funcionou em 16/09/2026:
instalar o pacote `ffmpeg-static` do npm num diretório qualquer (baixa um binário pronto,
sem precisar de sudo/brew) e chamar o binário direto:

```bash
npm install ffmpeg-static   # roda em qualquer pasta, ex.: /tmp
# binário fica em node_modules/ffmpeg-static/ffmpeg
```

Se o vídeo original já é 16:9 (1920x1080 ou parecido), scale+crop direto:

```bash
ffmpeg -i bruto.mp4 -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 26 -preset slow -movflags +faststart \
  hero-NOME.mp4
```

Se o original é vertical (9:16, comum em clipe de celular/Reels — foi o caso do
`hero-cilios.mp4`), corta uma faixa horizontal da região que interessa **antes** de
escalar, senão o assunto sai espremido ou cortado errado:

```bash
# exemplo real usado no hero-cilios.mp4, fonte 1080x1920:
ffmpeg -i bruto.mp4 -an \
  -vf "crop=1080:608:0:550,scale=1920:1080" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 26 -preset slow -movflags +faststart \
  hero-NOME.mp4
```

O `crop=W:H:X:Y` recorta W×H a partir do canto (X,Y) do vídeo original — ajustar Y pra
mirar na parte que interessa (geralmente o meio do quadro vertical). Depois `scale` estica
pro 1920x1080 final; alguma perda de nitidez é esperada e aceitável, o vídeo fica atrás do
degradê.

Se passar de ~1,5 MB, sobe o `-crf` (28, 30). Quanto maior o número, menor o arquivo e pior
a imagem. Em vídeo de fundo velado por degradê dá pra ir bem longe sem ninguém perceber.

## Onde os vídeos NÃO são carregados

Abaixo de 900px de largura, e para quem liga "reduzir movimento" no sistema, nenhum
`<source>` chega a ser renderizado, então nenhum mp4 é baixado — só o poster aparece. A
regra está no primeiro `useEffect` do `Hero.tsx` (`matchMedia`), se quiser mudar o corte.

## Estes arquivos vão pro git

Diferente do `.env` e do `projeto-expansao/`, os `hero-*.mp4` **precisam** estar
commitados: o GitHub Pages e a Vercel constroem o site a partir do repo, não tem storage
separado. É por isso que o limite de tamanho por clipe importa.
