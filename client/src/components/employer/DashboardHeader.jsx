
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-gray-500">Manage your job postings and applications</p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/post-job">Post New Job</Link>
          </Button>
          <Button variant="outline">View Company Profile</Button>
        </div>
      </div>
    </header>
  );
}
