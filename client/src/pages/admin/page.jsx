import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiCalls from "../../core/APICalls";
import { motion } from "framer-motion";
import adminDash from "../../assets/admin dash.png";

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setLoggedIn(token);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-teal-600 flex justify-center items-center text-gray-900 px-4 sm:px-8">
      <div className="container p-6 sm:p-8 rounded-lg shadow-lg bg-white text-gray-800 w-full max-w-3xl">
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-teal-700 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Admin Dashboard
        </motion.h1>

        <motion.img
          src={adminDash}
          alt="Admin Dashboard"
          className="w-full sm:w-3/4 lg:w-2/3 h-auto mb-6 sm:mb-8 mx-auto rounded-lg shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* If not logged in, show the login link */}
        {!loggedIn ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl mb-4">
              You are not logged in yet.
            </p>
            <Link
              to="/admin/auth"
              className="inline-block py-2 px-4 text-lg sm:text-xl bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Login
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-xl sm:text-2xl text-gray-700">
                Welcome to the Admin Panel
              </p>
            </div>
            {/* Action buttons */}
            <div className="space-y-4">
              <motion.button
                onClick={apiCalls.emptyDoctorQueue}
                className="w-full py-2 sm:py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Empty Doctor Queue
              </motion.button>
              <motion.button
                onClick={apiCalls.emptyPatientQueue}
                className="w-full py-2 sm:py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:bg-cyan-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Empty Patient Queue
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
