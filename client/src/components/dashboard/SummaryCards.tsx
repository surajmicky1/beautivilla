import { 
  Calendar, 
  ShoppingCart, 
  Gift, 
  CalendarCheck, 
  DollarSign, 
  Users 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UserSummaryProps {
  appointmentCount?: number;
  orderCount?: number;
  loyaltyPoints?: number;
  isLoading?: boolean;
}

interface AdminSummaryProps {
  appointmentCount?: number;
  orderCount?: number;
  revenue?: number;
  customerCount?: number;
  isLoading?: boolean;
}

export const UserSummaryCards: React.FC<UserSummaryProps> = ({ 
  appointmentCount = 0, 
  orderCount = 0, 
  loyaltyPoints = 0,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="bg-white rounded-lg shadow p-6">
            <div className="h-24 flex items-center justify-center bg-gray-100 animate-pulse rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center text-accent">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">Upcoming Appointment</h3>
              {appointmentCount > 0 ? (
                <>
                  <p className="text-lg font-semibold">Hair Styling</p>
                  <p className="text-sm text-neutral-medium">Tomorrow, 2:00 PM</p>
                </>
              ) : (
                <p className="text-lg font-semibold">No appointments</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-secondary bg-opacity-20 flex items-center justify-center text-secondary">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">Recent Order</h3>
              {orderCount > 0 ? (
                <>
                  <p className="text-lg font-semibold">{orderCount} Products</p>
                  <p className="text-sm text-neutral-medium">Delivered on June 15</p>
                </>
              ) : (
                <p className="text-lg font-semibold">No orders</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-accent bg-opacity-20 flex items-center justify-center text-accent">
              <Gift className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">Loyalty Points</h3>
              <p className="text-lg font-semibold">{loyaltyPoints} Points</p>
              <p className="text-sm text-neutral-medium">
                {loyaltyPoints > 200 ? 'Silver Membership' : 'Bronze Membership'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminSummaryCards: React.FC<AdminSummaryProps> = ({ 
  appointmentCount = 0, 
  orderCount = 0, 
  revenue = 0,
  customerCount = 0,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-white rounded-lg shadow p-6">
            <div className="h-24 flex items-center justify-center bg-gray-100 animate-pulse rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center text-accent">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">Today's Appointments</h3>
              <p className="text-2xl font-semibold">{appointmentCount}</p>
              <p className="text-sm text-green-600">
                <span className="inline-block mr-1">↑</span> 8% from yesterday
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">New Orders</h3>
              <p className="text-2xl font-semibold">{orderCount}</p>
              <p className="text-sm text-green-600">
                <span className="inline-block mr-1">↑</span> 12% from yesterday
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">Today's Revenue</h3>
              <p className="text-2xl font-semibold">${revenue.toFixed(2)}</p>
              <p className="text-sm text-green-600">
                <span className="inline-block mr-1">↑</span> 18% from yesterday
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-neutral-medium text-sm font-medium">New Customers</h3>
              <p className="text-2xl font-semibold">{customerCount}</p>
              <p className="text-sm text-green-600">
                <span className="inline-block mr-1">↑</span> 3% from yesterday
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
