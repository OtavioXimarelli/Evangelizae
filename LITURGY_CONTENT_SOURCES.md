# Fontes da ponte provisória da liturgia

## Escopo e validade

Esta implementação contém somente as leituras de 25 de agosto a 1º de setembro de 2026. A escolha da entrada usa a data civil de `America/Sao_Paulo`, independentemente do fuso do dispositivo.

A interface consulta a API Java/Spring para a data civil de `America/Sao_Paulo`. A ponte local abaixo permanece apenas como fallback temporário para as datas já revisadas; nunca há fallback para outro dia.

## Calendário e seleção das leituras

As celebrações, cores e referências foram conferidas para o calendário romano usado no Brasil, Ano A e ciclo ferial par (II), a partir destas referências:

- [Diretório da Liturgia da Igreja no Brasil – 2026](https://play.google.com/store/books/details?id=kmOiEQAAQBAJ), Edições CNBB;
- [Igreja em Oração — Liturgia Diária](https://liturgiadiaria.edicoescnbb.com.br/app/user/user/UserView.php), Edições CNBB;
- páginas diárias dos [Arautos do Evangelho](https://www.arautos.org/liturgia-diaria), usadas como segunda conferência das datas e referências.

Somente fatos do calendário e referências bíblicas foram transcritos dessas fontes. Nenhum texto bíblico ou oração da tradução oficial da CNBB foi copiado para o repositório, e a atribuição não implica apoio institucional da CNBB ou da Edições CNBB ao Evangelizae.

## Texto bíblico, catolicidade e licença

Todas as Escrituras em português incluídas na ponte são da **Bíblia Sagrada traduzida pelo Pe. António Pereira de Figueiredo**, sacerdote católico, a partir da Vulgata Latina. A transcrição foi conferida na edição de 1866, disponível em fac-símile e texto digital, que está em domínio público:

- [fac-símile da edição de 1866 no Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A_Biblia_Sagrada_(1866).pdf);
- [digitalização e OCR da edição de 1866 no Internet Archive](https://archive.org/details/bibliasagradacon00figu);
- [registro de uma edição brasileira de 1864 na Biblioteca Nacional](https://cpbn.bn.gov.br/planor/handle/20.500.12156.6/2350?show=full), cujo título documenta que foi “aprovada por mandamento” do Arcebispo da Bahia.

A ortografia, a acentuação, os espaços e a pontuação foram atualizados mecanicamente para leitura em português contemporâneo. Vocabulário, sentido e conteúdo dos versículos não foram adaptados. Nos lecionários que começam ou terminam em meia unidade de versículo (`a`/`b`), foi selecionado somente o segmento indicado pela referência. Os Salmos seguem a dupla numeração litúrgica e hebraica exibida na interface.

Esta é uma tradução bíblica católica histórica e identificada, escolhida por sua procedência e por estar em domínio público. Ela **não é** apresentada como a tradução litúrgica oficial atual da CNBB. Nenhum texto bíblico da edição da CNBB foi copiado porque não foi localizada uma autorização de redistribuição compatível com este repositório aberto. As orações próprias do Missal também foram deixadas vazias pela mesma cautela de direitos e fidelidade textual.

## Revisão e retirada

Antes da publicação, uma pessoa responsável pela revisão pastoral/editorial deve conferir data, celebração, cor, referências, cortes de versículos e texto exibido em cada um dos oito dias.

A integração com a API Java/Spring usa o contrato em `contracts/evangelizae-v1.openapi.yaml` e valida data, formato, fonte e estado de atualização antes de exibir uma resposta.

A ponte local é temporária e só poderá ser removida depois de a API ser comprovada em produção por sete dias consecutivos na fronteira de `America/Sao_Paulo`. A remoção exige revisar os testes, remover `src/data/embeddedDailyLiturgy.ts` e atualizar a documentação de privacidade e offline.
