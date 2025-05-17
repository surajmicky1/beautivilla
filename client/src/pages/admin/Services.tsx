import { Helmet } from "react-helmet";
import ServiceManager from "@/components/admin/ServiceManager";

const AdminServices = () => {
  return (
    <>
      <Helmet>
        <title>Manage Services - Beauty Villa Admin</title>
        <meta name="description" content="Manage Beauty Villa salon services. Add, edit, or remove services from your service catalog." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Services Management</h1>
        
        <ServiceManager />
      </div>
    </>
  );
};

export default AdminServices;
