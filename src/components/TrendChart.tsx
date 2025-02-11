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
type MetricId = 'ops_hours' | 'analysis_time' | 'ops_cost' | 'blunder_time' | 'automation' | 'high_severity';

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
    tasks: {
      automationScore: number;
      automation_breakdown: {
        manual_steps: number;
        automated_steps: number;
        potential_automation: number;
        ai_assisted_steps: number;
      };
    }[];
    workflows: {
      automation_metrics?: {
        automation_score: number;
        manual_steps: number;
        automated_steps: number;
        ai_assisted_steps: number;
      };
    }[];
    sessions: {
      automation_metrics: {
        automation_score: number;
        manual_steps: number;
        automated_steps: number;
        ai_assisted_steps: number;
      };
    }[];
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

  // Generate chart data based on mock historical data
  const chartData = useMemo(() => {
    // Get the metric data
    const currentMetric = typedMetricsData.metrics.current[metric];
    const historicalMetric = typedMetricsData.metrics.historical[metric];

    if (!currentMetric || !historicalMetric) {
      console.error('Missing metric data for:', metric);
      return {
        labels: [],
        datasets: []
      };
    }

    // Generate dates for the last 14 days
    const dataPoints = 14;
    const labels = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (dataPoints - 1 - i));
      return date.toLocaleDateString();
    });

    // Calculate the trend
    const trendMultiplier = currentMetric.trend_direction === 'up' ? 1 : -1;
    const trendPercentage = currentMetric.trend / 100;

    // Generate the data points
    const baseValue = currentMetric.value;
    const actualData = labels.map((_, index) => {
      // Calculate position in the trend (0 to 1)
      const position = index / (labels.length - 1);
      
      // Apply trend effect
      const trendEffect = baseValue * trendPercentage * trendMultiplier * position;
      
      // Calculate the value with trend
      let value = baseValue + trendEffect;
      
      // Scale based on selected time range
      value = value * (selectedDays / 30);
      
      // Add some random variation
      const variation = (Math.random() - 0.5) * (historicalMetric.variance * 0.1);
      value = value + variation;

      // Ensure the value stays within reasonable bounds
      const minValue = historicalMetric.min * (selectedDays / 30);
      const maxValue = historicalMetric.max * (selectedDays / 30);
      return Math.max(minValue, Math.min(maxValue, value));
    });

    // Generate baseline data
    const baselineData = labels.map(() => baseValue * (selectedDays / 30));

    return {
      labels,
      datasets: [
        {
          label: 'Actual',
          data: actualData,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Baseline',
          data: baselineData,
          borderColor: 'rgb(156, 163, 175)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [metric, selectedDays]);

  // Generate comparison bar chart data
  const barChartData = useMemo(() => {
    const currentMetric = typedMetricsData.metrics.current[metric];
    const historicalMetric = typedMetricsData.metrics.historical[metric];

    if (!currentMetric || !historicalMetric) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Generate comparison data based on selected period
    const periods = {
      year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };

    const labels = periods[comparisonPeriod];
    const baseValue = currentMetric.value * (selectedDays / 30);
    const previousValue = historicalMetric.baseline * (selectedDays / 30);

    // Generate current period data
    const currentData = labels.map(() => {
      const variation = (Math.random() - 0.5) * (historicalMetric.variance * 0.1);
      return baseValue + variation;
    });

    // Generate previous period data
    const previousData = labels.map(() => {
      const variation = (Math.random() - 0.5) * (historicalMetric.variance * 0.1);
      return previousValue + variation;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Current Period',
          data: currentData,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
        },
        {
          label: `Previous ${comparisonPeriod.charAt(0).toUpperCase() + comparisonPeriod.slice(1)}`,
          data: previousData,
          backgroundColor: 'rgba(156, 163, 175, 0.5)',
          borderColor: 'rgb(156, 163, 175)',
          borderWidth: 1,
        },
      ],
    };
  }, [metric, selectedDays, comparisonPeriod]);

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let value = context.raw as number;
            if (typeof value !== 'number' || isNaN(value)) {
              return 'N/A';
            }
            switch (metric) {
              case 'ops_hours':
              case 'blunder_time':
                return `${value.toFixed(1)}h`;
              case 'analysis_time':
                return `${value.toFixed(0)}m`;
              case 'ops_cost':
                return `$${value.toFixed(0)}`;
              case 'automation':
              case 'high_severity':
                return `${value.toFixed(1)}%`;
              default:
                return value.toFixed(1);
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            const numValue = Number(value);
            if (isNaN(numValue)) {
              return 'N/A';
            }
            switch (metric) {
              case 'ops_hours':
              case 'blunder_time':
                return `${numValue.toFixed(1)}h`;
              case 'analysis_time':
                return `${numValue.toFixed(0)}m`;
              case 'ops_cost':
                return `$${numValue.toFixed(0)}`;
              case 'automation':
              case 'high_severity':
                return `${numValue.toFixed(1)}%`;
              default:
                return numValue.toFixed(1);
            }
          }
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-md transition-colors ${
              chartType === 'line' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            title="Line Chart"
          >
            <LineChartIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-md transition-colors ${
              chartType === 'bar' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            title="Bar Chart"
          >
            <BarChart2 className="h-4 w-4" />
          </button>
        </div>
        {chartType === 'bar' && (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value as ComparisonPeriod)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="week">Week over Week</option>
              <option value="month">Month over Month</option>
              <option value="year">Year over Year</option>
            </select>
          </div>
        )}
      </div>
      <div className="h-[300px]">
        {chartType === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={barChartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default TrendChart;