# Mídia de lançamento

## Geração

Os PNGs de tamanho final **não são versionados**. São saídas geradas de forma determinística por `../render-media.sh`, a partir deste diretório e de `../screenshots/public/`. Para recriá-los:

```bash
./launch/render-media.sh
```

O script exige ImageMagick, as fontes do projeto e as capturas reais em `../screenshots/public/`. Nunca substituir a interface real por mockups gerados por IA.

### Entradas versionadas (não podem ser regeneradas pelo script)

- `campaign-background.png` — fundo editorial sem texto. **É uma entrada, não uma saída.** Foi criado com ImageGen a partir de `IMAGEGEN_PROMPT.md` e o script apenas o compõe. Sem ele, `render-media.sh` aborta na validação de entrada.
- `../screenshots/public/*.png` — capturas reais de produção. Entradas do script: início mobile e desktop, página completa do início, Rosário, missão e privacidade.

## Arquivos finais

Saídas esperadas do script, todas em `launch/media/`:

- `evangelizae-beta-feed-1080x1350.png` — Instagram/Facebook feed, 4:5.
- `evangelizae-beta-story-1080x1920.png` — Stories e status, 9:16.
- `evangelizae-beta-square-1200x1200.png` — WhatsApp, comunidades e cards quadrados.
- `evangelizae-beta-og-1200x630.png` — preview de link, release e imprensa.
- `evangelizae-carousel-01-convite-1080x1350.png` — abertura do carrossel.
- `evangelizae-carousel-02-rosario-1080x1350.png` — Rosário guiado.
- `evangelizae-carousel-03-privacidade-1080x1350.png` — privacidade local-first.
- `evangelizae-carousel-04-missao-1080x1350.png` — missão e identidade.
- `evangelizae-carousel-05-beta-1080x1350.png` — convite final para o beta.

O feed usa 4:5 e o Story usa 9:16 para respeitar os formatos de tela. A documentação criativa da Meta recomenda reservar áreas de segurança em Stories; os ativos mantêm elementos essenciais longe das bordas e da faixa inferior de interface: <https://assets.ctfassets.net/bx4f6dhogdf5/7J9WenrxnnuLZltLc5pwkj/b13ff0bc6027d5783dc24a6c2a0f6216/KPM_META_Guidelines_Final_3.24.25.pdf>.

## Uso

- Não substituir a interface real por mockups gerados por IA.
- Não inserir selo “oficial”, aprovação eclesial ou número de usuários sem comprovação.
- Os cards apontam para o domínio canônico `evangelizae.com`.
- Não publicar as peças que anunciam liturgia diária enquanto a API de produção não passar novamente pelo gate do checklist de lançamento.
- Escrever texto alternativo ao publicar.

## Textos alternativos sugeridos

**Feed:** Arte verde-escura do beta Evangelizae com a frase “Oração católica, sem ruído”, benefícios do aplicativo e uma captura real da página inicial em um celular.

**Story:** Arte vertical do Evangelizae apresentando Rosário guiado e progresso local, sem anúncios e sem conta, com captura real do aplicativo.

**Quadrado:** Convite para conhecer o beta Evangelizae, gratuito, privado e de código aberto.

**Open Graph:** Marca Evangelizae e a mensagem “Um lugar simples para voltar a Deus todos os dias”.

## Origem visual

O fundo `campaign-background.png` foi criado com ImageGen em modo integrado. A composição final, textos, marca e capturas do aplicativo são determinísticos e usam os ativos reais publicados em `evangelizae.com`.
