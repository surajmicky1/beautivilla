import { Helmet } from "react-helmet";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "wouter";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - Beauty Villa</title>
        <meta name="description" content="Login to your Beauty Villa account to manage your appointments, orders, and access personalized features." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-display font-bold text-accent">Beauty Villa</h1>
            </Link>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
