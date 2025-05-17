import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const timer = setTimeout(() => {
        if (user?.role === "admin") {
          setLocation("/admin/dashboard");
        } else {
          setLocation("/user/dashboard");
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, loading, setLocation]);

  // Don't redirect on login and register pages even if authenticated
  const [location] = useLocation();
  const isAuthPage = location === "/login" || location === "/register";

  if (!loading && isAuthenticated && !isAuthPage) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
