import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCalls from "../../../core/APICalls";
import "animate.css"; // Adding animate.css for animation
import adminAuthImage from "../../../assets/admin.png"; // Image import

const LoginComponent = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiCalls.loginAdmin(email, password);
      if (response.status === 200) {
        window.localStorage.setItem("token", response.data.token);
        navigate("/admin");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-teal-600">
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-5xl p-4 animate__animated animate__fadeIn">
        {/* Image Section */}
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={adminAuthImage}
            alt="Admin Auth"
            className="w-32 h-32 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-full shadow-lg transition-all duration-500 ease-in-out"
          />
        </div>
        {/* Login Form */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">
            Admin Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 transform hover:scale-105"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-teal-600 cursor-pointer hover:underline"
              onClick={() => setIsLogin(false)}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterComponent = ({ setIsLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await apiCalls.registerAdmin(name, email, password);
      if (response.status === 201) {
        setIsLogin(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-teal-600">
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-5xl p-4 animate__animated animate__fadeIn">
        {/* Image Section */}
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={adminAuthImage}
            alt="Admin Auth"
            className="w-32 h-32 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-full shadow-lg transition-all duration-500 ease-in-out"
          />
        </div>
        {/* Registration Form */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">
            Admin Registration
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 transform hover:scale-105"
            >
              Register
            </button>
          </form>
          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <span
              className="text-teal-600 cursor-pointer hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginComponent setIsLogin={setIsLogin} />
      ) : (
        <RegisterComponent setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default AdminAuth;
