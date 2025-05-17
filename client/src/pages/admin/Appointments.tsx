import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarCell, CalendarGrid, CalendarHeader, CalendarHeadRow, CalendarNav, CalendarRoot } from "@/components/ui/calendar";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Appointment {
  id: number;
  userId: number;
  serviceId: number;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

const AdminAppointments = () => {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch all appointments
  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments'],
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PATCH', `/api/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setSelectedAppointment(null);
      toast({
        title: "Status Updated",
        description: `The appointment status has been updated to ${selectedStatus}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update appointment status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedStatus(appointment.status);
  };

  const handleUpdateStatus = () => {
    if (selectedAppointment && selectedStatus) {
      updateStatusMutation.mutate({
        id: selectedAppointment.id,
        status: selectedStatus,
      });
    }
  };

  // Group appointments by date for the calendar view
  const appointmentsByDate = appointments?.reduce((acc, appointment) => {
    const date = format(new Date(appointment.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>) || {};

  // Count appointments for statistics
  const pendingCount = appointments?.filter(a => a.status === 'pending').length || 0;
  const confirmedCount = appointments?.filter(a => a.status === 'confirmed').length || 0;
  const completedCount = appointments?.filter(a => a.status === 'completed').length || 0;
  const cancelledCount = appointments?.filter(a => a.status === 'cancelled').length || 0;

  return (
    <>
      <Helmet>
        <title>Manage Appointments - Beauty Villa Admin</title>
        <meta name="description" content="Manage Beauty Villa salon appointments. View, confirm, reschedule, or cancel customer appointments." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Appointments Management</h1>
        
        {/* Appointment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-neutral-medium text-sm mb-1">Pending</p>
              <p className="text-2xl font-semibold">{pendingCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-neutral-medium text-sm mb-1">Confirmed</p>
              <p className="text-2xl font-semibold">{confirmedCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-neutral-medium text-sm mb-1">Completed</p>
              <p className="text-2xl font-semibold">{completedCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-neutral-medium text-sm mb-1">Cancelled</p>
              <p className="text-2xl font-semibold">{cancelledCount}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Appointment Views */}
        <Tabs defaultValue="list">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card className="bg-white rounded-lg shadow">
              <CardHeader className="border-b">
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AppointmentsTable isAdmin={true} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card className="bg-white rounded-lg shadow">
              <CardHeader className="border-b">
                <CardTitle>Appointment Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <Calendar 
                    mode="single" 
                    className="rounded-md border shadow p-4" 
                    modifiers={{
                      booked: (date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        return !!appointmentsByDate[dateStr] && appointmentsByDate[dateStr].length > 0;
                      }
                    }}
                    modifiersClassNames={{
                      booked: "bg-primary text-primary-foreground font-bold"
                    }}
                    onDayClick={(day) => {
                      // You could show appointments for this day
                      console.log(format(day, 'yyyy-MM-dd'), appointmentsByDate[format(day, 'yyyy-MM-dd')]);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Update Status Dialog */}
        <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Appointment Status</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <p>{selectedAppointment ? format(new Date(selectedAppointment.date), 'PPP p') : ''}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge 
                  variant={
                    selectedAppointment?.status === 'confirmed' ? 'default' : 
                    selectedAppointment?.status === 'pending' ? 'secondary' : 
                    selectedAppointment?.status === 'completed' ? 'outline' : 
                    'destructive'
                  }
                >
                  {selectedAppointment?.status?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedAppointment(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateStatus}
                className="bg-accent hover:bg-accent-dark"
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminAppointments;
