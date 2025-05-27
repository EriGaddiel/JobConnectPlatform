
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Link } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { JobCard } from "@/components/JobCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function JobSeekerDashboard() {
  const [notifications] = useState([
    { id: 1, title: "Application Viewed", description: "Your application for Senior Web Developer has been viewed by TechCorp Inc.", time: "2 hours ago" },
    { id: 2, title: "Interview Invitation", description: "You've been invited to interview for Marketing Specialist at BrandBoost.", time: "1 day ago" },
    { id: 3, title: "New Message", description: "You have a new message from FastCourier regarding your application.", time: "3 days ago" },
  ]);

  const recentApplications = [
    {
      id: "app1",
      jobTitle: "Senior Web Developer",
      company: "TechCorp Inc",
      date: "May 20, 2025",
      status: "In Review",
    },
    {
      id: "app2",
      jobTitle: "Marketing Specialist",
      company: "BrandBoost",
      date: "May 18, 2025",
      status: "Interview Scheduled",
    },
    {
      id: "app3",
      jobTitle: "Delivery Driver",
      company: "FastCourier",
      date: "May 15, 2025",
      status: "Application Viewed",
    },
  ];

  const recommendedJobs = [
    {
      id: "job1",
      title: "Front-end Developer",
      company: "WebSolutions Ltd",
      location: "Remote",
      type: "Full-time",
      category: "Formal",
      salary: "$70k - $90k",
      posted: "1 day ago"
    },
    {
      id: "job2",
      title: "Graphic Designer",
      company: "Creative Agency",
      location: "New York, NY",
      type: "Contract",
      category: "Formal",
      salary: "$45k - $60k",
      posted: "2 days ago"
    },
    {
      id: "job3",
      title: "Customer Service Rep",
      company: "Support Heroes",
      location: "Chicago, IL",
      type: "Part-time",
      category: "Informal",
      salary: "$18 - $22/hr",
      posted: "Just now"
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-gray-500">Here's what's happening with your job search</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <CardDescription>Complete your profile to attract employers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-sm">75% Complete</span>
                  <span className="text-sm font-medium text-jobconnect-primary">3/4 sections</span>
                </div>
                <Progress value={75} className="h-2" />
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Personal Information</span>
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Education</span>
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Work Experience</span>
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Skills & Certifications</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/profile/skills">Complete</Link>
                    </Button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Application Statistics</CardTitle>
              <CardDescription>Your job application activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-jobconnect-primary">8</p>
                  <p className="text-sm text-gray-500">Applications</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-jobconnect-secondary">3</p>
                  <p className="text-sm text-gray-500">Interviews</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-500">1</p>
                  <p className="text-sm text-gray-500">Offers</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-jobconnect-tertiary">12</p>
                  <p className="text-sm text-gray-500">Saved Jobs</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/applications">View All Applications</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Your recent activity updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link to="/notifications">View All Notifications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/applications">View All</Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="px-4 py-3">Job Title</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Date Applied</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentApplications.map(app => (
                    <tr key={app.id}>
                      <td className="px-4 py-3">{app.jobTitle}</td>
                      <td className="px-4 py-3">{app.company}</td>
                      <td className="px-4 py-3">{app.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={
                          app.status === "Interview Scheduled" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                          app.status === "In Review" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/applications/${app.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recommended for You</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/jobs">Browse All Jobs</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedJobs.map(job => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Profile</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <div className="bg-jobconnect-primary h-24"></div>
            <div className="p-6 pt-0 -mt-12">
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl">JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">John Smith</h3>
                  <p className="text-gray-500">Web Developer at TechCorp Inc</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={4.5} size="sm" />
                    <span className="text-sm text-gray-500">(12 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p>New York, NY (Open to Remote)</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Top Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">JavaScript</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">UI/UX Design</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
