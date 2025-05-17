import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

interface Appointment {
  id: number;
  userId: number;
  serviceId: number;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  service?: {
    name: string;
    duration: number;
  };
  stylist?: string;
}

interface ServiceData {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
}

interface AppointmentsTableProps {
  isAdmin?: boolean;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ isAdmin = false }) => {
  const { toast } = useToast();
  
  // Fetch appointments
  const appointmentsQuery = useQuery<Appointment[]>({
    queryKey: [isAdmin ? '/api/appointments' : '/api/user/appointments'],
  });

  // Fetch services for mapping service names
  const servicesQuery = useQuery<ServiceData[]>({
    queryKey: ['/api/services'],
  });

  const appointments = appointmentsQuery.data || [];
  const services = servicesQuery.data || [];

  // Get service name by ID
  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  // Cancel appointment
  const cancelAppointment = async (id: number) => {
    try {
      const endpoint = isAdmin 
        ? `/api/appointments/${id}/status` 
        : `/api/user/appointments/${id}/cancel`;
      
      const body = isAdmin ? { status: 'cancelled' } : {};
      const method = isAdmin ? 'PATCH' : 'PATCH';
      
      await apiRequest(method, endpoint, body);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [isAdmin ? '/api/appointments' : '/api/user/appointments'] });
      
      toast({
        title: "Appointment cancelled",
        description: "The appointment has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format appointment date
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy - h:mm a");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Loading state
  if (appointmentsQuery.isLoading || servicesQuery.isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              {isAdmin && <TableHead>Customer</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                {isAdmin && <TableCell><Skeleton className="h-5 w-40" /></TableCell>}
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Error state
  if (appointmentsQuery.error || servicesQuery.error) {
    return <div className="text-red-500">Failed to load appointments. Please try again later.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            {isAdmin && <TableHead>Customer</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-6 text-neutral-medium">
                No appointments found.
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{getServiceName(appointment.serviceId)}</TableCell>
                <TableCell>{formatAppointmentDate(appointment.date)}</TableCell>
                {isAdmin && (
                  <TableCell>
                    {/* In a real implementation, we'd use actual user data */}
                    Jane Doe
                  </TableCell>
                )}
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-800"
                      disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => cancelAppointment(appointment.id)}
                      disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable;
