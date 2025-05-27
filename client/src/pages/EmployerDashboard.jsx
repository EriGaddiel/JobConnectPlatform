
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/employer/DashboardHeader";
import { StatCards } from "@/components/employer/StatCards";
import { ActiveJobsList } from "@/components/employer/ActiveJobsList";
import { SubscriptionCard } from "@/components/employer/SubscriptionCard";
import { RecentApplicantsTable } from "@/components/employer/RecentApplicantsTable";
import { PerformanceAnalytics } from "@/components/employer/PerformanceAnalytics";
import { JobsDataProvider, useJobsData } from "@/components/employer/JobsDataProvider";

function EmployerDashboardContent() {
  const { activeJobs, recentApplicants, stats } = useJobsData();
  
  return (
    <div className="flex-1 p-6">
      <DashboardHeader />
      
      <StatCards 
        activeJobsCount={stats.activeJobsCount}
        totalApplicants={stats.totalApplicants}
        newToday={stats.newToday}
        profileViews={stats.profileViews}
      />
      
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
