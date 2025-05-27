
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";
import { JobFilterSidebar } from "@/components/JobFilterSidebar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function JobListings() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("recent");

  // Sample job data
  const jobs = [
    {
      id: "job1",
      title: "Senior Web Developer",
      company: "TechCorp Inc",
      location: "New York, NY",
      type: "Full-time",
      category: "Formal",
      salary: "$80k - $120k",
      posted: "2 days ago"
    },
    {
      id: "job2",
      title: "Delivery Driver",
      company: "FastCourier",
      location: "Chicago, IL",
      type: "Part-time",
      category: "Informal",
      salary: "$15 - $25/hr",
      posted: "1 day ago"
    },
    {
      id: "job3",
      title: "Marketing Specialist",
      company: "BrandBoost",
      location: "Remote",
      type: "Contract",
      category: "Formal",
      salary: "$50k - $70k",
      posted: "3 days ago"
    },
    {
      id: "job4",
      title: "House Cleaner",
      company: "CleanHome Services",
      location: "Austin, TX",
      type: "Freelance",
      category: "Informal",
      salary: "$20 - $30/hr",
      posted: "Just now"
    },
    {
      id: "job5",
      title: "Financial Analyst",
      company: "Capital Management",
      location: "Boston, MA",
      type: "Full-time",
      category: "Formal",
      salary: "$70k - $90k",
      posted: "1 week ago"
    },
    {
      id: "job6",
      title: "Restaurant Server",
      company: "Fine Dining Co",
      location: "Miami, FL",
      type: "Part-time",
      category: "Informal",
      salary: "$15 - $25/hr + tips",
      posted: "3 days ago"
    },
    {
      id: "job7",
      title: "Software Engineer",
      company: "InnovateApps",
      location: "San Francisco, CA",
      type: "Full-time",
      category: "Formal",
      salary: "$100k - $150k",
      posted: "5 days ago"
    },
    {
      id: "job8",
      title: "Dog Walker",
      company: "Pet Pals",
      location: "Portland, OR",
      type: "Freelance",
      category: "Informal",
      salary: "$15 - $20/hr",
      posted: "2 weeks ago"
    }
  ];

  // Handler for filter changes
  const handleFilterChange = (filters) => {
    console.log("Filters applied:", filters);
    // Here you would implement the actual filtering logic if this was connected to an API
  };

  // Handler for search
  const handleSearch = (query, location) => {
    console.log("Search query:", query);
    console.log("Search location:", location);
    // Here you would implement the actual search logic if this was connected to an API
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Search Banner */}
          <div className="bg-jobconnect-primary rounded-lg p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Find Your Perfect Job</h1>
            <SearchBar 
              placeholder="Search job titles, keywords, or companies..." 
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="md:w-1/4 shrink-0">
              <JobFilterSidebar onFilterChange={handleFilterChange} />
            </div>
            
            {/* Job Listings */}
            <div className="flex-1">
              <div className="bg-white dark:bg-card rounded-lg border p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Browse All Jobs</h2>
                    <p className="text-gray-500 text-sm">Found {jobs.length} jobs matching your criteria</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1 md:flex-none"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1 md:flex-none"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                      </Button>
                    </div>
                    
                    <Select defaultValue={sortOption} onValueChange={(value) => setSortOption(value)}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="relevant">Most Relevant</SelectItem>
                        <SelectItem value="salary-high">Salary (High to Low)</SelectItem>
                        <SelectItem value="salary-low">Salary (Low to High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Job Cards */}
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-6"
              }>
                {jobs.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="px-4 bg-jobconnect-primary text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="px-4">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="px-4">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
