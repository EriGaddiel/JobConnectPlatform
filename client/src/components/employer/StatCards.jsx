
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { TrendingUp, Users, Briefcase, Eye } from "lucide-react"; // Added icons

export function StatCards({ activeJobsCount, totalApplicants, applicationsLast30Days /* profileViews is removed */ }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> {/* Changed to 3 columns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jobconnect-primary">{activeJobsCount}</div>
          <p className="text-xs text-muted-foreground">Currently open job postings</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jobconnect-secondary">{totalApplicants}</div>
          <p className="text-xs text-muted-foreground">Across all company jobs</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Applications</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jobconnect-tertiary">{applicationsLast30Days}</div>
          <p className="text-xs text-muted-foreground">In the last 30 days</p>
        </CardContent>
      </Card>
      
      {/* Profile Views card removed as data is not available from the current endpoint
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jobconnect-info">{profileViews || "N/A"}</div>
          <p className="text-xs text-muted-foreground">Company profile views (coming soon)</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
