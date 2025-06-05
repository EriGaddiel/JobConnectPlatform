
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import CreateJob from "./pages/CreateJob";
import MyApplications from "./pages/MyApplications";
import ReviewsRatings from "./pages/ReviewsRatings";
import Notifications from "./pages/Notifications";
import UserProfile from "./pages/UserProfile";
import SavedJobs from "./pages/SavedJobs";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Calendar from "./pages/Calendar";
import EmployerJobs from "./pages/EmployerJobs";
import EmployerAnalytics from "./pages/EmployerAnalytics";
import EmployerApplications from "./pages/EmployerApplications";
import EmployerCompany from "./pages/EmployerCompany";
import EmployerSettings from "./pages/EmployerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/jobs" element={<EmployerJobs />} />
          <Route path="/employer/analytics" element={<EmployerAnalytics />} />
          <Route path="/employer/applications" element={<EmployerApplications />} />
          <Route path="/employer/company" element={<EmployerCompany />} />
          <Route path="/employer/settings" element={<EmployerSettings />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<CreateJob />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/reviews" element={<ReviewsRatings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
