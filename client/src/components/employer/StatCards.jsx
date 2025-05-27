
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export function StatCards({ activeJobsCount, totalApplicants, newToday, profileViews }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-jobconnect-primary">{activeJobsCount}</div>
          <p className="text-sm text-gray-500 mt-1">Currently active job postings</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-jobconnect-secondary">{totalApplicants}</div>
          <p className="text-sm text-gray-500 mt-1">Across all active jobs</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">New Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-jobconnect-tertiary">{newToday}</div>
          <p className="text-sm text-gray-500 mt-1">New applications today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profile Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-jobconnect-info">{profileViews}</div>
          <p className="text-sm text-gray-500 mt-1">In the last 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
