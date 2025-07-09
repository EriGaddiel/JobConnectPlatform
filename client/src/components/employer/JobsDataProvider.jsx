
import { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmployerDashboardAnalytics, getMyPostedJobs, getJobApplications } from "@/services/api"; // Assuming we might add more here
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // To get companyId if admin is viewing

const JobsDataContext = createContext(undefined);

export function JobsDataProvider({ children }) {
  const { user } = useAuth();

  // Fetch Employer Dashboard Analytics (Stats)
  // Admin can view specific company stats by passing companyIdForAdmin from user.company (if admin has one) or a selected one
  // For a regular employer, their companyId is derived by the backend from their user session.
  const companyIdForAdmin = user?.role === 'admin' ? user.company : undefined; // Example if admin is tied to a company

  const { data: analyticsData, isLoading: isLoadingAnalytics, isError: isAnalyticsError, error: analyticsApiError } = useQuery({
    queryKey: ['employerDashboardAnalytics', user?._id, companyIdForAdmin], // Include user ID or company ID if it affects query
    queryFn: () => getEmployerDashboardAnalytics(companyIdForAdmin).then(res => res.data),
    enabled: !!user, // Only fetch if user is loaded
  });

  useEffect(() => {
    if(isAnalyticsError && analyticsApiError) {
        toast.error(analyticsApiError.response?.data?.error || "Failed to fetch dashboard analytics.");
    }
  }, [isAnalyticsError, analyticsApiError]);

  // For now, activeJobs and recentApplicants will be fetched by their respective components.
  // This provider will focus on the stats for StatCards.
  // If we wanted this provider to supply all dashboard data, we'd add more useQuery calls here.

  const value = {
    // activeJobs: [], // To be fetched by ActiveJobsList directly or another query here
    // recentApplicants: [], // To be fetched by RecentApplicantsTable directly
    stats: {
      activeJobsCount: analyticsData?.totalActiveJobs || 0,
      totalApplicants: analyticsData?.totalApplicationsReceived || 0,
      applicationsLast30Days: analyticsData?.applicationsLast30Days || 0, // New name
      // profileViews: 0, // Not available from this endpoint
    },
    isLoadingStats: isLoadingAnalytics,
    // Pass along other specific data/loading states if this provider handles more
  };

  return (
    <JobsDataContext.Provider value={value}>
      {children}
    </JobsDataContext.Provider>
  );
}

export function useJobsData() {
  const context = useContext(JobsDataContext);
  if (context === undefined) {
    throw new Error("useJobsData must be used within a JobsDataProvider");
  }
  return context;
}
