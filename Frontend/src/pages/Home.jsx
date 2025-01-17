import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import { useLocation,useNavigate } from 'react-router-dom';
import Main from '../assets/displayMain.png'
const Home = () => {
  const location = useLocation();
  const[username,setUsername]=useState(location.state?.username||"")
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className='bg-orange-50'>
      <Navbar username={username}/>
      <p className='text-center font-bold text-lg'>how to use this website is provided in Contact Page</p>
      <img src={Main} alt="" className='w-[92%] m-auto'/>

    </div>
  );
};
export default Home;