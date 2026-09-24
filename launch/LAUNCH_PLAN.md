# Plano de lançamento do beta — Evangelizae

## Objetivo

Lançar o Evangelizae como um beta público pequeno, confiável e pastoralmente responsável. O objetivo inicial não é maximizar alcance, seguidores ou tempo de tela. É encontrar pessoas que realmente rezem, identificar falhas e confirmar que o aplicativo ajuda a entrar em oração e voltar à vida concreta da Igreja.

Posicionamento principal:

> **Oração católica, sem ruído.** Um lugar simples para rezar o Rosário, acompanhar a Palavra do dia e voltar a Deus todos os dias.

O Evangelizae deve ser apresentado como projeto católico independente, gratuito, de código aberto e em beta — nunca como aplicativo oficial da Igreja ou substituto da paróquia, dos sacramentos ou da direção espiritual.

## Critério de sucesso do primeiro ciclo

Durante os primeiros 30 dias, buscar:

- 30–50 testadores reais, começando por pessoas conhecidas ou apresentadas por comunidades confiáveis;
- pelo menos 15 Rosários concluídos sem bloqueio técnico relatado;
- 10 relatos qualitativos úteis;
- testes de instalação/offline em pelo menos três aparelhos Android e três iPhones;
- zero incidente crítico de privacidade, perda de progresso ou liturgia incorreta;
- uma revisão pastoral/editorial documentada do conteúdo devocional.

Não usar streaks, ranking, volume de notificações ou tempo de tela como medida de sucesso.

## Fases

### Fase 0 — Portas fechadas

Prazo sugerido: 3–5 dias.

1. Concluir os bloqueadores de `BETA_LAUNCH_CHECKLIST.md`.
2. Pedir a um sacerdote, diácono, catequista experiente ou responsável pastoral que revise a apresentação, as orações, os mistérios e a forma como a liturgia é creditada.
3. Testar o domínio publicado, CORS, data litúrgica, instalação PWA e retomada offline em aparelhos reais.
4. Preparar um formulário curto de feedback: aparelho, tarefa tentada, o que aconteceu, o que esperava e autorização opcional para contato.
5. Garantir que a comunicação diga claramente “beta” e “projeto independente”.

### Fase 1 — Beta de confiança

Prazo sugerido: 7 dias; 15–25 pessoas.

Convidar primeiro:

1. pessoas da própria paróquia que já rezam o Rosário;
2. equipe local da Pastoral da Comunicação (PASCOM);
3. catequistas, ministros e agentes pastorais;
4. pequenos grupos de oração, juventude e famílias;
5. desenvolvedores católicos ou pessoas com experiência em acessibilidade/PWA.

Pedir tarefas concretas, não apenas “o que achou?”:

- instalar o aplicativo;
- iniciar e retomar um Rosário;
- abrir a liturgia e conferir data/fonte;
- testar offline;
- exportar e apagar os dados;
- relatar uma frase confusa ou um ponto de distração.

### Fase 2 — Comunidades de oração

Prazo sugerido: segunda semana; 30–50 pessoas.

Contatar coordenadores locais antes de publicar em grupos. Bons públicos de teste:

- grupos paroquiais do Rosário e do Terço dos Homens;
- grupos Mães que Oram pelos Filhos;
- Grupos de Oração da RCC;
- EJC, ECC, pastoral juvenil e grupos universitários católicos;
- comunidades contemplativas ou grupos de Lectio Divina interessados em leitura sem distração.

A RCC Brasil descreve seus Grupos de Oração como comunidades presentes em paróquias, universidades, residências e outros espaços, com oração e vivência do Evangelho — um público coerente para um beta de oração, desde que o coordenador autorize a divulgação: <https://rccbrasil.org.br/institucional/grupo-de-oracao/>.

O Terço dos Homens Mãe Rainha e Mães que Oram pelos Filhos também mantêm redes organizadas de oração que podem oferecer feedback pastoral e de uso: <https://tercodoshomensbrasil.org/> e <https://maesqueorampelosfilhos.com/>.

### Fase 3 — Comunicação católica

Somente depois de corrigir os primeiros problemas e documentar a revisão pastoral.

Prioridade sugerida:

1. **PASCOM local e diocesana** — oferecer uma pauta curta, capturas reais e acesso ao beta.
2. **Jovens Conectados/CNBB** — adequado para o recorte de juventude e evangelização digital; a CNBB os identifica como equipe de comunicação da Comissão Episcopal para a Juventude: <https://www.cnbb.org.br/jovens-conectados-celebram-10-anos-de-servico-a-igreja-no-brasil/>.
3. **SIGNIS Brasil** — associação católica de comunicação e cultura de paz, com rede de rádios, TVs e comunicadores: <https://signis.org.br/>.
4. **Redações católicas** — apresentar como pauta, sem exigir publicação. O A12 integra a Rede Aparecida e informa contato editorial em sua página institucional: <https://www.a12.com/redacaoa12/a12-com-o-seu-portal-de-noticias-catolicas>. A Canção Nova mantém um ecossistema de evangelização digital e aplicativos: <https://www.cancaonova.com/digital/>.
5. **Comunidades e criadores católicos** — priorizar perfis menores ligados à própria região e missão. A Comunidade Católica Shalom mantém trabalho específico de juventude e evangelização: <https://comshalom.org/juventude/>.

Não disparar mensagens em massa. Escrever individualmente, pedir autorização ao administrador e explicar por que aquele público é relevante.

### Fase 4 — Público geral e código aberto

Depois da estabilidade do beta comunitário:

- publicar no Instagram pessoal/projeto;
- compartilhar no WhatsApp com a mensagem curta do kit;
- criar uma GitHub Release com limitações conhecidas;
- publicar em comunidades brasileiras de software livre e tecnologia responsável;
- considerar Product Hunt ou diretórios de produtos apenas como canal secundário, pois o público principal é pastoral e lusófono.

## Calendário editorial de sete dias

| Dia | Conteúdo | Objetivo | Ativo |
| --- | --- | --- | --- |
| D-3 | “Oração católica, sem ruído.” | Apresentar o problema | Story teaser |
| D-1 | Por que o Evangelizae existe | Explicar missão e limites | Post 4:5 |
| D0 | Beta disponível | Convite direto e transparente | Post 4:5 + Story + WhatsApp |
| D+1 | Rosário guiado e retomável | Demonstrar o núcleo | Vídeo curto/captura real |
| D+3 | Privado, sem conta e sem anúncios | Construir confiança | Card 1:1 |
| D+5 | Liturgia com fonte e estado claro | Demonstrar honestidade | Captura + legenda |
| D+7 | “O que devemos melhorar?” | Abrir escuta | Story com link de feedback |

## Sequência recomendada no dia do lançamento

1. Confirmar saúde, liturgia, PWA e feedback no ambiente publicado.
2. Enviar primeiro a mensagem aos testadores de confiança.
3. Publicar o post principal.
4. Publicar Story com link.
5. Compartilhar em até três grupos autorizados; evitar várias mensagens simultâneas.
6. Monitorar erros e responder pessoalmente nas primeiras horas.
7. Se houver problema crítico de liturgia, privacidade, exclusão ou perda de progresso, pausar a divulgação e comunicar com transparência.

## Medição sem invadir a oração

Preferir contagem manual e feedback voluntário. Se forem usados parâmetros de campanha, usar apenas identificadores genéricos de canal, nunca pessoa, paróquia ou intenção de oração. Não registrar textos devocionais, histórico individual, conteúdo do Rosário ou perfil espiritual.

Revisão semanal:

- problemas críticos e resolvidos;
- pontos de abandono por falha, não por “engajamento”;
- aparelhos/navegadores com defeito;
- clareza da linguagem;
- confiança na privacidade e nas fontes;
- sugestões pastorais recorrentes.

## Go/no-go

O beta público só deve ser anunciado quando os bloqueadores e smoke tests de `BETA_LAUNCH_CHECKLIST.md` estiverem concluídos. O material de campanha não substitui a revisão pastoral, a licença das fontes, a API de produção, DNS/TLS e os testes em aparelhos reais.
