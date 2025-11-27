import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';

interface SymptomData {
  date: string;
  intensity: number;
  name: string;
}

export const SymptomChart: React.FC = () => {
  const [data, setData] = useState<SymptomData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptomData = async () => {
      try {
        const response = await api.get('/symptoms?limit=30');
        const symptoms = response.data.symptoms;
        
        const chartData = symptoms.map((symptom: any) => ({
          date: new Date(symptom.recordedAt).toLocaleDateString(),
          intensity: symptom.intensity,
          name: symptom.name,
        }));

        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch symptom data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptomData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No symptom data available. Start logging your symptoms to see trends.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          domain={[0, 10]}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value}`, 'Intensity']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="intensity" 
          stroke="#0ea5e9" 
          strokeWidth={2}
          dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#0369a1' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};