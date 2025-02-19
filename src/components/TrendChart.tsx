import React, { useMemo, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Scale,
  ScaleOptionsByType,
  CartesianScaleTypeRegistry,
} from 'chart.js';
import { BarChart2, LineChart as LineChartIcon, Calendar } from 'lucide-react';
import metricsData from '../data/metrics.json';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Import shared types
type MetricId = 'total_tickets' | 'cost_per_ticket' | 'ai_resolution_rate' | 'ai_cost_savings' | 'automation_rate' | 'process_compliance';

interface MetricData {
  value: number;
  trend: number;
  trend_direction: 'up' | 'down';
}

interface HistoricalMetricData {
  baseline: number;
  variance: number;
  min: number;
  max: number;
}

interface MetricsState {
  metrics: {
    current: Record<MetricId, MetricData>;
    historical: Record<MetricId, HistoricalMetricData>;
  };
}

// Type assertion for metrics data
const typedMetricsData = metricsData as MetricsState;

interface Task {
  id: string;
  taskId: string;
  name: string;
  totalTimeSpent: number;
  opsCost: number;
  automationScore: number;
  blunderTime: number;
  blunderCost: number;
}

interface Workflow {
  id: string;
  workflowId: string;
  taskId: string;
  name: string;
  timeSpent: number;
  cost: number;
  status: string;
  lastUpdated: string;
}

interface Session {
  id: string;
  sessionId: string;
  workflowId: string;
  agent: string;
  timeSpent: number;
  cost: number;
  aiAssistanceUsed: boolean;
  toolsUsed: string[];
}

interface FilteredData {
  tasks: Task[];
  workflows: Workflow[];
  sessions: Session[];
}

interface TrendChartProps {
  metric: MetricId;
  data: {
    tasks: any[];
    workflows: any[];
    sessions: any[];
  };
  timeRange: string;
}

type ComparisonPeriod = 'year' | 'month' | 'week';

function getDefaultTimeRange(): number {
  return 30; // Default to 30 days if no filter is selected
}

function getDaysFromRange(range: string | undefined): number {
  if (!range) return getDefaultTimeRange();
  const days = range.split(' ')[1];
  return parseInt(days);
}

function TrendChart({ metric, data, timeRange }: TrendChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('month');
  const selectedDays = getDaysFromRange(timeRange);
  const daysRatio = selectedDays / getDefaultTimeRange();

  // Generate dates for x-axis based on time range
  const getDates = () => {
    const days = parseInt(timeRange.split(' ')[1]) || 30;
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return dates;
  };

  // Generate trend data based on metric type
  const getTrendData = () => {
    const dates = getDates();
    const baseValue = getBaseValue(metric);
    const variance = getVariance(metric);
    
    return dates.map(() => baseValue + (Math.random() - 0.5) * variance);
  };

  const getBaseValue = (metricId: MetricId): number => {
    const baseValues: Record<MetricId, number> = {
      total_tickets: 2450,
      cost_per_ticket: 85,
      ai_resolution_rate: 45,
      ai_cost_savings: 15500,
      automation_rate: 67,
      process_compliance: 92
    };
    return baseValues[metricId];
  };

  const getVariance = (metricId: MetricId): number => {
    const variances: Record<MetricId, number> = {
      total_tickets: 200,
      cost_per_ticket: 15,
      ai_resolution_rate: 8,
      ai_cost_savings: 2000,
      automation_rate: 8,
      process_compliance: 3
    };
    return variances[metricId];
  };

  const chartData = {
    labels: getDates(),
    datasets: [
      {
        label: metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        data: getTrendData(),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 2,
      },
    },
  };

  return <Line options={options} data={chartData} />;
}

export default TrendChart;