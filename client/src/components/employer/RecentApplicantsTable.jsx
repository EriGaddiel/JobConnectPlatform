
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageSquare } from "lucide-react";

export function RecentApplicantsTable({ applicants }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Reviewed": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Interview": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Shortlisted": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Latest applications across all your job postings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={applicant.avatar} />
                  <AvatarFallback>
                    {applicant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{applicant.name}</h3>
                  <p className="text-sm text-gray-500">{applicant.position}</p>
                  <p className="text-xs text-gray-400">Applied {applicant.appliedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(applicant.status)}>
                  {applicant.status}
                </Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
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
  );
}
