import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Cancer Care</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Supporting patients and care teams through every step of the cancer journey.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/symptoms" className="text-base text-gray-500 hover:text-gray-900">
                  Symptom Tracking
                </Link>
              </li>
              <li>
                <Link href="/medications" className="text-base text-gray-500 hover:text-gray-900">
                  Medication Management
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-base text-gray-500 hover:text-gray-900">
                  Appointment Scheduling
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-base text-gray-500 hover:text-gray-900">
                  Document Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/care-team" className="text-base text-gray-500 hover:text-gray-900">
                  Care Team
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-base text-gray-500 hover:text-gray-900">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-base text-gray-500 hover:text-gray-900">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              &copy; 2024 Cancer Care Platform. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 text-center md:text-right">
                <strong>Important:</strong> This app does not provide medical advice. 
                Always consult your healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};