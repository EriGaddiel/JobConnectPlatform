
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { JobCard } from "@/components/JobCard";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { JobCard } from "@/components/JobCard";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Building, Users, TrendingUp, Search, UserPlus, Edit, Award, Lightbulb, Zap, ShieldCheck, Palette, ShoppingBag, Hammer, Code } from "lucide-react"; // Added more icons

// Helper to format date (if needed for JobCard, though JobCard might handle it)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
};


export default function Landing() {
  const navigate = useNavigate();

  // Fetch featured jobs
  const { data: featuredJobsData, isLoading: isLoadingFeaturedJobs, isError: isErrorFeaturedJobs } = useQuery({
    queryKey: ['featuredJobs'],
    queryFn: async () => {
      try {
        const response = await getAllJobs({ limit: 4, status: 'open', sortBy: 'createdAt', sortOrder: 'desc' });
        if (response && response.data && Array.isArray(response.data.jobs)) {
          return response.data.jobs;
        }
        console.warn("Featured jobs API response was not in the expected format:", response);
        return []; // Return empty array on unexpected structure
      } catch (apiError) {
        console.error("Error fetching featured jobs in Landing.jsx:", apiError.response?.data?.error || apiError.message);
        throw apiError; // Re-throw for React Query to handle (isError will be true)
      }
    },
  });

  const featuredJobs = featuredJobsData || []; // Fallback remains useful

  // Stats data - these should ideally come from an API
  const platformStats = [
    { value: "10k+", label: "Active Jobs", icon: <Briefcase className="h-8 w-8 mb-2 text-jobconnect-primary" /> },
    { value: "8k+", label: "Companies Hiring", icon: <Building className="h-8 w-8 mb-2 text-jobconnect-primary" /> },
    { value: "15k+", label: "Skilled Job Seekers", icon: <Users className="h-8 w-8 mb-2 text-jobconnect-primary" /> },
    { value: "Top Rated", label: "User Satisfaction", icon: <TrendingUp className="h-8 w-8 mb-2 text-jobconnect-primary" /> }, // Changed from "95% Success Rate"
  ];

  const keyFeatures = [
    {
      icon: <Lightbulb className="h-8 w-8 text-jobconnect-primary" />,
      title: "Unified Job Market",
      description: "Access both traditional full-time roles and flexible gig opportunities in one seamless platform. No more juggling multiple sites!"
    },
    {
      icon: <Zap className="h-8 w-8 text-jobconnect-primary" />,
      title: "Smart Matching (Coming Soon)",
      description: "Our intelligent algorithms will connect you with the most relevant jobs or candidates, saving you time and effort."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-jobconnect-primary" />,
      title: "Secure & Direct Communication",
      description: "Connect directly and securely with employers or candidates through our integrated messaging system."
    },
  ];

  const popularCategories = [
    { name: "Software Development", icon: <Code className="h-6 w-6 text-jobconnect-primary" />, jobs: "1500+" },
    { name: "Creative & Design", icon: <Palette className="h-6 w-6 text-jobconnect-primary" />, jobs: "800+" },
    { name: "Delivery Services", icon: <ShoppingBag className="h-6 w-6 text-jobconnect-primary" />, jobs: "1200+" },
    { name: "Home Services", icon: <Hammer className="h-6 w-6 text-jobconnect-primary" />, jobs: "950+" },
  ];

  const handleGlobalSearch = (query, location) => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground"> {/* Use theme colors */}
      <Navbar />
      
      {/* Hero Section - Placeholder for potential dynamic background/illustration */}
      {/* <div className="absolute inset-0 -z-10"> POSSIBLE BACKGROUND ELEMENT </div> */}
      <section className="relative hero-pattern py-20 lg:py-32 overflow-hidden"> {/* Added relative and overflow-hidden for potential bg elements */}
        <div className="container px-4 mx-auto relative z-10"> {/* Added relative z-10 for content over bg */}
          <div className="max-w-3xl mx-auto text-center"> {/* Reduced max-width for tighter focus */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"> {/* Use font-extrabold */}
              {/* Option A Headline */}
              Unlock Your Next Opportunity.
              <span className="block sm:inline bg-gradient-to-r from-jobconnect-primary to-jobconnect-secondary bg-clip-text text-transparent mt-2 sm:mt-0"> Big or Small, We Connect All.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {/* Option A Sub-headline */}
              JobConnect: Seamlessly bridging the gap between traditional careers and the dynamic gig economy. Discover diverse roles or find the perfect talent, effortlessly.
            </p>
            <div className="max-w-2xl mx-auto"> {/* SearchBar slightly narrower */}
              <SearchBar
                className="mb-8 shadow-lg"
                placeholder="Job title, keywords, or company"
                onSearch={handleGlobalSearch} // Use the new handler
              />
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button asChild size="lg" className="px-8 py-6 text-lg w-full sm:w-auto"> {/* Larger, more prominent CTA */}
                  <Link to="/jobs"><Search className="mr-2 h-5 w-5"/>Find Jobs</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg w-full sm:w-auto">
                  <Link to="/post-job"><Briefcase className="mr-2 h-5 w-5"/>Post a Job</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats Section - Refactored */}
          <div className="mt-16 md:mt-24 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {platformStats.map(stat => (
              <div key={stat.label} className="p-4 rounded-lg bg-card/50 dark:bg-card/70 shadow-md">
                <div className="flex justify-center items-center">{stat.icon}</div>
                <div className="text-jobconnect-primary text-3xl lg:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section (New) */}
      <section className="py-16 lg:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose JobConnect?</h2>
            <p className="text-lg text-muted-foreground">
              Discover the advantages of a unified platform for all your employment needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section (New) */}
      <section className="py-16 lg:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore Popular Categories</h2>
            <p className="text-lg text-muted-foreground">
              Find opportunities in various sectors, from tech to trades.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map(category => (
              <Link key={category.name} to={`/jobs?category_like=${encodeURIComponent(category.name)}`} className="block group">
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:border-jobconnect-primary">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center items-center mb-4 text-jobconnect-primary group-hover:scale-110 transition-transform">
                        {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.jobs} Openings</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
           <div className="mt-12 text-center">
            <Button asChild variant="ghost" size="lg" className="text-jobconnect-primary">
              <Link to="/jobs">Browse All Categories &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Featured Jobs Section - Now Dynamic */}
      <section className="py-16 lg:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hot Off The Press: Featured Jobs</h2>
            <p className="text-lg text-muted-foreground">
              Handpicked opportunities to kickstart your search.
            </p>
          </div>
          {isLoadingFeaturedJobs && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4 space-y-3"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/4" /></Card>
              ))}
            </div>
          )}
          {!isLoadingFeaturedJobs && isErrorFeaturedJobs && <p className="text-center text-red-500">Could not load featured jobs.</p>}
          {!isLoadingFeaturedJobs && !isErrorFeaturedJobs && featuredJobs.length === 0 && <p className="text-center text-muted-foreground">No featured jobs available at the moment. Check back soon!</p>}
          {!isLoadingFeaturedJobs && !isErrorFeaturedJobs && featuredJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredJobs.map(job => (
                <JobCard
                    key={job._id}
                    id={job._id}
                    title={job.title}
                    company={job.companyName || (job.company?.name || "N/A")}
                    companyLogo={job.companyLogo || job.company?.logo}
                    location={job.location}
                    type={job.employmentType}
                    category={job.category}
                    salary={job.salary || (job.salaryMin && job.salaryMax ? `${job.currency || '$'}${job.salaryMin} - ${job.currency || '$'}${job.salaryMax}`: "Not Disclosed")}
                    posted={formatDate(job.createdAt)}
                    {...job}
                />
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Button asChild variant="default" size="lg" className="px-8 py-6 text-lg">
              <Link to="/jobs">Explore All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How JobConnect Works</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Simple steps to find your next opportunity or perfect candidate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16">
            {/* Step 1 */}
            <div className="text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-jobconnect-primary/10 text-jobconnect-primary flex items-center justify-center mx-auto mb-6 ring-4 ring-jobconnect-primary/20">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Create Your Profile</h3>
              <p className="text-muted-foreground">
                Join JobConnect easily as a job seeker or an employer. Build your profile in minutes to get started.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-jobconnect-secondary/10 text-jobconnect-secondary flex items-center justify-center mx-auto mb-6 ring-4 ring-jobconnect-secondary/20">
                <Search className="h-8 w-8" /> {/* Or Briefcase for employers */}
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Discover & Engage</h3>
              <p className="text-muted-foreground">
                Employers post diverse job openings. Job seekers explore and find roles matching their unique skills.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-jobconnect-tertiary/10 text-jobconnect-tertiary flex items-center justify-center mx-auto mb-6 ring-4 ring-jobconnect-tertiary/20">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Connect & Succeed</h3>
              <p className="text-muted-foreground">
                Apply, interview, hire, and grow your career or business
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center gap-6">
            <Button asChild size="lg" className="px-8">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Job Seekers & Employers Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">For Job Seekers</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Find opportunities that match your skills, experience, and preferences whether in formal corporate roles or flexible informal work.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Access both formal and informal job opportunities</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Create a professional profile to showcase your skills</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Get notifications for relevant job opportunities</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Track your job applications in one place</span>
                </li>
              </ul>
              
              <Button asChild className="w-full md:w-auto px-8">
                <Link to="/register?role=jobseeker">Find Jobs Now</Link>
              </Button>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">For Employers</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Post jobs and find the right talent for your business needs, from full-time corporate roles to flexible or short-term help.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Post jobs with custom application requirements</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Reach qualified candidates quickly</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Manage and review applications efficiently</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-jobconnect-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Build your employer brand and reputation</span>
                </li>
              </ul>
              
              <Button asChild variant="secondary" className="w-full md:w-auto px-8">
                <Link to="/register?role=employer">Post a Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Success stories from job seekers and employers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson"
              role="Hired as Marketing Manager"
              rating={5}
              content="JobConnect made my job search so much easier! I found a great marketing position within two weeks of signing up."
            />
            <TestimonialCard 
              name="Michael Rodriguez"
              role="Freelance Carpenter"
              rating={4}
              content="As someone in the informal job market, JobConnect has been a game-changer. I now have consistent work and better clients."
            />
            <TestimonialCard 
              name="Emma Thompson"
              role="HR Director at TechCorp"
              rating={5}
              content="We've found amazing talent through JobConnect. The platform is intuitive and the quality of candidates is excellent."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-jobconnect-primary text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take the Next Step?</h2>
            <p className="text-xl mb-8">
              Join thousands of job seekers and employers already using JobConnect
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="px-8">
                <Link to="/register">Create an Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-jobconnect-primary">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
