import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "@/services/api";
import { useAuth } from "@/context/AuthContext"; // To check if user has a company
import { PlusCircle, Trash2 } from "lucide-react";

// Zod schema for application requirement item
const applicationRequirementSchema = z.object({
  name: z.string().min(1, "Field name is required."),
  type: z.enum(["text", "textarea", "number", "file", "url"]), // Added 'url' as per original
  required: z.boolean().default(false),
});

// Zod schema for the entire job form
const jobFormSchema = z.object({
  category: z.enum(["Formal", "Informal", "Other"]),
  title: z.string().min(3, "Job title must be at least 3 characters."),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"]),
  experienceLevel: z.enum(["Entry-level", "Mid-level", "Senior-level", "Lead", "Manager", "Executive", "Intern"]).optional(),
  salary: z.string().optional(), // For display string e.g. "$50k - 70k"
  salaryMin: z.coerce.number().nonnegative("Must be a positive number or zero.").optional().or(z.literal("")),
  salaryMax: z.coerce.number().nonnegative("Must be a positive number or zero.").optional().or(z.literal("")),
  currency: z.string().max(5).optional(),
  location: z.string().min(2, "Location is required."),
  remotePolicy: z.enum(["On-site", "Remote", "Hybrid"]).default("On-site"),
  description: z.string().min(20, "Description must be at least 20 characters."),
  requirements: z.string().min(10, "Requirements section must be at least 10 characters.").transform(val => val.split('\n').map(s => s.trim()).filter(Boolean)), // Convert textarea to array
  responsibilities: z.string().optional().transform(val => val ? val.split('\n').map(s => s.trim()).filter(Boolean) : []),
  benefits: z.string().optional().transform(val => val ? val.split('\n').map(s => s.trim()).filter(Boolean) : []),
  applicationDeadline: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date" }),
  applicationInstructions: z.string().optional(),
  applicationRequirements: z.array(applicationRequirementSchema).optional().default([]),
  tags: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
  status: z.enum(["open", "draft"]).default("open"), // Default to open, or allow draft
  // companyIdForAdmin: z.string().optional(), // If admin is posting, this is needed.
}).refine(data => !data.salaryMin || !data.salaryMax || parseFloat(data.salaryMin) <= parseFloat(data.salaryMax), {
    message: "Minimum salary cannot be greater than maximum salary.",
    path: ["salaryMin"], // Path to show error on
});


export default function CreateJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // To check if employer has a company linked

  const [formStep, setFormStep] = useState(1); // 1: Details, 2: Desc/Req, 3: Application

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, trigger } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      category: "Formal",
      employmentType: "Full-time",
      remotePolicy: "On-site",
      applicationRequirements: [],
      requirements: "", // Textarea inputs
      responsibilities: "",
      benefits: "",
      tags: "",
      status: "open",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "applicationRequirements"
  });

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      toast.success(data.data.message || "Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ['myPostedJobs'] }); // Invalidate employer's job list
      navigate("/employer/jobs"); // Redirect to employer's job list
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to post job. Please try again.");
    }
  });

  const processSubmit = (data) => {
    // Pre-submission data transformation if necessary (e.g., string to array for requirements)
    // Zod transform handles this for requirements, responsibilities, benefits, tags

    // If admin is posting, they should provide companyIdForAdmin.
    // This form assumes an employer is posting, so companyId is derived from their profile on backend.
    // If this form were also for admins, we'd need a companyId selector.
    if (user && user.role === 'employer' && !user.company) {
        toast.error("You must have a company profile to post a job. Please create one first in your Company Profile section.");
        return;
    }

    // Convert empty string salaries to undefined so they are not sent if not filled
    if (data.salaryMin === "") data.salaryMin = undefined;
    if (data.salaryMax === "") data.salaryMax = undefined;
    if (data.currency === "") data.currency = undefined;
    if (data.salary === "") data.salary = undefined;
    if (data.applicationDeadline === "") data.applicationDeadline = undefined;


    createJobMutation.mutate(data);
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (formStep === 1) fieldsToValidate = ['category', 'title', 'employmentType', 'location']; // Add more as needed
    if (formStep === 2) fieldsToValidate = ['description', 'requirements'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setFormStep(prev => prev + 1);
    else toast.error("Please fill all required fields in this step.");
  };
  const prevStep = () => setFormStep(prev => prev - 1);


  return (
    <>
      <Navbar />
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create a New Job</CardTitle>
              <CardDescription>Fill out the form below to post a new job listing for your company.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={`step${formStep}`} onValueChange={(val) => setFormStep(parseInt(val.replace('step','')))} className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3">
                  <TabsTrigger value="step1">1. Job Details</TabsTrigger>
                  <TabsTrigger value="step2">2. Description</TabsTrigger>
                  <TabsTrigger value="step3">3. Application</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit(processSubmit)}>
                  <TabsContent value="step1" className="space-y-6">
                    <div>
                      <Label htmlFor="category" className="text-base font-medium block mb-2">Job Category <span className="text-red-500">*</span></Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup {...field} onValueChange={field.onChange} className="flex flex-col space-y-3">
                            <div className="flex items-start space-x-3"><RadioGroupItem value="Formal" id="Formal" /><Label htmlFor="Formal" className="font-normal">Formal Employment <span className="text-xs text-gray-500">(Traditional jobs)</span></Label></div>
                            <div className="flex items-start space-x-3"><RadioGroupItem value="Informal" id="Informal" /><Label htmlFor="Informal" className="font-normal">Informal Employment <span className="text-xs text-gray-500">(Gigs, temporary)</span></Label></div>
                            <div className="flex items-start space-x-3"><RadioGroupItem value="Other" id="Other" /><Label htmlFor="Other" className="font-normal">Other</Label></div>
                          </RadioGroup>
                        )}
                      />
                       {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>
                    <div className="space-y-4">
                        <div><Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label><Input id="title" {...register("title")} placeholder="e.g., Senior Software Engineer"/>{errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="employmentType">Job Type <span className="text-red-500">*</span></Label>
                            <Controller name="employmentType" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="employmentType"><SelectValue placeholder="Select job type" /></SelectTrigger>
                                    <SelectContent>
                                        {["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"].map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}/>
                            {errors.employmentType && <p className="text-red-500 text-sm mt-1">{errors.employmentType.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="experienceLevel">Experience Level</Label>
                             <Controller name="experienceLevel" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="experienceLevel"><SelectValue placeholder="Select experience level" /></SelectTrigger>
                                <SelectContent>
                                    {["Entry-level", "Mid-level", "Senior-level", "Lead", "Manager", "Executive", "Intern"].map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            )}/>
                          </div>
                        </div>
                        <div><Label htmlFor="salary">Salary Display (e.g., $50k - $70k / year, Competitive)</Label><Input id="salary" {...register("salary")} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div><Label htmlFor="salaryMin">Min Annual Salary (Numbers only)</Label><Input id="salaryMin" type="number" {...register("salaryMin")} placeholder="e.g., 50000"/>{errors.salaryMin && <p className="text-red-500 text-sm mt-1">{errors.salaryMin.message}</p>}</div>
                          <div><Label htmlFor="salaryMax">Max Annual Salary (Numbers only)</Label><Input id="salaryMax" type="number" {...register("salaryMax")} placeholder="e.g., 70000"/>{errors.salaryMax && <p className="text-red-500 text-sm mt-1">{errors.salaryMax.message}</p>}</div>
                          <div><Label htmlFor="currency">Currency</Label><Input id="currency" {...register("currency")} placeholder="e.g., USD, EUR"/></div>
                        </div>
                        <div><Label htmlFor="location">Location <span className="text-red-500">*</span></Label><Input id="location" {...register("location")} placeholder="e.g., New York, NY or Remote"/>{errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}</div>
                        <div>
                            <Label htmlFor="remotePolicy">Remote Policy</Label>
                             <Controller name="remotePolicy" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="remotePolicy"><SelectValue placeholder="Select remote policy" /></SelectTrigger>
                                <SelectContent>
                                    {["On-site", "Remote", "Hybrid"].map(policy => <SelectItem key={policy} value={policy}>{policy}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            )}/>
                        </div>
                        <div><Label htmlFor="tags">Tags (comma separated)</Label><Input id="tags" {...register("tags")} placeholder="e.g., react, node, full-stack"/></div>
                    </div>
                    <div className="flex justify-end mt-6"><Button type="button" onClick={nextStep}>Next: Description</Button></div>
                  </TabsContent>
                  
                  <TabsContent value="step2" className="space-y-6">
                    <div><Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label><Textarea id="description" {...register("description")} placeholder="Detailed job description..." className="min-h-[150px]"/>{errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}</div>
                    <div><Label htmlFor="responsibilities">Key Responsibilities (one per line)</Label><Textarea id="responsibilities" {...register("responsibilities")} placeholder="List key responsibilities..." className="min-h-[120px]"/></div>
                    <div><Label htmlFor="requirements">Requirements (one per line) <span className="text-red-500">*</span></Label><Textarea id="requirements" {...register("requirements")} placeholder="List skills, qualifications, experience..." className="min-h-[150px]"/>{errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>}</div>
                    <div><Label htmlFor="benefits">Benefits (one per line)</Label><Textarea id="benefits" {...register("benefits")} placeholder="List benefits and perks..." className="min-h-[120px]"/></div>
                    <div className="flex justify-between mt-6"><Button type="button" variant="outline" onClick={prevStep}>Back</Button><Button type="button" onClick={nextStep}>Next: Application</Button></div>
                  </TabsContent>
                  
                  <TabsContent value="step3" className="space-y-6">
                    <div><Label htmlFor="applicationDeadline">Application Deadline (Optional)</Label><Input id="applicationDeadline" type="date" {...register("applicationDeadline")}/>{errors.applicationDeadline && <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline.message}</p>}</div>
                    <div><Label htmlFor="applicationInstructions">Application Instructions (Optional)</Label><Textarea id="applicationInstructions" {...register("applicationInstructions")} placeholder="e.g., Apply via our portal, or email resume to careers@example.com" className="min-h-[100px]"/></div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-base font-medium">Custom Application Questions</Label>
                          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", type: "text", required: false })}><PlusCircle className="mr-2 h-4 w-4"/>Add Question</Button>
                        </div>
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <Card key={field.id} className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor={`applicationRequirements.${index}.name`}>Question {index + 1}</Label>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4"/></Button>
                              </div>
                              <div className="space-y-2">
                                <Input {...register(`applicationRequirements.${index}.name`)} placeholder="e.g., Portfolio URL, Years of Experience" />
                                {errors.applicationRequirements?.[index]?.name && <p className="text-red-500 text-sm">{errors.applicationRequirements[index].name.message}</p>}
                                <Controller name={`applicationRequirements.${index}.type`} control={control} render={({ field: typeField }) => (
                                    <Select onValueChange={typeField.onChange} defaultValue={typeField.value}>
                                        <SelectTrigger><SelectValue placeholder="Select field type"/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="textarea">Long Text (Textarea)</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="file">File Upload</SelectItem>
                                            <SelectItem value="url">URL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}/>
                                <div className="flex items-center space-x-2 pt-1">
                                    <Controller name={`applicationRequirements.${index}.required`} control={control} render={({ field: requiredField }) => (
                                        <Switch id={`applicationRequirements.${index}.required`} checked={requiredField.value} onCheckedChange={requiredField.onChange} />
                                    )}/>
                                    <Label htmlFor={`applicationRequirements.${index}.required`}>Required</Label>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="status">Initial Job Status</Label>
                         <Controller name="status" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="status"><SelectValue placeholder="Select initial status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open (Visible to applicants)</SelectItem>
                                <SelectItem value="draft">Draft (Save for later, not visible)</SelectItem>
                            </SelectContent>
                            </Select>
                        )}/>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                        <Button type="submit" disabled={isSubmitting || createJobMutation.isPending}>
                            {isSubmitting || createJobMutation.isPending ? "Posting Job..." : "Post Job"}
                        </Button>
                    </div>
                  </TabsContent>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
