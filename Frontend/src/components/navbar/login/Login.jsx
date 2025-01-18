import {React,useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
// import Signup from '../../../pages/login&signup/SignUp';
import { IoIosArrowDown } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import './login.css'
import { FaArrowRight } from "react-icons/fa";

const Login = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        // Check if username exists in localStorage when the component mounts
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    const handleSignOut = () => {
        // Remove username from localStorage and reset state
        localStorage.removeItem("username");
        setUsername(""); // Clear username state
    };
    const handleLoginClick = () => {
        if(!username) { 
            navigate("/login");
        }
    }
    return (
        <li className="menu-iteml">
            <div className="flex items-center">
                <div onClick={handleLoginClick}
                className="arrow-container login group inline-flex gap-2 items-center cursor-pointer hover:bg-slate-400 p-2 rounded-lg">
                    <CgProfile
                        className=" transition-transform duration-300 text-slate-800"

                        size={30}
                        alt="Icon"
                    />
                    <p className='text-slate-800 font-semibold text-lg'>{username || "Login"}</p>

                    <IoIosArrowDown
                        className="arrow-icon transition-transform duration-300 group-hover:rotate-180 text-slate-800"
                    />
                </div>
            </div>
            <ul className="submenul group-hover:visible group-hover:opacity-100 group-hover:top-[60px] group-hover:translate-y-0">
                {username ? (
                    <>
                        <li className="hover:bg-indigo-100 p-2 rounded-lg hover:text-black">Profile</li>
                        <li onClick={() => navigate('/orders')} className="hover:bg-indigo-100 p-2 rounded-lg hover:text-black">Orders</li>

                        <li className="hover:bg-red-100 p-2 rounded-lg hover:text-black"onClick={handleSignOut}>Sign Out</li>
                    </>
                ) : (
                    <>
                    <li className="hover:bg-slate-00 flex items-center justify-between hover:bg-slate-200 rounded-lg">
                        <h1 className="flex items-center text-indigo-400 font-semibold">
                            New Customer<FaArrowRight className='ml-1 text-indigo-400' />
                        </h1>
                        <button
                            className='hover:bg-slate-400 p-2 rounded-lg hover:text-black'
                            onClick={() => navigate('/signup')} // Ensure you use React Router
                        >
                            Sign Up
                        </button>
                    </li>




</>
                )}
            </ul>
        </li>

    )
}

export default Login
