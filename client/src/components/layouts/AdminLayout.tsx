import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Bath, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  BarChart, 
  Settings, 
  LogOut,
  Bell,
  MessageCircle,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SocketProvider } from "@/lib/socket";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return "A";
    return user.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5" />,
      label: "Dashboard",
      href: "/admin/dashboard",
      isActive: location === "/admin/dashboard"
    },
    {
      icon: <CalendarCheck className="w-5" />,
      label: "Appointments",
      href: "/admin/appointments",
      isActive: location === "/admin/appointments",
      badge: 12
    },
    {
      icon: <Users className="w-5" />,
      label: "Customers",
      href: "/admin/customers",
      isActive: location === "/admin/customers"
    },
    {
      icon: <Bath className="w-5" />,
      label: "Services",
      href: "/admin/services",
      isActive: location === "/admin/services"
    },
    {
      icon: <Package className="w-5" />,
      label: "Products",
      href: "/admin/products",
      isActive: location === "/admin/products"
    },
    {
      icon: <ShoppingCart className="w-5" />,
      label: "Orders",
      href: "/admin/orders",
      isActive: location === "/admin/orders",
      badge: 8
    },
    {
      icon: <MessageSquare className="w-5" />,
      label: "Live Chat",
      href: "/admin/chat",
      isActive: location === "/admin/chat",
      badge: 3
    },
    {
      icon: <BarChart className="w-5" />,
      label: "Reports",
      href: "/admin/reports",
      isActive: location === "/admin/reports"
    },
    {
      icon: <Settings className="w-5" />,
      label: "Settings",
      href: "/admin/settings",
      isActive: location === "/admin/settings"
    }
  ];

  return (
    <SocketProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-neutral-dark text-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary font-display font-bold text-2xl">Beauty Villa</span>
              <span className="ml-2 text-xs px-2 py-1 bg-accent text-white rounded">Admin Portal</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-gray-300 hover:text-white transition">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">5</span>
                </button>
              </div>
              
              <div className="relative">
                <button className="text-gray-300 hover:text-white transition">
                  <MessageCircle className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
                </button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
                  <Avatar className="h-8 w-8 bg-accent text-white">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex flex-grow">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-neutral-dark text-white shadow-md hidden md:block">
            <nav className="py-6">
              <ul>
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>
                      <a className={`flex items-center py-3 px-6 ${
                        item.isActive 
                          ? "bg-neutral-medium bg-opacity-20 border-l-4 border-accent" 
                          : "text-gray-300 hover:bg-neutral-medium hover:bg-opacity-20 transition"
                      }`}>
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-accent text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
                        )}
                      </a>
                    </Link>
                  </li>
                ))}
                <li className="border-t border-gray-700 mt-6 pt-4">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center py-3 px-6 w-full text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition"
                  >
                    <LogOut className="w-5" />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-grow bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
};

export default AdminLayout;
