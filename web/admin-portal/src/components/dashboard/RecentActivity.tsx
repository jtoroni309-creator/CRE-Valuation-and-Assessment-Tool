'use client';

const activities = [
  {
    id: 1,
    type: 'valuation',
    description: 'Valuation approved for 123 Main Street',
    user: 'Jane Appraiser',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'assessment',
    description: 'Assessment run completed for Cook County',
    user: 'System',
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    type: 'appeal',
    description: 'New appeal filed for 456 Commerce Ave',
    user: 'Bob Advisor',
    timestamp: '1 day ago',
  },
  {
    id: 4,
    type: 'property',
    description: 'New property added: 789 Park Boulevard',
    user: 'Sarah Admin',
    timestamp: '2 days ago',
  },
];

const typeColors = {
  valuation: 'bg-blue-100 text-blue-800',
  assessment: 'bg-green-100 text-green-800',
  appeal: 'bg-yellow-100 text-yellow-800',
  property: 'bg-purple-100 text-purple-800',
};

export function RecentActivity() {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  typeColors[activity.type as keyof typeof typeColors]
                }`}
              >
                {activity.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  by {activity.user} · {activity.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
          View all activity →
        </a>
      </div>
    </div>
  );
}
