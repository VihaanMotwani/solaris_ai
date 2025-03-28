// src/app/(dashboard)/tasks/page.tsx
'use client';

import React, { useState } from 'react';

// Define the task interface
interface Task {
  id: string;
  siteId: string;
  componentId: string;
  description: string;
  priority: number;
  status: 'Pending' | 'In Progress' | 'Completed';
}

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: 'TSK-001',
    siteId: 'SITE-002',
    componentId: 'PANEL-E11',
    description: 'Inspect and replace damaged panel',
    priority: 5,
    status: 'Pending',
  },
  {
    id: 'TSK-002',
    siteId: 'SITE-001',
    componentId: 'PANEL-A23',
    description: 'Investigate hot spot and clean panel',
    priority: 4,
    status: 'Pending',
  },
  {
    id: 'TSK-003',
    siteId: 'SITE-002',
    componentId: 'INV-B12',
    description: 'Service inverter',
    priority: 3,
    status: 'Pending',
  },
  {
    id: 'TSK-004',
    siteId: 'SITE-004',
    componentId: 'STRING-F2',
    description: 'Check and secure connections',
    priority: 3,
    status: 'Pending',
  },
  {
    id: 'TSK-005',
    siteId: 'SITE-001',
    componentId: 'STRING-C4',
    description: 'Troubleshoot string performance',
    priority: 2,
    status: 'Pending',
  },
  {
    id: 'TSK-006',
    siteId: 'SITE-003',
    componentId: 'PANEL-D45',
    description: 'Assess and mitigate shading',
    priority: 2,
    status: 'Pending',
  },
  {
    id: 'TSK-007',
    siteId: 'SITE-001',
    componentId: 'PANEL-G17',
    description: 'Monitor for microfracture progression',
    priority: 1,
    status: 'Pending',
  },
];

// Priority badge component
function PriorityBadge({ priority }: { priority: number }) {
  let bgColor = 'bg-gray-500';
  let textColor = 'text-white';
  
  if (priority >= 5) {
    bgColor = 'bg-red-500';
  } else if (priority >= 3) {
    bgColor = 'bg-green-500';
  } else if (priority >= 1) {
    bgColor = 'bg-gray-500';
  }
  
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bgColor} ${textColor} text-sm font-medium`}>
      {priority}
    </span>
  );
}

// Status badge component
function StatusBadge({ status }: { status: 'Pending' | 'In Progress' | 'Completed' }) {
  let icon;
  
  if (status === 'Pending') {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (status === 'In Progress') {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  } else {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  
  return (
    <div className="inline-flex items-center">
      {icon}
      <span className="ml-1 text-sm text-gray-500">{status}</span>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  
  // Get current tasks for pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Tasks</h1>
          <p className="text-gray-500">Prioritized maintenance suggestions for your solar portfolio.</p>
        </div>
        
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {tasks.length} Pending Tasks
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Description
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
              {currentTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.siteId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.componentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {tasks.length > tasksPerPage && (
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
                disabled={currentPage * tasksPerPage >= tasks.length}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage * tasksPerPage >= tasks.length
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