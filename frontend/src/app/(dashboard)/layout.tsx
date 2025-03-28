// src/app/(dashboard)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import {
  HomeIcon,
  BellIcon,
  ClipboardIcon,
  UploadIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  MapIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  UserGroupIcon,
} from './icons';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Get current navigation item based on path
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: <HomeIcon className="w-6 h-6" />, current: pathname === '/' },
    { name: 'Alerts', href: '/alerts', icon: <BellIcon className="w-6 h-6" />, current: pathname === '/alerts' },
    { name: 'Tasks', href: '/tasks', icon: <ClipboardIcon className="w-6 h-6" />, current: pathname === '/tasks' },
    { name: 'Sites', href: '/sites', icon: <MapIcon className="w-6 h-6" />, current: pathname.startsWith('/sites') },
    { name: 'Anomalies', href: '/anomalies', icon: <ExclamationTriangleIcon className="w-6 h-6" />, current: pathname === '/anomalies' },
    { name: 'Performance', href: '/performance', icon: <ChartBarIcon className="w-6 h-6" />, current: pathname === '/performance' },
    { name: 'Reports', href: '/reports', icon: <DocumentIcon className="w-6 h-6" />, current: pathname === '/reports' },
    { name: 'Admin', href: '/admin', icon: <Cog6ToothIcon className="w-6 h-6" />, current: pathname === '/admin' },
    { name: 'Upload', href: '/upload', icon: <UploadIcon className="w-6 h-6" />, current: pathname === '/upload' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  if (!isAuthorized) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center text-xl font-semibold text-gray-900">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary-500 mr-2">●</span>
              <span>LitAgents</span>
            </div>
          </div>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-3 text-base font-medium rounded-md ${
                item.current
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Side menu */}
          <div className="fixed inset-y-0 left-0 flex flex-col z-50 w-64 max-w-xs bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center text-xl font-semibold text-gray-900">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-primary-500 mr-2">●</span>
                  <span>LitAgents</span>
                </div>
              </div>
              <button
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-3 text-base font-medium rounded-md ${
                    item.current
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200">
          <div className="lg:hidden">
            {/* Empty space for mobile menu button */}
            <div className="w-6"></div>
          </div>
          <div className="hidden lg:block">
            {/* Breadcrumbs could go here */}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center text-gray-700 font-medium">
                J
              </span>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium text-gray-700">John Technician</p>
                <p className="text-xs text-gray-500">technician</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}