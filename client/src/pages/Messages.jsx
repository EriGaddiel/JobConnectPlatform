
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, Paperclip, MoreHorizontal } from "lucide-react";

export default function Messages() {
  const [conversations] = useState([
    {
      id: 1,
      name: "TechCorp Inc",
      avatar: "",
      lastMessage: "Thanks for your application. We'd like to schedule an interview.",
      time: "10:30 AM",
      unread: true
    },
    {
      id: 2,
      name: "BrandBoost",
      avatar: "",
      lastMessage: "Hi John, we've reviewed your application for the Marketing position.",
      time: "Yesterday",
      unread: false
    },
    {
      id: 3,
      name: "FastCourier",
      avatar: "",
      lastMessage: "Your application for Delivery Driver has been received.",
      time: "May 19",
      unread: false
    },
    {
      id: 4,
      name: "JobConnect Support",
      avatar: "",
      lastMessage: "How is your job search going? We've got some tips for you!",
      time: "May 18",
      unread: false
    }
  ]);

  // Active conversation - would come from state management in a real app
  const [activeConversation, setActiveConversation] = useState(conversations[0]);

  const [messages] = useState([
    {
      id: 1,
      sender: "them",
      content: "Hello John, thank you for applying to the Senior Web Developer position at TechCorp Inc.",
      time: "10:20 AM",
      read: true
    },
    {
      id: 2,
      sender: "them",
      content: "We've reviewed your application and would like to schedule an interview with you.",
      time: "10:21 AM",
      read: true
    },
    {
      id: 3,
      sender: "me",
      content: "Hello! Thank you for considering my application. I'm excited about the opportunity.",
      time: "10:25 AM",
      read: true
    },
    {
      id: 4,
      sender: "them",
      content: "Great! Are you available for a video interview next Tuesday at 2 PM EST?",
      time: "10:27 AM",
      read: true
    },
    {
      id: 5,
      sender: "me",
      content: "Yes, that works perfectly for me. I'll make sure to be available at that time.",
      time: "10:29 AM",
      read: true
    },
    {
      id: 6,
      sender: "them",
      content: "Excellent! I'll send you a calendar invite with the meeting details shortly. Is there anything specific you'd like to know about the role before the interview?",
      time: "10:30 AM",
      read: false
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    // In a real app, this would send the message and update the state
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar role="jobseeker" />
      
      <div className="flex-1 flex flex-col">
        <header className="p-4 md:p-6 border-b">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500">Communicate with employers and the JobConnect team</p>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List */}
          <div className="w-full md:w-80 border-r overflow-y-auto flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search conversations"
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1">
              <TabsList className="grid grid-cols-2 mx-4 mt-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-2 flex-1 overflow-y-auto">
                <div className="space-y-1">
                  {conversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                        activeConversation.id === conversation.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      } ${conversation.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{conversation.name}</h4>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                            {conversation.unread && (
                              <Badge className="ml-2 h-2 w-2 rounded-full p-0 bg-jobconnect-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="unread" className="mt-2 flex-1">
                <div className="space-y-1">
                  {conversations.filter(c => c.unread).map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                        activeConversation.id === conversation.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      } bg-blue-50 dark:bg-blue-900/10`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{conversation.name}</h4>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                            <Badge className="ml-2 h-2 w-2 rounded-full p-0 bg-jobconnect-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {conversations.filter(c => c.unread).length === 0 && (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">No unread messages</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Message Area */}
          <div className="hidden md:flex flex-1 flex-col">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={activeConversation.avatar} />
                      <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{activeConversation.name}</h2>
                      <p className="text-xs text-gray-500">Last active: Today at 10:30 AM</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender === 'me' 
                          ? 'bg-jobconnect-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                          : 'bg-gray-200 dark:bg-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'
                      } p-3`}>
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                        } flex items-center`}>
                          <span>{message.time}</span>
                          {message.sender === 'me' && (
                            <svg 
                              className="h-3 w-3 ml-1" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input 
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Message View - would toggle in a real app */}
          <div className="md:hidden flex-1 flex items-center justify-center">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="mb-4">Select a conversation to view messages</p>
                <Button>View Conversations</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
