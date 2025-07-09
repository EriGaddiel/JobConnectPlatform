
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Edit, Eye, Trash2, Briefcase, Users, CalendarDays, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPostedJobs, deleteJob as apiDeleteJob } from "@/services/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function EmployerJobs() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams(); // For potential filtering/pagination later
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  // Add state for status filter if needed: const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");

  const { data: jobsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myPostedJobs', currentPage /*, statusFilter */],
    queryFn: () => getMyPostedJobs({ page: currentPage, limit: 5 /*, status: statusFilter === 'all' ? undefined : statusFilter */ }).then(res => res.data),
    // keepPreviousData: true,
  });

  useEffect(() => {
    if(isError && error) {
        toast.error(error.response?.data?.error || "Failed to fetch your jobs.");
    }
  }, [isError, error]);

  const deleteJobMutation = useMutation({
    mutationFn: (jobId) => apiDeleteJob(jobId),
    onSuccess: (data) => {
      toast.success(data.data.message || "Job deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['myPostedJobs'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete job.");
    }
  });

  const handleDeleteJob = (jobId) => {
    // Confirmation is handled by AlertDialog
    deleteJobMutation.mutate(jobId);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (jobsData?.totalPages || 1)) {
        setCurrentPage(newPage);
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set("page", newPage.toString());
        setSearchParams(currentParams);
        window.scrollTo(0,0);
    }
  };

  const jobs = jobsData?.jobs || [];
  const totalPages = jobsData?.totalPages || 1;

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "open": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "closed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default: return "secondary";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="employer" />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-gray-500">Manage your job postings</p>
          </div>
          <Button asChild>
            <Link to="/post-job">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* TODO: Add filters for job status (open, closed, draft) */}

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
            ))}
          </div>
        )}

        {!isLoading && isError && (
           <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Could Not Load Your Jobs</h2>
            <p className="text-red-600 dark:text-red-300 mb-6">{error?.response?.data?.error || error?.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <div className="text-center py-10">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold">No Jobs Posted Yet</h2>
            <p className="text-gray-500 mb-6">Click "Post New Job" to get started.</p>
          </div>
        )}

        {!isLoading && !isError && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link to={`/jobs/${job._id}`} className="hover:underline">
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><CalendarDays className="mr-1 h-4 w-4" /> Posted: {formatDate(job.createdAt)}</span>
                        {job.applicationDeadline && <span className="flex items-center"><CalendarDays className="mr-1 h-4 w-4 text-red-500" /> Expires: {formatDate(job.applicationDeadline)}</span>}
                        <span className="flex items-center"><Users className="mr-1 h-4 w-4" /> {job.applicationCount || 0} applicants</span>
                        <span className="flex items-center"><Eye className="mr-1 h-4 w-4" /> {job.views || 0} views</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0 shrink-0">
                      <Badge variant="outline" className={getStatusBadgeVariant(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      <div className="flex gap-1 mt-2 sm:mt-0">
                        <Button size="sm" variant="outline" asChild title="View Applicants">
                           <Link to={`/employer/applications?jobId=${job._id}`}><Users className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild title="Edit Job">
                          {/* TODO: Link to an edit page, e.g., /employer/jobs/edit/${job._id} */}
                          <Link to={`/post-job?edit=${job._id}`}><Edit className="h-4 w-4" /></Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:border-red-500" title="Delete Job">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the job posting "{job.title}" and all associated applications.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteJob(job._id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteJobMutation.isPending && deleteJobMutation.variables === job._id}
                              >
                                {deleteJobMutation.isPending && deleteJobMutation.variables === job._id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
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
          </div>
        )}
      </div>
    </div>
  );
}
