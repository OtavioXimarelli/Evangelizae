# Evangelizae ✝ — Plataforma Missionária Digital

> **"A Tecnologia a Serviço da Fé e da Vida Cristã"**  
> *Veritas • Communio • Missio*

Evangelizae é uma plataforma 100% católica, construída sob estrita fidelidade ao Magistério da Igreja Católica, às Sagradas Escrituras e à Tradição Apostólica. Seu propósito não é reter o fiel diante das telas ou estimular vaidades digitais, mas ser uma **ponte espiritual** que conduz à oração diária, à sólida formação doutrinal, à comunhão fraterna e à vida sacramental concreta na paróquia física.

---

## 🏛️ Os 4 Pilares do Evangelizae

1. **Pilar I: Oração (Santo Rosário & Vida Devocional)**
   - Guia passo a passo interativo com vibração háptica em cada conta (`BeadMap`).
   - Meditação bíblica e frutos teológicos para cada Mistério (Gozozos, Dolorosos, Gloriosos, Luminosos).
   - Suporte ao Latim tradicional (`Pater Noster`, `Ave Maria`, `Gloria Patri`).
   - Registro de check-ins offline no santuário pessoal.

2. **Pilar II: Formação (Liturgia Diária & Assistente Magisterial)**
   - Leituras litúrgicas diárias fundamentadas com reflexões catequéticas de santos e padres da Igreja.
   - **Assistente Magisterial (RAG):** Inteligência artificial estritamente configurada (índice de similaridade de alta fidelidade) que responde a dúvidas teológicas com citações exatas do Catecismo da Igreja Católica (CIC), Sagradas Escrituras e Documentos do Vaticano. *Possui guardrail ativo contra especulações ou opiniões particulares.*

3. **Pilar III: Comunhão (Muro Orante & Intercessão Fraterna)**
   - Muro de intenções onde os irmãos intercedem uns pelos outros em silêncio orante (`"Em oração por você"`).
   - Sem debates, sem polêmicas ou julgamentos: apenas oração caridosa e união fraterna.

4. **Pilar IV: A Igreja Física (Fidelidade Sem Vaidade & Paróquia)**
   - **Sem Rankings ou Gamificação Tóxica:** Abolimos leaderboards ou comparações públicas. A fidelidade é entre a alma, Deus e Sua Santa Igreja.
   - **Conexão Paroquial:** A plataforma impulsiona o usuário a frequentar os Sacramentos e a adoração eucarística em sua comunidade física.

---

## 🛠️ Stack Tecnológica

- **Core & Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Estilização & UI:** Tailwind CSS v4 (`@import "tailwindcss"; @custom-variant dark (&:where(.dark, .dark *));`) com design system de alta precisão cromática (`Vatican White` / `Marian Midnight`).
- **Internacionalização (i18n):** `next-intl` (suporte nativo e instantâneo a Português e Inglês).
- **Gerenciamento de Estado & Persistência Offline:** Zustand + `persist` middleware para check-ins no Santuário e fila de oração offline.
- **Ambiente de Execução:** Bun / Node.js

---

## 🚀 Como Executar Localmente

```bash
# Instalar dependências (com Bun ou NPM)
bun install
# ou
npm install

# Iniciar servidor de desenvolvimento
bun run dev
# ou
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) (redirecionamento automático para `/pt/sanctuary` ou `/en/sanctuary`).

---

## 📜 Manifesto de Fidelidade

> *"A sagrada Tradição e a sagrada Escritura constituem um só depósito sagrado da palavra de Deus, confiado à Igreja."* — **Dei Verbum, 10**

Evangelizae opera sob o compromisso de nunca introduzir ensinamentos divergentes do Sagrado Magistério da Igreja Católica Apostólica Romana. Ad Maiorem Dei Gloriam (AMDG).
