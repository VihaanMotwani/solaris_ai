// src/app/(dashboard)/anomalies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAlerts, updateAlertStatus } from '@/store/alerts-slice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Define anomaly type interface
interface AnomalyType {
  name: string;
  value: number;
  color: string;
}

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
  let variant = 'default';
  
  if (status === 'Active') {
    variant = 'danger';
  } else if (status === 'Resolved') {
    variant = 'success';
  } else if (status === 'Ignored') {
    variant = 'warning';
  }
  
  return (
    <Badge variant={variant as any} rounded>{status}</Badge>
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

export default function AnomaliesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: alerts, loading, error } = useSelector((state: RootState) => state.alerts);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
  const [filterSite, setFilterSite] = useState<string>('all');
  
  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);
  
  // Filter alerts based on selected filters
  const filteredAlerts = (alerts || []).filter(alert => {
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    if (filterSeverity !== null && alert.severity !== filterSeverity) return false;
    if (filterSite !== 'all' && alert.siteId !== filterSite) return false;
    return true;
  });
  
  // Get unique sites for filter
  const sites = [...new Set(alerts.map(alert => alert.siteId))];
  
  // Get anomaly types and counts for chart
  const anomalyTypes = alerts.reduce((acc: Record<string, number>, alert) => {
    acc[alert.anomalyType] = (acc[alert.anomalyType] || 0) + 1;
    return acc;
  }, {});
  
  const chartData: AnomalyType[] = Object.entries(anomalyTypes).map(([name, value], index) => {
    const colors = ['#16A34A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return {
      name,
      value,
      color: colors[index % colors.length],
    };
  });
  
  // Handle alert status update
  const handleStatusChange = (alertId: string, newStatus: 'Active' | 'Resolved' | 'Ignored') => {
    dispatch(updateAlertStatus({ id: alertId, status: newStatus }));
  };
  
  // Handle row click to show details
  const handleRowClick = (alert: any) => {
    setSelectedAnomaly(alert);
  };
  
  if (loading && alerts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Loading anomalies...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="error">
        Error loading anomalies: {error}
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anomaly Detection Center</h1>
          <p className="text-gray-500">Detect and manage issues across your solar portfolio</p>
        </div>
        
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {filteredAlerts.length} {filteredAlerts.length === 1 ? 'Anomaly' : 'Anomalies'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Filter controls */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Ignored">Ignored</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="severityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  id="severityFilter"
                  value={filterSeverity === null ? 'all' : filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value === 'all' ? null : Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="5">5 (Highest)</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1 (Lowest)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="siteFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Site
                </label>
                <select
                  id="siteFilter"
                  value={filterSite}
                  onChange={(e) => setFilterSite(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Sites</option>
                  {sites.map((site) => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterSeverity(null);
                    setFilterSite('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Anomalies table */}
          <Card>
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
                      Anomaly Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <tr 
                        key={alert.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(alert)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alert.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alert.siteId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {alert.anomalyType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <SeverityBadge severity={alert.severity} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={alert.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Timestamp timestamp={alert.timestamp} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No anomalies found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Anomaly distribution chart */}
          <Card title="Anomaly Distribution">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} anomalies`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Selected anomaly details */}
          {selectedAnomaly && (
            <Card title="Anomaly Details">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Alert ID</p>
                    <p className="text-base font-medium">{selectedAnomaly.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Site ID</p>
                    <p className="text-base font-medium">{selectedAnomaly.siteId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Component ID</p>
                    <p className="text-base font-medium">{selectedAnomaly.componentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Detected</p>
                    <p className="text-base font-medium">{selectedAnomaly.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-base font-medium">{selectedAnomaly.anomalyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Severity</p>
                    <div className="flex items-center space-x-1">
                      <SeverityBadge severity={selectedAnomaly.severity} />
                      <span className="text-base font-medium">
                        {selectedAnomaly.severity === 5 ? '(Critical)' :
                         selectedAnomaly.severity === 4 ? '(High)' :
                         selectedAnomaly.severity === 3 ? '(Medium)' :
                         selectedAnomaly.severity === 2 ? '(Low)' : '(Info)'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Recommended Action</p>
                  <p className="text-base">
                    {selectedAnomaly.anomalyType === 'Physical Damage' && 
                      'Inspect panel for visible damage and assess repair or replacement options.'}
                    {selectedAnomaly.anomalyType === 'Hot Spot' && 
                      'Clean panel surface and check for cell damage. Monitor temperature over time.'}
                    {selectedAnomaly.anomalyType === 'Inverter Efficiency Drop' && 
                      'Run inverter diagnostics and check for firmware updates. Inspect cooling system.'}
                    {selectedAnomaly.anomalyType === 'Connection Issue' && 
                      'Check all cable connections and junction boxes. Test for loose connections.'}
                    {selectedAnomaly.anomalyType === 'String Underperformance' && 
                      'Inspect all panels in the string. Check string wiring and connections.'}
                    {selectedAnomaly.anomalyType === 'Potential Shading' && 
                      'Assess surrounding environment for sources of shading. Consider panel relocation.'}
                    {selectedAnomaly.anomalyType === 'Microfractures' && 
                      'Monitor panel performance over time. Schedule inspection during next maintenance.'}
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    onClick={() => handleStatusChange(selectedAnomaly.id, 'Resolved')}
                    disabled={selectedAnomaly.status === 'Resolved'}
                    variant={selectedAnomaly.status === 'Resolved' ? 'outline' : 'primary'}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedAnomaly.id, 'Ignored')}
                    disabled={selectedAnomaly.status === 'Ignored'}
                    variant={selectedAnomaly.status === 'Ignored' ? 'outline' : 'secondary'}
                  >
                    Ignore
                  </Button>
                  <Button
                    href={`/tasks/create?alertId=${selectedAnomaly.id}`}
                    variant="outline"
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}