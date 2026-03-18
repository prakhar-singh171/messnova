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

const StudentComplaints = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [pendingComplaints, setPendingComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await axios.get(APIRoutes.getPendingComplaints, { withCredentials: true });
                setPendingComplaints(data);
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

    const handleLike = async (complaintId) => {
        if (role !== "student") {
            toast.error("Only students can like complaints");
            return;
        }
        try {
            // Assumed API route for liking a complaint.
            const { data } = await axios.post(APIRoutes.likeComplaint, { complaintId }, { withCredentials: true });
            const { updatedComplaint, success, message } = data;
            // Update the complaint in state with the new like count.
            if(success)
            {
                setPendingComplaints((prev) =>
                    prev.map((complaint) =>
                        complaint._id === updatedComplaint._id ? updatedComplaint : complaint
                    )
                );
            }
            else
            {
                showToast(message,"error");
            }
        } catch (error) {
            console.error("Error liking complaint:", error);
            toast.error("Could not like complaint");
        }
    };

    const handleDislike = async (complaintId) => {
        if (role !== "student") {
            toast.error("Only students can dislike complaints");
            return;
        }
        try {
            // Assumed API route for disliking a complaint.
            const { data } = await axios.post(APIRoutes.dislikeComplaint, { complaintId }, { withCredentials: true });
            const { updatedComplaint, success, message } = data;
            // Update the complaint in state with the new dislike count.
            if(success)
            {
                setPendingComplaints((prev) =>
                    prev.map((complaint) =>
                        complaint._id === updatedComplaint._id ? updatedComplaint : complaint
                    )
                );
            }
            else
            {
                showToast(message, "error");
            }
        } catch (error) {
            console.error("Error disliking complaint:", error);
            toast.error("Could not dislike complaint");
        }
    };

    const handleResolve = async (complaintId) => {
        try {
            // Assumed API route for resolving a complaint.
            const { data } = await axios.post(
                APIRoutes.resolveComplaint,
                { complaintId },
                { withCredentials: true }
            );
            const { updatedComplaint, success, message } = data;
            if (success) {
                // Remove the resolved complaint from the pending complaints list.
                setPendingComplaints((prev) =>
                    prev.filter((complaint) => complaint._id !== updatedComplaint._id)
                );
                // console.log("Complaint resolved successfully");
                showToast(message, "success");
            } else {
                showToast(message, "error");
            }
        } catch (error) {
            showToast(error.data.message, "error");
            console.error("Error resolving complaint:", error);
        }
    };

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
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Student Complaints</h2>
                {pendingComplaints.length > 0 ? (
                    <div className="space-y-4">
                        {pendingComplaints.map((complaint, index) => (
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
                                        onClick={() => handleLike(complaint._id)}
                                    >
                                        👍 {complaint.likes.length}
                                    </span>
                                    <span 
                                        className="text-red-600 text-2xl cursor-pointer" 
                                        onClick={() => handleDislike(complaint._id)}
                                    >
                                        👎 {complaint.dislikes.length}
                                    </span>
                                    {role === "chiefWarden" && (
                                        <button 
                                            className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700" 
                                            onClick={() => handleResolve(complaint._id)}
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No complaints available</p>
                )}
            </main>
            {/* Right Sidebar */}
            <ToastContainer />
            <RightSideBar />
        </div>
    );
};

export default StudentComplaints;