import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CreateJob() {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(1);
  const [jobCategory, setJobCategory] = useState("formal");
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleAddCustomField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      name: "",
      type: "text",
      required: false
    };
    setCustomFields([...customFields, newField]);
  };
  
  const handleUpdateCustomField = (id, field) => {
    setCustomFields(
      customFields.map(f => 
        f.id === id ? { ...f, ...field } : f
      )
    );
  };
  
  const handleRemoveCustomField = (id) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Job posted successfully!");
    navigate("/employer/jobs");
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create a New Job</CardTitle>
              <CardDescription>
                Fill out the form below to post a new job listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6 w-full justify-start">
                  <TabsTrigger 
                    value="details" 
                    className={formStep === 1 ? "border-b-2 border-jobconnect-primary" : ""}
                    onClick={() => setFormStep(1)}
                  >
                    1. Job Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="description" 
                    className={formStep === 2 ? "border-b-2 border-jobconnect-primary" : ""}
                    onClick={() => setFormStep(2)}
                  >
                    2. Description & Requirements
                  </TabsTrigger>
                  <TabsTrigger 
                    value="application" 
                    className={formStep === 3 ? "border-b-2 border-jobconnect-primary" : ""}
                    onClick={() => setFormStep(3)}
                  >
                    3. Application Settings
                  </TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="details" className={formStep === 1 ? "block" : "hidden"}>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="job-category" className="text-base font-medium block mb-4">Job Category</Label>
                        <RadioGroup 
                          id="job-category" 
                          value={jobCategory} 
                          onValueChange={setJobCategory} 
                          className="flex flex-col space-y-3"
                        >
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="formal" id="formal" />
                            <div>
                              <Label htmlFor="formal" className="font-medium">Formal Employment</Label>
                              <p className="text-sm text-gray-500">
                                Traditional jobs with regular hours, benefits, and long-term employment
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="informal" id="informal" />
                            <div>
                              <Label htmlFor="informal" className="font-medium">Informal Employment</Label>
                              <p className="text-sm text-gray-500">
                                Flexible work arrangements, gigs, short-term tasks, and temporary positions
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="job-title">Job Title</Label>
                          <Input id="job-title" placeholder="e.g., Senior Web Developer" required />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="job-type">Job Type</Label>
                            <Select required>
                              <SelectTrigger id="job-type">
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="experience-level">Experience Level</Label>
                            <Select>
                              <SelectTrigger id="experience-level">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="entry">Entry Level</SelectItem>
                                <SelectItem value="mid">Mid Level</SelectItem>
                                <SelectItem value="senior">Senior Level</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="min-salary">Minimum Salary</Label>
                            <Input id="min-salary" type="text" placeholder="e.g., $50,000" />
                          </div>
                          
                          <div>
                            <Label htmlFor="max-salary">Maximum Salary</Label>
                            <Input id="max-salary" type="text" placeholder="e.g., $70,000" />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" placeholder="e.g., New York, NY" required />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="remote" />
                          <Label htmlFor="remote">Remote work available</Label>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={() => setFormStep(2)}>
                          Next: Description & Requirements
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="description" className={formStep === 2 ? "block" : "hidden"}>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="job-description">Job Description</Label>
                        <Textarea 
                          id="job-description" 
                          placeholder="Describe the position, responsibilities, and ideal candidate..." 
                          className="min-h-[150px]"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea 
                          id="requirements" 
                          placeholder="List the skills, qualifications, and experience required..." 
                          className="min-h-[150px]"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="benefits">Benefits</Label>
                        <Textarea 
                          id="benefits" 
                          placeholder="Describe the benefits, perks, and other offerings..." 
                          className="min-h-[150px]"
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setFormStep(1)}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setFormStep(3)}>
                          Next: Application Settings
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="application" className={formStep === 3 ? "block" : "hidden"}>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-medium block mb-2">Application Deadline</Label>
                        <Input type="date" required />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label className="text-base font-medium">Required Application Materials</Label>
                          <Button type="button" variant="outline" size="sm" onClick={handleAddCustomField}>
                            Add Custom Field
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="require-resume" defaultChecked />
                            <Label htmlFor="require-resume">Resume/CV</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch id="require-cover-letter" />
                            <Label htmlFor="require-cover-letter">Cover Letter</Label>
                          </div>
                          
                          {customFields.map((field) => (
                            <div key={field.id} className="border p-4 rounded-lg space-y-4">
                              <div className="flex justify-between items-center">
                                <Label htmlFor={`field-name-${field.id}`}>Custom Field Name</Label>
                                <Button 
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCustomField(field.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                              <Input 
                                id={`field-name-${field.id}`}
                                value={field.name}
                                onChange={(e) => handleUpdateCustomField(field.id, { name: e.target.value })}
                                placeholder="e.g., Portfolio URL, Years of Experience"
                              />
                              
                              <div>
                                <Label htmlFor={`field-type-${field.id}`}>Field Type</Label>
                                <Select 
                                  value={field.type}
                                  onValueChange={(value) => handleUpdateCustomField(field.id, { type: value })}
                                >
                                  <SelectTrigger id={`field-type-${field.id}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="textarea">Long Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="url">URL</SelectItem>
                                    <SelectItem value="file">File Upload</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`field-required-${field.id}`}
                                  checked={field.required}
                                  onCheckedChange={(checked) => handleUpdateCustomField(field.id, { required: checked })}
                                />
                                <Label htmlFor={`field-required-${field.id}`}>Required Field</Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setFormStep(2)}>
                          Back
                        </Button>
                        <Button type="submit">Post Job</Button>
                      </div>
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
