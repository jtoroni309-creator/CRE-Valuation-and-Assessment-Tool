'use client';

import {
  HomeIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Properties',
    value: '127',
    change: '+12%',
    changeType: 'increase',
    icon: HomeIcon,
  },
  {
    name: 'Active Valuations',
    value: '43',
    change: '+5%',
    changeType: 'increase',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Completed Assessments',
    value: '1,234',
    change: '+8%',
    changeType: 'increase',
    icon: ChartBarIcon,
  },
  {
    name: 'Open Appeals',
    value: '18',
    change: '-3%',
    changeType: 'decrease',
    icon: ScaleIcon,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
