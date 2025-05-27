
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { JobCard } from "@/components/JobCard";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Link } from "react-router-dom";

export default function Landing() {
  // Sample featured jobs data
  const featuredJobs = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-pattern py-20 lg:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-jobconnect-primary to-jobconnect-secondary bg-clip-text text-transparent">
              Find Your Perfect Job Match
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Connecting talent with opportunity across formal and informal job markets
            </p>
            <div className="max-w-3xl mx-auto">
              <SearchBar className="mb-8" />
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="px-8">
                  <Link to="/jobs">Find Jobs</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link to="/post-job">Post a Job</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-4">
              <div className="text-jobconnect-primary text-4xl font-bold mb-2">10k+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Jobs</div>
            </div>
            <div className="text-center p-4">
              <div className="text-jobconnect-primary text-4xl font-bold mb-2">8k+</div>
              <div className="text-gray-600 dark:text-gray-300">Companies</div>
            </div>
            <div className="text-center p-4">
              <div className="text-jobconnect-primary text-4xl font-bold mb-2">15k+</div>
              <div className="text-gray-600 dark:text-gray-300">Job Seekers</div>
            </div>
            <div className="text-center p-4">
              <div className="text-jobconnect-primary text-4xl font-bold mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Jobs</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover opportunities that match your skills and interests
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/jobs">View All Jobs</Link>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-jobconnect-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up as a job seeker or employer in minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-jobconnect-secondary flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">
                {`${"{Post Jobs | Find Jobs}"}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Post your opportunities or search for jobs that match your skills
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-jobconnect-tertiary flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Connect and Succeed</h3>
              <p className="text-gray-600 dark:text-gray-300">
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
