import { Helmet } from "react-helmet";
import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "wouter";

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - Beauty Villa</title>
        <meta name="description" content="Create a Beauty Villa account to book salon appointments, shop beauty products, and access exclusive offers." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-display font-bold text-accent">Beauty Villa</h1>
            </Link>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default Register;
