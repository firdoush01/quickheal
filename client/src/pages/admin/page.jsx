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
    <div>
      <h1>admin</h1>
      {!loggedIn ? (
        <div className='bg-blue p-3'>
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
  );
}

export default AdminPage;
