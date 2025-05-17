import { Helmet } from "react-helmet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/chat/ChatInterface";

const AdminChat = () => {
  return (
    <>
      <Helmet>
        <title>Customer Chat - Beauty Villa Admin</title>
        <meta name="description" content="Manage real-time customer conversations. Respond to inquiries and provide support to Beauty Villa customers." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Live Customer Chat</h1>
        
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="border-b">
            <CardTitle>Customer Conversations</CardTitle>
          </CardHeader>
          <ChatInterface isAdmin={true} />
        </Card>
      </div>
    </>
  );
};

export default AdminChat;
