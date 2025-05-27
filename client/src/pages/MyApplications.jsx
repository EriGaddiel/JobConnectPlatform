
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Link } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MyApplications() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Sample applications data
  const applications = [
    {
      id: "app1",
      jobTitle: "Senior Web Developer",
      company: "TechCorp Inc",
      companyLogo: "",
      location: "New York, NY",
      appliedDate: "May 20, 2025",
      status: "In Review",
      description: "TechCorp Inc is looking for a Senior Web Developer to join our growing team."
    },
    {
      id: "app2",
      jobTitle: "Marketing Specialist",
      company: "BrandBoost",
      companyLogo: "",
      location: "Remote",
      appliedDate: "May 18, 2025",
      status: "Interview Scheduled",
      interview: {
        date: "May 25, 2025",
        time: "10:00 AM EST",
        type: "Video Call"
      },
      description: "Join our marketing team to help develop and implement marketing strategies."
    },
    {
      id: "app3",
      jobTitle: "Delivery Driver",
      company: "FastCourier",
      companyLogo: "",
      location: "Chicago, IL",
      appliedDate: "May 15, 2025",
      status: "Application Viewed",
      description: "Looking for reliable drivers to deliver packages in the Chicago area."
    },
    {
      id: "app4",
      jobTitle: "Frontend Developer",
      company: "WebSolutions Ltd",
      companyLogo: "",
      location: "Remote",
      appliedDate: "May 10, 2025",
      status: "Rejected",
      description: "Frontend development position for an experienced developer with React skills."
    },
    {
      id: "app5",
      jobTitle: "Customer Service Rep",
      company: "Support Heroes",
      companyLogo: "",
      location: "Chicago, IL",
      appliedDate: "May 5, 2025",
      status: "Hired",
      startDate: "June 1, 2025",
      description: "Join our customer service team to provide support to our clients."
    },
    {
      id: "app6",
      jobTitle: "House Cleaner",
      company: "CleanHome Services",
      companyLogo: "",
      location: "Austin, TX",
      appliedDate: "May 3, 2025",
      status: "Completed",
      completion: {
        date: "May 10, 2025",
        payment: "$120"
      },
      description: "One-time house cleaning job for a 3-bedroom home."
    }
  ];

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    toast.success("Thank you for your review!");
    setReviewDialogOpen(false);
    setRating(0);
    setReviewText("");
    setSelectedJob(null);
  };

  const openReviewDialog = (job) => {
    setSelectedJob(job);
    setReviewDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-500">Track and manage your job applications</p>
        </header>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {applications.map(app => (
              <ApplicationCard 
                key={app.id} 
                application={app}
                onReview={openReviewDialog} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-6">
            {applications
              .filter(app => ["In Review", "Application Viewed"].includes(app.status))
              .map(app => (
                <ApplicationCard 
                  key={app.id} 
                  application={app}
                  onReview={openReviewDialog}
                />
              ))
            }
          </TabsContent>
          
          <TabsContent value="interviews" className="space-y-6">
            {applications
              .filter(app => app.status === "Interview Scheduled")
              .map(app => (
                <ApplicationCard 
                  key={app.id} 
                  application={app}
                  onReview={openReviewDialog}
                />
              ))
            }
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {applications
              .filter(app => ["Hired", "Rejected", "Completed"].includes(app.status))
              .map(app => (
                <ApplicationCard 
                  key={app.id} 
                  application={app}
                  onReview={openReviewDialog}
                />
              ))
            }
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              {selectedJob && `Share your experience working with ${selectedJob.company} for the ${selectedJob.title} position.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jobconnect-primary`}
                    onClick={() => setRating(star)}
                  >
                    <svg
                      className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-gray-500">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What was your experience like working with this employer?"
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ApplicationCard({ application, onReview }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
              <div>
                <h2 className="text-xl font-bold">{application.jobTitle}</h2>
                <p className="text-gray-500">{application.company} • {application.location}</p>
              </div>
              <Badge variant="outline" className={
                application.status === "Interview Scheduled" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                application.status === "In Review" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                application.status === "Rejected" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                application.status === "Hired" || application.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }>
                {application.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{application.description}</p>
            
            <div className="text-sm mb-4">
              <div className="flex items-center">
                <span className="text-gray-500 min-w-32">Applied on:</span>
                <span>{application.appliedDate}</span>
              </div>
              
              {application.interview && (
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 min-w-32">Interview:</span>
                  <span>{application.interview.date} at {application.interview.time} ({application.interview.type})</span>
                </div>
              )}
              
              {application.startDate && (
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 min-w-32">Start date:</span>
                  <span>{application.startDate}</span>
                </div>
              )}
              
              {application.completion && (
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 min-w-32">Completed on:</span>
                  <span>{application.completion.date}</span>
                </div>
              )}
            </div>
            
            {application.status === "Interview Scheduled" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-800 p-1.5">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Your interview is scheduled</p>
                    <p className="text-sm">
                      {application.interview.date} at {application.interview.time} via {application.interview.type}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to={`/applications/${application.id}`}>View Details</Link>
              </Button>
              
              {(application.status === "Hired" || application.status === "Completed") && (
                <Button variant="outline" onClick={() => onReview({
                  id: application.id,
                  title: application.jobTitle,
                  company: application.company
                })}>
                  Leave a Review
                </Button>
              )}
              
              {application.status === "In Review" && (
                <Button variant="outline">
                  Withdraw Application
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
