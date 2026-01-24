import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 AI Invigilator. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Automated examination monitoring system powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
