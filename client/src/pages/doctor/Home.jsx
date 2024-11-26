import React from "react";

function Home() {
  console.log(process.env.REACT_APP_SERVER_URL);

  return (
    <div>
      <a href="/auth/doctor">Doctor Login</a>
      <br />
      <a href="/auth/patient">Patient Login</a>
    </div>
  );
}

export default Home;
