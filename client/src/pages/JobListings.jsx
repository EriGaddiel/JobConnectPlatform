
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
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";
import { JobFilterSidebar } from "@/components/JobFilterSidebar";
// import { Input } from "@/components/ui/input"; // Not directly used, SearchBar handles it
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "@/services/api"; // Import the API service
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { toast } from "sonner";

const DEBOUNCE_DELAY = 500; // ms for search input debounce

export default function JobListings() {
  const [searchParams, setSearchParams] = useSearchParams();

  // View and Sort state
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState(searchParams.get("sortBy") || "createdAt_desc"); // Default to newest

  // Filter and Search Query State
  // Initialize from URL params or defaults
  const [filters, setFilters] = useState({
    type: searchParams.getAll("type") || [], // employmentType
    category: searchParams.getAll("category") || [],
    experienceLevel: searchParams.getAll("experienceLevel") || [],
    remotePolicy: searchParams.getAll("remotePolicy") || [],
    // Add salary range if your sidebar supports it
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Debounced search terms for API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [debouncedLocationQuery, setDebouncedLocationQuery] = useState(locationQuery);

  // Effect for debouncing search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocationQuery(locationQuery);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [locationQuery]);

  // Update URL search params when filters, search, sort or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
    if (debouncedLocationQuery) params.set("location", debouncedLocationQuery);

    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values)) values.forEach(value => params.append(key, value));
      else if (values) params.set(key, values);
    });

    if (sortOption) {
        const [sortBy, sortOrder] = sortOption.split('_');
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
    }
    if (currentPage > 1) params.set("page", currentPage.toString());
    else params.delete("page"); // Don't show page=1 in URL

    setSearchParams(params, { replace: true }); // Use replace to avoid multiple history entries for quick changes
  }, [debouncedSearchQuery, debouncedLocationQuery, filters, sortOption, currentPage, setSearchParams]);


  // React Query for fetching jobs
  const { data: jobData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['jobs', debouncedSearchQuery, debouncedLocationQuery, filters, sortOption, currentPage],
    queryFn: async () => {
      const params = {
        search: debouncedSearchQuery,
        location: debouncedLocationQuery,
        ...filters, // Spread filter object
        page: currentPage,
        limit: 9, // Or your preferred limit
      };
      if (sortOption) {
        const [sortBy, sortOrder] = sortOption.split('_');
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }
      return getAllJobs(params).then(res => res.data); // Assuming API returns { jobs, totalPages, currentPage, totalJobs }
    },
    // keepPreviousData: true, // Consider for smoother pagination experience
  });

  useEffect(() => {
    if(isError && error) {
        toast.error(error.response?.data?.error || "Failed to fetch jobs.");
    }
  }, [isError, error]);


  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleSearch = (query, location) => {
    setSearchQuery(query);
    setLocationQuery(location);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1); // Reset to page 1 on sort change
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (jobData?.totalPages || 1)) {
        setCurrentPage(newPage);
        window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  const jobs = jobData?.jobs || [];
  const totalJobs = jobData?.totalJobs || 0;
  const totalPages = jobData?.totalPages || 1;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-jobconnect-primary rounded-lg p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Find Your Perfect Job</h1>
            <SearchBar
              initialQuery={searchQuery}
              initialLocation={locationQuery}
              placeholder="Search job titles, keywords, or companies..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 shrink-0">
              <JobFilterSidebar
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>
            
            <div className="flex-1">
              <div className="bg-white dark:bg-card rounded-lg border p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Browse All Jobs</h2>
                    <p className="text-gray-500 text-sm">
                      {isLoading ? "Loading jobs..." : `Found ${totalJobs} jobs matching your criteria`}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1 md:flex-none"
                        aria-label="Grid view"
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
                        aria-label="List view"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                      </Button>
                    </div>
                    
                    <Select value={sortOption} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt_desc">Most Recent</SelectItem>
                        <SelectItem value="score_desc">Most Relevant</SelectItem> {/* Assuming backend sorts by score when search is active */}
                        <SelectItem value="salaryMax_desc">Salary (High to Low)</SelectItem>
                        <SelectItem value="salaryMin_asc">Salary (Low to High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {isLoading && (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                  {[...Array(6)].map((_, i) => ( // Show 6 skeletons
                    <Card key={i} className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoading && isError && (
                <div className="text-center py-10">
                  <p className="text-red-500">Failed to load jobs. Please try again later.</p>
                  <Button onClick={() => refetch()} className="mt-4">Retry</Button>
                </div>
              )}

              {!isLoading && !isError && jobs.length === 0 && (
                <div className="text-center py-16"> {/* Increased padding */}
                  <Search className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" strokeWidth={1.5} />
                  <h3 className="text-2xl font-semibold mb-2">No Jobs Found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any jobs matching your current search and filters.
                    <br />
                    Try adjusting your criteria or broadening your search.
                  </p>
                  {/* Example: Button to clear filters - requires clearFilters function */}
                  {/* <Button variant="outline" onClick={() => console.log('Clear filters clicked')}>Clear Filters</Button> */}
                </div>
              )}

              {!isLoading && !isError && jobs.length > 0 && (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                  {jobs.map(job => (
                    // Assuming JobCard is updated to take API data structure
                    // Key change: job.company is now an object if populated, or ID. JobCard might expect job.companyName
                    <JobCard
                        key={job._id}
                        id={job._id} // Pass ID for navigation
                        title={job.title}
                        company={job.companyName || (job.company?.name || "N/A")} // Adjust based on JobCard props
                        companyLogo={job.companyLogo || job.company?.logo}
                        location={job.location}
                        type={job.employmentType} // API uses employmentType
                        category={job.category}
                        salary={job.salary || (job.salaryMin && job.salaryMax ? `${job.currency || '$'}${job.salaryMin} - ${job.currency || '$'}${job.salaryMax}`: "Not Disclosed")}
                        posted={new Date(job.createdAt).toLocaleDateString()} // Format date
                        // Pass other necessary props from 'job' object to JobCard
                        {...job} // Spread the rest if JobCard handles it
                    />
                  ))}
                </div>
              )}
              
              {totalPages > 1 && !isLoading && !isError && jobs.length > 0 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {/* Simple pagination: show current page and ellipsis if too many pages */}
                    {/* A more complex pagination component would be better for many pages */}
                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Logic to show limited page numbers e.g. first, last, current, and some around current
                        if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                           return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                className="px-4"
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </Button>
                           );
                        } else if (
                            (pageNum === currentPage - 2 && currentPage > 3) ||
                            (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                            return <span key={`ellipsis-${pageNum}`} className="px-2">...</span>;
                        }
                        return null;
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
