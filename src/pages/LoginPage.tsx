
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/AuthContext';
import { Loader2, Play, Layers, Check, Rocket, Globe, Code, Settings, ExternalLink, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const LoginPage = () => {
  const { login, signUp, loginAsGuest, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      setIsSubmitting(true);
      await signUp(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsSubmitting(true);
      loginAsGuest();
      navigate('/');
    } catch (error) {
      console.error("Guest login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-full">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Profile Launcher</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary">How It Works</a>
            {/* <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary">Pricing</a> */}
            <a href="https://www.prajwalshelar.online/#contact" className="text-sm font-medium text-gray-600 hover:text-primary">Know The Developer</a>
          </div>
          <div>
            <Button onClick={() => setActiveTab("login")} variant="ghost" className="mr-2">Login</Button>
            <Button onClick={() => setActiveTab("signup")}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto pt-10 pb-16 px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-full">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Profile Launcher</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Launch all your apps with just one click</h2>
              <p className="text-xl text-muted-foreground">
                Create custom profiles with your favorite applications and websites, then launch them all with a single click.
              </p>
              
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 animate-pulse hover:animate-none"
                  onClick={handleGuestLogin}
                >
                  <Play className="mr-2" /> Try It Now
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  No registration required. Get started instantly.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <div className="mt-4">
                <div className="relative w-full mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 mb-3"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 488 512">
                      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="#4285F4"/>
                    </svg>
                  )}
                  {isGoogleLoading ? "Signing in with Google..." : "Sign in with Google"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={handleGuestLogin}
                >
                  <Play className="h-4 w-4" />
                  Continue as Guest
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full max-w-6xl mx-auto py-16 border-t border-gray-200 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Profile Launcher?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Boost Productivity</h3>
            <p className="text-muted-foreground">Save precious time by launching all your essential applications and websites simultaneously with a single click.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customizable Profiles</h3>
            <p className="text-muted-foreground">Create different profiles for various activities like work, research, entertainment, or development, each with its own set of applications.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
            <p className="text-muted-foreground">Works on Windows, macOS, and Linux with platform-specific launcher scripts that you can export and use anywhere.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="w-full max-w-6xl mx-auto py-16 border-t border-gray-200 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
            <h3 className="font-semibold mb-2">Create a Profile</h3>
            <p className="text-sm text-muted-foreground">Name your profile and give it a description</p>
          </div>
          
          <div className="text-center">
            <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
            <h3 className="font-semibold mb-2">Add Applications</h3>
            <p className="text-sm text-muted-foreground">Select applications and websites to include</p>
          </div>
          
          <div className="text-center">
            <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
            <h3 className="font-semibold mb-2">Configure Settings</h3>
            <p className="text-sm text-muted-foreground">Set launch order and delay times</p>
          </div>
          
          <div className="text-center">
            <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">4</div>
            <h3 className="font-semibold mb-2">Launch with One Click</h3>
            <p className="text-sm text-muted-foreground">Use the launch button to open everything</p>
          </div>
        </div>
      </div>

     

      {/* CTA Section */}
      <div className="w-full max-w-6xl mx-auto py-16 border-t border-gray-200 px-4">
        <div className="bg-primary/10 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your workflow?</h2>
          <p className="text-xl mb-8">Get started with Profile Launcher today — no credit card required.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGuestLogin} className="px-8">
              <Play className="mr-2" /> Try It Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveTab("signup")} className="px-8">
              Create Free Account
            </Button>
          </div>
        
        </div>
      </div>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          
          
          <div className="border-t border-gray-800 pt-8 text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-gray-400 mb-4 sm:mb-0">© 2025 Prajwal Shelar. All rights reserved.</p>
           
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
