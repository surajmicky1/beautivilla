import { Helmet } from "react-helmet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/chat/ChatInterface";

const UserChat = () => {
  return (
    <>
      <Helmet>
        <title>Chat Support - Beauty Villa</title>
        <meta name="description" content="Chat with Beauty Villa's support team. Get real-time assistance with your appointments, orders, or product questions." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Chat with Us</h1>
        
        <Card className="bg-white rounded-lg shadow">
          <CardHeader className="border-b">
            <CardTitle>Beauty Villa Support</CardTitle>
          </CardHeader>
          <ChatInterface />
        </Card>
      </div>
    </>
  );
};

export default UserChat;
