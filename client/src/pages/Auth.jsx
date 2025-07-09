
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Navbar from "@/components/navbar";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'login';
  const defaultRole = searchParams.get('role') || 'jobseeker';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [role, setRole] = useState(defaultRole);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerName, setRegisterName] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState(""); // Added username state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  
  // const [loading, setLoading] = useState(false); // Will use isLoading from useAuth
  // const navigate = useNavigate(); // Navigation handled by AuthContext for login/signup success

  const { login, signup, isLoading, loginError, signupError, user, isAuthenticated } = useAuth(); // Use a single isLoading for now

  useEffect(() => {
    if (loginError) {
      toast.error(loginError.response?.data?.error || "Login failed. Please try again.");
    }
  }, [loginError]);

  useEffect(() => {
    if (signupError) {
      toast.error(signupError.response?.data?.error || "Signup failed. Please try again.");
    }
  }, [signupError]);

  // Redirect if user is already authenticated
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "employer") navigate("/employer/dashboard");
      else if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    // setLoading(true); //isLoading from useAuth
    
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      // setLoading(false);
      return;
    }
    
    try {
      await login({ usernameOrEmail: loginEmail, password: loginPassword });
      // Navigation is handled by AuthContext's loginMutation onSuccess
      // toast.success("Login successful! Redirecting..."); // Also can be handled in AuthContext or here
    } catch (err) {
      // Error toast is handled by useEffect [loginError]
      // console.error("Login error in component:", err);
    }
    // setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // setLoading(true); //isLoading from useAuth
    
    if (!registerName || !registerUsername || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error("Please fill in all (Full Name, Username, Email, Password, Confirm Password) fields");
      // setLoading(false);
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your passwords match.",
      });
      // setLoading(false);
      return;
    }
    
    try {
      await signup({
        fullName: registerName,
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        role: role // Pass the selected role
      });
      // After successful signup, AuthContext's signupMutation onSuccess handles navigation
      // toast.success("Account created! Redirecting..."); // Or prompt to check email for verification
      // setActiveTab("login"); // Or redirect to dashboard/verification page
    } catch (err) {
      // Error toast is handled by useEffect [signupError]
      // console.error("Signup error in component:", err);
    }
    // setLoading(false);
  };

  return (
    <>
      <Navbar /> {/* Navbar might need to be updated to reflect auth state */}
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Login to JobConnect</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-role">I am a:</Label>
                      <RadioGroup 
                        id="login-role" 
                        value={role} 
                        onValueChange={setRole} 
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jobseeker" id="login-jobseeker" />
                          <Label htmlFor="login-jobseeker">Job Seeker</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="employer" id="login-employer" />
                          <Label htmlFor="login-employer">Employer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="login-admin" />
                          <Label htmlFor="login-admin">Admin</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="you@example.com" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link to="/forgot-password" className="text-sm text-jobconnect-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Logging In..." : "Login"}
                      </Button>
                    </form>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Don&apos;t have an account?{" "}
                      <button 
                        onClick={() => setActiveTab("register")} 
                        className="text-jobconnect-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                      Enter your details to create your JobConnect account
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-role">I am a:</Label>
                      <RadioGroup 
                        id="register-role" 
                        value={role} 
                        onValueChange={setRole} 
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jobseeker" id="register-jobseeker" />
                          <Label htmlFor="register-jobseeker">Job Seeker</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="employer" id="register-employer" />
                          <Label htmlFor="register-employer">Employer</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Smith" 
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Username</Label>
                        <Input
                          id="register-username"
                          placeholder="johnsmith"
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="you@example.com" 
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input 
                          id="register-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Already have an account?{" "}
                      <button 
                        onClick={() => setActiveTab("login")} 
                        className="text-jobconnect-primary hover:underline"
                      >
                        Login
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
