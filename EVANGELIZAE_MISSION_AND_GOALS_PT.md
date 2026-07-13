# Evangelizae — Manifesto, Missão e Objetivos do Projeto

> **Status:** Documento Guia do Projeto (Living Document)  
> **Versão:** 1.0  
> **Identidade Core:** Plataforma Digital Missionária para a Verdade Católica e Vida de Oração Diária.  
> **Idiomas:** Português (`pt` — Primário) | Inglês (`en` — Secundário)

---

## 1. Nossa Missão

**Ajudar os católicos a viverem sua fé todos os dias por meio da oração, da formação, da comunhão e da participação ativa na Igreja.**

O Evangelizae não existe para substituir a Igreja, o sacerdote, a direção espiritual ou a comunidade paroquial. Ele existe para ser um **companheiro diário da vida cristã**. Cada funcionalidade deve levar o usuário para mais perto de Cristo, dos sacramentos e da vida em comunidade paroquial.

---

## 2. Nossa Visão

Tornar-se a principal plataforma digital católica em língua portuguesa (com expansão global em inglês), oferecendo uma experiência completa e integrada para oração, formação e comunhão, **sempre estritamente fundamentada no Magistério da Igreja Católica**.

---

## 3. Filosofia do Produto

1. **A Tecnologia a Serviço da Fé (e Invisível)**
   * Não queremos prender a atenção do usuário nem aumentar o tempo de tela por vício.
   * Nosso objetivo é ajudar a rezar e desenvolver uma rotina espiritual sólida. Quanto menos tempo o usuário precisar permanecer no aplicativo para cumprir seus deveres espirituais e ir à Igreja física, melhor.
2. **Fidelidade Integral ao Magistério**
   * Toda resposta, ensinamento, reflexão ou interativa de IA Católica deve possuir fundamento sólido em fontes oficiais:
     * *Bíblia Sagrada*
     * *Catecismo da Igreja Católica (CIC)*
     * *Código de Direito Canônico*
     * *Documentos Oficiais da Santa Sé e do Vaticano*
     * *Conferências Episcopais (ex: CNBB)*
     * *Santos e Doutores da Igreja*
   * **Nunca** responder apenas com opiniões pessoais ou especulações teológicas sem aprovação eclesiástica.
3. **Comunidade Saudável e Fraterna**
   * **O que NÃO haverá:** algoritmos de engajamento viciantes, feed infinito, caça por curtidas, gamificação excessiva ou conteúdo sensacionalista.
   * **O que queremos incentivar:** oração de intercessão, caridade, fraternidade, comunhão e silêncio sagrado.
4. **Sem Competição (Progresso Pessoal)**
   * No Evangelizae não existem rankings, placares de líderes ou competições espirituais.
   * O perfil do usuário apresenta exclusivamente o seu **progresso pessoal**: dias consecutivos de oração (sequência/streak), rosários realizados, leituras concluídas e planos finalizados.
5. **Crescimento Espiritual como Filtro**
   * Antes de desenvolver qualquer nova funcionalidade, deve-se responder à pergunta: *Como isso ajuda alguém a crescer espiritualmente, rezar mais, aproximar-se dos sacramentos e da Igreja?* Caso não responda a essa pergunta com um sim claro, a funcionalidade não pertence ao Evangelizae.

---

## 4. Os 4 Pilares do Evangelizae

### 🙏 Pilar 1: Oração (Criar o hábito diário)
* **Rosário Guiado Interativo (A Joia da Coroa Preservada)**: Oração passo a passo com contas visuais, meditação dos mistérios de acordo com o dia da semana, textos em português e latim.
* **Terço da Misericórdia e Novenas**
* **Biblioteca de Orações Tradicionais**
* **Diário Espiritual & Exame de Consciência**
* **Cronômetro de Oração & Histórico Pessoal**
* **Lembretes Suaves de Oração**

### 📖 Pilar 2: Formação (Ensinar a fé católica de maneira acessível)
* **Bíblia Sagrada & Catecismo Pesquisável**
* **Liturgia Diária**: Evangelho, Primeira/Segunda Leitura, Salmo Responsorial e Reflexão.
* **Santos do Dia & História da Igreja**
* **Documentos Oficiais e Cursos de Aprofundamento**
* **IA Católica (Assistente do Magistério)**: Perguntas e respostas teológicas com citação obrigatória das fontes.

### 🤝 Pilar 3: Comunidade (Conectar pessoas através da oração)
* **Mural de Pedidos de Oração**: Usuários publicam intenções e outros marcam *"🙏 Rezei por você"* (Sem comentários públicos no MVP para evitar distrações e contendas).
* **Testemunhos de Graças Alcançadas**
* **Pequenos Grupos & Missões Espirituais**

### ⛪ Pilar 4: Igreja (Levar o usuário para a Igreja física)
* **Agenda e Localizador de Missas e Confissões**
* **Horários de Adoração ao Santíssimo**
* **Eventos Paroquiais, Pastorais e Retiros**

---

## 5. Roadmap de Entregas & Fases

### Fase 0 — Fundação (Concluída/Em Refinamento)
* Manifesto, Identidade Visual (Branding & Logo), **Design System Modern Cathedral** (Vatican White & Marian Midnight), Arquitetura Decoupled (Next.js 15 + Java 25 Spring Boot 4).

### Fase 1 — Núcleo de Oração (Foco do MVP Atual)
* **Objetivo:** O usuário consegue rezar diariamente utilizando apenas o Evangelizae.
* **Entregas do MVP:**
  1. **Santuário (Dashboard Principal)**: Visão consolidada do Plano Espiritual de 30 dias, Evangelho do dia, Santo do dia, atalho para o Rosário e resumo de intenções.
  2. **Rosário Guiado Completo**: Preservação e evolução do motor interativo (`buildRosarySequence`), com cálculo automático dos Mistérios do Dia (*Rosarium Virginis Mariae*).
  3. **Liturgia Diária**: Leitura limpa e meditativa da Palavra de Deus.
  4. **Pedidos de Oração (Comunidade MVP)**: Sistema de intercessão com botão de caridade *"🙏 Rezei por você"*.
  5. **Plano Espiritual de 30 Dias**: Compromisso inicial escolhido no cadastro (ex: *Quero criar o hábito de oração*).
  6. **IA Católica de Formação**: Chatbot teológico estritamente vinculado à base documental católica.
  7. **Perfil de Progresso Pessoal**: Sequência diária de oração, sem rankings.

### Fase 2 — Formação Sólida (Próximo Ciclo)
* Bíblia Completa, Catecismo com busca semântica, Biblioteca expandida de novenas e orações, Busca global unificada.

### Fase 3 — Comunidade & Ecossistema Paroquial
* Grupos de intercessão paroquial, testemunhos moderados e notificações inteligentes de intercessão.

### Fase 4 & 5 — IA Avançada (RAG Católico) & Mobile Nativo (Android/iOS)
* Base vetorial completa do Magistério (Spring AI + MongoDB Atlas Vector Search) e publicação de aplicativos nativos de alta performance com modo offline completo.

---

## 6. Posicionamento de Mercado
O Evangelizae **não compete** com redes sociais (Instagram, TikTok, Facebook). Também não pretende ser apenas um "aplicativo de Bíblia" ou um "contador de Ave-Marias desintegrado". O Evangelizae é o **ecossistema missionário completo que acompanha o católico durante toda a semana em direção à santidade e à Igreja física**.
