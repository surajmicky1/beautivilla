import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { AdminSummaryCards } from "@/components/dashboard/SummaryCards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import OrdersTable from "@/components/dashboard/OrdersTable";
import ChatInterface from "@/components/chat/ChatInterface";
import UsersList from "@/components/admin/UsersList";

const AdminDashboard = () => {
  // Fetch appointments
  const appointmentsQuery = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Fetch orders
  const ordersQuery = useQuery({
    queryKey: ['/api/orders'],
  });

  // Count appointments and orders
  const appointmentCount = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data.length : 0;
  const orderCount = Array.isArray(ordersQuery.data) ? ordersQuery.data.length : 0;

  // Simulate revenue based on orders
  const revenue = ordersQuery.data?.reduce((total, order) => total + order.total, 0) || 0;

  // Simulate customer count
  const customerCount = 5; // For demo

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Beauty Villa</title>
        <meta name="description" content="Beauty Villa admin dashboard. Manage appointments, products, services, and customer interactions." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Admin Dashboard</h1>
        
        <AdminSummaryCards 
          appointmentCount={appointmentCount}
          orderCount={orderCount}
          revenue={revenue}
          customerCount={customerCount}
          isLoading={appointmentsQuery.isLoading || ordersQuery.isLoading}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-lg shadow h-full">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Today's Appointments</CardTitle>
                  <select className="border rounded p-1 text-sm">
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>This Week</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <AppointmentsTable isAdmin={true} />
              </CardContent>
            </Card>
          </div>
          
          {/* Live Chat */}
          <div>
            <Card className="bg-white rounded-lg shadow">
              <CardHeader className="border-b">
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Active customer conversations</CardDescription>
              </CardHeader>
              <CardContent className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <span>JD</span>
                    </div>
                    <div className="ml-2">
                      <p className="font-medium">Jane Doe</p>
                      <div className="flex items-center">
                        <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <button className="text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                      <span>RJ</span>
                    </div>
                    <div className="ml-2">
                      <p className="font-medium">Robert Johnson</p>
                      <div className="flex items-center">
                        <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <button className="text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent Orders */}
        <Card className="bg-white rounded-lg shadow mb-8">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              <select className="border rounded p-1 text-sm">
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <OrdersTable isAdmin={true} />
          </CardContent>
        </Card>
        
        {/* Recent Users */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="border-b">
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <UsersList />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
