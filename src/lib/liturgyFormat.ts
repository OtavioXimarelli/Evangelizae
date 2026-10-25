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
  type: 'plain' | 'quote' | 'verse';
  value: string;
}

function getReferenceVerseNumbers(reference: string): Set<string> {
  const verseRange = reference.split(',').slice(1).join(',').replace(/\([^)]*\)/g, '');
  const numbers = new Set<string>();

  for (const match of verseRange.matchAll(/(\d{1,3}[a-z]{0,3})(?:-(\d{1,3}[a-z]{0,3}))?/gi)) {
    const first = match[1].toLowerCase();
    const last = match[2]?.toLowerCase();
    numbers.add(first);
    if (!last || last === first) continue;

    const firstNumber = Number.parseInt(first, 10);
    const lastNumber = Number.parseInt(last, 10);
    if (lastNumber - firstNumber <= 30) {
      for (let verse = firstNumber + 1; verse < lastNumber; verse += 1) numbers.add(String(verse));
    }
    numbers.add(last);
  }

  return numbers;
}

/** Identifies only verse labels present in the item's cited biblical reference. */
export function tokenizeLiturgyVerseMarkers(text: string, reference?: string): TextSegment[] {
  if (!reference) return [{type: 'plain', value: text}];
  const verseNumbers = getReferenceVerseNumbers(reference);
  if (verseNumbers.size === 0) return [{type: 'plain', value: text}];

  const candidatePattern = /\d{1,3}[a-z]{0,3}/gi;
  const segments: TextSegment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = candidatePattern.exec(text)) !== null) {
    const label = match[0].toLowerCase();
    const before = text[match.index - 1];
    const after = text[match.index + match[0].length];
    const hasBoundaryBefore = match.index === 0 || /[\s:;.!?*]/.test(before ?? '');
    const hasBoundaryAfter = after !== undefined && /\s/.test(after);
    if (!verseNumbers.has(label) || !hasBoundaryBefore || !hasBoundaryAfter) continue;

    if (match.index > cursor) segments.push({type: 'plain', value: text.slice(cursor, match.index)});
    segments.push({type: 'verse', value: match[0]});
    cursor = candidatePattern.lastIndex;
  }

  if (cursor < text.length) segments.push({type: 'plain', value: text.slice(cursor)});
  return segments.length > 0 ? segments : [{type: 'plain', value: text}];
}

export interface ResponsorialPsalm {
  refrain: string | null;
  stanzas: string[];
}

export function formatResponsorialPsalm(text: string, reference: string, explicitRefrain?: string): ResponsorialPsalm {
  const firstResponse = text.match(/^\s*R\.\s*([\s\S]*?)(?=\s+\d{1,3}[a-z]{0,3}\s|$)/i);
  const refrain = explicitRefrain?.trim() || firstResponse?.[1]?.trim() || null;
  const verseStart = firstResponse ? firstResponse[0].length : 0;
  const textAfterOpeningResponse = firstResponse ? text.slice(verseStart) : text;
  const rawStanzas = firstResponse
    ? textAfterOpeningResponse.split(/\bR\.\s*/i)
    : [textAfterOpeningResponse];
  const escapedRefrain = refrain?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let stanzas = rawStanzas
    .map((stanza) => {
      const withoutRepeatedResponse = escapedRefrain
        ? stanza.replace(new RegExp(`^\\s*${escapedRefrain}\\s*`, 'i'), '')
        : stanza;
      const withoutVerseLabels = tokenizeLiturgyVerseMarkers(withoutRepeatedResponse, reference)
        .filter((segment) => segment.type !== 'verse')
        .map((segment) => segment.value)
        .join('');
      return withoutVerseLabels
        .replace(/\s*\*\s*/g, ' / ')
        .replace(/\s+([,.;!?])/g, '$1')
        .replace(/\s+/g, ' ')
        .replace(/^\s*\/|\/\s*$/g, '')
        .trim();
    })
    .filter(Boolean);

  if (stanzas.length <= 1 && !/\bR\./i.test(textAfterOpeningResponse)) {
    const withoutVerseLabels = tokenizeLiturgyVerseMarkers(textAfterOpeningResponse, reference)
      .filter((segment) => segment.type !== 'verse')
      .map((segment) => segment.value)
      .join('');
    stanzas = formatLiturgyParagraphs(withoutVerseLabels, 'PSALM').map((stanza) =>
      stanza.replace(/\s*\*\s*/g, ' / ').replace(/\s+/g, ' ').trim(),
    );
  }

  return {
    refrain,
    stanzas: stanzas.map((stanza) => `${stanza.replace(/\s*–\s*R\.$/i, '').trim()} – R.`),
  };
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
