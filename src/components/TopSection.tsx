import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  MessageSquare, 
  Tag, 
  AlertTriangle, 
  Loader2, 
  ChevronDown, 
  Activity,
  ClipboardList,
  AppWindow,
  Hash,
  Search,
  LucideIcon 
} from 'lucide-react';
import TrendChart from './TrendChart';
import { useApp } from '../context/AppContext';
import metricsData from '../data/metrics.json';
import filtersData from '../data/filters.json';

// Add type definitions for metrics data
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

interface AutomationBreakdown {
  manual_steps: number;
  automated_steps: number;
  potential_automation: number;
  ai_assisted_steps: number;
}

interface AutomationMetrics {
  automation_score: number;
  manual_steps: number;
  automated_steps: number;
  ai_assisted_steps: number;
}

interface Task {
  id: string;
  taskId: string;
  name: string;
  totalTimeSpent: number;
  opsCost: number;
  automationScore: number;
  blunderTime: number;
  blunderCost: number;
  tags: string[];
  apps: string[];
  automation_breakdown: AutomationBreakdown;
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
  tags: string[];
  apps: string[];
  automation_metrics: AutomationMetrics;
}

interface Session {
  id: string;
  sessionId: string;
  workflowId: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  tools_used: string[];
  tags: string[];
  automation_metrics: AutomationMetrics;
}

type MetricId = 'ops_hours' | 'analysis_time' | 'ops_cost' | 'blunder_time' | 'automation' | 'high_severity';

interface MetricsState {
  metrics: {
    current: Record<MetricId, MetricData>;
    historical: Record<MetricId, HistoricalMetricData>;
  };
}

// Type assertion for metrics data
const typedMetricsData = metricsData as MetricsState;

// Add types for filters
interface FilterOption {
  name: string;
  icon: string;
  default?: string;
  options: string[];
}

interface DynamicFilterOption {
  name: string;
  icon: string;
  type?: string;
  placeholder?: string;
}

interface FiltersData {
  filters: {
    [key: string]: FilterOption;
  };
  defaults: {
    [key: string]: string;
  };
  dynamic_filters: {
    [key: string]: DynamicFilterOption;
  };
}

interface FilterConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  options: string[];
  default?: string;
}

const typedFiltersData = filtersData as FiltersData;

// Update the icon map with new icons
const iconMap = {
  Calendar,
  MessageSquare,
  Tag,
  AlertTriangle,
  ClipboardList,
  Activity,
  AppWindow,
  Hash,
  Search,
};

// Create static filters from mock data
const staticFilters = Object.entries(typedFiltersData.filters).map(([key, filter]) => ({
  id: key,
  name: filter.name,
  icon: iconMap[filter.icon as keyof typeof iconMap],
  options: filter.options,
  default: filter.default,
}));

interface KPI {
  id: string;
  name: string;
  value: string;
  trend: string;
  positive: boolean;
}

interface FilterState {
  [key: string]: string;
}

// Update KPIs generation with proper typing
const defaultKPIs: KPI[] = Object.entries(typedMetricsData.metrics.current).map(([id, data]) => {
  const metricId = id as MetricId;
  return {
    id: metricId,
    name: metricId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: formatMetricValue(metricId, data.value),
    trend: `${data.trend_direction === 'up' ? '+' : ''}${data.trend}%`,
    positive: (data.trend_direction === 'up') === !['ops_cost', 'blunder_time', 'high_severity'].includes(metricId)
  };
});

function formatMetricValue(metricId: MetricId, value: number): string {
  // Ensure we have a valid number
  if (typeof value !== 'number' || isNaN(value)) {
    return '0'; // Return '0' instead of NaN
  }

  // Round the value to avoid floating point issues
  const roundedValue = Math.round(value);

  switch (metricId) {
    case 'ops_hours':
    case 'blunder_time':
      return `${roundedValue.toFixed(1)}h`;
    case 'analysis_time':
      return `${Math.round(roundedValue)}m`;
    case 'ops_cost':
      // Format as $X.Xk if over 1000, otherwise just $X
      return roundedValue >= 1000 
        ? `$${(roundedValue / 1000).toFixed(1)}k`
        : `$${Math.round(roundedValue)}`;
    case 'automation':
    case 'high_severity':
      return `${Math.round(roundedValue)}%`;
    default:
      return roundedValue.toString();
  }
}

function getDefaultTimeRange(): number {
  return 30; // Default to 30 days if no filter is selected
}

function getDaysFromRange(range: string | undefined): number {
  if (!range) return getDefaultTimeRange();
  const days = range.split(' ')[1];
  return parseInt(days);
}

function TopSection() {
  const { tasks, sessions, workflows, loading, error } = useApp();
  const [selectedKPI, setSelectedKPI] = useState<KPI>(defaultKPIs[0]);
  const [kpis, setKpis] = useState<KPI[]>(defaultKPIs);
  
  // Initialize filter values with defaults from mock data
  const [filterValues, setFilterValues] = useState<FilterState>(() => {
    const defaults: FilterState = {};
    Object.entries(typedFiltersData.defaults).forEach(([key, value]) => {
      const filter = typedFiltersData.filters[key];
      if (filter) {
        defaults[filter.name] = value;
      }
    });
    return defaults;
  });

  // Create dynamic filters with tasks
  const dynamicFilters = useMemo(() => {
    const taskFilter = typedFiltersData.dynamic_filters.task;

    return [
      { 
        id: 'task',
        name: taskFilter.name, 
        icon: iconMap[taskFilter.icon as keyof typeof iconMap],
        options: tasks.map(task => task.name)
      } as FilterConfig,
      ...staticFilters,
    ];
  }, [tasks]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filteredTasks = [...tasks];
    let filteredWorkflows = [...workflows];
    let filteredSessions = [...sessions];

    // Apply task filter
    if (filterValues['Task']) {
      const selectedTask = tasks.find(t => t.name === filterValues['Task']);
      if (selectedTask) {
        filteredTasks = [selectedTask];
        filteredWorkflows = workflows.filter(w => w.taskId === selectedTask.taskId);
        filteredSessions = sessions.filter(s => 
          filteredWorkflows.some(w => w.workflowId === s.workflowId)
        );
      }
    }

    // Apply date filter
    if (filterValues['Last X Days']) {
      const days = getDaysFromRange(filterValues['Last X Days']);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filteredWorkflows = filteredWorkflows.filter(w => 
        new Date(w.lastUpdated) >= cutoffDate
      );
      filteredSessions = filteredSessions.filter(s =>
        filteredWorkflows.some(w => w.workflowId === s.workflowId)
      );
    }

    // Apply apps filter
    if (filterValues['Apps']) {
      const selectedApp = filterValues['Apps'];
      filteredTasks = filteredTasks.filter(t => t.apps.includes(selectedApp));
      filteredWorkflows = filteredWorkflows.filter(w => 
        w.apps.includes(selectedApp) || 
        filteredTasks.some(t => t.taskId === w.taskId)
      );
      filteredSessions = filteredSessions.filter(s => 
        s.tools_used.includes(selectedApp) ||
        filteredWorkflows.some(w => w.workflowId === s.workflowId)
      );
    }

    // Apply tags filter
    if (filterValues['Tags']) {
      const selectedTag = filterValues['Tags'];
      filteredTasks = filteredTasks.filter(t => t.tags.includes(selectedTag));
      filteredWorkflows = filteredWorkflows.filter(w => 
        w.tags.includes(selectedTag) || 
        filteredTasks.some(t => t.taskId === w.taskId)
      );
      filteredSessions = filteredSessions.filter(s => 
        s.tags.includes(selectedTag) ||
        filteredWorkflows.some(w => w.workflowId === s.workflowId)
      );
    }

    // Apply search filter
    if (filterValues['Search']) {
      const searchTerm = filterValues['Search'].toLowerCase();
      filteredTasks = filteredTasks.filter(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        t.apps.some(app => app.toLowerCase().includes(searchTerm))
      );
      filteredWorkflows = filteredWorkflows.filter(w => 
        w.name.toLowerCase().includes(searchTerm) ||
        w.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        w.apps.some(app => app.toLowerCase().includes(searchTerm)) ||
        filteredTasks.some(t => t.taskId === w.taskId)
      );
      filteredSessions = filteredSessions.filter(s =>
        filteredWorkflows.some(w => w.workflowId === s.workflowId)
      );
    }

    return {
      tasks: filteredTasks,
      workflows: filteredWorkflows,
      sessions: filteredSessions
    };
  }, [tasks, workflows, sessions, filterValues]);

  // Update KPIs based on filtered data and automation metrics
  useEffect(() => {
    const selectedDays = getDaysFromRange(filterValues['Last X Days']);
    const daysRatio = selectedDays / getDefaultTimeRange();

    setKpis(prev => prev.map(kpi => {
      const metricId = kpi.id as MetricId;
      const mockData = typedMetricsData.metrics.current[metricId];
      const mockHistorical = typedMetricsData.metrics.historical[metricId];
      
      // Start with the base value
      let adjustedValue = mockData.value;

      // Only adjust if we have filters applied
      if (filterValues['Task'] || filterValues['Last X Days'] || filterValues['Apps'] || filterValues['Tags'] || filterValues['Search']) {
        // Calculate automation impact
        let automationImpact = 1;
        if (filteredData.tasks.length > 0) {
          const avgAutomation = filteredData.tasks.reduce((acc, task) => 
            acc + task.automationScore, 0) / filteredData.tasks.length;
          automationImpact = avgAutomation / 100;
        }

        // Apply scaling factors
        const randomFactor = 0.8 + Math.random() * 0.4; // Random variation between 0.8 and 1.2
        adjustedValue = adjustedValue * randomFactor * daysRatio * automationImpact;

        // Ensure value stays within historical bounds
        const scaledMin = mockHistorical.min * daysRatio;
        const scaledMax = mockHistorical.max * daysRatio;
        adjustedValue = Math.max(scaledMin, Math.min(scaledMax, adjustedValue));
      }

      // Calculate trend
      const scaledTrend = mockData.trend * (selectedDays / 30);
      const trendFormatted = `${mockData.trend_direction === 'up' ? '+' : ''}${scaledTrend.toFixed(1)}%`;

      return {
        ...kpi,
        value: formatMetricValue(metricId, adjustedValue),
        trend: trendFormatted,
        positive: (mockData.trend_direction === 'up') === !['ops_cost', 'blunder_time', 'high_severity'].includes(metricId)
      };
    }));
  }, [filteredData, filterValues]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterName]: value === filterName ? '' : value
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-lg text-gray-600">Loading data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-32 text-red-500">
            <p>Error loading data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder={typedFiltersData.dynamic_filters.search.placeholder}
                value={filterValues['Search'] || ''}
                onChange={(e) => handleFilterChange('Search', e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Dropdown Filters */}
          {dynamicFilters.map((filter) => (
            filter.id !== 'search' && (
              <div key={filter.id} className="relative">
                <div className="relative">
                  <select
                    className="block w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none cursor-pointer hover:border-indigo-400 transition-colors"
                    value={filterValues[filter.name] || ''}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  >
                    <option value="">{filter.name}</option>
                    {filter.options.map((option) => (
                      <option 
                        key={option} 
                        value={option} 
                        className="py-1"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <filter.icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* KPIs and Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPIs */}
        <div className="lg:col-span-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
          {kpis.map((kpi) => (
            <button
              key={kpi.name}
              onClick={() => setSelectedKPI(kpi)}
              className={`bg-white rounded-lg shadow p-4 transition-all ${
                selectedKPI.id === kpi.id
                  ? 'ring-2 ring-indigo-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{kpi.name}</h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    kpi.positive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {kpi.trend}
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{kpi.value}</p>
            </button>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedKPI.name} Trend
            </h3>
          </div>
          <TrendChart 
            metric={selectedKPI.id as MetricId} 
            data={filteredData} 
            timeRange={filterValues['Last X Days'] || 'Last 30 days'} 
          />
        </div>
      </div>



    </div>
  );
}

export default TopSection;