interface PreferenceEnvelope {
  state: Record<string, unknown>;
  version?: number;
}

interface SyncStateStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

export interface ReconciledPreferenceStorage extends SyncStateStorage {
  replaceNextWrite: () => void;
}

function parseEnvelope(value: string | null): PreferenceEnvelope | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null || !('state' in parsed)) return null;
    const state = (parsed as {state: unknown}).state;
    if (typeof state !== 'object' || state === null || Array.isArray(state)) return null;
    return parsed as PreferenceEnvelope;
  } catch {
    return null;
  }
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** Merge only this tab's changed preference fields into the latest stored value. */
export function createReconciledPreferenceStorage(storage: SyncStateStorage): ReconciledPreferenceStorage {
  let previousState: Record<string, unknown> | null = null;
  let replaceOnNextWrite = false;

  return {
    getItem(name) {
      const value = storage.getItem(name);
      if (typeof value === 'string') previousState = parseEnvelope(value)?.state ?? null;
      return value;
    },
    setItem(name, value) {
      const incoming = parseEnvelope(value);
      if (!incoming) {
        storage.setItem(name, value);
        return;
      }

      if (replaceOnNextWrite) {
        replaceOnNextWrite = false;
        previousState = incoming.state;
        storage.setItem(name, value);
        return;
      }

      const latest = parseEnvelope(storage.getItem(name));
      const changedFields = previousState
        ? Object.fromEntries(
            Object.entries(incoming.state).filter(([key, fieldValue]) => !sameValue(fieldValue, previousState?.[key])),
          )
        : incoming.state;
      const mergedState = {...(latest?.state ?? {}), ...changedFields};
      const reconciled = JSON.stringify({...incoming, state: mergedState});

      storage.setItem(name, reconciled);
      previousState = incoming.state;
    },
    removeItem(name) {
      previousState = null;
      storage.removeItem(name);
    },
    replaceNextWrite() {
      replaceOnNextWrite = true;
    },
  };
}
