
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Bell, Trash, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/FeatureCard";

export default function Settings() {
  // Sample settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    applicationUpdates: true,
    messageNotifications: true,
    jobRecommendations: true,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    contactInfoVisibility: false,
    resumeVisibility: true,
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account preferences and settings</p>
        </header>
        
        <Tabs defaultValue="account" className="mb-8">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Smith" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.smith@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="New York, NY" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle>Danger Zone</CardTitle>
                      <CardDescription>Permanent account actions</CardDescription>
                    </div>
                    <Badge variant="destructive">Proceed with caution</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
                          <Trash size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-gray-500">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <Bell className="h-5 w-5 text-jobconnect-primary" />
                  <CardTitle>Notification Settings</CardTitle>
                </div>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Job Alerts</h4>
                        <p className="text-sm text-gray-500">Receive emails about new job matches</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailAlerts} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailAlerts: checked})} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Application Updates</h4>
                        <p className="text-sm text-gray-500">Updates on your job applications</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.applicationUpdates} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, applicationUpdates: checked})} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Message Notifications</h4>
                        <p className="text-sm text-gray-500">Emails when you receive new messages</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.messageNotifications} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, messageNotifications: checked})} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Job Recommendations</h4>
                        <p className="text-sm text-gray-500">Weekly job recommendations based on your profile</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.jobRecommendations} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, jobRecommendations: checked})} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-gray-500">News, tips, and product updates from JobConnect</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.marketingEmails} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})} 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Browser Notifications</h4>
                        <p className="text-sm text-gray-500">Allow desktop notifications in your browser</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mobile Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications on your mobile device</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <UserCog className="h-5 w-5 text-jobconnect-primary" />
                  <CardTitle>Privacy Settings</CardTitle>
                </div>
                <CardDescription>Control what information is visible to others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="font-medium mb-4">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Public Profile</h4>
                        <p className="text-sm text-gray-500">Make your profile visible to employers</p>
                      </div>
                      <Switch 
                        checked={privacySettings.profileVisibility} 
                        onCheckedChange={(checked) => setPrivacySettings({...privacySettings, profileVisibility: checked})} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Contact Information</h4>
                        <p className="text-sm text-gray-500">Allow employers to see your contact details</p>
                      </div>
                      <Switch 
                        checked={privacySettings.contactInfoVisibility} 
                        onCheckedChange={(checked) => setPrivacySettings({...privacySettings, contactInfoVisibility: checked})} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Resume Visibility</h4>
                        <p className="text-sm text-gray-500">Make your resume visible to employers</p>
                      </div>
                      <Switch 
                        checked={privacySettings.resumeVisibility} 
                        onCheckedChange={(checked) => setPrivacySettings({...privacySettings, resumeVisibility: checked})} 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Data & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Activity Tracking</h4>
                        <p className="text-sm text-gray-500">Allow us to track your activity to provide better job matches</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cookie Preferences</h4>
                        <p className="text-sm text-gray-500">Manage how we use cookies</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Download Your Data</h4>
                        <p className="text-sm text-gray-500">Get a copy of all your personal data</p>
                      </div>
                      <Button variant="outline" size="sm">Request</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Privacy Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>Manage your subscription and billing details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-lg mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium">Free Plan</h3>
                          <p className="text-sm text-gray-500">
                            You&apos;re currently on the free plan. Upgrade for premium features.
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Payment Method</h3>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-gray-500 mb-2">No payment method added</p>
                          <Button variant="outline">Add Payment Method</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Billing History</h3>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-gray-500 mb-2">No billing history available</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade to Premium</CardTitle>
                  <CardDescription>Get access to exclusive features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-100 dark:border-blue-900/30 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                      <h3 className="font-bold text-xl mb-2">Premium Plan</h3>
                      <p className="font-medium text-2xl mb-4">$9.99<span className="text-sm text-gray-500">/month</span></p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Priority application visibility</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Access to premium job listings</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Detailed application insights</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Early access to new features</span>
                        </li>
                      </ul>
                      <Button className="w-full">Upgrade Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
