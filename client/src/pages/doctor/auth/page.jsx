import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCalls from "../../../core/APICalls";
import doctorImage from "../../../assets/doctor.png";
import "animate.css";

const LoginComponent = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiCalls.loginDoctor(email, password);
      if (response.status === 200) {
        window.localStorage.setItem("data", JSON.stringify(response.data.data));
        navigate("/dashboard/doctor");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-700">
      {/* Doctor Image */}
      <div className="md:w-1/2 hidden md:flex items-center justify-center">
        <img
          src={doctorImage}
          alt="Doctor"
          className="w-3/4 animate__animated animate__fadeInLeft"
        />
      </div>
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate__animated animate__fadeInRight">
        {/* Doctor Image for Mobile */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:hidden">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
          Doctor Registration
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => setIsLogin(false)}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

const RegisterComponent = ({ setIsLogin }) => {
  // Similar to LoginComponent; updated with the same styles
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
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
      const response = await apiCalls.registerDoctor(
        name,
        email,
        password,
        specialization
      );
      if (response.status === 201) {
        setIsLogin(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-700">
      {/* Doctor Image */}
      <div className="md:w-1/2 hidden md:flex items-center justify-center">
        <img
          src={doctorImage}
          alt="Doctor"
          className="w-3/4 animate__animated animate__fadeInLeft"
        />
      </div>
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate__animated animate__fadeInRight">
        {/* Doctor Image for Mobile */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:hidden">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
          Doctor Registration
        </h2>
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => setIsLogin(true)}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

const DoctorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginComponent setIsLogin={setIsLogin} />
  ) : (
    <RegisterComponent setIsLogin={setIsLogin} />
  );
};

export default DoctorAuth;
