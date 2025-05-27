import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const jobsRequiringReview = [
    { id: "job1", title: "Financial Consultant", company: "MoneyWise Inc", type: "Formal", status: "Pending Review", reportedReason: "Misleading Information" },
    { id: "job2", title: "Construction Worker", company: "BuildRight", type: "Informal", status: "Pending Review", reportedReason: "Inappropriate Content" },
    { id: "job3", title: "Marketing Internship", company: "AdGenius", type: "Formal", status: "Pending Review", reportedReason: "Suspicious Activity" }
  ];

  const recentReviews = [
    { id: "rev1", jobTitle: "Software Engineer", company: "TechSolutions", reviewer: "John Smith", rating: 4, status: "Pending" },
    { id: "rev2", jobTitle: "Graphic Designer", company: "CreativeMinds", reviewer: "Emma Thompson", rating: 2, status: "Pending" },
    { id: "rev3", jobTitle: "Customer Service", company: "ServiceFirst", reviewer: "Michael Rodriguez", rating: 1, status: "Pending", flagged: true }
  ];

  const recentUsers = [
    { id: "user1", name: "David Lee", email: "david.lee@example.com", role: "Job Seeker", joinDate: "May 20, 2025", status: "Active" },
    { id: "user2", name: "Lisa Johnson", email: "lisa.johnson@company.com", role: "Employer", joinDate: "May 19, 2025", status: "Active" },
    { id: "user3", name: "Robert Garcia", email: "robert.garcia@example.com", role: "Job Seeker", joinDate: "May 18, 2025", status: "Flagged" }
  ];

  const handleApprove = (id, type) => {
    toast.success(`${type} has been approved`);
  };

  const handleReject = (id, type) => {
    toast.success(`${type} has been rejected`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="admin" />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500">Manage site content and user accounts</p>
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Search users, jobs, reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Button>Search</Button>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-jobconnect-primary">15,423</div>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-green-500">+127</span> new this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-jobconnect-secondary">8,745</div>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-green-500">+85</span> new this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-jobconnect-error">23</div>
              <p className="text-sm text-gray-500 mt-1">
                Pending review and action
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Site Activity</CardTitle>
                  <CardDescription>Recent activity overview</CardDescription>
                </div>
                <Button variant="outline" size="sm">Generate Report</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content Review</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left bg-gray-50 dark:bg-gray-800">
                          <th className="px-4 py-3 font-medium">Job Title</th>
                          <th className="px-4 py-3 font-medium">Company</th>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Reason</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {jobsRequiringReview.map(job => (
                          <tr key={job.id}>
                            <td className="px-4 py-4">{job.title}</td>
                            <td className="px-4 py-4">{job.company}</td>
                            <td className="px-4 py-4">
                              <Badge variant={job.type === "Formal" ? "default" : "secondary"} className={job.type === "Formal" ? "bg-jobconnect-formal" : "bg-jobconnect-informal"}>
                                {job.type}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                {job.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">{job.reportedReason}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleApprove(job.id, "Job")}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleReject(job.id, "Job")}>
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="users">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left bg-gray-50 dark:bg-gray-800">
                          <th className="px-4 py-3 font-medium">User</th>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Role</th>
                          <th className="px-4 py-3 font-medium">Join Date</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentUsers.map(user => (
                          <tr key={user.id}>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {user.name}
                              </div>
                            </td>
                            <td className="px-4 py-4">{user.email}</td>
                            <td className="px-4 py-4">{user.role}</td>
                            <td className="px-4 py-4">{user.joinDate}</td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className={
                                user.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/admin/users/${user.id}`}>View</Link>
                                </Button>
                                {user.status === "Flagged" ? (
                                  <Button size="sm" variant="outline" onClick={() => handleApprove(user.id, "User")}>
                                    Approve
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                                    Flag
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left bg-gray-50 dark:bg-gray-800">
                          <th className="px-4 py-3 font-medium">Job</th>
                          <th className="px-4 py-3 font-medium">Company</th>
                          <th className="px-4 py-3 font-medium">Reviewer</th>
                          <th className="px-4 py-3 font-medium">Rating</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentReviews.map(review => (
                          <tr key={review.id} className={review.flagged ? "bg-red-50 dark:bg-red-900/20" : ""}>
                            <td className="px-4 py-4">{review.jobTitle}</td>
                            <td className="px-4 py-4">{review.company}</td>
                            <td className="px-4 py-4">{review.reviewer}</td>
                            <td className="px-4 py-4">{review.rating} / 5</td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                {review.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleApprove(review.id, "Review")}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleReject(review.id, "Review")}>
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Overview of key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                [Chart: User growth, job postings, and applications over time]
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system status and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Server Status</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Healthy</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">CPU Usage</div>
                      <div className="text-xl font-bold">24%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Memory</div>
                      <div className="text-xl font-bold">52%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Disk Space</div>
                      <div className="text-xl font-bold">37%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Response Time</div>
                      <div className="text-xl font-bold">120ms</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recent Events</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Database Backup Completed</div>
                      <div className="text-gray-500">May 22, 2025 - 03:00 AM</div>
                    </li>
                    <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">System Update Deployed</div>
                      <div className="text-gray-500">May 21, 2025 - 11:30 PM</div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
