
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/employer/DashboardHeader";
import { StatCards } from "@/components/employer/StatCards";
import { ActiveJobsList } from "@/components/employer/ActiveJobsList";
import { SubscriptionCard } from "@/components/employer/SubscriptionCard";
import { RecentApplicantsTable } from "@/components/employer/RecentApplicantsTable";
import { PerformanceAnalytics } from "@/components/employer/PerformanceAnalytics";
import { JobsDataProvider, useJobsData } from "@/components/employer/JobsDataProvider";

function EmployerDashboardContent() {
  const { activeJobs, recentApplicants, stats, isLoadingStats } = useJobsData(); // Added isLoadingStats
  
  // TODO: activeJobs and recentApplicants are currently not populated by the refactored JobsDataProvider.
  // They would need their own useQuery hooks here or in their respective components.
  // For now, they will receive empty arrays or mock data if not updated.

  return (
    <div className="flex-1 p-6">
      <DashboardHeader /> {/* This might also need user data from useAuth */}
      
      {isLoadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      ) : (
        <StatCards
          activeJobsCount={stats.activeJobsCount}
          totalApplicants={stats.totalApplicants}
          // Map applicationsLast30Days to a renamed prop or adjust StatCards
          applicationsLast30Days={stats.applicationsLast30Days}
          // profileViews is not available, StatCards will need to handle its absence
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ActiveJobsList jobs={activeJobs} />
        </div>
        
        <div>
          <SubscriptionCard />
        </div>
      </div>
      
      <div className="mb-8">
        <RecentApplicantsTable applicants={recentApplicants} />
      </div>
      
      <div>
        <PerformanceAnalytics />
      </div>
    </div>
  );
}

export default function EmployerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="employer" />
      <JobsDataProvider>
        <EmployerDashboardContent />
      </JobsDataProvider>
    </div>
  );
}
