import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Clock, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Notifications() {
  const [notifications] = useState([
    { 
      id: 1, 
      title: "Application Viewed", 
      description: "Your application for Senior Web Developer has been viewed by TechCorp Inc.", 
      time: "2 hours ago",
      type: "application",
      read: false
    },
    { 
      id: 2, 
      title: "Interview Invitation", 
      description: "You've been invited to interview for Marketing Specialist at BrandBoost.", 
      time: "1 day ago",
      type: "interview",
      read: false
    },
    { 
      id: 3, 
      title: "New Message", 
      description: "You have a new message from FastCourier regarding your application.", 
      time: "3 days ago",
      type: "message",
      read: true
    },
    { 
      id: 4, 
      title: "Application Status Updated", 
      description: "Your application for Graphic Designer at CreativeMinds has moved to the next stage.", 
      time: "4 days ago",
      type: "application",
      read: true
    },
    { 
      id: 5, 
      title: "Job Recommendation", 
      description: "Based on your profile, we found a new UX Researcher position that might interest you.", 
      time: "1 week ago",
      type: "recommendation",
      read: true
    },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-gray-500">Stay updated on your job search activity</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
              <Button variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </div>
        </header>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Stay updated with your job search activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b last:border-0 flex gap-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        {notification.type === 'application' && (
                          <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                            <CheckCircle size={20} />
                          </div>
                        )}
                        {notification.type === 'interview' && (
                          <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded-full">
                            <Clock size={20} />
                          </div>
                        )}
                        {notification.type === 'message' && (
                          <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-2 rounded-full">
                            <Bell size={20} />
                          </div>
                        )}
                        {notification.type === 'recommendation' && (
                          <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 p-2 rounded-full">
                            <Star size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-medium flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                New
                              </Badge>
                            )}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.description}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="link" className="h-auto p-0">
                            View Details
                          </Button>
                          {!notification.read && (
                            <Button size="sm" variant="link" className="h-auto p-0">
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>Notifications you haven&apos;t read yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {notifications.filter(n => !n.read).map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 border-b last:border-0 flex gap-4 bg-blue-50 dark:bg-blue-900/10"
                    >
                      <div className="flex-shrink-0">
                        {notification.type === 'application' && (
                          <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                            <CheckCircle size={20} />
                          </div>
                        )}
                        {notification.type === 'interview' && (
                          <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded-full">
                            <Clock size={20} />
                          </div>
                        )}
                        {notification.type === 'message' && (
                          <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-2 rounded-full">
                            <Bell size={20} />
                          </div>
                        )}
                        {notification.type === 'recommendation' && (
                          <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 p-2 rounded-full">
                            <Star size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-medium flex items-center gap-2">
                            {notification.title}
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              New
                            </Badge>
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.description}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="link" className="h-auto p-0">
                            View Details
                          </Button>
                          <Button size="sm" variant="link" className="h-auto p-0">
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.filter(n => !n.read).length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No unread notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Notifications</CardTitle>
                <CardDescription>Updates related to your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {notifications.filter(n => n.type === 'application').length > 0 ? (
                    notifications.filter(n => n.type === 'application').map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b last:border-0 flex gap-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex-shrink-0">
                          <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                            <CheckCircle size={20} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-base font-medium flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  New
                                </Badge>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.description}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="link" className="h-auto p-0">
                              View Details
                            </Button>
                            {!notification.read && (
                              <Button size="sm" variant="link" className="h-auto p-0">
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No application notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Notifications</CardTitle>
                <CardDescription>Messages from employers and the JobConnect team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {notifications.filter(n => n.type === 'message').length > 0 ? (
                    notifications.filter(n => n.type === 'message').map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b last:border-0 flex gap-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex-shrink-0">
                          <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-2 rounded-full">
                            <Bell size={20} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-base font-medium flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  New
                                </Badge>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.description}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="link" className="h-auto p-0">
                              View Message
                            </Button>
                            {!notification.read && (
                              <Button size="sm" variant="link" className="h-auto p-0">
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No message notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <Button variant="outline" className="w-full max-w-sm">
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}
