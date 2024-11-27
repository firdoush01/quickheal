// LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      const response = await apiCalls.loginPatient(email, password);
      if (response.status === 200) {
        // Redirect to the doctor's dashboard or home page upon successful login
        console.log(response);
        window.localStorage.setItem("data", JSON.stringify(response.data.data));

        navigate("/dashboard/patient");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div>
      <h2>Patient Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span onClick={() => setIsLogin(false)}>Register here</span>
      </p>
    </div>
  );
};

const RegisterComponent = ({ setIsLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
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
      const response = await apiCalls.registerPatient(
        name,
        email,
        password,
        age
      );
      if (response.status === 201) {
        setIsLogin(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age</label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={() => setIsLogin(true)}>Login here</span>
      </p>
    </div>
  );
};

const PatientAuth = () => {
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

export default PatientAuth;
