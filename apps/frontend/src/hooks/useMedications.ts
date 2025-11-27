import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  notes?: string;
}

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/medications');
      setMedications(response.data.medications);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const createMedication = async (medicationData: Omit<Medication, '_id'>) => {
    try {
      const response = await api.post('/medications', medicationData);
      setMedications(prev => [response.data.medication, ...prev]);
      return response.data.medication;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create medication');
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const response = await api.put(`/medications/${id}`, updates);
      setMedications(prev => 
        prev.map(med => med._id === id ? response.data.medication : med)
      );
      return response.data.medication;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update medication');
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await api.delete(`/medications/${id}`);
      setMedications(prev => prev.filter(med => med._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete medication');
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return {
    medications,
    loading,
    error,
    refetch: fetchMedications,
    createMedication,
    updateMedication,
    deleteMedication,
  };
}