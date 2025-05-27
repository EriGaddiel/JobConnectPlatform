
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Download, MessageSquare } from "lucide-react";

export default function EmployerApplications() {
  const applications = [
    {
      id: 1,
      name: "Emma Thompson",
      email: "emma@example.com",
      position: "Senior Web Developer",
      appliedDate: "May 21, 2025",
      status: "New",
      avatar: ""
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "michael@example.com",
      position: "UI/UX Designer",
      appliedDate: "May 20, 2025",
      status: "Reviewed",
      avatar: ""
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      position: "Content Writer",
      appliedDate: "May 19, 2025",
      status: "Interview",
      avatar: ""
    },
    {
      id: 4,
      name: "David Lee",
      email: "david@example.com",
      position: "Senior Web Developer",
      appliedDate: "May 18, 2025",
      status: "Shortlisted",
      avatar: ""
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Reviewed": return "bg-yellow-100 text-yellow-800";
      case "Interview": return "bg-green-100 text-green-800";
      case "Shortlisted": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="employer" />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-500">Review and manage job applications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest applications across all your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={application.avatar} />
                      <AvatarFallback>
                        {application.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{application.name}</h3>
                      <p className="text-sm text-gray-500">{application.email}</p>
                      <p className="text-sm font-medium">{application.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{application.appliedDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
