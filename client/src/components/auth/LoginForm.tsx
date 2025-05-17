import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log("Login form submitted with:", data);
      setIsPending(true);
      await login(data.email, data.password);
      // Login successful, auth context will handle redirect
    } catch (error: any) {
      console.error("Login error:", error);
      // Show form error
      form.setError("root", { 
        type: "manual", 
        message: error.message || "Login failed. Please check your credentials." 
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold">Welcome Back</h2>
          <p className="text-neutral-medium mt-1">Login to your Beauty Villa account</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
                      disabled={isPending}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      disabled={isPending}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end mt-2">
              <Link href="#" className="text-sm text-accent hover:text-accent-dark">
                Forgot Password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent-dark text-white py-2 rounded-md font-medium transition duration-300"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-medium">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent hover:text-accent-dark">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
