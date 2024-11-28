// LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctor from "../../../assests/doctor.png";
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
      const response = await apiCalls.loginDoctor(email, password);
      if (response.status === 200) {
        // Redirect to the doctor's dashboard or home page upon successful login
        console.log(response);
        window.localStorage.setItem("data", JSON.stringify(response.data.data));

        navigate("/dashboard/doctor");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className='bg-blue-700 h-screen w-screen flex flex-col justify-center items-center'>
      <div className='bg-white flex shadow-xl flex-col md:flex-row gap-10 p-5 rounded-lg justify-center items-center'>
        <div>
          <img src={doctor} alt='' className='h-52 md:h-72' />
        </div>
        <div>
          <h2 className='text-blue-500 text-3xl font-bold p-3 mb-5'>
            Welcome Doctor
          </h2>
          <form onSubmit={handleSubmit} className='bg-blue-500 p-3 rounded-lg'>
            <div className='flex w-[70%] md:flex-row gap-5 text-white text-lg md:text-xl p-2 justify-start items-center'>
              <label className='md:mr-9'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-blue-300'
              />
            </div>
            <div className='flex md:flex-row gap-5 text-white text-xl p-2 items-center justify-start'>
              <label>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='bg-blue-300 w-48 md:w-[100%]'
              />
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button
              type='submit'
              className='text-blue-700 bg-white font-bold hover:bg-blue-400 transition-all duration-200 p-3 rounded-lg w-full mx-auto mt-5'>
              Login
            </button>
          </form>
          <p className='text-blue-500 mt-5'>
            Don't have an account?{" "}
            <span
              onClick={() => setIsLogin(false)}
              className='text-blue-900 cursor-pointer'>
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
  const [specialization, setSpecialization] = useState("");
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
    <div className='bg-blue-700 w-screen h-screen flex justify-center items-center'>
      <div className='bg-white flex shadow-xl flex-col md:flex-row gap-10 p-3 rounded-lg justify-center items-center'>
        <div>
          <img src={doctor} alt='' className='h-52 md:h-72' />
        </div>
        <div>
          <h2 className='text-blue-500 text-3xl font-bold p-3 mb-5'>
            Welcome Doctor
          </h2>
          <form
            onSubmit={handleSubmit}
            className='bg-blue-500 flex flex-col gap-7 p-3 rounded-lg'>
            <div className='flex justify-between'>
              <label className='text-white font-bold'>Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='bg-blue-300'
              />
            </div>
            <div className='flex justify-between'>
              <label className='text-white font-bold'>Specialization</label>
              <input
                type='text'
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                className='bg-blue-300'
              />
            </div>
            <div className='flex justify-between'>
              <label className='text-white font-bold'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-blue-300'
              />
            </div>
            <div className='flex justify-between'>
              <label className='text-white font-bold'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='bg-blue-300'
              />
            </div>
            <div className='flex justify-between'>
              <label className='text-white font-bold'>Confirm Password</label>
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
              className='text-blue-700 bg-white font-bold hover:bg-blue-400 transition-all duration-200 p-3 rounded-lg'>
              Register
            </button>
          </form>
          <p className='mt-5'>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const DoctorAuth = () => {
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

export default DoctorAuth;
