
import { createContext, useContext, useState, useEffect } from "react";

const JobsDataContext = createContext();

export function JobsDataProvider({ children }) {
  const [data, setData] = useState({
    activeJobs: [],
    recentApplicants: [],
    stats: {
      activeJobsCount: 0,
      totalApplicants: 0,
      newToday: 0,
      profileViews: 0
    }
  });

  useEffect(() => {
    // Mock data - in a real app this would come from an API
    const mockData = {
      activeJobs: [
        {
          id: 1,
          title: "Senior Web Developer",
          postedDate: "May 15, 2025",
          applicants: 12,
          daysLeft: 22,
          status: "Active"
        },
        {
          id: 2,
          title: "UI/UX Designer",
          postedDate: "May 18, 2025",
          applicants: 8,
          daysLeft: 19,
          status: "Active"
        },
        {
          id: 3,
          title: "Content Writer",
          postedDate: "May 20, 2025",
          applicants: 5,
          daysLeft: 17,
          status: "Active"
        }
      ],
      recentApplicants: [
        {
          id: 1,
          name: "Emma Thompson",
          position: "Senior Web Developer",
          appliedDate: "May 21, 2025",
          status: "New",
          avatar: ""
        },
        {
          id: 2,
          name: "Michael Rodriguez",
          position: "UI/UX Designer",
          appliedDate: "May 20, 2025",
          status: "Reviewed",
          avatar: ""
        },
        {
          id: 3,
          name: "Sarah Johnson",
          position: "Content Writer",
          appliedDate: "May 19, 2025",
          status: "Interview",
          avatar: ""
        }
      ],
      stats: {
        activeJobsCount: 3,
        totalApplicants: 25,
        newToday: 4,
        profileViews: 156
      }
    };

    setData(mockData);
  }, []);

  return (
    <JobsDataContext.Provider value={data}>
      {children}
    </JobsDataContext.Provider>
  );
}

export function useJobsData() {
  const context = useContext(JobsDataContext);
  if (!context) {
    throw new Error("useJobsData must be used within a JobsDataProvider");
  }
  return context;
}
