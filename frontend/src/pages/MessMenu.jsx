import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import APIRoutes from "../utils/APIRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import ChiefWardenLeftSideBar from "../components/ChiefWardenLeftSidebar";
import AccountantLeftSideBar from "../components/AccountantLeftSideBar";
import StudentLeftSideBar from "../components/StudentLeftSideBar";
import RightSideBar from "../components/RightSideBar";


const MessMenu = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [menu, setMenu] = useState({});
    const [editing, setEditing] = useState(null);
    const [newValue, setNewValue] = useState("");

    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    // Set default selected day
    useEffect(() => {
        setSelectedDay(today);
    }, [today]);

    // Fetch menu data and transform array into an object keyed by day
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await axios.get(APIRoutes.messMenu,{ withCredentials: true });
                // Transform array into an object: { Monday: { ...meals }, Tuesday: { ...meals }, ... }
                const formattedMenu = data.reduce((acc, item) => {
                    acc[item.day] = item.meals;
                    return acc;
                }, {});
                setMenu(formattedMenu);
            } catch (error) {
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, []);

    // Fetch user data for authentication
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

    const handleEdit = (mealType) => {
        setEditing(mealType);
        setNewValue(menu[selectedDay][mealType]);
    };

    const handleSave = async (mealType) => {
        setMenu({
            ...menu,
            [selectedDay]: {
                ...menu[selectedDay],
                [mealType]: newValue,
            },
        });
        setEditing(null);
        try {
            await axios.put(`${APIRoutes.changeMenu}/${selectedDay}`, {
              mealType,
              value: newValue,
            },{ withCredentials: true });
          } catch (error) {
            console.error("Error updating menu:", error);
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
            <main className="flex-1 flex justify-center items-center text-xl font-semibold text-gray-700">
                <div className="flex flex-col items-center bg-gradient-to-br from-pink-100 to-orange-100 min-h-screen p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Mess Menu</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-6">Today is {today}</h2>
                    <select
                        className="mb-6 p-2 border rounded-lg"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        {Object.keys(menu).length > 0 ? (
                            Object.keys(menu).map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))
                        ) : (
                            <option>Loading...</option>
                        )}
                    </select>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                        {Object.keys(menu[selectedDay] || {}).map((mealType) => (
                            <div
                                key={mealType}
                                className="bg-white rounded-2xl shadow-lg p-8 text-center w-96 min-h-60 flex flex-col justify-between"
                            >
                                <h2 className="text-2xl font-bold text-indigo-600 capitalize">{mealType}</h2>
                                {editing === mealType ? (
                                    <>
                                        <input
                                            type="text"
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            className="mt-4 p-3 border rounded-lg w-full"
                                        />
                                        <button
                                            onClick={() => handleSave(mealType)}
                                            className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="mt-4 text-xl text-gray-700">{menu[selectedDay][mealType]}</p>
                                        <div className="mt-4 flex justify-center">
                                            {(role === 'chiefWarden' || role === 'accountant') && (
                                                <button
                                                    onClick={() => handleEdit(mealType)}
                                                    className="px-6 py-3 flex items-center bg-blue-500 text-white font-semibold rounded-lg gap-2"
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>





                </div>
            </main>
            {/* Right Sidebar */}
            <ToastContainer />
            <RightSideBar />
        </div>

    );
};

export default MessMenu;
