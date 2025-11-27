import React from 'react';
import Link from 'next/link';

interface DashboardStats {
  upcomingAppointments: number;
  activeMedications: number;
  recentSymptoms: number;
  unreadMessages: number;
  documentsCount: number;
}

interface DashboardCardsProps {
  stats: DashboardStats;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      color: 'bg-blue-500',
      href: '/appointments',
    },
    {
      title: 'Active Medications',
      value: stats.activeMedications,
      color: 'bg-green-500',
      href: '/medications',
    },
    {
      title: 'Recent Symptoms',
      value: stats.recentSymptoms,
      color: 'bg-yellow-500',
      href: '/symptoms',
    },
    {
      title: 'Documents',
      value: stats.documentsCount,
      color: 'bg-purple-500',
      href: '/documents',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {card.value}
              </p>
            </div>
            <div className={`${card.color} rounded-lg p-3`}>
              <div className="h-6 w-6 text-white"></div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};