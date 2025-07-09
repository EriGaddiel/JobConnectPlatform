
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Keep Tabs for filtering
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom"; // Added useSearchParams for filtering
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyApplications, withdrawApplication as apiWithdrawApplication } from "@/services/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, FileText as FileTextIcon, AlertTriangle, Filter } from "lucide-react";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const APPLICATION_STATUS_TABS = [
    { value: "all", label: "All Applications" },
    { value: "submitted_viewed_shortlisted", label: "Active", statuses: ["submitted", "viewed", "shortlisted"] },
    { value: "interviewing", label: "Interviews", statuses: ["interviewing"] },
    { value: "offered_hired", label: "Offers/Hired", statuses: ["offered", "hired"] },
    { value: "withdrawn_rejected", label: "Archived", statuses: ["withdrawn", "rejected"] },
];


export default function MyApplications() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabValue = searchParams.get("status_tab") || "all";

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [currentFilterStatuses, setCurrentFilterStatuses] = useState(
    APPLICATION_STATUS_TABS.find(tab => tab.value === activeTabValue)?.statuses || []
  );

  const { data: applicationData, isLoading, isError, error, refetch } = useQuery({
    // Query key includes statuses to refetch when filter changes
    queryKey: ['myApplications', currentPage, currentFilterStatuses.join('_')],
    queryFn: () => {
        const params = { page: currentPage, limit: 5 }; // Reduced limit for demo
        if (currentFilterStatuses.length > 0) {
            params.status = currentFilterStatuses; // Send as array if API supports it, or join
        }
        return getMyApplications(params).then(res => res.data);
    },
    // keepPreviousData: true, // Good for pagination
  });

  useEffect(() => {
    if(isError && error) {
        toast.error(error.response?.data?.error || "Failed to fetch applications.");
    }
  }, [isError, error]);

  const withdrawMutation = useMutation({
    mutationFn: (applicationId) => apiWithdrawApplication(applicationId),
    onSuccess: (data) => {
      toast.success(data.data.message || "Application withdrawn successfully.");
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to withdraw application.");
    }
  });

  const handleWithdraw = (applicationId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      withdrawMutation.mutate(applicationId);
    }
  };

  const handleTabChange = (tabValue) => {
    const selectedTab = APPLICATION_STATUS_TABS.find(tab => tab.value === tabValue);
    setCurrentFilterStatuses(selectedTab?.statuses || []);
    setCurrentPage(1); // Reset page on tab change
    setSearchParams({ status_tab: tabValue }); // Update URL
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (applicationData?.totalPages || 1)) {
        setCurrentPage(newPage);
        // Update URL search param for page if needed, or rely on queryKey change
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set("page", newPage.toString());
        setSearchParams(currentParams);
        window.scrollTo(0,0);
    }
  };


  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "interviewing":
      case "offered":
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "submitted":
      case "viewed":
      case "shortlisted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "rejected":
      case "withdrawn":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const applications = applicationData?.applications || [];
  const totalPages = applicationData?.totalPages || 1;
  const totalApplications = applicationData?.totalApplications || 0;


  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-500">Track and manage your job applications</p>
        </header>
        
        <Tabs value={activeTabValue} onValueChange={handleTabChange}>
          <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {APPLICATION_STATUS_TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTabValue} className="space-y-6"> {/* Use activeTabValue for TabsContent value */}
            {isLoading && (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-24 md:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                      </div>
                      <div className="flex-1 p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Could Not Load Applications</h2>
                <p className="text-red-600 dark:text-red-300 mb-6">{error?.response?.data?.error || error?.message}</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            )}

            {!isLoading && !isError && applications.length === 0 && (
              <div className="text-center py-10">
                <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold">No Applications Found</h2>
                <p className="text-gray-500 mb-6">
                    {activeTabValue === 'all' ? "You haven't applied for any jobs yet." : "No applications match the current filter."}
                </p>
                {activeTabValue === 'all' &&
                    <Button asChild>
                        <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                }
              </div>
            )}

            {!isLoading && !isError && applications.length > 0 && (
              <>
                {applications.map((app) => (
                  <Card key={app._id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-24 md:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 shrink-0">
                        {app.job?.companyLogo ? (
                          <img src={app.job.companyLogo} alt={`${app.job?.companyName} logo`} className="h-12 w-12 object-contain" />
                        ) : (
                          <Briefcase className="h-10 w-10 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <Link to={`/jobs/${app.job?._id}`} className="hover:underline">
                                <CardTitle className="text-lg">{app.job?.title || "Job Title Not Available"}</CardTitle>
                              </Link>
                              <CardDescription>{app.job?.companyName || "Company Not Available"}</CardDescription>
                            </div>
                            <Badge variant="outline" className={getStatusBadgeVariant(app.status)}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 pb-4 space-y-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Applied on: {formatDate(app.createdAt)}
                          </p>
                          {/* Display more relevant info from app.applicationFields if needed, or job type/location */}
                           <p className="text-sm text-gray-500 dark:text-gray-400">
                            Job Type: {app.job?.employmentType || "N/A"} &bull; Location: {app.job?.location || "N/A"}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/applications/${app._id}`}>View Details</Link>
                            </Button>
                            {app.status !== "rejected" && app.status !== "hired" && app.status !== "withdrawn" && (
                               <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleWithdraw(app._id)}
                                  disabled={withdrawMutation.isPending && withdrawMutation.variables === app._id}
                                >
                                {withdrawMutation.isPending && withdrawMutation.variables === app._id ? "Withdrawing..." : "Withdraw"}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <nav className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                        >
                            Previous
                        </Button>
                        {/* Simple pagination display - can be improved */}
                        <span className="px-4 text-sm">Page {currentPage} of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            Next
                        </Button>
                        </nav>
                    </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
