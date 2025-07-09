import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending HttpOnly cookies
});

// Optional: Add interceptors for global error handling or request/response manipulation
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors (e.g., 401 Unauthorized, network errors)
//     if (error.response && error.response.status === 401) {
//       // Potentially redirect to login or refresh token
//       // window.location.href = '/auth';
//       console.error("Unauthorized access - redirecting to login might be needed.");
//     }
//     return Promise.reject(error);
//   }
// );

// --- Auth Service Functions ---
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const signupUser = (userData) => apiClient.post('/auth/signup', userData);
export const logoutUser = () => apiClient.post('/auth/logout');
export const fetchCurrentUser = () => apiClient.get('/auth/me');
export const verifyEmail = (data) => apiClient.post('/auth/verify-email', data);
export const resendVerificationEmail = (data) => apiClient.post('/auth/resend-verification-email', data);
export const requestPasswordReset = (data) => apiClient.post('/auth/request-password-reset', data);
export const resetPassword = (data) => apiClient.post('/auth/reset-password', data);


// --- User Service Functions ---
export const updateUserProfile = (profileData) => apiClient.put('/users/me', profileData);
export const getUserProfile = (userId) => apiClient.get(`/users/${userId}`);
// TODO: Add other user-related API calls (e.g., save/unsave job if they go here)

// --- Job Service Functions ---
export const createJob = (jobData) => apiClient.post('/jobs', jobData);
export const getAllJobs = (params) => apiClient.get('/jobs', { params }); // params for filtering, pagination, search
export const getJobById = (jobId) => apiClient.get(`/jobs/${jobId}`);
export const updateJob = (jobId, jobData) => apiClient.put(`/jobs/${jobId}`, jobData);
export const deleteJob = (jobId) => apiClient.delete(`/jobs/${jobId}`);
export const getSimilarJobs = (jobId) => apiClient.get(`/jobs/${jobId}/similar`);
export const getMyPostedJobs = (params) => apiClient.get('/jobs/my-posted/list', { params });
export const getCompanyJobs = (companyId, params) => apiClient.get(`/jobs/company/${companyId}`, { params });

// --- Company Service Functions ---
export const createCompany = (companyData) => apiClient.post('/companies', companyData);
export const getMyCompanyDetails = () => apiClient.get('/companies/my-company/details');
export const getCompanyById = (companyId) => apiClient.get(`/companies/${companyId}`);
export const updateCompany = (companyId, companyData) => apiClient.put(`/companies/${companyId}`, companyData);
export const listCompanies = (params) => apiClient.get('/companies', { params });
// TODO: Add deleteCompany, verifyCompany if needed by frontend roles other than super admin directly.

// --- Application Service Functions ---
export const createApplication = (jobId, applicationData) => apiClient.post(`/applications/job/${jobId}`, applicationData);
export const getMyApplications = (params) => apiClient.get('/applications/my-applications', { params });
export const getJobApplications = (jobId, params) => apiClient.get(`/applications/job/${jobId}/list`, { params });
export const updateApplicationStatus = (applicationId, statusData) => apiClient.patch(`/applications/${applicationId}/status`, statusData);
export const withdrawApplication = (applicationId) => apiClient.patch(`/applications/${applicationId}/withdraw`);
export const getApplicationById = (applicationId) => apiClient.get(`/applications/${applicationId}`);


// --- Analytics Service Functions ---
export const getJobAnalyticsForEmployer = (jobId) => apiClient.get(`/analytics/employer/jobs/${jobId}`);
export const getEmployerDashboardAnalytics = (companyIdForAdmin) => {
    const params = companyIdForAdmin ? { companyIdForAdmin } : {};
    return apiClient.get('/analytics/employer/dashboard', { params });
};
// TODO: Add admin analytics if needed by frontend.


// --- Notification Service Functions (Conceptual - if direct API interaction for notifications is needed) ---
// export const getMyNotifications = (params) => apiClient.get('/notifications/me', { params });
// export const markNotificationAsRead = (notificationId) => apiClient.patch(`/notifications/me/${notificationId}/mark-read`);
// export const markAllNotificationsAsRead = () => apiClient.patch('/notifications/me/mark-all-read');


export default apiClient; // Export the configured instance for default use if needed elsewhere
                         // But primarily, named exports for service functions are used.
