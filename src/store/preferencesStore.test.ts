import {beforeEach, describe, expect, it} from 'vitest';
import {initialPreferences, usePreferencesStore} from './usePreferencesStore';

describe('beta notice dismissal preference', () => {
  beforeEach(() => {
    window.localStorage.clear();
    usePreferencesStore.setState({...initialPreferences}, false);
  });

  it('starts visible and stays hidden once dismissed', () => {
    expect(usePreferencesStore.getState().betaNoticeDismissed).toBe(false);
    usePreferencesStore.getState().dismissBetaNotice();
    expect(usePreferencesStore.getState().betaNoticeDismissed).toBe(true);
  });
});
