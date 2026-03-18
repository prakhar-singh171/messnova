import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import APIRoutes from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChiefWardenLeftSideBar from "../components/ChiefWardenLeftSidebar";
import AccountantLeftSideBar from "../components/AccountantLeftSideBar";
import StudentLeftSideBar from "../components/StudentLeftSideBar";
import RightSideBar from "../components/RightSideBar";
import { showToast } from "../utils/toast";

const ResolvedComplaints = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [resolvedComplaints, setResolvedComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await axios.get(APIRoutes.getResolvedComplaints, { withCredentials: true });
                setResolvedComplaints(data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(APIRoutes.authCheck, { withCredentials: true });
                if (response.data.isAuthenticated) {
                    setRole(response.data.user.role);
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.log(error);
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    if (role === "") {
        return <div>Loading...</div>
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-pink-100 to-orange-100">
            {/* Left Sidebar */}
            {role === "chiefWarden" ? (
                <ChiefWardenLeftSideBar />
            ) : role === "accountant" ? (
                <AccountantLeftSideBar />
            ) : (
                <StudentLeftSideBar />
            )}

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Resolved Complaints</h2>
                {resolvedComplaints.length > 0 ? (
                    <div className="space-y-4">
                        {resolvedComplaints.map((complaint, index) => (
                            <div key={index} className="p-4 bg-white shadow-md rounded-md">
                                <h3 className="text-lg font-semibold">{complaint.title}</h3>
                                <p className="text-gray-600">{complaint.description}</p>
                                {complaint.file && (
                                    <a 
                                        href={complaint.file} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-500 underline block mt-2"
                                    >
                                        View Attachment
                                    </a>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Submitted: {new Date(complaint.createdAt).toLocaleString()}
                                </p>
                                <div className="flex items-center mt-2 space-x-4">
                                    <span 
                                        className="text-green-600 text-2xl cursor-pointer" 
                                    >
                                        👍 {complaint.likes.length}
                                    </span>
                                    <span 
                                        className="text-red-600 text-2xl cursor-pointer" 
                                    >
                                        👎 {complaint.dislikes.length}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No resolved complaints available</p>
                )}
            </main>
            {/* Right Sidebar */}
            <ToastContainer />
            <RightSideBar />
        </div>
    );
};

export default ResolvedComplaints;