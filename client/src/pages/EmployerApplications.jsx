
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, Download, MessageSquare, Briefcase, Users, CalendarDays, AlertTriangle, ExternalLink, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPostedJobs, getJobApplications, updateApplicationStatus as apiUpdateApplicationStatus } from "@/services/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Application } from "@/Models/application.model"; // For status enum (conceptual)

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
};

// Available statuses for an employer to set
const EMPLOYER_APPLICATION_STATUSES = ["submitted", "viewed", "shortlisted", "interviewing", "offered", "hired", "rejected"];


export default function EmployerApplications() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get("jobId") || "");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState(searchParams.get("app_status") || "all");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));


  // Fetch employer's jobs for the job selection dropdown
  const { data: employerJobsData, isLoading: isLoadingEmployerJobs } = useQuery({
    queryKey: ['myPostedJobsForAppView'], // Different key to avoid conflict if EmployerJobs page uses same query
    queryFn: () => getMyPostedJobs({ limit: 100, status: "open" }).then(res => res.data), // Fetch all open jobs
  });

  // Fetch applications for the selected job
  const { data: applicationsData, isLoading: isLoadingApplications, isError, error, refetch: refetchApplications } = useQuery({
    queryKey: ['jobApplications', selectedJobId, applicationStatusFilter, currentPage],
    queryFn: () => {
      const params = { page: currentPage, limit: 10 };
      if (applicationStatusFilter !== "all") {
        params.status = applicationStatusFilter;
      }
      return getJobApplications(selectedJobId, params).then(res => res.data);
    },
    enabled: !!selectedJobId, // Only run if a job is selected
  });

  useEffect(() => {
    if(isError && error && selectedJobId) { // Only toast if a job was selected
        toast.error(error.response?.data?.error || "Failed to fetch applications for this job.");
    }
  }, [isError, error, selectedJobId]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }) => apiUpdateApplicationStatus(applicationId, { status }),
    onSuccess: (data) => {
      toast.success(data.data.message || "Application status updated.");
      queryClient.invalidateQueries({ queryKey: ['jobApplications', selectedJobId] });
      // Potentially invalidate notification count for job seeker if that query exists
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update status.");
    }
  });

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setCurrentPage(1);
    setApplicationStatusFilter("all");
    setSearchParams({ jobId, app_status: "all" });
  };

  const handleStatusFilterChange = (status) => {
    setApplicationStatusFilter(status);
    setCurrentPage(1);
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("app_status", status);
    currentParams.delete("page");
    setSearchParams(currentParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (applicationsData?.totalPages || 1)) {
        setCurrentPage(newPage);
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set("page", newPage.toString());
        setSearchParams(currentParams);
        window.scrollTo(0,0);
    }
  };


  const applications = applicationsData?.applications || [];
  const totalPages = applicationsData?.totalPages || 1;
  const selectedJobDetails = employerJobsData?.jobs?.find(j => j._id === selectedJobId);

  const getStatusBadgeVariant = (status) => {
     switch (status?.toLowerCase()) {
      case "interviewing": case "offered": case "hired": return "bg-green-100 text-green-800";
      case "submitted": case "viewed": case "shortlisted": return "bg-blue-100 text-blue-800";
      case "rejected": case "withdrawn": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="employer" />
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-gray-500">Review and manage applications for your job postings</p>
        </header>

        <div className="mb-6">
          <Label htmlFor="job-select">Select a Job Posting:</Label>
          <Select value={selectedJobId} onValueChange={handleJobSelect}>
            <SelectTrigger id="job-select" className="w-full md:w-1/2 mt-1">
              <SelectValue placeholder={isLoadingEmployerJobs ? "Loading jobs..." : "Select a job"} />
            </SelectTrigger>
            <SelectContent>
              {employerJobsData?.jobs?.map(job => (
                <SelectItem key={job._id} value={job._id}>{job.title}</SelectItem>
              ))}
              {!isLoadingEmployerJobs && employerJobsData?.jobs?.length === 0 && (
                <div className="p-2 text-center text-gray-500">No open jobs found. <Link to="/post-job" className="text-jobconnect-primary hover:underline">Post one now!</Link></div>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedJobId && (
          <Card>
            <CardHeader>
              <CardTitle>Applications for: {selectedJobDetails?.title || "Selected Job"}</CardTitle>
              <div className="flex justify-between items-center mt-2">
                <CardDescription>
                  {applicationsData?.totalApplications || 0} application(s) found.
                </CardDescription>
                <div className="w-48">
                    <Select value={applicationStatusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter by status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {EMPLOYER_APPLICATION_STATUSES.map(status => (
                                <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingApplications && (
                <div className="space-y-4">
                  {[...Array(3)].map((_,i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
                </div>
              )}
              {!isLoadingApplications && isError && (
                <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                    <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Could Not Load Applications</h2>
                    <p className="text-red-600 dark:text-red-300 mb-6">{error?.response?.data?.error || error?.message}</p>
                    <Button onClick={() => refetchApplications()}>Try Again</Button>
                </div>
              )}
              {!isLoadingApplications && !isError && applications.length === 0 && (
                <div className="text-center py-16"> {/* Increased padding */}
                  <FileTextIcon size={52} className="mx-auto text-gray-400 dark:text-gray-500 mb-6" strokeWidth={1.5}/>
                  <h2 className="text-2xl font-semibold mb-2">No Applications Found</h2>
                  <p className="text-muted-foreground">
                    {applicationStatusFilter === 'all' ? "There are currently no applications for this job." : "No applications match the selected status filter."}
                  </p>
                </div>
              )}
              {!isLoadingApplications && !isError && applications.length > 0 && (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={app.applicant?.profilePicture} />
                          <AvatarFallback>
                            {app.applicant?.fullName?.split(' ').map(n => n[0]).join('') || app.applicant?.username?.substring(0,2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{app.applicant?.fullName || app.applicant?.username}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Applied: {formatDate(app.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                         <div className="w-full sm:w-40">
                            <Select
                                value={app.status}
                                onValueChange={(newStatus) => updateStatusMutation.mutate({ applicationId: app._id, status: newStatus })}
                                disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.applicationId === app._id}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Set status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EMPLOYER_APPLICATION_STATUSES.map(s => (
                                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         </div>
                        <div className="flex gap-1 mt-2 sm:mt-0">
                          <Button size="sm" variant="outline" asChild title="View Application Details">
                            <Link to={`/applications/${app._id}`}><Eye className="h-4 w-4" /></Link>
                          </Button>
                          {/* Resume download/view would depend on how files are handled */}
                          {/* <Button size="sm" variant="outline" title="Download Resume (if available)"><Download className="h-4 w-4" /></Button> */}
                          {/* <Button size="sm" variant="outline" title="Message Applicant"><MessageSquare className="h-4 w-4" /></Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                   {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <nav className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoadingApplications}
                            >
                                Previous
                            </Button>
                            <span className="px-4 text-sm">Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoadingApplications}
                            >
                                Next
                            </Button>
                            </nav>
                        </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {!selectedJobId && !isLoadingEmployerJobs && employerJobsData?.jobs?.length > 0 && (
            <div className="text-center py-10">
                <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold">Select a Job</h2>
                <p className="text-gray-500">Please select a job posting from the dropdown above to view its applications.</p>
            </div>
        )}
      </div>
    </div>
  );
}
