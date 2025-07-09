
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // Assuming Index is a public or landing page variant
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

// Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider> {/* Assuming TooltipProvider and Sonner are UI library setups */}
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} /> {/* Often /auth handles both login/register */}
          <Route path="/register" element={<Auth />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
            {/* <Route path="/company/:companyId" element={<PublicCompanyProfile />} /> */}


            {/* Job Seeker Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['jobSeeker', 'admin']}><JobSeekerDashboard /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute allowedRoles={['jobSeeker']}><MyApplications /></ProtectedRoute>} />
            <Route path="/applications/:applicationId" element={<ProtectedRoute allowedRoles={['jobSeeker', 'employer', 'admin']}><MyApplications/></ProtectedRoute>} /> {/* Placeholder, needs actual component */}
            <Route path="/saved-jobs" element={<ProtectedRoute allowedRoles={['jobSeeker']}><SavedJobs /></ProtectedRoute>} />

            {/* Employer Protected Routes */}
            <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><EmployerDashboard /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><CreateJob /></ProtectedRoute>} />
            {/* TODO: Add route for editing a job: /employer/jobs/edit/:jobId, also protected */}
            <Route path="/employer/jobs" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><EmployerJobs /></ProtectedRoute>} />
            <Route path="/employer/applications" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><EmployerApplications /></ProtectedRoute>} />
            <Route path="/employer/company" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><EmployerCompany /></ProtectedRoute>} />
            <Route path="/employer/analytics" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><EmployerAnalytics /></ProtectedRoute>} />
            <Route path="/employer/settings" element={<ProtectedRoute allowedRoles={['employer', 'admin']}><EmployerSettings /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            {/* TODO: Add more admin specific routes for user management, site settings etc. */}

            {/* Common Protected Routes (accessible by multiple authenticated roles) */}
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['jobSeeker', 'employer', 'admin']}><UserProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['jobSeeker', 'employer', 'admin']}><Settings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute allowedRoles={['jobSeeker', 'employer', 'admin']}><Notifications /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute allowedRoles={['jobSeeker', 'employer', 'admin']}><Messages /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute allowedRoles={['jobSeeker', 'employer', 'admin']}><Calendar /></ProtectedRoute>} />


            {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
