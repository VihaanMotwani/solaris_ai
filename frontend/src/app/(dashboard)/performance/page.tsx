// src/app/(dashboard)/performance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock optimization recommendations
const mockOptimizations = [
  {
    id: 'OPT-001',
    siteId: 'SITE-001',
    type: 'Cleaning Schedule',
    description: 'Adjust cleaning schedule from monthly to bi-weekly due to high dust accumulation',
    potentialGain: 3.2,
    implementationCost: 'Low',
    paybackPeriod: '2 months',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'OPT-002',
    siteId: 'SITE-002',
    type: 'Inverter Settings',
    description: 'Optimize inverter power factor settings for improved grid integration',
    potentialGain: 1.5,
    implementationCost: 'Low',
    paybackPeriod: '3 months',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 'OPT-003',
    siteId: 'SITE-003',
    type: 'Panel Tilt Adjustment',
    description: 'Adjust panel tilt angle by 5 degrees to optimize for seasonal sun position',
    potentialGain: 2.8,
    implementationCost: 'Medium',
    paybackPeriod: '4 months',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'OPT-004',
    siteId: 'SITE-001',
    type: 'String Reconfiguration',
    description: 'Reconfigure panel strings to reduce shading impact',
    potentialGain: 4.5,
    implementationCost: 'High',
    paybackPeriod: '8 months',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 'OPT-005',
    siteId: 'SITE-004',
    type: 'MPP Tracking Optimization',
    description: 'Update firmware to improve maximum power point tracking algorithm',
    potentialGain: 2.1,
    implementationCost: 'Low',
    paybackPeriod: '3 months',
    status: 'Implemented',
    priority: 'High',
  },
  {
    id: 'OPT-006',
    siteId: 'SITE-002',
    type: 'Vegetation Management',
    description: 'Implement regular vegetation trimming to prevent future shading issues',
    potentialGain: 1.3,
    implementationCost: 'Low',
    paybackPeriod: '4 months',
    status: 'Pending',
    priority: 'Low',
  },
];

// Mock forecast data for site production
const mockProductionForecast = [
  { month: 'Jan', baseline: 42000, optimized: 43890 },
  { month: 'Feb', baseline: 48000, optimized: 50400 },
  { month: 'Mar', baseline: 56000, optimized: 59360 },
  { month: 'Apr', baseline: 62000, optimized: 65720 },
  { month: 'May', baseline: 68000, optimized: 72420 },
  { month: 'Jun', baseline: 72000, optimized: 76680 },
  { month: 'Jul', baseline: 74000, optimized: 78810 },
  { month: 'Aug', baseline: 70000, optimized: 74550 },
  { month: 'Sep', baseline: 64000, optimized: 67840 },
  { month: 'Oct', baseline: 54000, optimized: 56970 },
  { month: 'Nov', baseline: 46000, optimized: 48530 },
  { month: 'Dec', baseline: 40000, optimized: 42000 },
];

// Mock cleaning schedule data
const mockCleaningSchedule = [
  { week: 'Week 1', site: 'SITE-001', status: 'Completed' },
  { week: 'Week 2', site: 'SITE-002', status: 'Scheduled' },
  { week: 'Week 3', site: 'SITE-003', status: 'Scheduled' },
  { week: 'Week 4', site: 'SITE-004', status: 'Scheduled' },
  { week: 'Week 5', site: 'SITE-001', status: 'Scheduled' },
  { week: 'Week 6', site: 'SITE-002', status: 'Scheduled' },
];

// Mock benchmark data
const mockBenchmarks = [
  {
    siteId: 'SITE-001',
    efficiency: 84.3,
    industryAvg: 82.1,
    topPerformer: 86.8,
  },
  {
    siteId: 'SITE-002',
    efficiency: 86.1,
    industryAvg: 82.1,
    topPerformer: 86.8,
  },
  {
    siteId: 'SITE-003',
    efficiency: 81.5,
    industryAvg: 82.1,
    topPerformer: 86.8,
  },
  {
    siteId: 'SITE-004',
    efficiency: 83.7,
    industryAvg: 82.1,
    topPerformer: 86.8,
  },
];

// Priority badge component
function PriorityBadge({ priority }: { priority: string }) {
  let variant = 'default';
  
  if (priority === 'High') {
    variant = 'danger';
  } else if (priority === 'Medium') {
    variant = 'warning';
  } else if (priority === 'Low') {
    variant = 'primary';
  }
  
  return <Badge variant={variant as any}>{priority}</Badge>;
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let variant = 'default';
  
  if (status === 'Implemented') {
    variant = 'success';
  } else if (status === 'Pending') {
    variant = 'warning';
  } else if (status === 'Rejected') {
    variant = 'danger';
  }
  
  return <Badge variant={variant as any}>{status}</Badge>;
}

// Cost badge component
function CostBadge({ cost }: { cost: string }) {
  let variant = 'default';
  
  if (cost === 'Low') {
    variant = 'success';
  } else if (cost === 'Medium') {
    variant = 'warning';
  } else if (cost === 'High') {
    variant = 'danger';
  }
  
  return <Badge variant={variant as any}>{cost}</Badge>;
}

export default function PerformanceOptimizationPage() {
  const [selectedOptimization, setSelectedOptimization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState('all');
  const [implementedOptimizations, setImplementedOptimizations] = useState<string[]>([]);
  const [showOptimizationDetails, setShowOptimizationDetails] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Filter optimizations based on selected site
  const filteredOptimizations = selectedSite === 'all'
    ? mockOptimizations
    : mockOptimizations.filter(opt => opt.siteId === selectedSite);
  
  // Get unique sites for filter (using Array methods instead of Set)
  const sites = Array.from(new Set(mockOptimizations.map(opt => opt.siteId)));
  
  // Calculate total potential gain
  const totalPotentialGain = filteredOptimizations
    .filter(opt => opt.status === 'Pending')
    .reduce((sum, opt) => sum + opt.potentialGain, 0);
  
  // Calculate implemented gain
  const implementedGain = filteredOptimizations
    .filter(opt => opt.status === 'Implemented' || implementedOptimizations.includes(opt.id))
    .reduce((sum, opt) => sum + opt.potentialGain, 0);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle optimization row click
  const handleRowClick = (optimization: any) => {
    setSelectedOptimization(optimization);
    setShowOptimizationDetails(true);
  };
  
  // Handle implementation
  const handleImplementation = (optimizationId: string) => {
    setImplementedOptimizations([...implementedOptimizations, optimizationId]);
    if (selectedOptimization?.id === optimizationId) {
      setSelectedOptimization({
        ...selectedOptimization,
        status: 'Implemented',
      });
    }
  };

  const handleSelection = (items: string[]) => {
    const newSelection = new Set(items);
    setSelectedItems(newSelection);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Loading optimization recommendations...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Optimization Center</h1>
          <p className="text-gray-500">AI-powered recommendations to maximize energy output</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="siteFilter" className="text-sm font-medium text-gray-700">
            Site:
          </label>
          <select
            id="siteFilter"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">All Sites</option>
            {sites.map((site) => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI cards */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Potential Gain</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-primary-600">
                {totalPotentialGain.toFixed(1)}%
              </p>
              <p className="ml-2 text-sm text-gray-500">
                increase in energy production
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Implemented Gain</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-green-600">
                {implementedGain.toFixed(1)}%
              </p>
              <p className="ml-2 text-sm text-gray-500">
                efficiency improvement
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-800">
                {filteredOptimizations.filter(opt => opt.status === 'Pending').length}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                pending optimizations
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${showOptimizationDetails ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {/* Production forecast chart */}
          <Card title="Production Forecast" className="mb-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockProductionForecast}
                  margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `${value / 1000}k`}
                    label={{ value: 'kWh', angle: -90, position: 'insideLeft', offset: -20 }} 
                  />
                  <Tooltip formatter={(value) => [`${value} kWh`, '']} />
                  <Legend />
                  <Bar 
                    name="Baseline Production" 
                    dataKey="baseline" 
                    fill="#94a3b8" 
                    animationDuration={1500} 
                  />
                  <Bar 
                    name="Optimized Production" 
                    dataKey="optimized" 
                    fill="#16A34A" 
                    animationDuration={1500} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Optimization recommendations */}
          <Card title="Optimization Recommendations">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gain
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOptimizations.length > 0 ? (
                    filteredOptimizations.map((optimization) => (
                      <tr 
                        key={optimization.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedOptimization?.id === optimization.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleRowClick(optimization)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {optimization.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {optimization.siteId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {optimization.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          +{optimization.potentialGain}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CostBadge cost={optimization.implementationCost} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PriorityBadge priority={optimization.priority} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={
                            implementedOptimizations.includes(optimization.id) 
                              ? 'Implemented' 
                              : optimization.status
                          } />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No optimization recommendations found for this site.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Optimization details sidebar */}
        {showOptimizationDetails && selectedOptimization && (
          <div>
            <Card title="Optimization Details" 
              className="sticky top-4"
              footer={
                <div className="flex space-x-3">
                  {(selectedOptimization.status !== 'Implemented' && 
                   !implementedOptimizations.includes(selectedOptimization.id)) ? (
                    <>
                      <Button
                        onClick={() => handleImplementation(selectedOptimization.id)}
                        variant="primary"
                      >
                        Implement
                      </Button>
                      <Button variant="outline">
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                    >
                      Already Implemented
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setShowOptimizationDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedOptimization.type}</h3>
                  <p className="text-gray-700 mt-1">{selectedOptimization.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Site ID</p>
                    <p className="text-base font-medium">{selectedOptimization.siteId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Potential Gain</p>
                    <p className="text-base font-medium text-green-600">+{selectedOptimization.potentialGain}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Implementation Cost</p>
                    <CostBadge cost={selectedOptimization.implementationCost} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payback Period</p>
                    <p className="text-base font-medium">{selectedOptimization.paybackPeriod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <PriorityBadge priority={selectedOptimization.priority} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <StatusBadge status={
                      implementedOptimizations.includes(selectedOptimization.id) 
                        ? 'Implemented' 
                        : selectedOptimization.status
                    } />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">ROI Analysis</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Annual Energy Increase</p>
                        <p className="text-sm font-medium">
                          {Math.round(selectedOptimization.potentialGain * 5000 / 100)} kWh
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Annual Revenue Increase</p>
                        <p className="text-sm font-medium">
                          ${Math.round(selectedOptimization.potentialGain * 5000 * 0.12 / 100)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Implementation Cost</p>
                        <p className="text-sm font-medium">
                          ${selectedOptimization.implementationCost === 'Low' ? '200-500' :
                             selectedOptimization.implementationCost === 'Medium' ? '500-1,500' :
                             '1,500-3,000'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ROI</p>
                        <p className="text-sm font-medium">
                          {selectedOptimization.implementationCost === 'Low' ? '80-200%' :
                            selectedOptimization.implementationCost === 'Medium' ? '40-120%' :
                            '20-60%'} per year
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Implementation Notes</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                    {selectedOptimization.type === 'Cleaning Schedule' && (
                      <>
                        <li>Schedule bi-weekly cleaning rotations</li>
                        <li>Use soft-bristle brushes to prevent panel damage</li>
                        <li>Apply filtered water only</li>
                        <li>Document efficiency before and after cleaning</li>
                      </>
                    )}
                    {selectedOptimization.type === 'Inverter Settings' && (
                      <>
                        <li>Update inverter firmware to latest version</li>
                        <li>Adjust power factor to 0.98</li>
                        <li>Optimize MPPT parameters</li>
                        <li>Document settings before changes</li>
                      </>
                    )}
                    {selectedOptimization.type === 'Panel Tilt Adjustment' && (
                      <>
                        <li>Adjust tilt from current 30° to 35°</li>
                        <li>Perform adjustment during morning hours</li>
                        <li>Verify all mounting hardware is secure</li>
                        <li>Update system documentation</li>
                      </>
                    )}
                    {selectedOptimization.type === 'String Reconfiguration' && (
                      <>
                        <li>Disconnect system and follow lockout procedures</li>
                        <li>Reconfigure string connections per diagram</li>
                        <li>Label all wiring clearly</li>
                        <li>Test voltage and current after reconnection</li>
                      </>
                    )}
                    {selectedOptimization.type === 'MPP Tracking Optimization' && (
                      <>
                        <li>Download latest firmware package</li>
                        <li>Schedule update during low production hours</li>
                        <li>Verify communication between devices</li>
                        <li>Document performance before and after</li>
                      </>
                    )}
                    {selectedOptimization.type === 'Vegetation Management' && (
                      <>
                        <li>Identify and mark all vegetation causing shading</li>
                        <li>Remove vegetation at least 10 feet from array boundary</li>
                        <li>Apply environmentally safe growth inhibitor</li>
                        <li>Schedule quarterly maintenance checks</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}