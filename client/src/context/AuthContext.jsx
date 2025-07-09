import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, loginUser, signupUser, logoutUser as apiLogoutUser } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io-client
import { API_BASE_URL } from '@/lib/constants'; // Get base URL for socket connection
import { toast } from 'sonner'; // For displaying notifications

const AuthContext = createContext(null);
const SOCKET_SERVER_URL = API_BASE_URL.replace('/api', ''); // Assuming socket server is at root of backend URL

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]); // Simple state for unread notifications count/list

  const { data: user, isLoading: isLoadingUser, isError: isAuthError, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await fetchCurrentUser();
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;
        throw error;
      }
    },
    staleTime: Infinity, cacheTime: Infinity, retry: false, refetchOnWindowFocus: false,
  });

  // Socket connection management
  useEffect(() => {
    if (user?._id && !socketRef.current) {
      // Connect to socket server, passing userId in query for initial mapping
      socketRef.current = io(SOCKET_SERVER_URL, {
        query: { userId: user._id },
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        // Server-side userSocketMap should handle mapping via handshake query.
        // Explicitly emit registerUser if handshake query is not reliable or for redundancy.
        socketRef.current.emit("registerUser", user._id);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        // No need to manually nullify socketRef.current here, reconnection attempts will handle it.
        // If reconnection fails after attempts, then it might be set to null.
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // --- Step 3: Listen for Notifications ---
      socketRef.current.on('newNotification', (notification) => {
        console.log('New notification received:', notification);
        toast.info(notification.message, {
          description: `Type: ${notification.type}`,
          action: notification.link ? {
            label: "View",
            onClick: () => navigate(notification.link),
          } : undefined,
          duration: 10000, // Show for 10 seconds
        });
        // Update a simple notification state/count (can be expanded)
        setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10
        // TODO: Update a notification bell icon/counter in Navbar
        // Potentially invalidate queries if notification implies data change
        if (notification.type === 'new_job_application' || notification.type === 'application_status_update') {
            queryClient.invalidateQueries({ queryKey: ['jobApplications'] }); // Broad invalidation
            queryClient.invalidateQueries({ queryKey: ['myApplications'] });
            // More specific invalidation can be done if entityId and entityType are used
        }
      });

      // Example for more specific event handling
      socketRef.current.on('newApplicationReceived', ({application, jobTitle, applicantName}) => {
        console.log(`New application for ${jobTitle} from ${applicantName}`);
        // This specific event can be used by EmployerApplications page to update UI directly
        // For now, the generic 'newNotification' handles the toast.
      });


      return () => {
        if (socketRef.current) {
          console.log("Disconnecting socket on user change or unmount");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else if (!user && socketRef.current) {
      // User logged out or cleared, disconnect socket
      console.log("User logged out, disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [user, navigate, queryClient]); // Added queryClient to dependencies for invalidateQueries

  const commonMutationOptions = {
    // onSuccess is handled specifically in each mutation below for navigation/socket logic
    onError: (error) => {
      console.error("Auth mutation error:", error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || "An authentication error occurred.");
    }
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
        queryClient.setQueryData(['currentUser'], response.data); // Assuming response.data is the user object
        // refetchUser(); // This will trigger useEffect for socket connection
        const role = response.data.role;
        if (role === "employer") navigate("/employer/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/dashboard");
    },
    onError: commonMutationOptions.onError,
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (response) => {
        // Typically, after signup, user might need to verify email before full login.
        // For this flow, let's assume signup also logs them in (backend sets cookie).
        queryClient.setQueryData(['currentUser'], response.data); // User object from signup
        // refetchUser(); // Trigger useEffect for socket connection
        toast.success("Account created! Please check your email for verification (if applicable).");
        const role = response.data.role;
        if (role === "employer") navigate("/employer/dashboard"); // Or to company creation
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/dashboard");
    },
    onError: commonMutationOptions.onError,
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogoutUser,
    onSuccess: () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      queryClient.setQueryData(['currentUser'], null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.clear();
      setNotifications([]); // Clear notifications on logout
      navigate('/auth');
    },
    onError: (error) => { // Still attempt client-side cleanup on error
      console.error("Logout API error:", error.response?.data?.error || error.message);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      queryClient.setQueryData(['currentUser'], null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.clear();
      setNotifications([]);
      navigate('/auth');
    }
  });

  const login = async (credentials) => loginMutation.mutateAsync(credentials);
  const signup = async (userData) => signupMutation.mutateAsync(userData);
  const logout = async () => logoutMutation.mutateAsync();

  const value = {
    user: user || null,
    isAuthenticated: !!user && !isAuthError,
    isLoading: isLoadingUser || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    isAuthError,
    login,
    signup,
    logout,
    refetchUser,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    notifications, // Provide notifications to be used by a Navbar component, for example
    clearNotifications: () => setNotifications([]), // Example function to clear
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
