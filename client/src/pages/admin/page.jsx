import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiCalls from "../../core/APICalls";

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setLoggedIn(token);
    }
  }, []);

  return (
    <div className='bg-blue-700 h-screen w-screen flex justify-center items-center'>
      <div className='bg-white p-3 rounded-lg'>
        <h1 className='text-3xl text-blue-600 p-3 font-bold'>Admin</h1>
        {!loggedIn ? (
          <div className='bg-blue-400 p-3 rounded-lg'>
            <Link to='/admin/auth'>Login</Link>
          </div>
        ) : (
          <div>
            <button onClick={apiCalls.emptyDoctorQueue}>
              Empty Queue Doctor
            </button>
            <br />
            <button onClick={apiCalls.emptyPatientQueue}>
              Empty Queue Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
