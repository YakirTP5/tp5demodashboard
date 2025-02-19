import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  BarChart2,
  PieChart,
  ChevronRight,
  ChevronDown,
  Users,
  Workflow,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface CostBreakdownRowProps {
  name: string;
  costPerTicket: number;
  aiSavings: number;
  resolutionTime: string;
  impact: number;
  isBottleneck?: boolean;
}

const CostBreakdownRow: React.FC<CostBreakdownRowProps> = ({
  name,
  costPerTicket,
  aiSavings,
  resolutionTime,
  impact,
  isBottleneck
}) => (
  <div className={`grid grid-cols-5 gap-4 p-4 rounded-lg transition-colors ${
    isBottleneck ? 'bg-red-900/20' : 'hover:bg-gray-800/50'
  }`}>
    <div className="flex items-center space-x-2">
      {isBottleneck && <AlertTriangle className="h-4 w-4 text-red-400" />}
      <span className="text-gray-300">{name}</span>
    </div>
    <div className="text-gray-400">${costPerTicket}</div>
    <div className="text-green-400">-${aiSavings}</div>
    <div className="text-gray-400">{resolutionTime}</div>
    <div className={`text-right ${impact > 0 ? 'text-red-400' : 'text-green-400'}`}>
      {impact > 0 ? '+' : ''}{impact}%
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  value: string;
  trend: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, value, trend, children }) => (
  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-green-400">{trend}</span>
      </div>
    </div>
    <div className="h-48">
      {children}
    </div>
  </div>
);

interface InsightCardProps {
  title: string;
  impact: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, impact, description }) => (
  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-sm font-medium text-white">{title}</h4>
      <span className="text-green-400 font-medium">{impact}</span>
    </div>
    <p className="text-sm text-gray-400">{description}</p>
    <button className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
      <span>View details</span>
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

interface KPIChartData {
  name: string;
  actual: number;
  target: number;
}

const generateKPIData = (
  startValue: number,
  targetValue: number,
  days: number = 30
): KPIChartData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    // Create some variation in the actual values
    const progress = i / (days - 1); // 0 to 1
    const baseValue = startValue + (targetValue - startValue) * progress;
    const variation = (Math.random() - 0.5) * 20; // +/- $10 variation
    
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: Math.round(baseValue + variation),
      target: targetValue
    };
  });
};

const KPIDistanceChart: React.FC<{
  data: KPIChartData[];
  title: string;
  valuePrefix?: string;
  height?: number;
}> = ({ data, title, valuePrefix = '$', height = 300 }) => (
  <div className="w-full h-full">
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#DC2626" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name"
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#4B5563' }}
          tick={{ fill: '#9CA3AF' }}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#4B5563' }}
          tick={{ fill: '#9CA3AF' }}
          tickFormatter={(value) => `${valuePrefix}${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.375rem',
          }}
          labelStyle={{ color: '#9CA3AF' }}
          itemStyle={{ color: '#E5E7EB' }}
          formatter={(value: number) => [`${valuePrefix}${value}`, undefined]}
        />
        {/* Black separator line */}
        <ReferenceLine 
          x={data[Math.floor(data.length * 0.6)].name}
          stroke="#000000"
          strokeWidth={2}
        />
        {/* Target line */}
        <ReferenceLine 
          y={data[0].target} 
          stroke="#3B82F6"
          strokeWidth={2}
          label={{ 
            value: 'Target',
            position: 'right',
            fill: '#3B82F6',
            fontSize: 12
          }}
        />
        <Area
          type="monotone"
          dataKey="actual"
          stroke="#DC2626"
          fill="url(#performanceGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

interface EfficiencyInsight {
  title: string;
  impact: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'ai' | 'automation' | 'process';
}

interface HierarchicalCostData {
  name: string;
  totalCost: number;
  aiSavings: number;
  volume: number;
  children?: HierarchicalCostData[];
  isExpanded?: boolean;
  insights?: EfficiencyInsight[];
  showInsights?: boolean;
}

const InsightBadge: React.FC<{ type: EfficiencyInsight['category'] }> = ({ type }) => {
  const badges = {
    ai: {
      bg: 'bg-cyan-900/30',
      text: 'text-cyan-400',
      label: 'AI Opportunity'
    },
    automation: {
      bg: 'bg-purple-900/30',
      text: 'text-purple-400',
      label: 'Automation'
    },
    process: {
      bg: 'bg-orange-900/30',
      text: 'text-orange-400',
      label: 'Process'
    }
  };

  const badge = badges[type];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  );
};

const WorkflowInsights: React.FC<{
  insights: EfficiencyInsight[];
}> = ({ insights }) => (
  <div className="ml-6 pl-6 border-l border-gray-800">
    <div className="grid grid-cols-1 gap-4 py-4">
      {insights.map((insight, index) => (
        <div 
          key={index}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                <InsightBadge type={insight.category} />
              </div>
              <p className="text-sm text-gray-400">{insight.description}</p>
            </div>
            <span className={`text-sm font-medium ${
              insight.impact.startsWith('+') ? 'text-red-400' : 'text-green-400'
            }`}>{insight.impact}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                insight.priority === 'high' 
                  ? 'bg-red-900/30 text-red-400' 
                  : insight.priority === 'medium'
                    ? 'bg-yellow-900/30 text-yellow-400'
                    : 'bg-green-900/30 text-green-400'
              }`}>
                {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
              </span>
            </div>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
              <span>Take action</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HierarchicalCostRow: React.FC<{
  data: HierarchicalCostData;
  level: number;
  onToggle: () => void;
  onInsightsToggle: () => void;
}> = ({ data, level, onToggle, onInsightsToggle }) => (
  <div>
    <div 
      className={`
        grid grid-cols-6 gap-4 p-4 rounded-lg transition-colors
        hover:bg-gray-800/50 cursor-pointer
        ${level === 0 ? 'bg-gray-800/20' : ''}
      `}
      style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
    >
      <div className="flex items-center space-x-2" onClick={onToggle}>
        {data.children && (
          data.isExpanded ? 
            <ChevronDown className="h-4 w-4 text-gray-400" /> :
            <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
        <span className={`text-gray-300 ${level === 0 ? 'font-medium' : ''}`}>
          {data.name}
        </span>
      </div>
      <div className="text-gray-400">${data.totalCost.toLocaleString()}</div>
      <div className="text-green-400">-${data.aiSavings.toLocaleString()}</div>
      <div className="text-gray-400">{data.volume.toLocaleString()}</div>
      <div className="text-gray-400">
        ${(data.totalCost / data.volume).toFixed(2)}
      </div>
      {data.insights && (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInsightsToggle();
            }}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors
              ${data.showInsights 
                ? 'bg-cyan-900/50 text-cyan-400' 
                : 'bg-gray-800 text-gray-400 hover:text-gray-300'}`
            }
          >
            {data.insights.length} Insights
          </button>
        </div>
      )}
    </div>
    {data.showInsights && data.insights && (
      <WorkflowInsights insights={data.insights} />
    )}
  </div>
);

const HierarchicalCostBreakdown: React.FC<{
  data: HierarchicalCostData[];
  level?: number;
  onToggle: (index: number) => void;
  onInsightsToggle: (index: number) => void;
}> = ({ data, level = 0, onToggle, onInsightsToggle }) => (
  <div className="space-y-1">
    {data.map((item, index) => (
      <React.Fragment key={item.name}>
        <HierarchicalCostRow 
          data={item} 
          level={level}
          onToggle={() => onToggle(index)}
          onInsightsToggle={() => onInsightsToggle(index)}
        />
        {item.children && item.isExpanded && (
          <HierarchicalCostBreakdown 
            data={item.children} 
            level={level + 1}
            onToggle={(childIndex) => {
              if (item.children) {
                item.children[childIndex].isExpanded = !item.children[childIndex].isExpanded;
                onToggle(index);
              }
            }}
            onInsightsToggle={(childIndex) => {
              if (item.children) {
                item.children[childIndex].showInsights = !item.children[childIndex].showInsights;
                onInsightsToggle(index);
              }
            }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

interface TeamTabProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const TeamTab: React.FC<TeamTabProps> = ({ name, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
      ${isActive 
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'}`
    }
  >
    {name}
  </button>
);

interface WorkflowEfficiencyCardProps {
  name: string;
  efficiency: number;
  target: number;
  opportunities: number;
  savings: string;
}

const WorkflowEfficiencyCard: React.FC<WorkflowEfficiencyCardProps> = ({
  name,
  efficiency,
  target,
  opportunities,
  savings
}) => (
  <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-white">{name}</h3>
      <button className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/20 transition-colors">
        Optimize Now
      </button>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Current Efficiency</span>
        <span className="text-white font-medium">{efficiency}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyan-500 rounded-full transition-all"
          style={{ width: `${efficiency}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Target</span>
        <span className="text-cyan-400 font-medium">{target}%</span>
      </div>
      <div className="pt-4 border-t border-gray-800 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Optimization Opportunities</span>
          <span className="text-sm font-medium text-white">{opportunities}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Potential Savings</span>
          <span className="text-sm font-medium text-green-400">{savings}</span>
        </div>
      </div>
    </div>
  </div>
);

function MainSection() {
  const [activeTeam, setActiveTeam] = useState("Incident Response");
  
  const teams = [
    "Incident Response",
    "Threat Detection",
    "Security Operations",
    "Endpoint Protection"
  ];

  const workflowEfficiencyData = {
    "Incident Response": [
      {
        name: "Alert Triage",
        efficiency: 68,
        target: 90,
        opportunities: 4,
        savings: "$52k/mo"
      },
      {
        name: "Malware Analysis",
        efficiency: 75,
        target: 92,
        opportunities: 3,
        savings: "$38k/mo"
      },
      {
        name: "Incident Containment",
        efficiency: 82,
        target: 95,
        opportunities: 2,
        savings: "$45k/mo"
      }
    ],
    "Threat Detection": [
      {
        name: "False Positive Analysis",
        efficiency: 65,
        target: 88,
        opportunities: 5,
        savings: "$48k/mo"
      },
      {
        name: "Threat Hunting",
        efficiency: 72,
        target: 85,
        opportunities: 3,
        savings: "$35k/mo"
      },
      {
        name: "IOC Management",
        efficiency: 78,
        target: 90,
        opportunities: 3,
        savings: "$42k/mo"
      }
    ],
    "Security Operations": [
      {
        name: "Agent Deployment",
        efficiency: 70,
        target: 92,
        opportunities: 4,
        savings: "$55k/mo"
      },
      {
        name: "Policy Management",
        efficiency: 76,
        target: 95,
        opportunities: 3,
        savings: "$40k/mo"
      },
      {
        name: "System Hardening",
        efficiency: 82,
        target: 94,
        opportunities: 2,
        savings: "$32k/mo"
      }
    ],
    "Endpoint Protection": [
      {
        name: "Agent Crash Resolution",
        efficiency: 62,
        target: 85,
        opportunities: 5,
        savings: "$58k/mo"
      },
      {
        name: "Performance Impact Analysis",
        efficiency: 71,
        target: 88,
        opportunities: 4,
        savings: "$45k/mo"
      },
      {
        name: "Update Management",
        efficiency: 68,
        target: 90,
        opportunities: 3,
        savings: "$38k/mo"
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Team Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-4">
        {teams.map((team) => (
          <TeamTab
            key={team}
            name={team}
            isActive={activeTeam === team}
            onClick={() => setActiveTeam(team)}
          />
        ))}
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowEfficiencyData[activeTeam as keyof typeof workflowEfficiencyData].map((workflow, index) => (
          <WorkflowEfficiencyCard
            key={index}
            {...workflow}
          />
        ))}
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Overall Efficiency vs Target</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">72%</span>
              <span className="text-sm text-red-400">-13%</span>
            </div>
          </div>
          <KPIDistanceChart 
            data={generateKPIData(72, 85)}
            title="Efficiency"
            valuePrefix=""
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Cost Optimization Progress</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">$105k</span>
              <span className="text-sm text-green-400">saved/mo</span>
            </div>
          </div>
          <KPIDistanceChart 
            data={generateKPIData(105, 150)}
            title="Monthly Savings"
            valuePrefix="$"
          />
        </div>
      </div>
    </div>
  );
}

export default MainSection; 