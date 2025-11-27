'use client';

import React from 'react';
import { DashboardCards } from '../../components/Dashboard/DashboardCards';
import { SymptomChart } from '../../components/Charts/SymptomChart';
import { RecentActivity } from '../../components/Dashboard/RecentActivity';

export default function DashboardPage() {
  const stats = {
    upcomingAppointments: 0,
    activeMedications: 0,
    recentSymptoms: 0,
    unreadMessages: 0,
    documentsCount: 0,
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to your Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your health and manage your care in one place.
        </p>
      </div>

      <div className="px-4 sm:px-0 mb-8">
        <DashboardCards stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Symptom Tracking
          </h2>
          <SymptomChart />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}