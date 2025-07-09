import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardHeader, Title, Description
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator"; // Not explicitly used in original, can add if needed
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getJobById, getSimilarJobs } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Briefcase, CalendarDays, DollarSign, MapPin, Users, Globe, Building } from "lucide-react"; // Icons
import { JobCard } from "@/components/JobCard"; // For similar jobs

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};


export default function JobDetail() {
  const { id: jobId } = useParams(); // Renamed id to jobId for clarity
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const { data: job, isLoading, isError, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId).then(res => res.data),
    enabled: !!jobId, // Only run query if jobId is available
  });

  const { data: similarJobs, isLoading: isLoadingSimilarJobs } = useQuery({
    queryKey: ['similarJobs', jobId],
    queryFn: () => getSimilarJobs(jobId).then(res => res.data),
    enabled: !!job, // Only run if the main job data has been fetched
  });
  
  useEffect(() => {
    if(isError && error) {
        toast.error(error.response?.data?.error || "Failed to fetch job details.");
        // Optionally navigate back or to a 404 page
    }
  }, [isError, error]);


  // TODO: Implement actual save, share, report logic using API calls and useMutation
  const handleSaveJob = () => {
    toast.success("Job saved! (Feature coming soon)");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied to clipboard!");
  };

  const handleReport = () => {
    // TODO: Implement actual report functionality
    toast.info("Report submitted. (Feature coming soon)");
  };

  // Mutation for creating an application
  const { mutate: submitApplication, isPending: isSubmittingApplication } = useMutation({
    mutationFn: ({ jobId, payload }) => createApplication(jobId, payload),
    onSuccess: (data) => {
      toast.success(data.data.message || "Application submitted successfully!");
      setIsApplyDialogOpen(false);
      // Optionally, refetch applications for the user or update some local state
      // queryClient.invalidateQueries(['myApplications']); // If using React Query for myApplications
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to submit application. Please try again.");
    },
  });


  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const applicationFields = [];

    // Construct applicationFields from form data based on job.applicationRequirements
    (job?.applicationRequirements || []).forEach((req, index) => { // Added optional chaining and fallback
        const fieldName = req.name; // Use the actual name of the requirement
        const fieldType = req.type;
        let value;

        if (fieldType === 'file') {
            const fileInput = e.target[`field-${index}`]; // Access file input by its constructed ID
            if (fileInput && fileInput.files && fileInput.files[0]) {
                // SIMULATION: In a real app, upload file here and get URL/ID
                // For now, just using file name as a placeholder string value
                value = fileInput.files[0].name;
                // Real implementation:
                // const file = fileInput.files[0];
                // const uploadedFileUrl = await uploadFileService(file); // imaginary service
                // value = uploadedFileUrl;
            } else {
                value = ""; // Or handle as error if required and no file
            }
        } else {
             // FormData uses input names. Ensure your inputs have names if using new FormData(e.target)
             // Or, access by ID like the file input if IDs are consistent
             const inputElement = e.target[`field-${index}`];
             value = inputElement ? inputElement.value : formData.get(req.name) || ""; // Fallback if IDs aren't used for names
        }

        applicationFields.push({
            fieldName: fieldName, // Store the original field name
            fieldType: fieldType,
            value: value
        });
    });

    // console.log("Submitting application for job:", jobId, { applicationFields });
    submitApplication({ jobId, payload: { applicationFields } });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-6" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="w-full lg:w-80 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !job) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">Error loading job details.</h1>
          <p>{error?.response?.data?.error || error?.message || "The job might not exist or an error occurred."}</p>
          <Button asChild className="mt-4">
            <Link to="/jobs">Back to Job Listings</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  // Safely access nested company data, now job.company is the direct populated object
  const companyInfo = job.company || {};

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-grow">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={`${job.companyName} logo`} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <span className="text-2xl font-bold">{job.companyName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h1 className="text-2xl lg:text-3xl font-bold mb-1">{job.title}</h1>
                          <p className="text-gray-500 dark:text-gray-400">
                            <Link to={`/companies/${companyInfo._id}`} className="hover:underline">{job.companyName}</Link> • {job.location}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0 shrink-0">
                          <Button onClick={handleSaveJob} variant="outline">Save Job</Button>
                          <Button variant="outline" onClick={handleShare}>Share</Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant={job.category === "Formal" ? "default" : "secondary"} className={job.category === "Formal" ? "bg-jobconnect-formal text-white" : "bg-jobconnect-informal text-white"}>
                          {job.category}
                        </Badge>
                        <Badge variant="outline">{job.employmentType}</Badge>
                        {job.salary && <Badge variant="outline">{job.salary}</Badge>}
                        {job.remotePolicy && <Badge variant="outline">{job.remotePolicy}</Badge>}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
                        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg">Apply Now</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Apply for {job.title} at {job.companyName}</DialogTitle>
                              <DialogDescription>
                                Complete the application form below. Required fields are marked with <span className="text-red-500">*</span>.
                              </DialogDescription>
                            </DialogHeader>
                            {/* Application form will be updated in a later step */}
                            <form onSubmit={handleApplySubmit} className="space-y-6 py-4">
                              {(job.applicationRequirements && job.applicationRequirements.length > 0) ? job.applicationRequirements.map((req, index) => (
                                <div key={index} className="space-y-2">
                                  <label htmlFor={`field-${index}`} className="text-sm font-medium">
                                    {req.name} {req.required && <span className="text-red-500">*</span>}
                                  </label>
                                  
                                  {req.type === "file" && (
                                    <Input type="file" id={`field-${index}`} required={req.required} />
                                  )}
                                  {req.type === "text" && (
                                    <Input type="text" id={`field-${index}`} required={req.required} placeholder={req.name} />
                                  )}
                                  {req.type === "number" && (
                                    <Input type="number" id={`field-${index}`} required={req.required} placeholder={req.name} min="0"/>
                                  )}
                                  {req.type === "textarea" && (
                                    <textarea id={`field-${index}`} required={req.required} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm min-h-[100px]" placeholder={req.name} />
                                  )}
                                </div>
                              )) : <p>This job has no specific application questions. You can submit your general profile.</p>}
                              
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsApplyDialogOpen(false)} disabled={isSubmittingApplication}>Cancel</Button>
                                <Button type="submit" disabled={isSubmittingApplication}>
                                  {isSubmittingApplication ? "Submitting..." : "Submit Application"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <p>Posted: {formatDate(job.createdAt)}</p>
                          {job.applicationDeadline && <p>Apply before: {formatDate(job.applicationDeadline)}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <Tabs defaultValue="description">
                    <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-3">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="company">Company</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews (Coming Soon)</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="space-y-6 prose dark:prose-invert max-w-none">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Job Description</h2>
                        <p>{job.description}</p>
                      </div>
                      
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                          <ul>{job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        </div>
                      )}
                      
                      {job.requirements && job.requirements.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                          <ul>{job.requirements.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        </div>
                      )}

                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                          <ul>{job.benefits.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        </div>
                      )}
                       {job.applicationInstructions && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Application Instructions</h3>
                            <p>{job.applicationInstructions}</p>
                        </div>
                       )}
                    </TabsContent>

                    <TabsContent value="company" className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">About {companyInfo.name || job.companyName}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{companyInfo.description || "No company description available."}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {companyInfo.industry && <div><h3 className="text-md font-semibold mb-1">Industry</h3><p className="text-gray-600 dark:text-gray-300">{companyInfo.industry}</p></div>}
                        {companyInfo.companySize && <div><h3 className="text-md font-semibold mb-1">Company Size</h3><p className="text-gray-600 dark:text-gray-300">{companyInfo.companySize}</p></div>}
                        {companyInfo.location && <div><h3 className="text-md font-semibold mb-1">Headquarters</h3><p className="text-gray-600 dark:text-gray-300">{companyInfo.location}</p></div>}
                        {companyInfo.foundedYear && <div><h3 className="text-md font-semibold mb-1">Founded</h3><p className="text-gray-600 dark:text-gray-300">{companyInfo.foundedYear}</p></div>}
                        {companyInfo.website && <div><h3 className="text-md font-semibold mb-1">Website</h3><a href={companyInfo.website} target="_blank" rel="noreferrer" className="text-jobconnect-primary hover:underline">{companyInfo.website.replace(/^https?:\/\//, '')}</a></div>}
                      </div>
                      {/* TODO: Add "More jobs at this company" section if API supports it */}
                    </TabsContent>
                    
                    <TabsContent value="reviews">
                      <p className="text-gray-500">Company reviews feature coming soon.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-96 space-y-6 shrink-0"> {/* Increased width for better layout */}
              <Card>
                <CardHeader>
                    <CardTitle>Apply Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Ready to take the next step? Submit your application today.
                  </p>
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mb-2">Apply for this Job</Button>
                    </DialogTrigger>
                    {/* Dialog content defined above */}
                  </Dialog>
                  <Button variant="outline" className="w-full" onClick={handleSaveJob}>
                    Save Job
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                    <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-500" /> Job Type: <span className="font-medium ml-auto">{job.employmentType}</span></div>
                    <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-gray-500" /> Category: <span className="font-medium ml-auto">{job.category}</span></div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-500" /> Location: <span className="font-medium ml-auto">{job.location}</span></div>
                    {job.salary && <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-gray-500" /> Salary: <span className="font-medium ml-auto">{job.salary}</span></div>}
                    {job.experienceLevel && <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-gray-500" /> Experience: <span className="font-medium ml-auto">{job.experienceLevel}</span></div>}
                    {job.remotePolicy && <div className="flex items-center"><Globe className="w-4 h-4 mr-2 text-gray-500" /> Remote Policy: <span className="font-medium ml-auto">{job.remotePolicy}</span></div>}
                    <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-gray-500" /> Posted: <span className="font-medium ml-auto">{formatDate(job.createdAt)}</span></div>
                    {job.applicationDeadline && <div className="flex items-center text-red-600 dark:text-red-400"><CalendarDays className="w-4 h-4 mr-2" /> Deadline: <span className="font-medium ml-auto">{formatDate(job.applicationDeadline)}</span></div>}
                </CardContent>
              </Card>
              
             {similarJobs && similarJobs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Similar Jobs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {isLoadingSimilarJobs && <p>Loading similar jobs...</p>}
                    {!isLoadingSimilarJobs && similarJobs.map(sJob => (
                        <JobCard
                            key={sJob._id}
                            id={sJob._id}
                            title={sJob.title}
                            company={sJob.companyName || (sJob.company?.name || "N/A")}
                            companyLogo={sJob.companyLogo || sJob.company?.logo}
                            location={sJob.location}
                            type={sJob.employmentType}
                            category={sJob.category}
                            salary={sJob.salary || (sJob.salaryMin && sJob.salaryMax ? `${sJob.currency || '$'}${sJob.salaryMin} - ${sJob.currency || '$'}${sJob.salaryMax}`: "Not Disclosed")}
                            posted={new Date(sJob.createdAt).toLocaleDateString()}
                            compact={true} // Assuming JobCard has a compact mode
                            {...sJob}
                        />
                    ))}
                    <Button variant="outline" className="w-full mt-2" asChild>
                        <Link to="/jobs">Browse More Jobs</Link>
                    </Button>
                    </CardContent>
                </Card>
             )}
              
              <div className="text-center mt-4">
                <Button variant="ghost" size="sm" onClick={handleReport} className="text-xs text-gray-500 hover:text-red-500">
                  Report This Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
