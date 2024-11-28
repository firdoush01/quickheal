// LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCalls from "../../../core/APICalls";

const LoginComponent = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the error state
    setError("");

    try {
      const response = await apiCalls.loginAdmin(email, password);
      if (response.status === 200) {
        console.log(response);
        window.localStorage.setItem("token", response.data.token);

        navigate("/admin");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className='bg-blue-700 h-screen w-screen flex justify-center items-center'>
      <div className='bg-white p-5 shadow-lg rounded-lg'>
        <h2 className='text-2xl font-bold text-blue-600'>Admin Login</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 py-5'>
          <div className='flex gap-2 justify-between'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-blue-400'
            />
          </div>
          <div className='flex gap-2 justify-between'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='bg-blue-400'
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button
            type='submit'
            className='bg-blue-300 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200'>
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <span
            onClick={() => setIsLogin(false)}
            className='text-blue-600 cursor-pointer'>
            Register here
          </span>
        </p>
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

    // Reset the error state
    setError("");

    // Validate that the passwords match
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
    <div className='bg-blue-700 h-screen w-screen flex justify-center items-center'>
      <div className='bg-white p-5 shadow-lg rounded-lg'>
        <h2 className='text-2xl font-bold text-blue-600'>Admin Registration</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 py-5'>
          <div className='flex gap-2 justify-between'>
            <label>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='bg-blue-300'
            />
          </div>

          <div className='flex gap-2 justify-between'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-blue-300'
            />
          </div>
          <div className='flex gap-2 justify-between'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='bg-blue-300'
            />
          </div>
          <div className='flex gap-2 justify-between'>
            <label>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='bg-blue-300'
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button
            type='submit'
            className='bg-blue-300 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200'>
            Register
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span
            onClick={() => setIsLogin(true)}
            className='text-blue-600 cursor-pointer'>
            Login here
          </span>
        </p>
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
