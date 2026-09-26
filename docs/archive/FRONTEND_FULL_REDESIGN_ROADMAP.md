# Evangelizae — MVP e próximos ciclos

## Estado do beta

O frontend foi reenquadrado como um produto de oração, não como uma demonstração de funcionalidades futuras. A primeira entrega pública contém somente home, onboarding local, santuário, Rosário, liturgia, ajustes, missão, privacidade e suporte offline.

## Critérios de lançamento

- Rosário completo, retomável e utilizável offline depois do primeiro carregamento.
- Liturgia com fonte, horário e estado de cache explícitos.
- Nenhum mock apresentado como dado real.
- Português como único idioma do beta (`pt.json` apenas; `/en/*` redireciona para `/pt/*`).
- WCAG 2.2 AA, navegação por teclado e movimento reduzido.
- TypeScript, ESLint, testes unitários, E2E, build e imagem Docker aprovados.
- Monitoramento técnico sem conteúdo devocional ou PII.

## Próximo ciclo: contas e sincronização

- Autenticação construída no backend Java/Spring.
- Migração explícita do histórico convidado para a conta.
- Sincronização idempotente e offline-first.
- Política de retenção e exclusão no servidor.

## Ciclo posterior: comunhão

- Intenções reais com moderação, denúncia e proteção contra abuso.
- Uma única interação fraterna, sem comentários ou métricas competitivas.
- Grupos paroquiais somente depois de regras operacionais e pastorais.

## Ciclo posterior: formação

- Conteúdo catequético com autoria e fontes verificáveis.
- Busca em documentos oficiais.
- Assistência por IA somente após corpus, avaliação, citações e recusas magisteriais auditáveis.

## Fora de escopo até nova decisão

- Rankings, moedas, recompensas, feed infinito e notificações invasivas.
- Publicidade, paywalls ou versão premium.
- Conteúdo devocional gerado e publicado sem revisão.
- Conexão direta do frontend com banco de dados ou infraestrutura de IA.

