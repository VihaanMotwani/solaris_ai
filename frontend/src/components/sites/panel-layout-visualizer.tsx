// src/components/sites/panel-layout-visualizer.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

// Interface for panel data
interface Panel {
  id: string;
  health: number;
  hasIssue: boolean;
  type: 'normal' | 'premium';
}

interface PanelLayoutVisualizerProps {
  panels: Panel[];
  onPanelClick?: (panel: Panel) => void;
}

export function PanelLayoutVisualizer({ panels, onPanelClick }: PanelLayoutVisualizerProps) {
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  
  // Function to determine panel color based on health
  const getHealthColor = (health: number) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 70) return 'bg-green-300';
    if (health >= 50) return 'bg-yellow-400';
    if (health >= 30) return 'bg-orange-400';
    return 'bg-red-500';
  };
  
  // Handle panel click
  const handlePanelClick = (panel: Panel) => {
    setSelectedPanel(panel);
    if (onPanelClick) {
      onPanelClick(panel);
    }
  };
  
  return (
    <Card title="Panel Layout" description="Interactive visualization of solar panel array">
      <div className="space-y-6">
        <div className="grid grid-cols-10 gap-2">
          {panels.map((panel) => (
            <div
              key={panel.id}
              className={`aspect-square rounded-md ${getHealthColor(panel.health)} flex items-center justify-center cursor-pointer ${
                panel.hasIssue ? 'animate-pulse border-2 border-red-600' : ''
              } ${selectedPanel?.id === panel.id ? 'ring-4 ring-blue-500' : ''}`}
              title={`Panel ${panel.id}: ${Math.round(panel.health)}% health`}
              onClick={() => handlePanelClick(panel)}
            >
              <span className="text-xs text-white font-medium">
                {panel.id.split('-')[1]}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
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
        
        {selectedPanel && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Panel {selectedPanel.id}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Health</p>
                <p className="text-lg font-medium text-gray-900">{Math.round(selectedPanel.health)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="text-lg font-medium text-gray-900 capitalize">{selectedPanel.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-lg font-medium ${selectedPanel.hasIssue ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedPanel.hasIssue ? 'Issue Detected' : 'Normal'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Efficiency</p>
                <p className="text-lg font-medium text-gray-900">
                  {selectedPanel.type === 'premium' ? '22.4%' : '18.7%'}
                </p>
              </div>
            </div>
            {selectedPanel.hasIssue && (
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Maintenance Task
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}