import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { emergencyContactService } from '../api/emergencyContactService';
import { authSession } from '../auth/authSession';
import { useEmergencyContactStore } from '../stores/useEmergencyContactStore';

/**
 * Call this once at app startup (inside ThemedApp).
 * Fetches the global emergency contact only when a valid auth token exists,
 * and re-fetches every time the app returns to the foreground.
 */
export function useGlobalEmergencyContact() {
  const { setContact, setLoading, setError } = useEmergencyContactStore();
  const appState = useRef(AppState.currentState);

  async function fetchContact() {
    const token = await authSession.getAccessToken();
    console.log('[EmergencyContact] token present:', !!token);
    if (!token) {
      console.log('[EmergencyContact] skipping fetch – no token');
      return;
    }

    setLoading(true);
    try {
      console.log('[EmergencyContact] fetching...');
      const contact = await emergencyContactService.fetchActive();
      console.log('[EmergencyContact] success:', JSON.stringify(contact));
      setContact(contact);
    } catch (err) {
      console.log('[EmergencyContact] error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load emergency contact');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContact();

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (appState.current !== 'active' && nextState === 'active') {
          fetchContact();
        }
        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
