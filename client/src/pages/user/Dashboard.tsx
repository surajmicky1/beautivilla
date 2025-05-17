import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { UserSummaryCards } from "@/components/dashboard/SummaryCards";
import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

const UserDashboard = () => {
  const { user } = useAuth();

  // Fetch user appointments
  const appointmentsQuery = useQuery({
    queryKey: ['/api/user/appointments'],
  });

  // Fetch user orders
  const ordersQuery = useQuery({
    queryKey: ['/api/user/orders'],
  });

  // Count appointments and orders
  const appointmentCount = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data.length : 0;
  const orderCount = Array.isArray(ordersQuery.data) ? ordersQuery.data.length : 0;

  // Simulate loyalty points based on orders
  const loyaltyPoints = orderCount * 80; // Just a simple calculation for demo

  return (
    <>
      <Helmet>
        <title>My Dashboard - Beauty Villa</title>
        <meta name="description" content="Manage your Beauty Villa appointments, orders, and account information from your personal dashboard." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Welcome Back, {user?.name || 'Guest'}!</h1>
        
        <UserSummaryCards 
          appointmentCount={appointmentCount}
          orderCount={orderCount}
          loyaltyPoints={loyaltyPoints}
          isLoading={appointmentsQuery.isLoading || ordersQuery.isLoading}
        />
        
        {/* Upcoming Appointments */}
        <Card className="bg-white rounded-lg shadow mb-8">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="outline" asChild>
                <Link href="/user/bookings">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AppointmentsTable />
          </CardContent>
        </Card>
        
        {/* Recent Orders */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" asChild>
                <Link href="/user/orders">View Order History</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <OrdersTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserDashboard;
