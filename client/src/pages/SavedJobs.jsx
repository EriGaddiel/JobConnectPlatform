import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "@/components/JobCard";

export default function SavedJobs() {
  const [savedJobs] = useState([
    {
      id: "job1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc",
      location: "New York, NY",
      type: "Full-time",
      category: "Formal",
      salary: "$90k - $120k",
      posted: "3 days ago",
      saved: true
    },
    {
      id: "job2",
      title: "UX/UI Designer",
      company: "Creative Agency",
      location: "Remote",
      type: "Contract",
      category: "Formal",
      salary: "$70k - $90k",
      posted: "1 week ago",
      saved: true
    },
    {
      id: "job3",
      title: "Content Manager",
      company: "Media Group",
      location: "Chicago, IL",
      type: "Full-time",
      category: "Formal",
      salary: "$60k - $80k",
      posted: "2 weeks ago",
      saved: true
    },
    {
      id: "job4",
      title: "Delivery Driver",
      company: "Local Express",
      location: "Boston, MA",
      type: "Part-time",
      category: "Informal",
      salary: "$18 - $25/hr",
      posted: "5 days ago",
      saved: true
    },
    {
      id: "job5",
      title: "Home Cleaner",
      company: "CleanCo",
      location: "Los Angeles, CA",
      type: "Part-time",
      category: "Informal",
      salary: "$22 - $30/hr",
      posted: "3 days ago",
      saved: true
    }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Saved Jobs</h1>
              <p className="text-gray-500">Jobs you've saved for later</p>
            </div>
          </div>
        </header>
        
        {savedJobs.length > 0 ? (
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Saved ({savedJobs.length})</TabsTrigger>
              <TabsTrigger value="formal">Formal ({savedJobs.filter(job => job.category === "Formal").length})</TabsTrigger>
              <TabsTrigger value="informal">Informal ({savedJobs.filter(job => job.category === "Informal").length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="formal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.filter(job => job.category === "Formal").map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="informal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.filter(job => job.category === "Informal").map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto max-w-md">
                <h3 className="text-xl font-bold mb-2">No Saved Jobs</h3>
                <p className="text-gray-500 mb-6">
                  You haven't saved any jobs yet. Browse jobs and click the save icon to keep track of interesting opportunities.
                </p>
                <Button asChild>
                  <a href="/jobs">Browse Jobs</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {savedJobs.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">Job Alert</h2>
            <Card>
              <CardHeader>
                <CardTitle>Get notified about similar jobs</CardTitle>
                <CardDescription>Create a job alert to receive notifications when new jobs match your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge>Web Development</Badge>
                      <Badge>Remote</Badge>
                      <Badge>Full-time</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Based on your saved jobs, we recommend setting up alerts for these keywords
                    </p>
                  </div>
                  <Button>Create Job Alert</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
