# Evangelizae

> Oração para a vida cotidiana.

Evangelizae é um companheiro católico, gratuito e de código aberto para rezar o Rosário e acompanhar a liturgia diária. A tecnologia é um meio: o objetivo é ajudar a pessoa a deixar a tela e viver a fé na família, na paróquia, na caridade e nos sacramentos.

## Beta público

O núcleo atual é deliberadamente pequeno:

- apresentação pública e missão;
- configuração local opcional, sem conta, em três passos;
- santuário diário personalizado, com saudação pelo momento do dia e mistério do dia;
- Rosário guiado completo com 73 passos, retomada e acesso offline;
- liturgia diária fornecida pela API Java/Spring, com fonte, data e estado de atualização explícitos;
- histórico semanal, lembrete interno e exportação/exclusão dos dados locais;
- tema claro/escuro com alternância rápida no cabeçalho (padrão: preferência do sistema);
- instalação como aplicativo (PWA) com suporte offline.

Quem já se preparou entra direto no santuário; a página pública permanece acessível pelo selo Evangelizae no cabeçalho.

## O que funciona hoje

- Fluxo completo de onboarding local (nome, janela de oração, aparência) sem conta.
- Santuário como página inicial do usuário: convite de oração, retomada do passo interrompido, faixa dos sete dias.
- Rosário guiado com os quatro mistérios, conclusão iluminada e persistência entre sessões.
- Liturgia do dia com fonte, data e estado de atualização declarados.
- Ajustes de perfil, leitura e tema; exportação JSON e exclusão total dos dados.
- Missão, privacidade e páginas institucionais em português.
- Offline depois do primeiro carregamento, monitoramento técnico opcional e imagem Docker.

IA teológica, muro de intenções, autenticação, sincronização, paróquias e planos espirituais não fazem parte deste MVP. Rotas antigas levam ao roadmap em vez de simular funcionalidades.

## Planejado para os próximos ciclos

1. **Contas e sincronização** — autenticação no backend Java/Spring, migração explícita do histórico convidado e sincronização idempotente offline-first.
2. **Comunhão** — intenções reais com moderação e proteção contra abuso; uma única interação fraterna, sem comentários ou métricas.
3. **Formação** — conteúdo catequético com autoria verificável e busca em documentos oficiais; assistência por IA somente após corpus, avaliação e citações auditáveis.

Fora de escopo até nova decisão: rankings, moedas, recompensas, feed infinito, notificações invasivas, publicidade, paywall e conteúdo devocional gerado sem revisão.

## Princípios

1. Fidelidade às Escrituras, à Tradição e ao Magistério.
2. Nenhuma competição espiritual, ranking ou mecanismo de retenção.
3. Nenhum anúncio, paywall ou assinatura premium.
4. Dados de oração permanecem privados e locais no MVP.
5. Falhas de fonte são declaradas; conteúdo antigo nunca é apresentado como liturgia de hoje.

## Tecnologia

- Next.js 16.2, React 19 e TypeScript estrito
- Tailwind CSS 4 com tokens editoriais próprios
- next-intl, com português como único idioma exposto no beta
- Zustand com migração versionada
- Serwist para instalação e Rosário offline
- Vitest, Playwright e axe
- Docker com saída standalone
- Sentry opcional, sem PII, replay ou conteúdo devocional

O backend é mantido em outro repositório e implementado integralmente em Java/Spring. O espelho do contrato está em contracts/evangelizae-v1.openapi.yaml.

### Liturgia

A página `/pt/liturgy` consulta a API Java/Spring em `NEXT_PUBLIC_API_BASE_URL` usando `America/Sao_Paulo` e `pt-BR`. A resposta é validada antes da exibição; a cópia local só pode representar a mesma data e é marcada como cache. A ponte local de 25/08 a 01/09/2026 permanece como fallback temporário até a API ser comprovada por sete dias consecutivos.

As fontes, a licença, os limites editoriais e o procedimento de remoção estão em [`LITURGY_CONTENT_SOURCES.md`](LITURGY_CONTENT_SOURCES.md).

## Desenvolvimento

Recomendado: [mise](https://mise.jdx.dev/). O arquivo `.mise.toml` fixa as mesmas
versões de Node.js e pnpm usadas no desenvolvimento local. Como alternativa,
use Node.js 20.9–26 e pnpm 11.22.0 (via Corepack ou instalação direta).

    mise install
    pnpm install
    cp .env.example .env.local
    pnpm dev

Acesse http://localhost:3000. Configure `NEXT_PUBLIC_API_BASE_URL` para a API Java/Spring usada pela liturgia diária.

## Verificação

    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build
    pnpm test:e2e

O build de produção usa webpack porque a integração estável de precache do Serwist ainda depende dele; o desenvolvimento continua usando Turbopack.

## Docker

    docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.org/api/v1 --build-arg NEXT_PUBLIC_APP_URL=https://evangelizae.com -t evangelizae-web .
    docker run --rm -p 3000:3000 evangelizae-web

O container roda sem privilégios e disponibiliza GET /api/health.

## Dados e privacidade

Nome opcional, horário, preferências, intenções, sessão e histórico ficam no navegador. Nenhum deles entra em telemetria. O usuário pode exportar uma cópia JSON ou apagar tudo em **Ajustes**.

**Veritas • Communio • Missio**
