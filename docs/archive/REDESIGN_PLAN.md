# Plano de Redesenho — Missal Refinado + Personalização Dinâmica

> Visão: o Evangelizae deve parecer um **missal pessoal bem cuidado** que conhece quem reza —
> saudação pelo momento do dia, mistério do dia já selecionado, estação litúrgica perceptível,
> progresso presente sem competir com a oração.

---

## 1. Princípios executáveis

1. **Tipografia primeiro**: hierarquia vem de serifada display + capitulares iluminadas, não de cor ou sombra.
2. **Textura, não decoração**: grão de papel e ornamentos marginais substituem cards com bordas pesadas.
3. **A página sabe o dia**: todo mastro exibe diapartes (manhã/tarde/noite), estação litúrgica e mistério do dia quando fizer sentido.
4. **Nada pisca à toa**: revelações são únicas na entrada; `prefers-reduced-motion` desliga tudo.
5. **Contraste inegociável**: grão ≤ 4% de opacidade; nenhum ornamento atrás de texto corrido.

---

## 2. Sistema de tokens (extensão do atual)

Base mantida (`--paper`, `--ink`, `--oxblood`, `--brass`, `--rule`…). Adições em `globals.css`:

```css
:root {
  --grain-opacity: 0.035;
  --illumination: linear-gradient(135deg, var(--brass), #d9b96a 45%, var(--brass));
  --season-accent: var(--brass);          /* sobrescrita por estação */
  --paper-deep: color-mix(in srgb, var(--rule) 22%, var(--paper));
  --ease-sacred: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 2.1 Grão de papel

`body::after` fixo, `pointer-events: none`, SVG `feTurbulence` embutido como data-URI,
`opacity: var(--grain-opacity)`, `mix-blend-mode: multiply` (no dark: `soft-light`).
Zero componentes React — custo nulo.

### 2.2 Capitular iluminada (`.drop-cap`)

`::first-letter` flutuante em `var(--font-serif)`, ~3.2em, gradiente `--illumination`
com `background-clip: text`. Usada apenas no primeiro parágrafo de leituras longas
(liturgia, about) e no lede da landing.

### 2.3 Ornamento marginal (`.marginal-flourish`)

Cantoneira em SVG fino (`stroke: var(--rule)`), posicionada absoluta nos cantos dos
`paper-panel` principais. Aparece sutilmente no hover/focus-within via transição de opacidade.

### 2.4 Tinta de estação litúrgica

`data-season` no `<html>` troca apenas `--season-accent` — usada em eyebrows, filetes e
o anel da liturgia:

| Estação | Tom claro | Escuro |
|---|---|---|
| Advento | violeta profundo `#5c4a72` | `#a99bc4` |
| Natal | dourado festivo `#9a7420` | `#d9b96a` |
| Quaresma | oxblood atual | idem escuro |
| Páscoa | dourado alegre + verde suave `#3f6b52` | `#89a592` |
| Tempo Comum | brass padrão | brass escuro |

Regra: **somente** eyebrow/regra/anel mudam. Botões primários permanecem oxblood sempre.

---

## 3. Motor de contexto do dia

Novo módulo puro `src/lib/dayContext.ts` (+ teste):

```ts
export type Daypart = 'dawn' | 'morning' | 'afternoon' | 'night';
export type LiturgicalSeason = 'advent' | 'christmas' | 'lent' | 'easter' | 'ordinary';

export function getDaypart(hour: number): Daypart            // 5–11 manhã, 12–17 tarde, 18–4 noite/madrugada
export function getLiturgicalSeason(date: Date): LiturgicalSeason
export function getDayContext(date?: Date): { daypart, season, mystery } // compõe + getDailyMysteryType()
```

Cálculo da estação (sem dependências):
- **Advento**: 4º domingo antes do Natal → Natal (domingo mais próximo 30/nov–3/dez).
- **Natal**: 25/dez → Batismo do Senhor (domingo após 6/jan).
- **Quaresma**: Quarta-feira de Cinzas → Quinta-feira Santa. Páscoa computada por
  algoritmo de Gauss/Meeus (função pura testada contra 2026–2030).
- **Páscoa**: até Pentecostes (+49 dias).

Consumo: hook `useDayContext()` (client, memoizado por hora) nas páginas product.
Server components usam a função direta (landing).

i18n novo em `pt.json`/`en.json`: `DayContext.greetings.{dawn,morning,afternoon,night}`,
`DayContext.seasons.{...}`, `DayContext.mysteryOfTheDay`.

---

## 4. Layouts por página

### 4.1 Landing `/inicio`

Mantém estrutura hero + practices + CTA. Mudanças:
1. **Faixa "hoje"** entre hero e practices: linha horizontal fina com mistério do dia,
   santo do dia (fallback do `liturgyService`) e estação. É a página ganhando vida mesmo para visitantes.
   Markup: `dl.today-strip` de 3 colunas colapsando em 1.
2. Lede do hero recebe `.drop-cap`.
3. Practice-cards ganham `.marginal-flourish` no hover (desktop) — nada muda no toque.
4. CTA final ganha rosa-guia em background (SVG existente `RoseWindowMotif` a 6% opacity).

### 4.2 Onboarding `/comecar`

Split atual mantido. Adições:
1. Painel de identidade: ornamento tintado pela estação + saudação por diaparte
   ("Boa noite. Vamos preparar seu caderno de oração.").
2. Passo-a-passo visível: 3 etapas (nome → janela de oração → aparência) viram um fluxo
   de um passo por tela com indicador `● ○ ○`. Estado local no componente; submit final persiste igual.
3. Choices com `active:scale-[0.98]` e anel `--season-accent` no selecionado.

### 4.3 Santuário `/sanctuary` (maior mudança)

Grid atual vira **coluna única narrativa** (max-width ~68ch) — menos dashboard, mais missal:

```
[ mastro ]  Boa tarde, Otávio.          ← diaparte + nome
            terça-feira, 21 de julho · Tempo Comum   ← eyebrow tintado

[ convite principal ]  paper-panel com florão de canto
   "O mistério de hoje é o doloroso."  ← getDailyMysteryType(), não o ativo antigo
   [ Retomar passo 23 · 73 ]  ← ribbon de progresso quando há sessão
   botão único: Rezar agora

[ sete dias ]  ● ● ● ○ ● ● ○   ← WeekDots: marca silenciosa, sem número grande
   12 terços · sequência de 4 dias · último sábado

[ liturgia de hoje ]  promo com santo do dia + cor litúrgica no anel
```

1. **WeekDots** (novo componente): 7 pontos preenchidos conforme `prayer.completions`,
   `title` acessível por dia, sem animação.
2. Stats grandes desaparecem como painel lateral; viram uma linha tipográfica sob os dots.
3. Reminder cue permanece, mas integrada ao mastro (linha fina, não card).
4. Mistério do dia: se o mistério ativo difere do do dia, o convite oferece
   "Começar o de hoje" secundário — nunca reseta sessão em curso silenciosamente.

### 4.4 Rosário `/rosary` (focus shell)

1. Focus shell ganha vinheta radial escura sutil + grão mais presente (`--grain-opacity: 0.05`).
2. Cartão de contemplação: oração longa com `.drop-cap` opcional (preferência `readerScale` respeitada já hoje).
3. Conclusão: RoseWindowMotif + cruz dourada mantidos; adiciona iluminação em dois estágios
   (fade + escala 1.02→1) desativada com reduced-motion.

### 4.5 Liturgia `/liturgy`

1. Mastro exibe estação no eyebrow (tintado).
2. Anel de cor litúrgica já existe — passa a usar `--season-accent` como fallback quando API não traz cor.
3. Primeiro parágrafo das leituras com `.drop-cap`.

### 4.6 Ajustes `/settings`, Missão `/about`, Privacidade `/privacy`

Grupos com `.quiet-list` e filetes `--rule`; sobre ganha drop-cap e florão de canto no
painel de compromissos. Sem mudança estrutural.

### 4.7 Offline `/offline`

Página mínima com ornamento central e texto curto — já quase pronta, só recebe o grão global.

---

## 5. Shell (`SiteShell.tsx`)

1. `data-season` aplicado no wrapper raiz (server calcula; shell só espelha em atributo se necessário).
2. Bottom-nav (produto): indicador ativo passa a ser filete superior de 2px em `--season-accent`
   em vez de cor de texto isolada.
3. Desktop-nav público: link ativo com sublinhado offset fino (missal, não pill).

---

## 6. Componentes novos / alterados

| Componente | Tipo | Responsabilidade |
|---|---|---|
| `src/lib/dayContext.ts` | novo | diapartes, estação, mistério do dia (puro + testado) |
| `useDayContext()` | novo hook | memoização client-side por hora |
| `WeekDots` | novo | faixa de 7 dias do santuário |
| `SacredOrnament` | alterar | aceitar `tone="season"` |
| `.drop-cap`, `.marginal-flourish`, `.today-strip` | CSS | utilidades tipográficas |
| `globals.css` tokens | alterar | §2 deste plano |

---

## 7. i18n — chaves novas (somente português no beta)

```
DayContext.greetings.dawn/morning/afternoon/night
DayContext.seasons.advent/christmas/lent/easter/ordinary
DayContext.mysteryOfTheDay        // "Mistério de hoje"
Sanctuary.weekDotsLabel           // "Últimos sete dias"
Sanctuary.offerTodayMystery       // "Começar o de hoje"
Home.todayStrip.*                 // rótulos da faixa
Onboarding.stepOf                 // "Etapa {current} de {total}"
```

`pt.json` é o único dicionário (`en.json` removido; `routing.locales = ['pt']`).
URLs `/en/*` antigas continuam redirecionando para `/pt/*` via `proxy.ts` — sem 404.
Inglês volta em ciclo futuro; chaves devem ser escritas de forma traduzível
(sem concatenação, com pluralização explícita).

---

## 8. Acessibilidade & movimento

- Toda revelação/ornamento animável: `@media (prefers-reduced-motion: reduce)` → `transition: none; animation: none`.
- WeekDots: cada dot tem `aria-label` ("terça, 14 de julho — rezado").
- Grão nunca reduz contraste: validação axe nos E2E existentes (`tests/e2e/core-flow.spec.ts`).
- Navegação por teclado intacta; flourishes são decorativos (`aria-hidden`).

## 9. Verificação por fase

`pnpm check` (lint + typecheck + vitest + build) verde ao fim de cada fase;
E2E Playwright rodado nas fases 3–5.

---

## 10. Fases de execução

| Fase | Escopo | Risco | Status |
|---|---|---|---|
| **1 — Fundação visual** | tokens §2, grão, `.drop-cap`, `.marginal-flourish`, tintas de estação | baixo (CSS puro) | ✅ aprovada |
| **2 — Motor do dia** | `dayContext.ts` + testes (Páscoa 2026–2030) + hook + i18n | médio | ✅ aprovada |
| **3 — Santuário** | layout narrativo §4.3, WeekDots, convite por mistério do dia | médio | ✅ aprovada |
| **4 — Entrada pública** | landing §4.1 (faixa hoje, drop-cap, rosa-guia) + onboarding §4.2 em passos | médio | ✅ concluída (com home detalhada: faixa de hoje, como funciona, compromissos) |
| **5 — Foco e leitura** | rosário §4.4, liturgia §4.5, ajustes/missão §4.6, shell §5 | baixo | ✅ concluída |

Ordem escolhida para que o produto diário (santuário) mude antes das páginas de vitrine,
e cada fase seja commitável e reversível isoladamente.

### Desvios e notas das fases 3–5
- Santuário: o eyebrow do mastro permanece dourado (`#d7b169`, fundo capela escuro); a tinta
  sazonal aparece nos WeekDots, na fita de progresso, nos florões e na capitular.
- Faixa "hoje" da landing usa apenas mistério + estação + link da liturgia. Santo do dia ficou
  de fora por princípio ("nenhum mock apresentado como dado real"): não há fonte de santos no MVP.
- Anel de cor litúrgica com fallback sazonal não foi implementado: a API sempre fornece a cor;
  sem dado ausente para tratar.
- E2E atualizado para o onboarding em 3 etapas; clique final via `dispatchEvent` para
  estabilidade entre troca de rota.
