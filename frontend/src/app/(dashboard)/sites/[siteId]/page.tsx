'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchSiteById } from '@/store/sites-slice';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Panel {
  id: string;
  health: number;
  hasIssue: boolean;
  type: 'normal' | 'premium';
}

// Mock panel data
const mockPanels: Panel[] = Array.from({ length: 60 }, (_, index) => ({
  id: `PANEL-${String.fromCharCode(65 + Math.floor(index / 10))}${(index % 10) + 1}`,
  health: Math.random() * 100,
  hasIssue: Math.random() < 0.1,
  type: Math.random() < 0.5 ? 'normal' : 'premium',
}));

const mockPerformanceData = [
  { date: '2025-03-01', actual: 87, expected: 90 },
  { date: '2025-03-02', actual: 92, expected: 91 },
  { date: '2025-03-03', actual: 85, expected: 88 },
  { date: '2025-03-04', actual: 78, expected: 87 },
  { date: '2025-03-05', actual: 82, expected: 89 },
  { date: '2025-03-06', actual: 94, expected: 90 },
  { date: '2025-03-07', actual: 96, expected: 92 },
  { date: '2025-03-08', actual: 88, expected: 91 },
  { date: '2025-03-09', actual: 85, expected: 90 },
  { date: '2025-03-10', actual: 91, expected: 91 },
  { date: '2025-03-11', actual: 89, expected: 92 },
  { date: '2025-03-12', actual: 93, expected: 93 },
  { date: '2025-03-13', actual: 87, expected: 90 },
  { date: '2025-03-14', actual: 84, expected: 89 },
];

// Color mapping function for panel health
function getHealthColor(health: number) {
  if (health >= 90) return 'bg-green-500';
  if (health >= 70) return 'bg-green-300';
  if (health >= 50) return 'bg-yellow-400';
  if (health >= 30) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const dispatch = useDispatch<AppDispatch>();
  const { currentSite, loading, error } = useSelector((state: RootState) => state.sites);
  const [viewMode, setViewMode] = useState<'layout' | 'performance'>('layout');

  useEffect(() => {
    dispatch(fetchSiteById(siteId));
  }, [dispatch, siteId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading site details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">Error loading site: {error}</p>
        <Link href="/sites" className="text-blue-600 hover:underline mt-2 inline-block">
          Return to sites list
        </Link>
      </div>
    );
  }

  if (!currentSite) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
        <p className="text-yellow-700">Site not found</p>
        <Link href="/sites" className="text-blue-600 hover:underline mt-2 inline-block">
          Return to sites list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentSite.name}</h1>
          <p className="text-gray-500">Site ID: {currentSite.id}</p>
        </div>
        
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('layout')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'layout'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Panel Layout
          </button>
          <button
            type="button"
            onClick={() => setViewMode('performance')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'performance'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Performance
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Capacity</h2>
          <p className="text-3xl font-bold mt-2">{currentSite.capacity} kW</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Performance</h2>
          <p className="text-3xl font-bold mt-2 text-primary-600">{currentSite.performance}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Installation Date</h2>
          <p className="text-3xl font-bold mt-2">{currentSite.installationDate}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Active Alerts</h2>
          <p className="text-3xl font-bold mt-2 text-red-500">{currentSite.alerts}</p>
        </div>
      </div>
      
      {viewMode === 'layout' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Panel Layout</h2>
          
          <div className="grid grid-cols-10 gap-2">
            {mockPanels.map((panel) => (
              <div
                key={panel.id}
                className={`aspect-square rounded-md ${getHealthColor(panel.health)} flex items-center justify-center ${
                  panel.hasIssue ? 'animate-pulse border-2 border-red-600' : ''
                }`}
                title={`Panel ${panel.id}: ${Math.round(panel.health)}% health`}
              >
                <span className="text-xs text-white font-medium">
                  {panel.id.split('-')[1]}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">90-100%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-300 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">70-89%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">50-69%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-400 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">30-49%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">0-29%</span>
              </div>
            </div>
            
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <span className="mr-1">●</span> Panel requires attention
            </div>
          </div>
        </div>
      )}
      
      {viewMode === 'performance' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Performance History</h2>
          
          <div className="h-80">
            {/* This would be a chart in a real implementation - using a placeholder for now */}
            <div className="h-full bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Performance chart would render here using Recharts</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Recent Performance Data</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual (%)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected (%)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPerformanceData.map((day, index) => (
                    <tr key={index} className={day.actual < day.expected * 0.9 ? 'bg-red-50' : ''}>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                        {day.date}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                        {day.actual}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                        {day.expected}%
                      </td>
                      <td className={`px-6 py-2 whitespace-nowrap text-sm ${
                        day.actual >= day.expected ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {day.actual >= day.expected ? '+' : ''}{(day.actual - day.expected).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex space-x-4">
        <Link
          href={`/sites/${siteId}/alerts`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          View Site Alerts
        </Link>
        
        <Link
          href={`/sites/${siteId}/tasks`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          View Maintenance Tasks
        </Link>
      </div>
    </div>
  );
}