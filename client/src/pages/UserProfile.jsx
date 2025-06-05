
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { FeatureCard } from "@/components/FeatureCard";
import { Briefcase, Calendar, GraduationCap, Mail, MapPin, Phone, Star, User } from "lucide-react";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: "John Smith",
    title: "Web Developer",
    location: "New York, NY",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    about: "Passionate web developer with 5+ years of experience in frontend and backend development. Proficient in React, TypeScript, Node.js and various modern web technologies.",
    education: [
      {
        id: 1,
        degree: "BSc Computer Science",
        institution: "New York University",
        period: "2016 - 2020"
      },
      {
        id: 2,
        degree: "Web Development Bootcamp",
        institution: "Coding Academy",
        period: "2015 - 2016"
      }
    ],
    experience: [
      {
        id: 1,
        position: "Senior Web Developer",
        company: "TechCorp Inc",
        period: "2022 - Present",
        description: "Lead developer for the company's main product, managing a team of 3 developers and implementing new features."
      },
      {
        id: 2,
        position: "Web Developer",
        company: "Digital Solutions",
        period: "2020 - 2022",
        description: "Developed and maintained client websites using React, Node.js, and MongoDB."
      },
      {
        id: 3,
        position: "Junior Developer",
        company: "StartUp Tech",
        period: "2018 - 2020",
        description: "Assisted in developing web applications and fixing bugs."
      }
    ],
    skills: [
      "React", "JavaScript", "TypeScript", "Node.js", "HTML5", "CSS3", 
      "MongoDB", "Express.js", "REST API", "Git", "UI/UX Design", "Responsive Design"
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2021"
      },
      {
        id: 2,
        name: "React Developer Certification",
        issuer: "Meta",
        date: "2020"
      }
    ]
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real application, you would save the updated profile data here
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-gray-500">Manage your personal information and career details</p>
            </div>
            
            {!isEditing ? (
              <Button onClick={handleEdit}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>
        </header>

        <div className="mb-8">
          <Card>
            <div className="bg-jobconnect-primary h-32 rounded-t-lg"></div>
            <CardContent className="p-6 pt-0 -mt-16">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl">JS</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                      <p className="text-gray-500">{userProfile.title}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StarRating rating={4.5} />
                      <span className="text-sm text-gray-500">(12 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{userProfile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={16} />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      <span>{userProfile.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="about" className="mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>Tell employers about yourself and your career</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea 
                    className="min-h-[200px]"
                    defaultValue={userProfile.about}
                    onChange={(e) => setUserProfile({...userProfile, about: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{userProfile.about}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="experience">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Your professional history</CardDescription>
                </div>
                
                {isEditing && (
                  <Button size="sm">Add Experience</Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {userProfile.experience.map((exp) => (
                  <div key={exp.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{exp.position}</h3>
                        <p className="text-gray-500">{exp.company}</p>
                      </div>
                      <Badge variant="outline">{exp.period}</Badge>
                    </div>
                    
                    {isEditing ? (
                      <Textarea 
                        className="mt-2"
                        defaultValue={exp.description}
                      />
                    ) : (
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{exp.description}</p>
                    )}
                    
                    {isEditing && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education & Certifications</CardTitle>
                  <CardDescription>Your academic background and professional certifications</CardDescription>
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Button size="sm">Add Education</Button>
                    <Button size="sm">Add Certification</Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Education</h3>
                  <div className="space-y-4">
                    {userProfile.education.map((edu) => (
                      <div key={edu.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <GraduationCap className="h-6 w-6 text-jobconnect-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-gray-500">{edu.institution}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-0">
                          <Badge variant="outline">{edu.period}</Badge>
                          
                          {isEditing && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="ghost">Edit</Button>
                              <Button size="sm" variant="destructive">Delete</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="space-y-4">
                    {userProfile.certifications.map((cert) => (
                      <div key={cert.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <Star className="h-6 w-6 text-jobconnect-secondary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-gray-500">{cert.issuer}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-0">
                          <Badge variant="outline">{cert.date}</Badge>
                          
                          {isEditing && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="ghost">Edit</Button>
                              <Button size="sm" variant="destructive">Delete</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <CardDescription>Showcase your professional capabilities</CardDescription>
                </div>
                
                {isEditing && (
                  <Button size="sm">Add Skill</Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1.5">
                      {skill}
                      {isEditing && (
                        <button className="ml-1 text-gray-500 hover:text-gray-700" aria-label="Remove skill">
                          &times;
                        </button>
                      )}
                    </Badge>
                  ))}
                  
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-4 w-full">
                      <Input placeholder="Add a new skill..." className="max-w-xs" />
                      <Button size="sm">Add</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={userProfile.email} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={userProfile.phone} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value="********" disabled={!isEditing} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Change Password</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control what information is visible to others</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-gray-500">Make your profile visible to employers</p>
                    </div>
                    <div>
                      {/* Switch component would go here */}
                      <div className="h-6 w-12 bg-jobconnect-primary rounded-full relative">
                        <div className="h-4 w-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Contact Information</h4>
                      <p className="text-sm text-gray-500">Allow employers to see your contact details</p>
                    </div>
                    <div>
                      {/* Switch component would go here */}
                      <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded-full relative">
                        <div className="h-4 w-4 bg-white rounded-full absolute left-1 top-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Job Alerts</h4>
                      <p className="text-sm text-gray-500">Receive notifications about new job matches</p>
                    </div>
                    <div>
                      {/* Switch component would go here */}
                      <div className="h-6 w-12 bg-jobconnect-primary rounded-full relative">
                        <div className="h-4 w-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">Profile Strength</h2>
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">Your profile is 75% complete</p>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Strong</Badge>
                </div>
                
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full bg-jobconnect-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Complete your profile to increase visibility to employers and get more job matches.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FeatureCard 
                    icon={<User />}
                    title="Add a professional photo"
                    description="Profiles with photos get 14x more views"
                  />
                  <FeatureCard 
                    icon={<Briefcase />}
                    title="Add more work experience"
                    description="Highlight your relevant job history"
                  />
                  <FeatureCard 
                    icon={<Calendar />}
                    title="Set your availability"
                    description="Let employers know when you can start"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
