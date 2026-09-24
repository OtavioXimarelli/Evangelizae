import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const minimumTextContrast = 4.5;

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);

  if (!channels || channels.length !== 3) {
    throw new Error(`Invalid six-digit hex color: ${hex}`);
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

describe('light-mode color tokens', () => {
  it('keeps every season accent at WCAG AA contrast against paper', () => {
    const css = readFileSync('src/app/globals.css', 'utf8');
    const rootBlock = css.match(/:root\s*{([^}]*)}/)?.[1];
    const paper = rootBlock?.match(/--paper:\s*(#[0-9a-f]{6})\s*;/i)?.[1];

    if (!paper) {
      throw new Error('Could not parse the light --paper token from :root');
    }

    const accents = [
      ...css.matchAll(
        /^\[data-season=['"]([^'"]+)['"]\]\s*{\s*--season-accent:\s*(#[0-9a-f]{6})\s*;/gim,
      ),
    ].map((match) => ({season: match[1], value: match[2]}));
    const failures = accents
      .map(({season, value}) => ({
        season,
        value,
        ratio: contrastRatio(value, paper),
      }))
      .filter(({ratio}) => ratio < minimumTextContrast)
      .map(
        ({season, value, ratio}) =>
          `${season}: ${value} against ${paper} has ${ratio.toFixed(2)}:1 contrast`,
      );

    expect(
      failures,
      failures.join('\n') || `Compared ${accents.length} light-mode season accents`,
    ).toEqual([]);
  });
});
