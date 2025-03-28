// src/app/(dashboard)/sites/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchSites } from '@/store/sites-slice';
import Link from 'next/link';

// Map component (simplified placeholder)
function SitesMap({ sites }: { sites: any[] }) {
  return (
    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
      <p className="text-gray-500">Interactive map would render here using Leaflet</p>
    </div>
  );
}

export default function SitesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, loading, error } = useSelector((state: RootState) => state.sites);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  
  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading sites...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solar Sites</h1>
          <p className="text-gray-500">View and manage your solar installations</p>
        </div>
        
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'map'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Map View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            List View
          </button>
        </div>
      </div>
      
      {viewMode === 'map' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <SitesMap sites={sites} />
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity (kW)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Alerts
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {site.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.alerts > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {site.alerts} {site.alerts === 1 ? 'alert' : 'alerts'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        No alerts
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/sites/${site.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {sites.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No sites found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}