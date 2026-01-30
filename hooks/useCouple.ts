'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Couple } from '@/types';

export function useCouple() {
  const [couple, setCouple] = useState<Couple | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCouple = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const coupleData = await api.couples.getByUser(token);
      setCouple(coupleData);
      // Store couple ID for later use
      localStorage.setItem('coupleId', coupleData.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch couple';
      setError(message);
      setCouple(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCouple = useCallback(
    async (userId2: string, coupleName: string) => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return { success: false };
      }

      setIsLoading(true);
      setError(null);

      try {
        const newCouple = await api.couples.create(token, userId2, coupleName);
        setCouple(newCouple);
        localStorage.setItem('coupleId', newCouple.id);
        return { success: true, couple: newCouple };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create couple';
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Fetch couple on mount
  useEffect(() => {
    fetchCouple();
  }, [fetchCouple]);

  return {
    couple,
    isLoading,
    error,
    fetchCouple,
    createCouple,
  };
}
