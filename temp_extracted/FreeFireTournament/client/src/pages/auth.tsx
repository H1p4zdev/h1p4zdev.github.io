
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const registerSchema = loginSchema.extend({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [_, setLocation] = useLocation();
  const { signIn, signUp, signInWithGoogle, signInWithFacebook, signInWithTwitter } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      setLocation("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password);
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials.",
      });
      setMode("login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "twitter") => {
    try {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "facebook":
          await signInWithFacebook();
          break;
        case "twitter":
          await signInWithTwitter();
          break;
      }
      setLocation("/dashboard");
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-dark">
      <div className="w-full max-w-md text-center mb-8">
        <div className="w-64 h-32 mx-auto mb-4 flex items-center justify-center">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <rect x="10" y="10" width="80" height="30" rx="5" fill="none" stroke="#FF5500" strokeWidth="2" />
            <path d="M20 25 L30 15 L40 25 L50 15 L60 25 L70 15 L80 25" stroke="#FF5500" strokeWidth="2" fill="none" />
            <circle cx="50" cy="25" r="10" fill="#FF5500" opacity="0.5" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-primary font-rajdhani">FIRE TOURNAMENT</h1>
        <p className="text-text-secondary mt-2">Level up your game. Join tournaments now.</p>
      </div>

      <div className="w-full max-w-md">
        <Card className="bg-dark-surface border-dark-lighter">
          <CardContent className="pt-6">
            <div className="flex space-x-2 mb-6">
              <button 
                onClick={() => setMode("login")}
                className={`w-1/2 py-2 text-center font-rajdhani font-bold border-b-2 ${mode === "login" ? "text-white border-primary" : "text-text-secondary border-dark-lighter"}`}
              >
                LOGIN
              </button>
              <button 
                onClick={() => setMode("register")}
                className={`w-1/2 py-2 text-center font-rajdhani font-bold border-b-2 ${mode === "register" ? "text-white border-primary" : "text-text-secondary border-dark-lighter"}`}
              >
                REGISTER
              </button>
            </div>

            <div className={mode === "login" ? "block" : "hidden"}>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-dark-lighter border-dark-lighter focus:border-primary text-white"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
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
                        <FormLabel className="text-text-secondary">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-dark-lighter border-dark-lighter focus:border-primary text-white"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="flex justify-end mt-2">
                          <a href="#" className="text-secondary text-sm hover:underline">Forgot Password?</a>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gaming-btn bg-primary hover:bg-primary/90 text-white font-rajdhani">
                    <i className="ri-login-box-line mr-2"></i> LOGIN
                  </Button>
                </form>
              </Form>
            </div>

            <div className={mode === "register" ? "block" : "hidden"}>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="gamertag"
                            className="bg-dark-lighter border-dark-lighter focus:border-primary text-white hover:border-primary"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-dark-lighter border-dark-lighter focus:border-primary text-white hover:border-primary"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-dark-lighter border-dark-lighter focus:border-primary text-white"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-secondary">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-dark-lighter border-dark-lighter focus:border-primary text-white"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gaming-btn bg-primary hover:bg-primary/90 text-white font-rajdhani">
                    <i className="ri-user-add-line mr-2"></i> REGISTER
                  </Button>
                </form>
              </Form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">Or continue with</p>
              <div className="flex justify-center space-x-4 mt-4">
                <Button 
                  onClick={() => handleSocialLogin("google")}
                  variant="outline" 
                  size="icon" 
                  className="w-12 h-12 rounded-full gaming-btn bg-dark-lighter hover:bg-dark-lighter/80 border-dark-lighter"
                >
                  <i className="ri-google-fill text-white text-xl"></i>
                </Button>
                <Button 
                  onClick={() => handleSocialLogin("facebook")}
                  variant="outline" 
                  size="icon" 
                  className="w-12 h-12 rounded-full gaming-btn bg-dark-lighter hover:bg-dark-lighter/80 border-dark-lighter"
                >
                  <i className="ri-facebook-fill text-white text-xl"></i>
                </Button>
                <Button 
                  onClick={() => handleSocialLogin("twitter")}
                  variant="outline" 
                  size="icon" 
                  className="w-12 h-12 rounded-full gaming-btn bg-dark-lighter hover:bg-dark-lighter/80 border-dark-lighter"
                >
                  <i className="ri-twitter-fill text-white text-xl"></i>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
