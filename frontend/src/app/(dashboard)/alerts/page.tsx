// src/app/(dashboard)/alerts/page.tsx
'use client';

import React, { useState } from 'react';

// Define the alert interface
interface Alert {
  id: string;
  siteId: string;
  componentId: string;
  anomalyType: string;
  severity: number;
  timestamp: string;
  status: 'Active' | 'Resolved' | 'Ignored';
}

// Mock data for alerts
const mockAlerts: Alert[] = [
  {
    id: 'ALT-005',
    siteId: 'SITE-002',
    componentId: 'PANEL-E11',
    anomalyType: 'Physical Damage',
    severity: 5,
    timestamp: '3/28/2025, 10:58:44 PM',
    status: 'Active',
  },
  {
    id: 'ALT-001',
    siteId: 'SITE-001',
    componentId: 'PANEL-A23',
    anomalyType: 'Hot Spot',
    severity: 4,
    timestamp: '3/29/2025, 12:58:44 AM',
    status: 'Active',
  },
  {
    id: 'ALT-002',
    siteId: 'SITE-002',
    componentId: 'INV-B12',
    anomalyType: 'Inverter Efficiency Drop',
    severity: 3,
    timestamp: '3/28/2025, 2:58:44 PM',
    status: 'Active',
  },
  {
    id: 'ALT-006',
    siteId: 'SITE-004',
    componentId: 'STRING-F2',
    anomalyType: 'Connection Issue',
    severity: 3,
    timestamp: '3/27/2025, 2:58:44 PM',
    status: 'Active',
  },
  {
    id: 'ALT-003',
    siteId: 'SITE-001',
    componentId: 'STRING-C4',
    anomalyType: 'String Underperformance',
    severity: 2,
    timestamp: '3/28/2025, 2:58:44 AM',
    status: 'Active',
  },
  {
    id: 'ALT-004',
    siteId: 'SITE-003',
    componentId: 'PANEL-D45',
    anomalyType: 'Potential Shading',
    severity: 2,
    timestamp: '3/28/2025, 6:58:44 PM',
    status: 'Active',
  },
  {
    id: 'ALT-007',
    siteId: 'SITE-001',
    componentId: 'PANEL-G17',
    anomalyType: 'Microfractures',
    severity: 1,
    timestamp: '3/27/2025, 2:58:44 AM',
    status: 'Active',
  },
];

// Severity badge component
function SeverityBadge({ severity }: { severity: number }) {
  let bgColor = 'bg-gray-500';
  let textColor = 'text-white';
  
  if (severity >= 5) {
    bgColor = 'bg-red-500';
  } else if (severity >= 3) {
    bgColor = 'bg-green-500';
  } else if (severity >= 1) {
    bgColor = 'bg-gray-500';
  }
  
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bgColor} ${textColor} text-sm font-medium`}>
      {severity}
    </span>
  );
}

// Status badge component
function StatusBadge({ status }: { status: 'Active' | 'Resolved' | 'Ignored' }) {
  let bgColor = 'bg-gray-100 text-gray-800';
  
  if (status === 'Active') {
    bgColor = 'bg-red-100 text-red-800';
  } else if (status === 'Resolved') {
    bgColor = 'bg-green-100 text-green-800';
  } else if (status === 'Ignored') {
    bgColor = 'bg-yellow-100 text-yellow-800';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {status}
    </span>
  );
}

// Timestamp component
function Timestamp({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex items-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm">{timestamp}</span>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;
  
  // Get current alerts for pagination
  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500">Active anomalies detected across your solar portfolio.</p>
        </div>
        
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {alerts.length} Active Alerts
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anomaly Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.siteId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.componentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alert.anomalyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Timestamp timestamp={alert.timestamp} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={alert.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {alerts.length > alertsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage * alertsPerPage >= alerts.length}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage * alertsPerPage >= alerts.length
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}