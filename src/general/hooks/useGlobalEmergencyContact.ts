import { useEffect } from 'react';
import { emergencyContactService } from '../api/emergencyContactService';
import { authSession } from '../auth/authSession';
import { useEmergencyContactStore } from '../stores/useEmergencyContactStore';

export function useGlobalEmergencyContact() {
  const { setContact, setLoading, setError } = useEmergencyContactStore();

  useEffect(() => {
    async function fetchContact() {
      const token = await authSession.getAccessToken();
      if (!token) return;

      setLoading(true);
      try {
        const contact = await emergencyContactService.fetchActive();
        setContact(contact);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load emergency contact');
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
