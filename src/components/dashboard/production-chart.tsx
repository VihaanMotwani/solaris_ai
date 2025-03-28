'use client'

import React from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

// Mock data for the chart
const generateMockData = (value: number) => {
  // Generate some data that looks like solar production over days
  // with the average trend related to the value parameter
  const baseValue = 50
  const days = 14
  const data = []

  for (let i = 1; i <= days; i++) {
    // Create a curve that peaks in the middle of the day
    const dayFactor = Math.sin((i / days) * Math.PI)
    
    // Add a slight trend based on the value (positive or negative)
    const trend = value * 20 * (i / days)
    
    // Add some random noise
    const noise = Math.random() * 10 - 5
    
    const forecast = baseValue + dayFactor * 20
    const actual = forecast + trend + noise
    
    data.push({
      day: `Day ${i}`,
      forecast,
      actual,
    })
  }

  return data
}

interface ProductionChartProps {
  value: number
}

export function ProductionChart({ value }: ProductionChartProps) {
  const data = generateMockData(value)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)} kWh`, undefined]}
          labelFormatter={(label) => `${label}`}
        />
        <ReferenceLine
          y={0}
          stroke="#000"
          strokeDasharray="3 3"
        />
        <Area 
          type="monotone" 
          dataKey="forecast" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.2}
          name="Forecast"
        />
        <Area 
          type="monotone" 
          dataKey="actual" 
          stroke="#30a46c" 
          fill="#30a46c" 
          fillOpacity={0.5}
          name="Actual"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
} 