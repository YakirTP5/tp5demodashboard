import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Scale,
  ScaleOptionsByType,
  CartesianScaleTypeRegistry,
} from 'chart.js';
import metricsData from '../data/metrics.json';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

function getDefaultTimeRange(): number {
  return 30; // Default to 30 days if no filter is selected
}

function getDaysFromRange(range: string | undefined): number {
  if (!range) return getDefaultTimeRange();
  const days = range.split(' ')[1];
  return parseInt(days);
}

function TrendChart({ metric, data, timeRange }: TrendChartProps) {
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

  const options: ChartOptions<'line'> = {
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
    <div className="w-full h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TrendChart;