import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./lib/auth.tsx";
import { useEffect } from "react";

// Layouts
import PublicLayout from "@/components/layouts/PublicLayout";
import UserLayout from "@/components/layouts/UserLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Public Pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Products from "@/pages/Products";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";

// User Pages
import UserDashboard from "@/pages/user/Dashboard";
import UserBookings from "@/pages/user/Bookings";
import UserOrders from "@/pages/user/Orders";
import UserChat from "@/pages/user/Chat";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminServices from "@/pages/admin/Services";
import AdminProducts from "@/pages/admin/Products";
import AdminAppointments from "@/pages/admin/Appointments";
import AdminChat from "@/pages/admin/Chat";

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: string;
}) => {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/login');
    } else if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      if (user?.role === 'admin') {
        setLocation('/admin/dashboard');
      } else {
        setLocation('/user/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, requiredRole, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        {/* Public Routes */}
        <Route path="/">
          <PublicLayout>
            <Home />
          </PublicLayout>
        </Route>
        <Route path="/services">
          <PublicLayout>
            <Services />
          </PublicLayout>
        </Route>
        <Route path="/products">
          <PublicLayout>
            <Products />
          </PublicLayout>
        </Route>
        <Route path="/contact">
          <PublicLayout>
            <Contact />
          </PublicLayout>
        </Route>
        <Route path="/login">
          <PublicLayout>
            <Login />
          </PublicLayout>
        </Route>
        <Route path="/register">
          <PublicLayout>
            <Register />
          </PublicLayout>
        </Route>

        {/* User Routes */}
        <Route path="/user/dashboard">
          <ProtectedRoute requiredRole="user">
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/user/bookings">
          <ProtectedRoute requiredRole="user">
            <UserLayout>
              <UserBookings />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/user/orders">
          <ProtectedRoute requiredRole="user">
            <UserLayout>
              <UserOrders />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/user/chat">
          <ProtectedRoute requiredRole="user">
            <UserLayout>
              <UserChat />
            </UserLayout>
          </ProtectedRoute>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard">
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/services">
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/products">
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/appointments">
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminAppointments />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/chat">
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminChat />
            </AdminLayout>
          </ProtectedRoute>
        </Route>

        {/* Fallback to 404 */}
        <Route>
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        </Route>
      </Switch>
    </TooltipProvider>
  );
}

export default App;
