# Verificação das capturas de produção

Data: 23 de agosto de 2026. Domínio: <https://evangelizae.com>.

## Confirmado

- O indicador circular com a letra “N” não aparece no domínio público. Ele pertencia ao ambiente local de desenvolvimento do Next.js.
- A página inicial foi conferida em viewport mobile e desktop.
- Rosário, missão e privacidade abriram corretamente e foram usados nas peças.
- As capturas publicadas não possuem o indicador local.

## Bloqueador encontrado

Em <https://evangelizae.com/pt/liturgy>, a página exibiu “A liturgia não está disponível agora.” A tentativa manual de recarregar o conteúdo manteve o mesmo estado.

O bundle público contém o fallback `http://localhost:8080/api/v1` usado quando `NEXT_PUBLIC_API_BASE_URL` não está definido. Isso não comprova sozinho a causa, mas torna provável que a variável pública da API não esteja configurada no build publicado ou que a API/CORS de produção esteja indisponível.

Antes de divulgar a liturgia como funcionalidade do beta:

1. confirmar `NEXT_PUBLIC_API_BASE_URL` no ambiente de build/deploy;
2. reconstruir e publicar o frontend se a variável foi adicionada depois do build;
3. validar HTTPS e CORS da API Java/Spring;
4. confirmar `GET /liturgy/today` com a data de `America/Sao_Paulo`;
5. abrir novamente a página em uma sessão limpa e conferir título, data, fonte e horário de atualização.

Até essa verificação passar, usar o carrossel de Rosário, privacidade e missão, mas não publicar demonstrações ou promessas específicas da liturgia diária.
