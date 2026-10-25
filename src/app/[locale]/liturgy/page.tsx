'use client';

import {useEffect, useState} from 'react';
import {RefreshCw} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useDayContext} from '@/hooks/useDayContext';
import {extractPsalmRefrain, formatLiturgyParagraphs, tokenizeLiturgyQuotes, tokenizeLiturgyVerseMarkers} from '@/lib/liturgyFormat';
import {DailyLiturgyDto, getDailyLiturgy, LiturgyGroupDto, ReadingKind} from '@/services/liturgyService';
import {usePreferencesStore} from '@/store/usePreferencesStore';

const groupIds: Record<LiturgyGroupDto['kind'], string> = {
  FIRST_READING: 'primeira-leitura', PSALM: 'salmo', SECOND_READING: 'segunda-leitura', GOSPEL: 'evangelho', EXTRA: 'outros-textos',
};

const freshnessKeys = {
  LIVE: 'live',
  CACHED: 'cached',
  EMBEDDED: 'embedded',
} as const;

function formatSourceTime(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit'}).format(new Date(date));
}

function formatLiturgyDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(`${date}T12:00:00`));
}

function renderFormattedParagraph(paragraph: string, reference?: string, isPsalm = false) {
  const segments = tokenizeLiturgyQuotes(paragraph);
  return segments.flatMap((segment, segIndex) => {
    if (segment.type === 'quote') return <span key={segIndex} className="liturgy-quote">{segment.value}</span>;
    return tokenizeLiturgyVerseMarkers(segment.value, reference).map((textSegment, textIndex) => {
      const key = `${segIndex}-${textIndex}`;
      if (textSegment.type === 'verse') return <sup key={key} className="reading-verse-number">{textSegment.value}</sup>;
      if (!isPsalm) return <span key={key}>{textSegment.value}</span>;
      return textSegment.value.split(/(R\.)/gi).map((part, partIndex) =>
        /^R\.$/i.test(part)
          ? <span key={`${key}-${partIndex}`} className="psalm-response-marker" aria-label="Refrão">{part}</span>
          : <span key={`${key}-${partIndex}`}>{part}</span>,
      );
    });
  });
}

function hasDropCap(kind: ReadingKind): boolean {
  return kind === 'FIRST_READING' || kind === 'SECOND_READING' || kind === 'GOSPEL';
}

export default function LiturgyPage() {
  const t = useTranslations('Liturgy');
  const tDay = useTranslations('DayContext');
  const today = useDayContext();
  const readerScale = usePreferencesStore((state) => state.readerScale);
  const [liturgy, setLiturgy] = useState<DailyLiturgyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = async (force = false) => {
    setLoading(true); setFailed(false);
    try { setLiturgy(await getDailyLiturgy({force})); } catch { setLiturgy(null); setFailed(true); } finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;
    getDailyLiturgy()
      .then((data) => { if (active) setLiturgy(data); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="page-wrap liturgy-page">
      <header className="page-header statement-header"><span className="eyebrow season-text">{t('eyebrow')} · {tDay(`seasons.${today.season}`)}</span><h1 className="page-title">{liturgy?.title ?? t('title')}</h1><p className="lede">{t('subtitle')}</p></header>
      {loading && <div className="section-pad status-message" role="status">{t('loading')}</div>}
      {failed && !loading && <section className="reading-wrap section-pad"><div className="status-message liturgy-empty" data-tone="error" role="alert"><span className="liturgy-empty-mark" aria-hidden="true">✦</span><h2>{t('unavailableTitle')}</h2><p>{t('unavailableBody')}</p><div className="hero-actions"><button className="button" onClick={() => void load(true)}><RefreshCw size={16} />{t('retry')}</button><a className="button button-secondary" href="https://www.cnbb.org.br/liturgia-diaria/" target="_blank" rel="noreferrer">{t('officialLink')}</a></div></div></section>}
      {liturgy && !loading && <>
        {liturgy.source.freshness === 'CACHED' && <p className="status-message liturgy-edition-note">{t('cachedNotice')}</p>}
        {liturgy.source.freshness === 'EMBEDDED' && <p className="status-message liturgy-edition-note">{t('embeddedNotice')}</p>}
        <div className={`liturgy-layout reader-${readerScale}`}>
          <nav className="contents-nav" aria-label={t('contents')}><strong>{t('contents')}</strong>{liturgy.groups.map((group, index) => <a key={`${group.kind}-${index}`} href={`#${groupIds[group.kind]}-${index}`}>{t(group.kind)}</a>)}</nav>
          <article className="reading-document">
            {liturgy.groups.map((group, groupIndex) => (
              <section
                className={`reading-group reading-group-${group.kind.toLowerCase().replace('_', '-')}`}
                id={`${groupIds[group.kind]}-${groupIndex}`}
                key={`${group.kind}-${groupIndex}`}
              >
                <span className="eyebrow">{t(group.kind)}</span>
                {group.items.map((item, index) => {
                  const isPsalm = group.kind === 'PSALM';
                  const isGospel = group.kind === 'GOSPEL';
                  const isScriptureReading = group.kind === 'FIRST_READING' || group.kind === 'SECOND_READING';
                  const psalmResponse = isPsalm ? extractPsalmRefrain(item.text, item.refrain) : null;
                  const readingText = psalmResponse?.text ?? item.text;
                  const paragraphs = formatLiturgyParagraphs(readingText, group.kind);
                  const reference = isPsalm ? item.reference?.replace(/\s*\(R\.[^)]*\)/i, '') : item.reference;
                  const showItemTitle = !isPsalm || item.title.trim().toLocaleLowerCase('pt-BR') !== t(group.kind).toLocaleLowerCase('pt-BR');
                  return (
                    <div className="reading-item" key={`${item.reference}-${index}`}>
                      <div className="reading-item-header">
                        {showItemTitle && <h2>{item.title}</h2>}
                        {reference && <p className="reading-reference">{reference}</p>}
                      </div>
                      {psalmResponse?.refrain && (
                        <p className="psalm-refrain" role="note" aria-label={t('refrainLabel')}>
                          <span className="liturgy-rubric" aria-hidden="true">R.</span>
                          {' '}<span>{psalmResponse.refrain}</span>
                        </p>
                      )}
                      <div className={`reading-body${isPsalm ? ' reading-body-psalm' : ''}`}>
                        {paragraphs.map((paragraph, pIndex) => (
                          <p
                            key={pIndex}
                            className={
                              isPsalm
                                ? 'psalm-stanza'
                                : pIndex === 0 && index === 0 && hasDropCap(group.kind)
                                  ? 'reading-paragraph drop-cap'
                                  : 'reading-paragraph'
                            }
                          >
                            {renderFormattedParagraph(paragraph, item.reference, isPsalm)}
                          </p>
                        ))}
                      </div>
                      {(isScriptureReading || isGospel) && (
                        <footer className="liturgy-acclamation">
                          <span>
                            <abbr className="liturgy-rubric" title="Versículo">V.</abbr>{' '}
                            {isGospel ? t('wordOfSalvation') : t('wordOfTheLord')}
                          </span>
                          <span>
                            <abbr className="liturgy-rubric" title="Resposta">R.</abbr>{' '}
                            <strong>{isGospel ? t('gloryToYouLord') : t('thanksBeToGod')}</strong>
                          </span>
                        </footer>
                      )}
                    </div>
                  );
                })}
              </section>
            ))}
            {Object.entries(liturgy.prayers).map(([key, text]) =>
              text ? (
                <section className="reading-group reading-group-prayer" key={key}>
                  <span className="eyebrow">{t(key as 'collect' | 'offerings' | 'communion')}</span>
                  <div className="reading-body">
                    {formatLiturgyParagraphs(text, 'PRAYER').map((paragraph, pIndex) => (
                      <p key={pIndex} className="reading-paragraph">
                        {renderFormattedParagraph(paragraph)}
                      </p>
                    ))}
                  </div>
                </section>
              ) : null,
            )}
            <p className="liturgy-source">{t('source', {
              provider: liturgy.source.provider,
              date: formatLiturgyDate(liturgy.date),
               time: formatSourceTime(liturgy.source.fetchedAt),
               timeZone: 'São Paulo',
               freshness: t(`freshness.${freshnessKeys[liturgy.source.freshness]}`),
            })}</p>
          </article>
        </div>
      </>}
    </div>
  );
}
