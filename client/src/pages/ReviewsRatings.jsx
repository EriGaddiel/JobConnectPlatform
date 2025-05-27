
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ReviewsRatings() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample review data
  const employerReviews = [
    {
      id: "rev1",
      company: "TechCorp Inc",
      logo: "",
      rating: 4.5,
      reviewCount: 42,
      location: "New York, NY",
      highlights: [
        { label: "Work-Life Balance", rating: 4.2 },
        { label: "Culture", rating: 4.5 },
        { label: "Career Growth", rating: 4.0 }
      ],
      reviews: [
        {
          id: "emp_rev1",
          author: "Sarah Johnson",
          role: "Web Developer",
          date: "May 15, 2025",
          rating: 5,
          title: "Great working environment",
          content: "I've been working at TechCorp for 2 years now, and it's been a fantastic experience. The management truly cares about employee growth and well-being.",
          pros: ["Flexible hours", "Great benefits", "Supportive team"],
          cons: ["Office location is a bit inconvenient"]
        },
        {
          id: "emp_rev2",
          author: "Michael Rodriguez",
          role: "UX Designer",
          date: "April 28, 2025",
          rating: 4,
          title: "Good place to grow your career",
          content: "TechCorp has been an excellent place to develop my skills as a designer. There are plenty of opportunities to work on challenging projects.",
          pros: ["Professional development", "Interesting projects", "Good salary"],
          cons: ["Can be high-pressure at times", "Some communication issues"]
        }
      ]
    },
    {
      id: "rev2",
      company: "FastCourier",
      logo: "",
      rating: 3.8,
      reviewCount: 26,
      location: "Chicago, IL",
      highlights: [
        { label: "Work-Life Balance", rating: 3.5 },
        { label: "Payment", rating: 4.0 },
        { label: "Management", rating: 3.2 }
      ],
      reviews: [
        {
          id: "emp_rev3",
          author: "David Lee",
          role: "Delivery Driver",
          date: "May 10, 2025",
          rating: 4,
          title: "Flexible work and decent pay",
          content: "Working for FastCourier has allowed me to create my own schedule. The pay is fair for the work, although there can be slow periods.",
          pros: ["Flexible schedule", "Quick payment", "Simple job requirements"],
          cons: ["Vehicle maintenance costs", "Inconsistent work volume"]
        }
      ]
    },
  ];

  const jobSeekerReviews = [
    {
      id: "js_rev1",
      name: "Emma Thompson",
      avatar: "",
      rating: 4.8,
      reviewCount: 16,
      specialties: ["Web Development", "UI Design"],
      location: "Remote",
      reviews: [
        {
          id: "js_rev1_1",
          author: "TechCorp Inc",
          role: "Hiring Manager",
          date: "May 18, 2025",
          rating: 5,
          title: "Excellent developer, highly recommended",
          content: "Emma was a pleasure to work with. She delivered high-quality code on time and was very communicative throughout the project."
        },
        {
          id: "js_rev1_2",
          author: "DesignStudio",
          role: "Project Manager",
          date: "April 5, 2025",
          rating: 4.5,
          title: "Great skills and communication",
          content: "Emma has strong technical skills and is very responsive. Would definitely work with her again on future projects."
        }
      ]
    },
    {
      id: "js_rev2",
      name: "James Wilson",
      avatar: "",
      rating: 4.2,
      reviewCount: 8,
      specialties: ["House Cleaning", "Gardening"],
      location: "Austin, TX",
      reviews: [
        {
          id: "js_rev2_1",
          author: "CleanHome Services",
          role: "Supervisor",
          date: "May 12, 2025",
          rating: 4,
          title: "Reliable and thorough",
          content: "James is a dependable worker who pays attention to details. His cleaning services are thorough and he's always on time."
        }
      ]
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-2">Reviews & Ratings</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Discover what job seekers and employers are saying about their experiences
            </p>
            
            <div className="relative mb-8">
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search companies or job seekers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="employers" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="employers">Employer Reviews</TabsTrigger>
              <TabsTrigger value="jobseekers">Job Seeker Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="employers" className="space-y-8">
              {employerReviews.map(employer => (
                <Card key={employer.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={employer.logo} />
                          <AvatarFallback className="text-xl">{employer.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl">{employer.company}</CardTitle>
                          <p className="text-gray-500">{employer.location}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <StarRating rating={employer.rating} />
                            <span className="font-medium">{employer.rating}</span>
                            <span className="text-gray-500">({employer.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium mb-3">Rating Breakdown</h4>
                        <div className="space-y-2">
                          {employer.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{highlight.label}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div 
                                    className="bg-jobconnect-primary h-2 rounded-full" 
                                    style={{ width: `${(highlight.rating / 5) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-8">{highlight.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {employer.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <StarRating rating={review.rating} size="sm" />
                                <span className="font-medium">{review.title}</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                by {review.author} • {review.role} • {review.date}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {review.pros && review.pros.length > 0 && (
                              <div>
                                <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Pros</h5>
                                <ul className="space-y-1">
                                  {review.pros.map((pro, index) => (
                                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {review.cons && review.cons.length > 0 && (
                              <div>
                                <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">Cons</h5>
                                <ul className="space-y-1">
                                  {review.cons.map((con, index) => (
                                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                      <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="jobseekers" className="space-y-8">
              {jobSeekerReviews.map(jobSeeker => (
                <Card key={jobSeeker.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={jobSeeker.avatar} />
                          <AvatarFallback className="text-xl">{jobSeeker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl">{jobSeeker.name}</CardTitle>
                          <p className="text-gray-500">{jobSeeker.location}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <StarRating rating={jobSeeker.rating} />
                            <span className="font-medium">{jobSeeker.rating}</span>
                            <span className="text-gray-500">({jobSeeker.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium mb-3">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobSeeker.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {jobSeeker.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <StarRating rating={review.rating} size="sm" />
                                <span className="font-medium">{review.title}</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                by {review.author} • {review.role} • {review.date}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
