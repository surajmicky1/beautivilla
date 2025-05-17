import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Order type with optional items
interface Order {
  id: number;
  userId: number;
  status: "pending" | "paid" | "delivered" | "cancelled";
  total: number;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

const UserOrders = () => {
  // Fetch user orders
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/user/orders'],
  });

  // Calculate order statistics
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => order.status === 'delivered').length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending' || order.status === 'paid').length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

  return (
    <>
      <Helmet>
        <title>My Orders - Beauty Villa</title>
        <meta name="description" content="View your Beauty Villa order history. Track your purchases, check order status, and reorder your favorite products." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">My Orders</h1>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-9 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="text-neutral-medium text-sm mb-1">Total Orders</p>
                  <p className="text-2xl font-semibold">{totalOrders}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="text-neutral-medium text-sm mb-1">Completed</p>
                  <p className="text-2xl font-semibold">{completedOrders}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="text-neutral-medium text-sm mb-1">Pending/Processing</p>
                  <p className="text-2xl font-semibold">{pendingOrders}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="text-neutral-medium text-sm mb-1">Total Spent</p>
                  <p className="text-2xl font-semibold">${totalSpent.toFixed(2)}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {/* Orders Table */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="border-b">
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <OrdersTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserOrders;
