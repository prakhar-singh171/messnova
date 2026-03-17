import React, { useState, useEffect } from 'react';
import Logo from '../assets/app_logo.png';
import home from '../assets/home.png';
import { useNavigate, Link } from "react-router-dom";
import APIRoutes from '../utils/APIRoutes';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(APIRoutes.authCheck, { withCredentials: true });
                // console.log(data);
                if (data.isAuthenticated) {
                    navigate("/dashboard");
                }
            } catch (error) {
                console.log(error)
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Left Side - Image Section */}
            <div className="w-1/2 bg-white flex items-center justify-center px-3">
                <img src={home} alt="Dashboard Preview" className="max-w-full h-auto" />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-1/2 bg-gradient-to-br from-pink-100 to-orange-100 flex flex-col justify-center items-center p-10">

                <div className="flex items-center mb-8">
                    <img src={Logo} alt="Logo" className="h-12 mr-4" />
                    <h1 className="text-4xl font-bold text-black">EazyMess</h1>
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-semibold">Select Your Role</h2>
                    <button onClick={() => navigate("/register/chief-warden-register")} className="w-64 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#E63946]">
                        Chief Warden
                    </button>
                    <button onClick={() => navigate("/register/student-register")} className="w-64 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#E63946]">
                        Student
                    </button>
                </div>
                <p className="mt-4 text-center text-black text-sm">
                    ALREADY HAVE AN ACCOUNT ? <Link to="/login" className="text-[#FF6B6B] font-bold">LOGIN</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;