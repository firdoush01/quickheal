import React from "react";
import visit from "../assests/visit.jpeg";
function Home() {
  console.log(process.env.REACT_APP_SERVER_URL);

  return (
    <div className='bg-blue-700 p-3 h-screen w-full flex flex-col justify-center items-center gap-10'>
      <div className='bg-white flex flex-col md:flex-row p-4 justify-center items-center rounded-lg shadow-lg '>
        <div className='flex flex-col justify-center items-center gap-10'>
          <img src={visit} alt='' className='size-80 rounded-lg' />
        </div>
        <div className='flex flex-col justify-center items-center gap-3 p-5 mt-10 md:mt-0 md:ml-32'>
          <h1 className='text-white text-2xl font-extrabold font-mono text-slate-400'>
            Welcome to{" "}
            <span className='bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text'>
              QuickHeal
            </span>
          </h1>
          <div className='flex gap-5 justify-center items-center'>
            <a
              href='/auth/doctor'
              className='bg-blue-900 p-3 rounded-lg text-white hover:bg-blue-300 hover:text-black transition-all duration-300'>
              Doctor Login
            </a>
            <br />
            <a
              href='/auth/patient'
              className='bg-blue-900 p-3 rounded-lg text-white hover:bg-blue-300 hover:text-black transition-all duration-300'>
              Patient Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
