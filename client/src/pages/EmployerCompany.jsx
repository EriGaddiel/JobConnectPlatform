
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Building, MapPin, Globe, Users } from "lucide-react";

export default function EmployerCompany() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="employer" />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-gray-500">Manage your company information and branding</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="TechCorp Solutions" />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Technology" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    defaultValue="We are a leading technology company focused on innovative solutions..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://techcorp.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-size">Company Size</Label>
                    <Input id="company-size" defaultValue="100-500 employees" />
                  </div>
                  <div>
                    <Label htmlFor="founded">Founded</Label>
                    <Input id="founded" defaultValue="2015" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Culture</CardTitle>
                <CardDescription>Showcase your company values and culture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea 
                    id="mission" 
                    rows={3}
                    defaultValue="To empower businesses through innovative technology solutions..."
                  />
                </div>
                <div>
                  <Label htmlFor="values">Core Values</Label>
                  <Textarea 
                    id="values" 
                    rows={3}
                    defaultValue="Innovation, Integrity, Collaboration, Excellence"
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Employee Benefits</Label>
                  <Textarea 
                    id="benefits" 
                    rows={3}
                    defaultValue="Health insurance, 401k, flexible work hours, remote work options..."
                  />
                </div>
                <Button>Update Culture Info</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">Technology</p>
                    <p className="text-sm text-gray-500">Industry</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">San Francisco, CA</p>
                    <p className="text-sm text-gray-500">Headquarters</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">100-500</p>
                    <p className="text-sm text-gray-500">Employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">techcorp.com</p>
                    <p className="text-sm text-gray-500">Website</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Complete</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="w-full" />
                  <p className="text-xs text-gray-500">Add company logo to reach 100%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
