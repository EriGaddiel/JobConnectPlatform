
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Video } from "lucide-react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = [
    {
      id: "1",
      title: "Interview with John Doe",
      time: "10:00 AM",
      duration: "45 min",
      type: "interview",
      location: "Video Call",
      attendees: [
        { name: "John Doe", avatar: "" },
        { name: "Sarah Wilson", avatar: "" }
      ]
    },
    {
      id: "2", 
      title: "Team Meeting",
      time: "2:00 PM",
      duration: "60 min",
      type: "meeting",
      location: "Conference Room A",
      attendees: [
        { name: "Mike Johnson", avatar: "" },
        { name: "Emily Chen", avatar: "" },
        { name: "David Brown", avatar: "" }
      ]
    },
    {
      id: "3",
      title: "Project Review",
      time: "4:30 PM", 
      duration: "30 min",
      type: "meeting",
      location: "Office 205",
      attendees: [
        { name: "Lisa Anderson", avatar: "" }
      ]
    }
  ];

  const upcomingEvents = [
    {
      id: "4",
      title: "Client Presentation",
      date: "Tomorrow",
      time: "9:00 AM",
      type: "presentation"
    },
    {
      id: "5", 
      title: "Code Review Session",
      date: "Friday",
      time: "11:00 AM",
      type: "review"
    }
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case "interview":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "meeting":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "presentation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "review":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-gray-500">Manage your schedule and upcoming events</p>
            </div>
            <Button>Schedule New Event</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your next scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                      </div>
                      <Badge variant="outline" className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant="outline" className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{event.time} ({event.duration})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            {event.location === "Video Call" && (
                              <Video className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <div className="flex -space-x-2">
                              {event.attendees.map((attendee, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                  <AvatarImage src={attendee.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {attendee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                              {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Join</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
