import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/ContextWrapper";

const Home = () => {
  const { login, isAuthenticated, backendActor, identity } = useAuth();

  return (
    <div className=" h-screen flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className=" text-5xl font-bold mb-4">Welcome to Tracy</div>
      <p className=" text-lg mb-8">Have a look behind your product</p>
      <Link
        to="/consumer"
        className="bg-green-500  px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
      >
        Search Records
      </Link>

      {/* Supplier/Fashion House Section */}
      <div className="mt-12  text-3xl">
        Are you a supplier or a fashion house?
      </div>
      <p className=" text-lg mb-8">
        If you are, login and start uploading some info.
      </p>
      {!isAuthenticated && (
        <button
          onClick={() => login()}
          className="bg-blue-500  px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Home;
