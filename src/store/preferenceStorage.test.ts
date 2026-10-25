import {describe, expect, it} from 'vitest';
import {createReconciledPreferenceStorage} from './preferenceStorage';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => { values.set(name, value); },
    removeItem: (name: string) => { values.delete(name); },
  };
}

describe('reconciled preference storage', () => {
  it('merges only changed fields into the latest value from another tab', () => {
    const shared = memoryStorage();
    const key = 'evangelizae-preferences';
    const initial = {
      state: {firstName: '', theme: 'system', rosaryGuideSeen: false},
      version: 4,
    };
    shared.setItem(key, JSON.stringify(initial));

    const firstTab = createReconciledPreferenceStorage(shared);
    const secondTab = createReconciledPreferenceStorage(shared);
    firstTab.getItem(key);
    secondTab.getItem(key);

    secondTab.setItem(key, JSON.stringify({
      state: {...initial.state, firstName: 'Ana', rosaryGuideSeen: true},
      version: 4,
    }));
    firstTab.setItem(key, JSON.stringify({
      state: {...initial.state, theme: 'dark'},
      version: 4,
    }));

    expect(JSON.parse(shared.getItem(key) ?? 'null')).toEqual({
      state: {firstName: 'Ana', theme: 'dark', rosaryGuideSeen: true},
      version: 4,
    });
  });

  it('allows an explicit full replacement for local-data reset', () => {
    const shared = memoryStorage();
    const key = 'evangelizae-preferences';
    shared.setItem(key, JSON.stringify({state: {firstName: 'Ana', rosaryGuideSeen: true}, version: 4}));
    const tab = createReconciledPreferenceStorage(shared);
    tab.getItem(key);
    tab.replaceNextWrite();
    tab.setItem(key, JSON.stringify({state: {firstName: '', rosaryGuideSeen: false}, version: 4}));

    expect(JSON.parse(shared.getItem(key) ?? 'null')).toEqual({
      state: {firstName: '', rosaryGuideSeen: false},
      version: 4,
    });
  });
});
