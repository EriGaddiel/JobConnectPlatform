
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";

export default function EmployerJobs() {
  const jobs = [
    {
      id: 1,
      title: "Senior Web Developer",
      status: "Active",
      applicants: 12,
      postedDate: "May 15, 2025",
      expiryDate: "June 15, 2025"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      status: "Active",
      applicants: 8,
      postedDate: "May 18, 2025",
      expiryDate: "June 18, 2025"
    },
    {
      id: 3,
      title: "Content Writer",
      status: "Draft",
      applicants: 0,
      postedDate: "May 20, 2025",
      expiryDate: "June 20, 2025"
    }
  ];

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

        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Posted: {job.postedDate}</span>
                      <span>Expires: {job.expiryDate}</span>
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
