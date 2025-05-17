import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  User, 
  LogOut,
  BellIcon,
  ShoppingCartIcon,
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

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return "U";
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
      href: "/user/dashboard",
      isActive: location === "/user/dashboard"
    },
    {
      icon: <Calendar className="w-5" />,
      label: "My Appointments",
      href: "/user/bookings",
      isActive: location === "/user/bookings"
    },
    {
      icon: <ShoppingBag className="w-5" />,
      label: "My Orders",
      href: "/user/orders",
      isActive: location === "/user/orders"
    },
    {
      icon: <MessageCircle className="w-5" />,
      label: "Chat with Us",
      href: "/user/chat",
      isActive: location === "/user/chat",
      badge: 2
    },
    {
      icon: <Heart className="w-5" />,
      label: "Favorites",
      href: "/user/favorites",
      isActive: location === "/user/favorites"
    },
    {
      icon: <User className="w-5" />,
      label: "Profile Settings",
      href: "/user/profile",
      isActive: location === "/user/profile"
    }
  ];

  return (
    <SocketProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-accent font-display font-bold text-2xl">Beauty Villa</span>
              <span className="ml-2 text-sm px-2 py-1 bg-secondary text-white rounded">User Portal</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-neutral-medium hover:text-accent transition">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
                </button>
              </div>
              
              <div className="relative">
                <button className="text-neutral-medium hover:text-accent transition">
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">2</span>
                </button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-neutral-medium hover:text-accent transition">
                  <Avatar className="h-8 w-8 bg-primary text-accent">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/orders">Orders</Link>
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
          <aside className="w-64 bg-white shadow-md hidden md:block">
            <nav className="py-6">
              <ul>
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>
                      <a className={`flex items-center py-3 px-6 ${
                        item.isActive 
                          ? "text-accent border-l-4 border-accent" 
                          : "text-neutral-medium hover:text-accent hover:bg-gray-50 transition"
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
                <li className="border-t mt-6 pt-4">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center py-3 px-6 w-full text-error hover:bg-red-50 transition"
                  >
                    <LogOut className="w-5" />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-grow bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
};

export default UserLayout;
