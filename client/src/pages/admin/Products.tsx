import { Helmet } from "react-helmet";
import ProductManager from "@/components/admin/ProductManager";

const AdminProducts = () => {
  return (
    <>
      <Helmet>
        <title>Manage Products - Beauty Villa Admin</title>
        <meta name="description" content="Manage Beauty Villa product catalog. Add, edit, or remove products from your online store." />
      </Helmet>

      <div>
        <h1 className="text-2xl font-display font-bold mb-6">Products Management</h1>
        
        <ProductManager />
      </div>
    </>
  );
};

export default AdminProducts;
