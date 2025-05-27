
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-gray-400 text-sm">
              Connecting talent with opportunity. Find your dream job or hire the perfect candidate.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-400 hover:text-white text-sm">Browse Jobs</Link></li>
              <li><Link to="/auth?tab=register&role=jobseeker" className="text-gray-400 hover:text-white text-sm">Create Profile</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-white text-sm">Career Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li><Link to="/post-job" className="text-gray-400 hover:text-white text-sm">Post a Job</Link></li>
              <li><Link to="/auth?tab=register&role=employer" className="text-gray-400 hover:text-white text-sm">Employer Signup</Link></li>
              <li><Link to="/employer/dashboard" className="text-gray-400 hover:text-white text-sm">Employer Dashboard</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 JobConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
