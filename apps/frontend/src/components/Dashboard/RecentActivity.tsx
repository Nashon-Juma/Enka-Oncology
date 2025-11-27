import React from 'react';
import { format } from 'date-fns';
import { 
  Pill, 
  Calendar, 
  FileText, 
  AlertTriangle,
  MessageCircle 
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'medication' | 'appointment' | 'symptom' | 'document' | 'message';
  title: string;
  description: string;
  timestamp: string;
}

export const RecentActivity: React.FC = () => {
  // Mock data - in real app, this would come from API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'medication',
      title: 'Medication Taken',
      description: 'Took Ibuprofen 200mg',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'symptom',
      title: 'Symptom Logged',
      description: 'Recorded headache with intensity 6',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: 'Follow-up with Dr. Smith',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'medication':
        return <Pill className="h-4 w-4 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'symptom':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-pink-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.title}
            </p>
            <p className="text-sm text-gray-500">
              {activity.description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        </div>
      ))}
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
};