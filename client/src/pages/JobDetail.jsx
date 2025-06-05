import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

export default function JobDetail() {
  const { id } = useParams();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  
  // This would normally be fetched from an API based on the ID
  const job = {
    id: id || "job1",
    title: "Senior Web Developer",
    company: "TechCorp Inc",
    location: "New York, NY (Remote Option)",
    type: "Full-time",
    category: "Formal",
    salary: "$80k - $120k",
    posted: "May 15, 2025 (7 days ago)",
    deadline: "June 15, 2025",
    companyLogo: "",
    description: "TechCorp Inc is looking for a Senior Web Developer to join our growing team. The ideal candidate will have a strong background in frontend and backend web technologies, with a focus on building scalable, responsive web applications.",
    responsibilities: [
      "Design and develop responsive web applications using modern technologies",
      "Write clean, maintainable, and efficient code",
      "Collaborate with cross-functional teams to define, design, and ship new features",
      "Optimize applications for maximum speed and scalability",
      "Identify and correct bottlenecks and fix bugs",
      "Work with data scientists and analysts to improve software"
    ],
    requirements: [
      "5+ years of professional web development experience",
      "Proficiency in JavaScript, TypeScript, HTML, and CSS",
      "Experience with React, Vue, or Angular",
      "Familiarity with backend technologies such as Node.js, Python, or Ruby",
      "Understanding of RESTful APIs and microservices architecture",
      "Experience with version control systems, preferably Git",
      "Strong problem-solving skills and attention to detail",
      "Bachelor's degree in Computer Science or related field (or equivalent experience)"
    ],
    benefits: [
      "Competitive salary based on experience",
      "Health, dental, and vision insurance",
      "401(k) retirement plan with company match",
      "Flexible work schedule and remote work options",
      "Professional development budget",
      "Relaxed, collaborative work environment",
      "Paid time off and company holidays"
    ],
    applicationRequirements: [
      { name: "Resume/CV", type: "file", required: true },
      { name: "Cover Letter", type: "file", required: false },
      { name: "Portfolio Link", type: "text", required: false },
      { name: "Years of Experience", type: "number", required: true },
      { name: "Why do you want to work with us?", type: "textarea", required: true }
    ],
    companyInfo: {
      name: "TechCorp Inc",
      size: "51-200 employees",
      industry: "Information Technology",
      website: "https://techcorp-example.com",
      about: "TechCorp Inc is an innovative technology company specializing in developing cutting-edge web and mobile applications for businesses of all sizes. Founded in 2010, we have grown to become a leader in custom software development with a focus on user experience and performance."
    }
  };

  const handleSaveJob = () => {
    toast.success("Job saved to your favorites");
  };

  const handleShare = () => {
    toast.success("Job link copied to clipboard");
  };

  const handleReport = () => {
    toast.success("Report submitted. Thank you for helping keep JobConnect safe.");
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setIsApplyDialogOpen(false);
    toast.success("Your application has been submitted!");
  };

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-grow">
              {/* Job Header */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={`${job.company} logo`} />
                      ) : (
                        <span className="text-2xl font-bold">{job.company.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                          <p className="text-gray-500">{job.company} • {job.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveJob}>Save Job</Button>
                          <Button variant="outline" onClick={handleShare}>Share</Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant={job.category === "Formal" ? "default" : "secondary"} className={job.category === "Formal" ? "bg-jobconnect-formal" : "bg-jobconnect-informal"}>
                          {job.category}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {job.salary}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
                        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg">Apply Now</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Apply for {job.title} at {job.company}</DialogTitle>
                              <DialogDescription>
                                Complete the application form below to apply for this position.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleApplySubmit} className="space-y-6 py-4">
                              {job.applicationRequirements.map((req, index) => (
                                <div key={index} className="space-y-2">
                                  <label htmlFor={`field-${index}`} className="text-sm font-medium">
                                    {req.name} {req.required && <span className="text-red-500">*</span>}
                                  </label>
                                  
                                  {req.type === "file" && (
                                    <input
                                      type="file"
                                      id={`field-${index}`}
                                      required={req.required}
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                                    />
                                  )}
                                  
                                  {req.type === "text" && (
                                    <input
                                      type="text"
                                      id={`field-${index}`}
                                      required={req.required}
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                                      placeholder={req.name}
                                    />
                                  )}
                                  
                                  {req.type === "number" && (
                                    <input
                                      type="number"
                                      id={`field-${index}`}
                                      required={req.required}
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                                      placeholder={req.name}
                                      min="0"
                                    />
                                  )}
                                  
                                  {req.type === "textarea" && (
                                    <textarea
                                      id={`field-${index}`}
                                      required={req.required}
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm min-h-[100px]"
                                      placeholder={req.name}
                                    />
                                  )}
                                </div>
                              ))}
                              
                              <DialogFooter>
                                <Button type="submit">Submit Application</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <div className="text-sm">
                          <p className="text-gray-500">Posted: {job.posted}</p>
                          <p className="text-gray-500">Apply before: {job.deadline}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Job Details */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="description">
                    <TabsList className="mb-6">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="company">Company</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Job Description</h2>
                        <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                          {job.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                          {job.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                          {job.benefits.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Application Process</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          To apply for this position, click the &quot;Apply Now&quot; button and submit the required application materials. Our team will review your application and reach out to qualified candidates for next steps.
                        </p>
                        
                        <h4 className="font-medium mt-4 mb-2">Required Application Materials:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300">
                          {job.applicationRequirements.map((req, index) => (
                            <li key={index}>
                              {req.name} {req.required ? "(Required)" : "(Optional)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="company">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold mb-4">About {job.companyInfo.name}</h2>
                          <p className="text-gray-600 dark:text-gray-300">{job.companyInfo.about}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-md font-semibold mb-2">Industry</h3>
                            <p className="text-gray-600 dark:text-gray-300">{job.companyInfo.industry}</p>
                          </div>
                          <div>
                            <h3 className="text-md font-semibold mb-2">Company Size</h3>
                            <p className="text-gray-600 dark:text-gray-300">{job.companyInfo.size}</p>
                          </div>
                          <div>
                            <h3 className="text-md font-semibold mb-2">Website</h3>
                            <a 
                              href={job.companyInfo.website} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-jobconnect-primary hover:underline"
                            >
                              {job.companyInfo.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">More Jobs at {job.companyInfo.name}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg hover:border-jobconnect-primary transition-colors duration-200">
                              <h4 className="font-medium mb-1">UI/UX Designer</h4>
                              <p className="text-gray-500 text-sm">New York, NY • Full-time</p>
                            </div>
                            <div className="p-4 border rounded-lg hover:border-jobconnect-primary transition-colors duration-200">
                              <h4 className="font-medium mb-1">Frontend Developer</h4>
                              <p className="text-gray-500 text-sm">Remote • Contract</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews">
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-bold">Company Reviews</h2>
                            <p className="text-gray-500">See what others are saying about working at {job.companyInfo.name}</p>
                          </div>
                          <Button>Write a Review</Button>
                        </div>
                        
                        <div className="space-y-6">
                          {/* Sample reviews - in a real app this would be dynamic */}
                          <div className="border-b pb-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">Great Company Culture</h3>
                                <div className="flex items-center text-yellow-400 mt-1">
                                  <span className="sr-only">5 out of 5 stars</span>
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">Posted 3 months ago</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              I've been working at TechCorp for 2 years and I love the culture. Great work-life balance, supportive management, and interesting projects.
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline">Great Benefits</Badge>
                              <Badge variant="outline">Good Work-Life Balance</Badge>
                            </div>
                          </div>
                          
                          <div className="border-b pb-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">Fast-Paced Environment</h3>
                                <div className="flex items-center text-yellow-400 mt-1">
                                  <span className="sr-only">4 out of 5 stars</span>
                                  {[...Array(4)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">Posted 5 months ago</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              The work is challenging but rewarding. Expect to learn a lot quickly. Sometimes deadlines can be tight, but the team is collaborative.
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline">Fast-Paced</Badge>
                              <Badge variant="outline">Learning Opportunities</Badge>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">Load More Reviews</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Quick Apply */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Apply Now</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    Apply quickly to be one of the first applicants.
                  </p>
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mb-4">Quick Apply</Button>
                    </DialogTrigger>
                    {/* Dialog content is defined above */}
                  </Dialog>
                  <Button variant="outline" className="w-full" onClick={handleSaveJob}>Save Job</Button>
                </CardContent>
              </Card>
              
              {/* Job Summary */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Job Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Job Type:</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{job.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Salary Range:</span>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Posted:</span>
                      <span className="font-medium">{job.posted.split('(')[0].trim()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deadline:</span>
                      <span className="font-medium">{job.deadline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Similar Jobs */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Similar Jobs</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <h3 className="font-medium hover:text-jobconnect-primary">
                        <Link to="/jobs/job2">Frontend Developer</Link>
                      </h3>
                      <p className="text-gray-500 text-sm">InnovateApps • Remote</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          Full-time
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          $70k - $90k
                        </Badge>
                      </div>
                    </div>
                    <div className="border-b pb-3">
                      <h3 className="font-medium hover:text-jobconnect-primary">
                        <Link to="/jobs/job3">Web Developer</Link>
                      </h3>
                      <p className="text-gray-500 text-sm">Digital Solutions • Chicago, IL</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          Contract
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          $50 - $70/hr
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium hover:text-jobconnect-primary">
                        <Link to="/jobs/job4">Full Stack Engineer</Link>
                      </h3>
                      <p className="text-gray-500 text-sm">TechStartup • San Francisco, CA</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          Full-time
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          $90k - $130k
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/jobs">Browse More Jobs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Report Job */}
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={handleReport}>
                  Report This Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
