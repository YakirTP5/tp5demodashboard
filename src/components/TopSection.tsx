import React, { useState } from 'react';
import { 
  Search,
  CalendarRange,
  Users,
  Wrench,
  Tag,
  Zap,
  Bot,
  GraduationCap,
  ArrowRight,
  Workflow,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface InsightCardProps {
  title: string;
  description: string;
  savings: string;
  type: 'automation' | 'ai' | 'training' | 'personnel';
  priority: 'high' | 'medium' | 'low';
  impactAreas: string[];
  implementationTime: string;
  roi: string;
  steps: {
    title: string;
    description: string;
    duration: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  requirements: string[];
  isExpanded: boolean;
  onExpand: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  savings,
  type,
  priority,
  impactAreas,
  implementationTime,
  roi,
  steps,
  requirements,
  isExpanded,
  onExpand
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'requirements'>('overview');
  
  const typeConfig = {
    automation: {
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      label: 'Automation Opportunity'
    },
    ai: {
      icon: Bot,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      label: 'AI Enhancement'
    },
    training: {
      icon: GraduationCap,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      label: 'Training Required'
    },
    personnel: {
      icon: Users,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      label: 'Personnel Optimization'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={`
        rounded-xl border ${config.border} ${config.bg}
        p-5 transition-all duration-300 ease-in-out cursor-pointer
        hover:shadow-lg hover:shadow-${config.color}/5 backdrop-blur-sm
        ${isExpanded ? 'shadow-lg shadow-${config.color}/10' : ''}
      `}
      onClick={onExpand}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-gray-500">•</span>
                <span className={`text-sm font-medium ${
                  priority === 'high' ? 'text-red-400' :
                  priority === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-white">{savings}</div>
              <div className="text-sm text-green-400">monthly savings</div>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-6 animate-fadeIn">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-800">
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? `border-${config.color} ${config.color}`
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('overview');
                  }}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'steps'
                      ? `border-${config.color} ${config.color}`
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('steps');
                  }}
                >
                  Implementation Steps
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'requirements'
                      ? `border-${config.color} ${config.color}`
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('requirements');
                  }}
                >
                  Requirements
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'overview' && (
                  <>
                    <p className="text-gray-300 text-base leading-relaxed">{description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Implementation Time</div>
                        <div className="text-white font-medium">{implementationTime}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Expected ROI</div>
                        <div className="text-white font-medium">{roi}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Workflow className="h-4 w-4" />
                        <span className="font-medium">Impact Areas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {impactAreas.map((area, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${config.bg} ${config.color}`}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'steps' && (
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-gray-800/50 border border-gray-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">{step.title}</h4>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            step.status === 'completed' 
                              ? 'bg-green-900/50 text-green-400'
                              : step.status === 'in-progress'
                                ? 'bg-blue-900/50 text-blue-400'
                                : 'bg-gray-900/50 text-gray-400'
                          }`}>
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                        <div className="text-sm text-gray-500">Duration: {step.duration}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="space-y-3">
                    {requirements.map((req, index) => (
                      <div 
                        key={index}
                        className="flex items-start space-x-3 text-gray-300"
                      >
                        <div className="p-1 rounded-full bg-gray-800 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
                        </div>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className={`w-full px-4 py-3 rounded-lg ${config.bg} ${config.color} font-medium
                  hover:bg-opacity-50 transition-colors flex items-center justify-center space-x-2`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle action plan view
                }}
              >
                <span>Start Implementation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchBar: React.FC = () => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search workflows, tasks, and cost optimizations..."
      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500"
    />
    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-600" />
  </div>
);

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  options: FilterOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  label,
  options,
  selectedValue,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 
          bg-gray-900 border border-gray-800 rounded-lg 
          text-gray-400 hover:text-gray-300 hover:border-gray-700
          ${isOpen ? 'border-gray-600' : ''}
        `}
      >
        {icon}
        <span>{selectedValue || label}</span>
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`
                  w-full px-4 py-2 text-sm flex items-center justify-between
                  ${selectedValue === option.value ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'}
                `}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center space-x-2">
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-gray-500">({option.count})</span>
                  )}
                </span>
                {selectedValue === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function TopSection() {
  const { loading, error } = useApp();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30d');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');

  const timeRangeOptions: FilterOption[] = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last Quarter', value: '90d' }
  ];

  const regionOptions: FilterOption[] = [
    { label: 'All Regions', value: '' },
    { label: 'North America', value: 'na', count: 245 },
    { label: 'Europe', value: 'eu', count: 189 },
    { label: 'Asia Pacific', value: 'apac', count: 156 },
    { label: 'Latin America', value: 'latam', count: 78 }
  ];

  const platformOptions: FilterOption[] = [
    { label: 'All Platforms', value: '' },
    { label: 'macOS', value: 'macos', count: 342 },
    { label: 'Windows', value: 'windows', count: 287 },
    { label: 'Linux', value: 'linux', count: 156 },
    { label: 'iOS', value: 'ios', count: 98 },
    { label: 'Android', value: 'android', count: 76 }
  ];

  const workflowOptions: FilterOption[] = [
    { label: 'All Workflows', value: '' },
    { label: 'Agent Crashes', value: 'crashes', count: 187 },
    { label: 'False Positives', value: 'false-positives', count: 156 },
    { label: 'Policy Conflicts', value: 'policy', count: 134 },
    { label: 'Network Issues', value: 'network', count: 98 },
    { label: 'Performance Impact', value: 'performance', count: 76 }
  ];

  const insights: InsightCardProps[] = [
    {
      title: "macOS Agent Crash Resolution",
      description: "High volume of agent crashes reported on macOS Sonoma, primarily affecting enterprise customers in North America. Current resolution time averaging 4.2 hours per incident.",
      savings: "2.8h",
      type: "automation",
      priority: "high",
      implementationTime: "3-4 weeks",
      roi: "65% faster resolution",
      impactAreas: ["Enterprise Customers", "macOS Platform", "Agent Stability"],
      steps: [
        {
          title: "Crash Pattern Analysis",
          description: "Analyze crash logs from affected systems to identify common patterns",
          duration: "1 week",
          status: "completed"
        },
        {
          title: "Automated Diagnostics",
          description: "Develop automated diagnostic tool for rapid crash analysis",
          duration: "2 weeks",
          status: "in-progress"
        },
        {
          title: "Recovery Script Development",
          description: "Create automated recovery scripts for common crash scenarios",
          duration: "1 week",
          status: "pending"
        }
      ],
      requirements: [
        "Access to crash logs from last 1000 incidents",
        "macOS development environment",
        "Enterprise customer environment access",
        "System level diagnostics permissions"
      ],
      isExpanded: false,
      onExpand: () => {}
    },
    {
      title: "False Positive Triage - APAC Region",
      description: "Increasing false positive alerts in APAC region during non-business hours, causing alert fatigue and delayed response to genuine threats.",
      savings: "1.5h",
      type: "ai",
      priority: "high",
      implementationTime: "4-6 weeks",
      roi: "40% reduction in false positives",
      impactAreas: ["Alert Accuracy", "Team Efficiency", "Customer Satisfaction"],
      steps: [
        {
          title: "Alert Pattern Analysis",
          description: "Analyze false positive patterns in APAC region",
          duration: "1-2 weeks",
          status: "completed"
        },
        {
          title: "ML Model Training",
          description: "Train ML model on verified false positive data",
          duration: "2-3 weeks",
          status: "in-progress"
        },
        {
          title: "Alert Filter Implementation",
          description: "Implement intelligent alert filtering system",
          duration: "1-2 weeks",
          status: "pending"
        }
      ],
      requirements: [
        "Historical alert data from APAC region",
        "ML training infrastructure",
        "Access to alert management system",
        "Verification from regional SOC team"
      ],
      isExpanded: false,
      onExpand: () => {}
    },
    {
      title: "Windows Policy Conflict Resolution",
      description: "Recurring policy conflicts on Windows endpoints after security updates, affecting 15% of enterprise customers in EU region.",
      savings: "3.2h",
      type: "automation",
      priority: "medium",
      implementationTime: "2-3 weeks",
      roi: "55% faster resolution",
      impactAreas: ["Policy Management", "Update Process", "Enterprise Stability"],
      steps: [
        {
          title: "Conflict Detection",
          description: "Implement automated policy conflict detection",
          duration: "1 week",
          status: "in-progress"
        },
        {
          title: "Resolution Automation",
          description: "Develop automated conflict resolution system",
          duration: "2 weeks",
          status: "pending"
        }
      ],
      requirements: [
        "Windows policy management access",
        "Update deployment logs",
        "Enterprise policy templates",
        "Test environment access"
      ],
      isExpanded: false,
      onExpand: () => {}
    },
    {
      title: "Network Performance Optimization",
      description: "Network-related agent performance issues in LATAM region, impacting scan times and real-time protection.",
      savings: "4.5h",
      type: "personnel",
      priority: "medium",
      implementationTime: "3-4 weeks",
      roi: "70% performance improvement",
      impactAreas: ["Network Efficiency", "Scan Performance", "Real-time Protection"],
      steps: [
        {
          title: "Performance Baseline",
          description: "Establish performance baselines across regions",
          duration: "1 week",
          status: "completed"
        },
        {
          title: "Network Analysis",
          description: "Analyze network patterns and bottlenecks",
          duration: "2 weeks",
          status: "in-progress"
        }
      ],
      requirements: [
        "Network monitoring tools access",
        "Regional performance data",
        "Bandwidth allocation data",
        "Local ISP coordination"
      ],
      isExpanded: false,
      onExpand: () => {}
    }
  ];

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-800 rounded-lg w-full mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/50 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Security Support Efficiency Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar />
          <div className="flex flex-wrap gap-3">
            <FilterButton 
              icon={<CalendarRange className="h-4 w-4" />}
              label="Time Range"
              options={timeRangeOptions}
              selectedValue={timeRangeOptions.find(o => o.value === selectedTimeRange)?.label}
              onChange={setSelectedTimeRange}
            />
            <FilterButton 
              icon={<Users className="h-4 w-4" />}
              label="Region"
              options={regionOptions}
              selectedValue={regionOptions.find(o => o.value === selectedRegion)?.label}
              onChange={setSelectedRegion}
            />
            <FilterButton 
              icon={<Wrench className="h-4 w-4" />}
              label="Platform"
              options={platformOptions}
              selectedValue={platformOptions.find(o => o.value === selectedPlatform)?.label}
              onChange={setSelectedPlatform}
            />
            <FilterButton 
              icon={<Tag className="h-4 w-4" />}
              label="Workflow Type"
              options={workflowOptions}
              selectedValue={workflowOptions.find(o => o.value === selectedWorkflow)?.label}
              onChange={setSelectedWorkflow}
            />
          </div>
        </div>
      </div>

      {/* Efficiency Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <InsightCard 
            key={index}
            {...insight} 
            isExpanded={expandedIndex === index}
            onExpand={() => handleExpand(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default TopSection;
