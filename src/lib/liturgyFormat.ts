import type {ReadingKind} from '@/services/liturgyService';

export interface FormattedParagraph {
  text: string;
  hasQuotes: boolean;
}

const DISCOURSE_BREAK_PATTERNS = [
  /^(Então|Naquele tempo|E disse|Disse-lhes|Responderam|Respondeu|Mas ele|E por fim|Ora,|Por isso,|Assim que,|E assim,)/i,
];

function splitIntoSentences(raw: string): string[] {
  const normalized = raw.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+[.!?]+(?:["”'’)]+)?|[^.!?]+$/g);
  return (matches ?? [normalized]).map((sentence) => sentence.trim()).filter(Boolean);
}

/**
 * Formats a liturgy reading or prayer text into balanced editorial paragraphs
 * or responsorial psalm stanzas while preserving the exact canonical words.
 */
export function formatLiturgyParagraphs(text: string, kind: ReadingKind | 'PRAYER'): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const explicitBlocks = trimmed
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (explicitBlocks.length > 1) {
    return explicitBlocks;
  }

  const singleLineBreaks = trimmed
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (singleLineBreaks.length > 1) {
    return singleLineBreaks;
  }

  const sentences = splitIntoSentences(trimmed);

  if (kind === 'PSALM') {
    if (sentences.length <= 2) return [trimmed];
    const stanzas: string[] = [];
    for (let index = 0; index < sentences.length; index += 2) {
      stanzas.push(sentences.slice(index, index + 2).join(' '));
    }
    return stanzas;
  }

  if (kind === 'PRAYER' || sentences.length <= 3) {
    return [trimmed];
  }

  const paragraphs: string[] = [];
  let current: string[] = [];
  let currentLength = 0;

  for (const sentence of sentences) {
    const startsNewDiscourse = DISCOURSE_BREAK_PATTERNS.some((pattern) => pattern.test(sentence));
    const shouldBreak =
      current.length > 0 &&
      (current.length >= 3 ||
        (current.length >= 2 && currentLength + sentence.length > 280) ||
        (startsNewDiscourse && currentLength > 140));

    if (shouldBreak) {
      paragraphs.push(current.join(' '));
      current = [sentence];
      currentLength = sentence.length;
    } else {
      current.push(sentence);
      currentLength += sentence.length;
    }
  }

  if (current.length > 0) {
    if (paragraphs.length > 0 && current.length === 1 && currentLength < 95) {
      paragraphs[paragraphs.length - 1] = `${paragraphs[paragraphs.length - 1]} ${current[0]}`;
    } else {
      paragraphs.push(current.join(' '));
    }
  }

  return paragraphs;
}

export interface TextSegment {
  type: 'plain' | 'quote';
  value: string;
}

/**
 * Splits a paragraph into plain text and direct-speech quotations (“...” or "...")
 * so direct speech can receive subtle editorial emphasis without altering content.
 */
export function tokenizeLiturgyQuotes(paragraph: string): TextSegment[] {
  const regex = /(“[^”]+”|"[^"]+")/g;
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(paragraph)) !== null) {
    if (match.index > lastIndex) {
      segments.push({type: 'plain', value: paragraph.slice(lastIndex, match.index)});
    }
    segments.push({type: 'quote', value: match[0]});
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < paragraph.length) {
    segments.push({type: 'plain', value: paragraph.slice(lastIndex)});
  }

  return segments.length > 0 ? segments : [{type: 'plain', value: paragraph}];
}
