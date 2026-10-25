import {describe, expect, it} from 'vitest';
import {formatLiturgyParagraphs, tokenizeLiturgyQuotes} from './liturgyFormat';

describe('formatLiturgyParagraphs', () => {
  it('preserves explicit double-newline paragraph breaks', () => {
    const text = 'Primeiro parágrafo da leitura.\n\nSegundo parágrafo da leitura.';
    expect(formatLiturgyParagraphs(text, 'FIRST_READING')).toEqual([
      'Primeiro parágrafo da leitura.',
      'Segundo parágrafo da leitura.',
    ]);
  });

  it('splits responsorial psalms into 2-sentence poetic stanzas when single-block', () => {
    const psalm =
      'Dizei entre as gentes que o Senhor reinou. Porque firmou a redondeza da terra, que não será comovida. Alegrem-se os céus e regozije-se a terra. Então se regozijarão todas as árvores das selvas.';
    const stanzas = formatLiturgyParagraphs(psalm, 'PSALM');
    expect(stanzas).toHaveLength(2);
    expect(stanzas[0]).toContain('Dizei entre as gentes');
    expect(stanzas[1]).toContain('Alegrem-se os céus');
    expect(stanzas.join(' ')).toBe(psalm);
  });

  it('segments long single-block Gospel readings into balanced paragraphs without altering text', () => {
    const gospel =
      'Então será semelhante o reino dos céus a dez virgens que, tomando as suas lâmpadas, saíram a receber o esposo e a esposa. Mas cinco delas eram loucas, e cinco prudentes. As cinco, porém, que eram loucas, tomando as suas lâmpadas, não levaram azeite consigo; mas as prudentes levaram azeite nas suas vasilhas juntamente com as lâmpadas. E, tardando o esposo, começaram todas a cochilar e adormeceram. À meia-noite, porém, ouviu-se um clamor: “Eis aí vem o esposo, saí a recebê-lo”. Então se levantaram todas aquelas virgens e prepararam as suas lâmpadas.';
    const paragraphs = formatLiturgyParagraphs(gospel, 'GOSPEL');
    expect(paragraphs.length).toBeGreaterThan(1);
    expect(paragraphs.join(' ')).toBe(gospel);
    const paragraphLengths = paragraphs.map((paragraph) => paragraph.length);
    expect(Math.max(...paragraphLengths) - Math.min(...paragraphLengths)).toBeLessThan(120);
  });
});

describe('tokenizeLiturgyQuotes', () => {
  it('identifies direct speech quotes for typographic styling', () => {
    const text = 'À meia-noite, porém, ouviu-se um clamor: “Eis aí vem o esposo, saí a recebê-lo”.';
    const tokens = tokenizeLiturgyQuotes(text);
    expect(tokens).toEqual([
      {type: 'plain', value: 'À meia-noite, porém, ouviu-se um clamor: '},
      {type: 'quote', value: '“Eis aí vem o esposo, saí a recebê-lo”'},
      {type: 'plain', value: '.'},
    ]);
  });
});
