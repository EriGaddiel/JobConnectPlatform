
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // For settings
// import { StarRating } from "@/components/StarRating"; // Assuming this exists if needed for reviews
// import { FeatureCard } from "@/components/FeatureCard"; // For profile strength suggestions
import { Briefcase, Calendar, GraduationCap, Mail, MapPin, Phone, Star, User, PlusCircle, Trash2, Edit3, Save, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile as apiUpdateUserProfile } from "@/services/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Zod schemas for nested arrays
const educationSchema = z.object({
  _id: z.string().optional(), // For existing items
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().optional(),
  description: z.string().optional(),
});
const experienceSchema = z.object({
  _id: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().optional(),
  description: z.string().optional(),
});
const certificationSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().optional(), // Could be date type if date picker is used
  credentialId: z.string().optional(),
  credentialURL: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Main profile schema
const userProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  // Password change fields - handled separately or as part of a different form
  // currentPassword: z.string().optional(),
  // newPassword: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  title: z.string().optional(), // Job seeker's professional title
  profilePicture: z.string().url("Must be a valid URL for profile picture.").optional().or(z.literal("")),
  resume: z.string().url("Must be a valid URL for resume.").optional().or(z.literal("")), // URL to resume
  portfolioURL: z.string().url("Must be a valid URL for portfolio.").optional().or(z.literal("")),
  skills: z.array(z.string()).optional().default([]), // Array of strings
  education: z.array(educationSchema).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  certifications: z.array(certificationSchema).optional().default([]),
  // Settings
  profileVisibility: z.enum(["public", "privateToEmployers", "private"]).optional(),
  contactInfoVisibility: z.enum(["public", "connections", "private"]).optional(), // Adjust if different enums
  jobAlertsEnabled: z.boolean().optional(),
});


export default function UserProfile() {
  const { user, isLoading: isLoadingAuthUser, refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(""); // For adding skills

  const { control, register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: user || {}, // Initialize with user data from context
  });

  // Field array hooks
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: "education" });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control, name: "experience" });
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({ control, name: "certifications" });
  const skillsArray = watch('skills', user?.skills || []); // Watch skills for dynamic rendering

  useEffect(() => {
    if (user) {
      reset({ // Reset form with potentially more complete data from context/API
        ...user,
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        certifications: user.certifications || [],
      });
    }
  }, [user, reset]);

  const profileUpdateMutation = useMutation({
    mutationFn: apiUpdateUserProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      refetchUser(); // Refetch user in AuthContext
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update profile.");
    }
  });

  const onSubmit = (formData) => {
    // Filter out empty strings for optional URL fields to avoid sending them
    const payload = { ...formData };
    if (payload.profilePicture === "") delete payload.profilePicture;
    if (payload.resume === "") delete payload.resume;
    if (payload.portfolioURL === "") delete payload.portfolioURL;
    payload.certifications = payload.certifications?.map(cert => ({
        ...cert,
        credentialURL: cert.credentialURL === "" ? undefined : cert.credentialURL
    }));

    profileUpdateMutation.mutate(payload);
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skillsArray.includes(currentSkill.trim())) {
      setValue("skills", [...skillsArray, currentSkill.trim()], { shouldDirty: true });
      setCurrentSkill("");
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setValue("skills", skillsArray.filter(skill => skill !== skillToRemove), { shouldDirty: true });
  };

  if (isLoadingAuthUser && !user) {
     return ( // Full page skeleton if user data isn't loaded yet
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardSidebar role={user?.role || "jobseeker"} /> {/* Pass role if available */}
            <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-10 w-1/3" /> <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-40 w-full rounded-lg" />
                <div className="grid grid-cols-3 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        </div>
     );
  }

  if (!user) { // Should be handled by ProtectedRoute, but as a fallback
    return <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center"><p>Please log in to view your profile.</p></div>;
  }

  // Determine role for sidebar, default to jobSeeker if somehow undefined
  const userRoleForSidebar = user?.role || 'jobSeeker';


  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role={userRoleForSidebar} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-6">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-500">Manage your personal information and career details</p>
          </div>
          <div>
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4"/>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsEditing(false); reset(user); }} disabled={isSubmitting}><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || !isDirty}><Save className="mr-2 h-4 w-4"/>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
              </div>
            )}
          </div>
        </header>

        {/* Profile Header / Avatar section */}
        <div className="mb-8">
          <Card>
            <div className="bg-gradient-to-r from-jobconnect-primary to-jobconnect-secondary h-32 rounded-t-lg"></div>
            <CardContent className="p-6 pt-0 -mt-16">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                 <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-background">
                        <AvatarImage src={watch("profilePicture") || user.profilePicture || undefined} />
                        <AvatarFallback className="text-4xl">{(user.fullName || user.username || "U").substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <div className="mt-2">
                            <Label htmlFor="profilePicture" className="text-xs">Profile Picture URL</Label>
                            <Input id="profilePicture" {...register("profilePicture")} placeholder="https://example.com/image.png" />
                            {errors.profilePicture && <p className="text-red-500 text-sm mt-1">{errors.profilePicture.message}</p>}
                        </div>
                    )}
                 </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      {isEditing ? <Input className="text-2xl font-bold" {...register("fullName")} placeholder="Your Full Name"/> : <h2 className="text-2xl font-bold">{user.fullName || "Your Name"}</h2>}
                      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

                      {isEditing ? <Input {...register("title")} placeholder="Your Professional Title (e.g., Web Developer)"/> : <p className="text-gray-500 dark:text-gray-400">{user.title || "Your Professional Title"}</p>}
                      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    {/* StarRating and reviews count can be added back if review system for users is implemented */}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin size={16} /> {isEditing ? <Input {...register("location")} placeholder="City, State"/> : (user.location || "Location not set")}</div>
                    <div className="flex items-center gap-1"><Mail size={16} /> {isEditing ? <Input type="email" {...register("email")} placeholder="your@email.com"/> : (user.email || "Email not set")} {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}</div>
                    <div className="flex items-center gap-1"><Phone size={16} /> {isEditing ? <Input {...register("phoneNumber")} placeholder="(123) 456-7890"/> : (user.phoneNumber || "Phone not set")}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="about" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <Card>
              <CardHeader><CardTitle>About Me</CardTitle><CardDescription>Tell employers about yourself and your career aspirations.</CardDescription></CardHeader>
              <CardContent>
                {isEditing ? (<Textarea className="min-h-[150px]" {...register("bio")} placeholder="Write a brief summary about yourself..."/>) : (<p className="text-muted-foreground whitespace-pre-wrap">{user.bio || "No bio provided."}</p>)}
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                {isEditing && user.role === 'jobSeeker' && (
                    <div className="mt-4 space-y-2">
                        <div><Label htmlFor="resume">Resume URL</Label><Input id="resume" {...register("resume")} placeholder="https://example.com/resume.pdf"/>{errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>}</div>
                        <div><Label htmlFor="portfolioURL">Portfolio URL</Label><Input id="portfolioURL" {...register("portfolioURL")} placeholder="https://github.com/yourusername or your personal site"/>{errors.portfolioURL && <p className="text-red-500 text-sm mt-1">{errors.portfolioURL.message}</p>}</div>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Experience Section */}
          <TabsContent value="experience">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Work Experience</CardTitle><CardDescription>Your professional history.</CardDescription></div>
                {isEditing && <Button type="button" size="sm" variant="outline" onClick={() => appendExperience({ position: "", company: "", period: "", description: "" })}><PlusCircle className="mr-2 h-4 w-4"/>Add Experience</Button>}
              </CardHeader>
              <CardContent className="space-y-6">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-lg space-y-2 relative">
                    {isEditing && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4"/></Button>}
                    {isEditing ? (<Input {...register(`experience.${index}.position`)} placeholder="Position"/>) : (<h3 className="text-lg font-medium">{field.position || user.experience?.[index]?.position}</h3>)}
                    {errors.experience?.[index]?.position && <p className="text-red-500 text-sm">{errors.experience[index].position.message}</p>}
                    {isEditing ? (<Input {...register(`experience.${index}.company`)} placeholder="Company Name"/>) : (<p className="text-muted-foreground">{field.company || user.experience?.[index]?.company}</p>)}
                     {errors.experience?.[index]?.company && <p className="text-red-500 text-sm">{errors.experience[index].company.message}</p>}
                    {isEditing ? (<Input {...register(`experience.${index}.period`)} placeholder="e.g., Jan 2020 - Present"/>) : (<Badge variant="outline" className="mb-1">{field.period || user.experience?.[index]?.period}</Badge>)}
                    {isEditing ? (<Textarea {...register(`experience.${index}.description`)} placeholder="Description of your role and achievements." className="text-sm"/>) : (<p className="text-sm text-muted-foreground">{field.description || user.experience?.[index]?.description}</p>)}
                  </div>
                ))}
                {!isEditing && user.experience?.length === 0 && <p className="text-muted-foreground">No work experience added yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Section */}
          <TabsContent value="education">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Education</CardTitle><CardDescription>Your academic background.</CardDescription></div>
                {isEditing && <Button type="button" size="sm" variant="outline" onClick={() => appendEducation({ degree: "", institution: "", period: "", description: "" })}><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>}
              </CardHeader>
              <CardContent className="space-y-4">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-lg space-y-2 relative">
                    {isEditing && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4"/></Button>}
                     <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="flex-grow">
                            {isEditing ? (<Input {...register(`education.${index}.degree`)} placeholder="Degree/Qualification"/>) : (<h4 className="font-medium">{field.degree || user.education?.[index]?.degree}</h4>)}
                            {errors.education?.[index]?.degree && <p className="text-red-500 text-sm">{errors.education[index].degree.message}</p>}
                            {isEditing ? (<Input {...register(`education.${index}.institution`)} placeholder="Institution Name"/>) : (<p className="text-sm text-muted-foreground">{field.institution || user.education?.[index]?.institution}</p>)}
                            {errors.education?.[index]?.institution && <p className="text-red-500 text-sm">{errors.education[index].institution.message}</p>}
                        </div>
                        {isEditing ? (<Input {...register(`education.${index}.period`)} placeholder="e.g., 2016 - 2020" className="w-auto"/>) : (<Badge variant="outline">{field.period || user.education?.[index]?.period}</Badge>)}
                     </div>
                     {isEditing ? (<Textarea {...register(`education.${index}.description`)} placeholder="Optional description or achievements." className="text-sm"/>) : ( (field.description || user.education?.[index]?.description) && <p className="text-sm text-muted-foreground mt-1 pl-8">{field.description || user.education?.[index]?.description}</p>)}
                  </div>
                ))}
                 {!isEditing && user.education?.length === 0 && <p className="text-muted-foreground">No education details added yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Section */}
           <TabsContent value="skills">
            <Card>
              <CardHeader><CardTitle>Skills & Expertise</CardTitle><CardDescription>Showcase your professional capabilities.</CardDescription></CardHeader>
              <CardContent>
                {isEditing && (
                  <div className="flex items-center gap-2 mb-4">
                    <Input value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} placeholder="Add a skill (e.g., React, Python)" onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSkill();}}}/>
                    <Button type="button" onClick={handleAddSkill}>Add Skill</Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(skillsArray || []).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-2.5">
                      {skill}
                      {isEditing && (
                        <button type="button" className="ml-1.5 text-muted-foreground hover:text-foreground" aria-label="Remove skill" onClick={() => handleRemoveSkill(skill)}>
                          &times;
                        </button>
                      )}
                    </Badge>
                  ))}
                  {!isEditing && skillsArray?.length === 0 && <p className="text-muted-foreground">No skills added yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Section - similar structure to Education/Experience */}
          {/* For brevity, not fully implementing the form fields here but structure would be similar */}
           <TabsContent value="certifications"> {/* Placeholder Tab for UI consistency */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Certifications</CardTitle><CardDescription>Your professional certifications.</CardDescription></div>
                    {isEditing && <Button type="button" size="sm" variant="outline" onClick={() => appendCertification({ name: "", issuer: "", date: "", credentialURL:"" })}><PlusCircle className="mr-2 h-4 w-4"/>Add Certification</Button>}
                </CardHeader>
                <CardContent className="space-y-4">
                {certificationFields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-lg space-y-2 relative">
                    {isEditing && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeCertification(index)}><Trash2 className="h-4 w-4"/></Button>}
                     <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                        <div className="flex-grow">
                            {isEditing ? (<Input {...register(`certifications.${index}.name`)} placeholder="Certification Name"/>) : (<h4 className="font-medium">{field.name || user.certifications?.[index]?.name}</h4>)}
                            {errors.certifications?.[index]?.name && <p className="text-red-500 text-sm">{errors.certifications[index].name.message}</p>}
                            {isEditing ? (<Input {...register(`certifications.${index}.issuer`)} placeholder="Issuing Organization"/>) : (<p className="text-sm text-muted-foreground">{field.issuer || user.certifications?.[index]?.issuer}</p>)}
                            {errors.certifications?.[index]?.issuer && <p className="text-red-500 text-sm">{errors.certifications[index].issuer.message}</p>}
                        </div>
                        {isEditing ? (<Input {...register(`certifications.${index}.date`)} placeholder="Date Issued (e.g., 2021)"/>) : (<Badge variant="outline">{field.date || user.certifications?.[index]?.date}</Badge>)}
                     </div>
                     {isEditing ? (<Input {...register(`certifications.${index}.credentialURL`)} placeholder="Credential URL (Optional)"/>) : ( (field.credentialURL || user.certifications?.[index]?.credentialURL) && <a href={field.credentialURL || user.certifications?.[index]?.credentialURL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 pl-7 block">View Credential</a>)}
                     {errors.certifications?.[index]?.credentialURL && <p className="text-red-500 text-sm mt-1 pl-7">{errors.certifications[index].credentialURL.message}</p>}
                  </div>
                ))}
                 {!isEditing && user.certifications?.length === 0 && <p className="text-muted-foreground">No certifications added yet.</p>}
                </CardContent>
             </Card>
           </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Account Settings</CardTitle><CardDescription>Manage your account preferences.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div><Label htmlFor="username">Username</Label><Input id="username" {...register("username")} />{errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}</div>
                      <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" {...register("email")} />{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}</div>
                      {/* Password change should be a separate, more secure form */}
                      <Button type="button" variant="outline" onClick={() => toast.info("Password change form coming soon!")}>Change Password</Button>
                    </>
                  ) : (
                    <>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>Privacy & Notification Settings</CardTitle><CardDescription>Control what information is visible and how you receive alerts.</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div><Label htmlFor="profileVisibility" className="font-medium">Profile Visibility</Label><p className="text-sm text-muted-foreground">Who can see your full profile.</p></div>
                        {isEditing ? (<Controller name="profileVisibility" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || user.profileVisibility}><SelectTrigger className="w-[180px]"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="privateToEmployers">Employers Only</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent></Select>
                        )}/>) : <Badge variant="outline">{user.profileVisibility || "Default"}</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div><Label htmlFor="contactInfoVisibility" className="font-medium">Contact Info Visibility</Label><p className="text-sm text-muted-foreground">Who can see your email/phone.</p></div>
                         {isEditing ? (<Controller name="contactInfoVisibility" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || user.contactInfoVisibility}><SelectTrigger className="w-[180px]"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="connections">Connections</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent></Select>
                        )}/>) : <Badge variant="outline">{user.contactInfoVisibility || "Default"}</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div><Label htmlFor="jobAlertsEnabled" className="font-medium">Job Alerts</Label><p className="text-sm text-muted-foreground">Receive email notifications for new job matches.</p></div>
                        {isEditing ? (<Controller name="jobAlertsEnabled" control={control} render={({ field }) => (
                            <Switch id="jobAlertsEnabled" checked={field.value === undefined ? user.jobAlertsEnabled : field.value} onCheckedChange={field.onChange} />
                        )}/>) : <Badge variant={user.jobAlertsEnabled ? "default" : "outline"}>{user.jobAlertsEnabled ? "Enabled" : "Disabled"}</Badge>}
                    </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Profile Strength section can be re-added with actual logic */}
        {/* <section className="my-8"> ... </section> */}
      </form>
    </div>
  );
}
