import React from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { ClientLayout } from '../components/Layout/ClientLayout';
import './globals.css';

export const metadata = {
  title: 'Cancer Care Platform',
  description: 'Comprehensive care management for cancer patients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}