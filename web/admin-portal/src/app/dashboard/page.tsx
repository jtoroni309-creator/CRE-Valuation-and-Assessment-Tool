import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ValuationChart } from '@/components/dashboard/ValuationChart';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the Axxiom platform. Here's an overview of your activity.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Charts and Activity */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ValuationChart />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
