import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
}

const appointmentSchema = z.object({
  serviceId: z.coerce.number({
    required_error: "Please select a service",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const Services = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceId: 0,
      date: undefined,
      time: "",
    },
  });

  const openBookingDialog = (service: Service) => {
    setSelectedService(service);
    form.setValue("serviceId", service.id);
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      return;
    }

    try {
      // Combine date and time
      const dateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      dateTime.setHours(hours, minutes);

      const appointmentData = {
        serviceId: data.serviceId,
        date: dateTime.toISOString(),
      };

      await apiRequest('POST', '/api/appointments', appointmentData);
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment has been booked successfully for ${format(dateTime, 'PPP')} at ${data.time}`,
      });
      
      // Close dialog by clearing selected service
      setSelectedService(null);
      form.reset();
      
      // Invalidate appointments cache
      queryClient.invalidateQueries({ queryKey: ['/api/user/appointments'] });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Generate a hero image with salon interior
  const heroImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-white text-lg md:text-xl">Experience the ultimate in beauty treatments with our professional salon services.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-neutral-light rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <Skeleton className="w-full h-64" />
                <CardContent className="p-6">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-white text-lg md:text-xl">Experience the ultimate in beauty treatments with our professional salon services.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500 text-lg">Failed to load services. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Our Services - Beauty Villa</title>
        <meta name="description" content="Explore our premium salon services including hair styling, facials, nail care, makeup, and more. Book your appointment today." />
      </Helmet>

      <div className="min-h-screen bg-neutral-light">
        <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-white text-lg md:text-xl">Experience the ultimate in beauty treatments with our professional salon services.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Card key={service.id} className="bg-neutral-light rounded-lg overflow-hidden shadow-md hover:shadow-lg transition" id={`service-${service.id}`}>
                <img className="w-full h-64 object-cover" src={service.image} alt={service.name} />
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-neutral-medium mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent font-semibold">${service.price.toFixed(2)}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-secondary hover:bg-secondary-dark text-white"
                          onClick={() => openBookingDialog(service)}
                          id={`book-${service.id}`}
                        >
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Book Appointment</DialogTitle>
                        </DialogHeader>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold">{selectedService?.name}</h4>
                              <p className="text-sm text-muted-foreground">Duration: {selectedService?.duration} minutes</p>
                              <p className="text-sm text-muted-foreground">Price: ${selectedService?.price.toFixed(2)}</p>
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Appointment Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => 
                                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                          date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="time"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Appointment Time</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a time" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {timeSlots.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button 
                                type="submit" 
                                className="bg-accent hover:bg-accent-dark"
                              >
                                Book Appointment
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
