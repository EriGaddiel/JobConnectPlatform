
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Progress } from "@/components/ui/progress"; // Can be re-added later
import { Building, MapPin, Globe, Users, Briefcase, Phone, Link2, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyCompanyDetails, createCompany, updateCompany } from "@/services/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Zod schema for validation
const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(2000),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL.").optional().or(z.literal("")),
  companySize: z.string().optional(), // E.g., "1-10", "11-50"
  foundedYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().or(z.literal("")),
  contactEmail: z.string().email("Invalid email address.").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  logo: z.string().url("Invalid logo URL.").optional().or(z.literal("")), // Assuming URL for logo for now
  socialLinks: z.object({
    linkedin: z.string().url("Invalid LinkedIn URL.").optional().or(z.literal("")),
    twitter: z.string().url("Invalid Twitter URL.").optional().or(z.literal("")),
    facebook: z.string().url("Invalid Facebook URL.").optional().or(z.literal("")),
  }).optional(),
});

export default function EmployerCompany() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit for existing company

  const { data: companyData, isLoading, isError, error: fetchError, refetch } = useQuery({
    queryKey: ['myCompanyDetails'],
    queryFn: getMyCompanyDetails,
    retry: (failureCount, error) => {
      // Don't retry on 404, it means company doesn't exist
      return error.response?.status !== 404 && failureCount < 2;
    },
  });

  const existingCompany = companyData?.data; // API response is nested in .data by axios

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: existingCompany || {
      name: "", description: "", industry: "", location: "", website: "",
      companySize: "", foundedYear: "", contactEmail: "", contactPhone: "", logo: "",
      socialLinks: { linkedin: "", twitter: "", facebook: "" }
    }
  });

  useEffect(() => {
    if (existingCompany) {
      reset(existingCompany); // Populate form with fetched data
      setIsEditing(false); // Start in view mode if company exists
    } else if (fetchError && fetchError.response?.status === 404) {
        setIsEditing(true); // If 404, it means no company, so directly go to create/edit mode
    }
  }, [existingCompany, reset, fetchError]);


  const createOrUpdateMutation = useMutation({
    mutationFn: (data) => {
      if (existingCompany?._id) {
        return updateCompany(existingCompany._id, data);
      }
      return createCompany(data);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || `Company profile ${existingCompany?._id ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['myCompanyDetails'] });
      refetch(); // Refetch data to update the view
      setIsEditing(false); // Exit edit mode
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to save company profile.");
    }
  });

  const onSubmit = (data) => {
    // Filter out empty optional strings for cleaner API payload, especially for URLs
    if (data.website === "") delete data.website;
    if (data.logo === "") delete data.logo;
    if (data.socialLinks) {
        if (data.socialLinks.linkedin === "") delete data.socialLinks.linkedin;
        if (data.socialLinks.twitter === "") delete data.socialLinks.twitter;
        if (data.socialLinks.facebook === "") delete data.socialLinks.facebook;
        if (Object.keys(data.socialLinks).length === 0) delete data.socialLinks;
    }
    if (data.foundedYear === "") data.foundedYear = null;


    createOrUpdateMutation.mutate(data);
  };

  if (isLoading && !existingCompany) { // Show loading skeleton only on initial load without data
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardSidebar role="employer" />
            <div className="flex-1 p-6 space-y-6">
                <Skeleton className="h-10 w-1/3 mb-4" />
                <Skeleton className="h-8 w-1/4 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  const companyDisplay = isEditing ? null : existingCompany; // Data for read-only view

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="employer" />
      <div className="flex-1 p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-gray-500">
              {existingCompany?._id ? "Manage your company information and branding" : "Create your company profile to start posting jobs"}
            </p>
          </div>
          {existingCompany?._id && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{existingCompany?._id && !isEditing ? "Company Information" : "Edit Company Information"}</CardTitle>
                <CardDescription>{existingCompany?._id && !isEditing ? "View your company details." : "Update your company details."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" {...register("industry")} placeholder="e.g., Technology, Healthcare, Finance"/>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Company Description <span className="text-red-500">*</span></Label>
                      <Textarea id="description" rows={5} {...register("description")} placeholder="Tell us about your company, its mission, and values." />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location (e.g., City, State)</Label>
                        <Input id="location" {...register("location")} placeholder="San Francisco, CA"/>
                      </div>
                      <div>
                        <Label htmlFor="website">Website URL</Label>
                        <Input id="website" {...register("website")} placeholder="https://yourcompany.com"/>
                        {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
                      </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companySize">Company Size</Label>
                        <Input id="companySize" {...register("companySize")} placeholder="e.g., 50-200 employees"/>
                      </div>
                       <div>
                        <Label htmlFor="foundedYear">Founded Year</Label>
                        <Input id="foundedYear" type="number" {...register("foundedYear")} placeholder="e.g., 2015"/>
                        {errors.foundedYear && <p className="text-red-500 text-sm mt-1">{errors.foundedYear.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="contact@yourcompany.com"/>
                            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input id="contactPhone" {...register("contactPhone")} placeholder="(123) 456-7890"/>
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input id="logo" {...register("logo")} placeholder="https://yourcompany.com/logo.png"/>
                        {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
                    </div>
                     <CardTitle className="text-md pt-2">Social Links</CardTitle>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><Label htmlFor="socialLinks.linkedin">LinkedIn URL</Label><Input id="socialLinks.linkedin" {...register("socialLinks.linkedin")} placeholder="https://linkedin.com/company/..."/>{errors.socialLinks?.linkedin && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.linkedin.message}</p>}</div>
                        <div><Label htmlFor="socialLinks.twitter">Twitter URL</Label><Input id="socialLinks.twitter" {...register("socialLinks.twitter")} placeholder="https://twitter.com/..."/>{errors.socialLinks?.twitter && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.twitter.message}</p>}</div>
                        <div><Label htmlFor="socialLinks.facebook">Facebook URL</Label><Input id="socialLinks.facebook" {...register("socialLinks.facebook")} placeholder="https://facebook.com/..."/>{errors.socialLinks?.facebook && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.facebook.message}</p>}</div>
                     </div>
                  </>
                ) : companyDisplay ? (
                    // Read-only view
                    <div className="space-y-3">
                        <p><strong>Industry:</strong> {companyDisplay.industry || "N/A"}</p>
                        <p><strong>Description:</strong> {companyDisplay.description}</p>
                        <p><strong>Location:</strong> {companyDisplay.location || "N/A"}</p>
                        <p><strong>Website:</strong> {companyDisplay.website ? <a href={companyDisplay.website} target="_blank" rel="noopener noreferrer" className="text-jobconnect-primary hover:underline">{companyDisplay.website}</a> : "N/A"}</p>
                        <p><strong>Company Size:</strong> {companyDisplay.companySize || "N/A"}</p>
                        <p><strong>Founded:</strong> {companyDisplay.foundedYear || "N/A"}</p>
                        <p><strong>Contact Email:</strong> {companyDisplay.contactEmail || "N/A"}</p>
                        <p><strong>Contact Phone:</strong> {companyDisplay.contactPhone || "N/A"}</p>
                        {companyDisplay.logo && <div className="mt-2"><p className="font-semibold">Logo:</p><img src={companyDisplay.logo} alt={`${companyDisplay.name} logo`} className="max-w-xs max-h-20 object-contain border rounded mt-1"/></div>}
                        {companyDisplay.socialLinks && (
                            <div className="mt-2 space-y-1">
                                <p className="font-semibold">Socials:</p>
                                {companyDisplay.socialLinks.linkedin && <p>LinkedIn: <a href={companyDisplay.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-jobconnect-primary hover:underline">View Profile</a></p>}
                                {companyDisplay.socialLinks.twitter && <p>Twitter: <a href={companyDisplay.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-jobconnect-primary hover:underline">View Profile</a></p>}
                                {companyDisplay.socialLinks.facebook && <p>Facebook: <a href={companyDisplay.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-jobconnect-primary hover:underline">View Profile</a></p>}
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No company profile found. Please fill out the form to create one.</p>
                )}
                {isEditing && (
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={createOrUpdateMutation.isPending || !isDirty}>
                        {createOrUpdateMutation.isPending ? "Saving..." : (existingCompany?._id ? "Save Changes" : "Create Company")}
                        </Button>
                        {existingCompany?._id && ( // Show cancel only if editing an existing company
                            <Button type="button" variant="outline" onClick={() => { setIsEditing(false); reset(existingCompany); }}>Cancel</Button>
                        )}
                    </div>
                )}
              </CardContent>
            </Card>
            {/* Removed Company Culture Card as it's not in the backend model directly */}
          </div>

          {/* Right Sidebar for Stats - shows data if companyDisplay exists and not editing */}
          {companyDisplay && !isEditing && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Company Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {companyDisplay.logo && <img src={companyDisplay.logo} alt={`${companyDisplay.name} logo`} className="max-w-full h-auto max-h-24 object-contain rounded border mb-3 mx-auto"/>}
                  <div className="flex items-center gap-2"><Building className="h-4 w-4 text-gray-500" /> <span>{companyDisplay.name}</span></div>
                  {companyDisplay.industry && <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-gray-500" /> <span>{companyDisplay.industry}</span></div>}
                  {companyDisplay.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /> <span>{companyDisplay.location}</span></div>}
                  {companyDisplay.companySize && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-500" /> <span>{companyDisplay.companySize}</span></div>}
                  {companyDisplay.website && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-gray-500" /> <a href={companyDisplay.website} target="_blank" rel="noopener noreferrer" className="text-jobconnect-primary hover:underline truncate">{companyDisplay.website}</a></div>}
                  {companyDisplay.contactEmail && <div className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-gray-500" /> <span>{companyDisplay.contactEmail}</span></div>}
                  {companyDisplay.contactPhone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> <span>{companyDisplay.contactPhone}</span></div>}
                  {companyDisplay.socialLinks?.linkedin && <div className="flex items-center gap-2"><Link2 className="h-4 w-4 text-gray-500" /> <a href={companyDisplay.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-jobconnect-primary hover:underline">LinkedIn</a></div>}
                </CardContent>
              </Card>
              {/* Profile Completion Card can be re-added if logic is defined */}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
