import React, { useEffect, useState } from 'react'
import ChiefWardenLeftSideBar from '../components/ChiefWardenLeftSidebar.jsx'
import RightSideBar from '../components/RightSideBar'
import axios from 'axios'
import APIRoutes from '../utils/APIRoutes.js'
import {showToast} from '../utils/toast.js'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function AddAccountant() {
    const navigate = useNavigate(); 
    const [user, setUser] = useState(null);
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(APIRoutes.authCheck, { withCredentials: true });
                // console.log(data);
                if (data.isAuthenticated && data.user.role === 'chiefWarden') {
                    // console.log(data.user);
                    setUser(data.user);
                }
                else{
                    navigate("/login");
                }
            } catch (error) {
                console.log(error)
                navigate("/login");
            }
        };
        fetchData();
    }, []);

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            showToast(
                "Password and confirm password should be same.",
                "error"
            );
            return false;
        } else if (username.length < 3) {
            showToast(
                "Username should be greater than 3 characters.",
                "error"
            );
            return false;
        } else if (password.length < 8) {
            showToast(
                "Password should be equal or greater than 8 characters.",
                "error"
            );
            return false;
        } else if (email === "") {
            showToast(
                "Email is required.",
                "error"
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            try {
                const { username, email, password } = values;
                const { data } = await axios.post(APIRoutes.addAccountant,
                    { username, email, password, hostel: user.hostel },
                    { withCredentials: true }
                );

                if (data.success) {
                    showToast(data.message, "success");
                    setValues({
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                }
                else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    if(!user){
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-pink-100 to-orange-100">
            {/* Left Sidebar */}
            <ChiefWardenLeftSideBar />

            {/* Main Content */}
            <main className="flex-1 flex justify-center items-center text-xl font-semibold text-gray-700">
                <div className="w-3/4 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4 text-center">Add Accountant</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={values.username}
                                onChange={handleChange}
                                className="w-full p-3 border rounded mb-3"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={values.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded mb-3"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange}
                                className="w-full p-3 border rounded mb-3"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border rounded mb-3"
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">Add Accountant</button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <RightSideBar />
            <ToastContainer/>
        </div>
    )
}

export default AddAccountant
