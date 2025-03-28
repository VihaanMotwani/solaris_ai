// src/app/(dashboard)/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Mock report templates
const mockReportTemplates = [
  {
    id: 'REPORT-001',
    name: 'Monthly Production Summary',
    description: 'Summary of energy production across all sites with key metrics',
    category: 'Performance',
    lastGenerated: '2025-03-15',
    frequency: 'Monthly',
  },
  {
    id: 'REPORT-002',
    name: 'Maintenance Cost Analysis',
    description: 'Breakdown of maintenance costs by site and component type',
    category: 'Financial',
    lastGenerated: '2025-03-01',
    frequency: 'Monthly',
  },
  {
    id: 'REPORT-003',
    name: 'Anomaly Detection Summary',
    description: 'Summary of detected anomalies across all sites',
    category: 'Maintenance',
    lastGenerated: '2025-03-28',
    frequency: 'Weekly',
  },
  {
    id: 'REPORT-004',
    name: 'Performance Optimization Impact',
    description: 'Analysis of impact from implemented optimization recommendations',
    category: 'Performance',
    lastGenerated: '2025-02-15',
    frequency: 'Quarterly',
  },
  {
    id: 'REPORT-005',
    name: 'Weather Impact Analysis',
    description: 'Analysis of weather patterns and their impact on energy production',
    category: 'Performance',
    lastGenerated: '2025-01-30',
    frequency: 'Quarterly',
  },
  {
    id: 'REPORT-006',
    name: 'Panel Efficiency Degradation',
    description: 'Tracking of panel efficiency over time to identify degradation',
    category: 'Maintenance',
    lastGenerated: '2025-03-20',
    frequency: 'Quarterly',
  },
];

// Mock monthly production data
const mockMonthlyProduction = [
  { month: 'Jan 2024', energy: 156000, target: 150000 },
  { month: 'Feb 2024', energy: 168000, target: 160000 },
  { month: 'Mar 2024', energy: 185000, target: 180000 },
  { month: 'Apr 2024', energy: 192000, target: 195000 },
  { month: 'May 2024', energy: 210000, target: 205000 },
  { month: 'Jun 2024', energy: 225000, target: 215000 },
  { month: 'Jul 2024', energy: 230000, target: 220000 },
  { month: 'Aug 2024', energy: 228000, target: 218000 },
  { month: 'Sep 2024', energy: 200000, target: 195000 },
  { month: 'Oct 2024', energy: 175000, target: 170000 },
  { month: 'Nov 2024', energy: 160000, target: 155000 },
  { month: 'Dec 2024', energy: 150000, target: 145000 },
  { month: 'Jan 2025', energy: 162000, target: 155000 },
  { month: 'Feb 2025', energy: 178000, target: 165000 },
  { month: 'Mar 2025', energy: 190000, target: 185000 },
];

// Mock maintenance cost data
const mockMaintenanceCosts = [
  { month: 'Oct 2024', planned: 2500, unplanned: 1200 },
  { month: 'Nov 2024', planned: 2800, unplanned: 800 },
  { month: 'Dec 2024', planned: 3000, unplanned: 1500 },
  { month: 'Jan 2025', planned: 2600, unplanned: 700 },
  { month: 'Feb 2025', planned: 2400, unplanned: 900 },
  { month: 'Mar 2025', planned: 2700, unplanned: 600 },
];

// Mock anomaly data
const mockAnomalyData = [
  { name: 'Physical Damage', value: 7 },
  { name: 'Hotspots', value: 12 },
  { name: 'Inverter Issues', value: 5 },
  { name: 'Connection Problems', value: 8 },
  { name: 'Shading', value: 6 },
  { name: 'String Underperformance', value: 9 },
];

// Mock site production data
const mockSiteProduction = [
  { name: 'SITE-001', value: 78500, percentage: 30 },
  { name: 'SITE-002', value: 96200, percentage: 37 },
  { name: 'SITE-003', value: 52300, percentage: 20 },
  { name: 'SITE-004', value: 33700, percentage: 13 },
];

// Mock data export options
const exportOptions = [
  { id: 'pdf', name: 'PDF Document', icon: '📄' },
  { id: 'excel', name: 'Excel Spreadsheet', icon: '📊' },
  { id: 'csv', name: 'CSV File', icon: '📝' },
  { id: 'image', name: 'Image (PNG)', icon: '🖼️' },
];

export default function ReportsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('6m');
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Filtered report templates
  const filteredReports = selectedCategory === 'all'
    ? mockReportTemplates
    : mockReportTemplates.filter(template => template.category === selectedCategory);
  
  // Set up mock loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle report generation
  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId);
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // Set mock report data based on report ID
      switch (reportId) {
        case 'REPORT-001':
          setReportData({
            title: 'Monthly Production Summary',
            description: 'Summary of energy production across all sites with key metrics',
            generatedDate: new Date().toLocaleDateString(),
            data: {
              monthlySummary: mockMonthlyProduction,
              siteSummary: mockSiteProduction,
            },
          });
          break;
        case 'REPORT-002':
          setReportData({
            title: 'Maintenance Cost Analysis',
            description: 'Breakdown of maintenance costs by site and component type',
            generatedDate: new Date().toLocaleDateString(),
            data: {
              costSummary: mockMaintenanceCosts,
            },
          });
          break;
        case 'REPORT-003':
          setReportData({
            title: 'Anomaly Detection Summary',
            description: 'Summary of detected anomalies across all sites',
            generatedDate: new Date().toLocaleDateString(),
            data: {
              anomalySummary: mockAnomalyData,
            },
          });
          break;
        default:
          setReportData({
            title: mockReportTemplates.find(r => r.id === reportId)?.name || '',
            description: mockReportTemplates.find(r => r.id === reportId)?.description || '',
            generatedDate: new Date().toLocaleDateString(),
            message: 'Demo report generated',
          });
      }
    }, 2000);
  };
  
  // Handle exporting the report
  const handleExportReport = (format: string) => {
    // In a real app, this would trigger a download
    alert(`Report would be exported as ${format.toUpperCase()} in a real application`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Loading reports & analytics...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Generate insights and reports from your solar data</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              <option value="Performance">Performance</option>
              <option value="Financial">Financial</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setSelectedReport(null)}
            disabled={!selectedReport}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report templates - show when no report is selected */}
        {!selectedReport && (
          <div className="lg:col-span-3">
            <Card title="Report Templates">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.map((template) => (
                  <div 
                    key={template.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => handleGenerateReport(template.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-md font-medium text-gray-900">{template.name}</h3>
                      <Badge variant={
                        template.category === 'Performance' ? 'primary' :
                        template.category === 'Financial' ? 'warning' : 'success'
                      }>
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{template.description}</p>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>Last generated: {template.lastGenerated}</span>
                      <span>Frequency: {template.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Analytics dashboard - show when no report is selected */}
            <div className="mt-6">
              <Card title="Analytics Dashboard">
                <div className="flex justify-end mb-4">
                  <div>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="3m">Last 3 Months</option>
                      <option value="6m">Last 6 Months</option>
                      <option value="1y">Last Year</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Energy Production Chart */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Energy Production Trends</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockMonthlyProduction.slice(-6)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value.toLocaleString()} kWh`, '']}
                          />
                          <Legend />
                          <Line 
                            name="Energy Production" 
                            type="monotone" 
                            dataKey="energy" 
                            stroke="#16A34A" 
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            name="Target" 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#94A3B8" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Maintenance Costs Chart */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Maintenance Costs</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={mockMaintenanceCosts}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, '']}
                          />
                          <Legend />
                          <Bar 
                            name="Planned Maintenance" 
                            dataKey="planned" 
                            fill="#3B82F6" 
                            stackId="a"
                          />
                          <Bar 
                            name="Unplanned Maintenance" 
                            dataKey="unplanned" 
                            fill="#EF4444" 
                            stackId="a"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Anomaly Distribution Chart */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Anomaly Distribution</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockAnomalyData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockAnomalyData.map((entry, index) => {
                              const COLORS = ['#16A34A', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];
                              return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                            })}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} incidents`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Site Production Distribution */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Site Production Distribution</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockSiteProduction}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockSiteProduction.map((entry, index) => {
                              const COLORS = ['#16A34A', '#3B82F6', '#F59E0B', '#8B5CF6'];
                              return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                            })}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value.toLocaleString()} kWh`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {/* Generated report - show when a report is selected */}
        {selectedReport && (
          <div className="lg:col-span-3">
            {isGenerating ? (
              <Card>
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="lg" />
                  <p className="mt-4 text-gray-600">Generating report...</p>
                </div>
              </Card>
            ) : reportData ? (
              <div className="space-y-6">
                {/* Report header */}
                <Card>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{reportData.title}</h2>
                      <p className="text-gray-500 mt-1">{reportData.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Generated on: {reportData.generatedDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative inline-block text-left">
                        <div>
                          <Button variant="outline">
                            Export Report
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Button>
                        </div>
                        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {exportOptions.map(option => (
                              <button
                                key={option.id}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleExportReport(option.id)}
                              >
                                <span className="mr-2">{option.icon}</span>
                                {option.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedReport(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card>
                
                {/* Report content based on report type */}
                {reportData.data?.monthlySummary && (
                  <Card title="Monthly Production Summary">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={reportData.data.monthlySummary}
                          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#16A34A" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value.toLocaleString()} kWh`, '']}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="energy" 
                            name="Energy Production"
                            stroke="#16A34A" 
                            fillOpacity={1} 
                            fill="url(#colorEnergy)" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            name="Target"
                            stroke="#94A3B8" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Production by Site</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Site ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Energy Production (kWh)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage of Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.data.siteSummary.map((site: any) => (
                              <tr key={site.name}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {site.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {site.value.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {site.percentage}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                )}
                
                {reportData.data?.costSummary && (
                  <Card title="Maintenance Cost Analysis">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={reportData.data.costSummary}
                          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, '']}
                          />
                          <Legend />
                          <Bar 
                            name="Planned Maintenance" 
                            dataKey="planned" 
                            fill="#3B82F6" 
                            stackId="a"
                          />
                          <Bar 
                            name="Unplanned Maintenance" 
                            dataKey="unplanned" 
                            fill="#EF4444" 
                            stackId="a"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Cost Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Planned Costs:</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${reportData.data.costSummary.reduce((sum: number, item: any) => sum + item.planned, 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Unplanned Costs:</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${reportData.data.costSummary.reduce((sum: number, item: any) => sum + item.unplanned, 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Total Maintenance Costs:</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${reportData.data.costSummary.reduce((sum: number, item: any) => sum + item.planned + item.unplanned, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Cost Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Avg. Monthly Maintenance:</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${Math.round(reportData.data.costSummary.reduce((sum: number, item: any) => sum + item.planned + item.unplanned, 0) / reportData.data.costSummary.length).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Planned vs. Unplanned Ratio:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(reportData.data.costSummary.reduce((sum: number, item: any) => sum + item.planned, 0) / 
                              (reportData.data.costSummary.reduce((sum: number, item: any) => sum + item.unplanned, 0) || 1) * 10) / 10}:1
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Month with Highest Costs:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {reportData.data.costSummary.reduce((highest: any, item: any) => 
                                (item.planned + item.unplanned) > (highest.planned + highest.unplanned) ? item : highest
                              ).month}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {reportData.data?.anomalySummary && (
                  <Card title="Anomaly Detection Summary">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-4">Anomaly Distribution</h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={reportData.data.anomalySummary}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {reportData.data.anomalySummary.map((entry: any, index: number) => {
                                  const COLORS = ['#16A34A', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];
                                  return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                })}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} incidents`, '']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-4">Anomaly Insights</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Total Anomalies</p>
                              <p className="text-2xl font-bold text-primary-600">
                                {reportData.data.anomalySummary.reduce((sum: number, item: any) => sum + item.value, 0)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-900">Most Common Issue</p>
                              <p className="text-md font-medium text-gray-700">
                                {reportData.data.anomalySummary.reduce((highest: any, item: any) => 
                                  item.value > (highest?.value || 0) ? item : highest
                                , {}).name}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div className="bg-primary-600 h-2.5 rounded-full" style={{ 
                                  width: `${Math.round(reportData.data.anomalySummary.reduce((highest: any, item: any) => 
                                    item.value > (highest?.value || 0) ? item : highest
                                  , {}).value / reportData.data.anomalySummary.reduce((sum: number, item: any) => sum + item.value, 0) * 100)}%` 
                                }}></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Critical Issues</p>
                                <p className="text-xl font-medium text-red-600">
                                  {Math.round(reportData.data.anomalySummary.reduce((sum: number, item: any) => sum + item.value, 0) * 0.25)}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-900">Resolved</p>
                                <p className="text-xl font-medium text-green-600">
                                  {Math.round(reportData.data.anomalySummary.reduce((sum: number, item: any) => sum + item.value, 0) * 0.65)}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-900">Estimated Impact</p>
                              <p className="text-sm text-gray-700">
                                Approximately <span className="font-medium">{Math.round(reportData.data.anomalySummary.reduce((sum: number, item: any) => sum + item.value, 0) * 0.8)} kWh</span> of production loss due to detected anomalies.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-primary-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Schedule panel cleaning for sites with high dust accumulation.</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-primary-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Perform infrared scanning on SITE-001 to identify additional hotspots.</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-primary-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Update inverter firmware to address efficiency issues.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* General report case */}
                {reportData.message && (
                  <Card>
                    <div className="flex flex-col items-center justify-center py-6">
                      <svg className="h-16 w-16 text-primary-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-600">{reportData.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        This report type is available in the demo but detailed content is not implemented.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">Error generating report</p>
                  <p className="text-sm text-gray-500 mt-2">Please try again later</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}