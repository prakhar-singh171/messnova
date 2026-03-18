import React, { useState, useEffect } from "react";
import axios from "axios";
import APIRoutes from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChiefWardenLeftSideBar from "../components/ChiefWardenLeftSidebar";
import AccountantLeftSideBar from "../components/AccountantLeftSideBar";
import StudentLeftSideBar from "../components/StudentLeftSideBar";
import RightSideBar from "../components/RightSideBar";

const DailyExpenses = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

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

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${APIRoutes.dailyExpense}?date=${selectedDate}`, { withCredentials: true });
                // Set only the expenses array from the response
                setExpenses(response.data.expenses);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, [selectedDate]);

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.price * expense.quantity, 0);

    if (role === "") {
        return <div>Loading...</div>
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-pink-100 to-orange-100">
            {role === "chiefWarden" ? (
                <ChiefWardenLeftSideBar />
            ) : role === "accountant" ? (
                <AccountantLeftSideBar />
            ) : (
                <StudentLeftSideBar />
            )}

            <main className="flex-1 flex justify-center items-center  text-xl font-semibold text-gray-700">
                <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg"
                    style={{ background: "linear-gradient(to bottom, #fde2e4, #fad2e1)" }}>

                    
                    <h2 className="text-2xl font-bold mb-4 text-center">Daily Expenses</h2>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        max={new Date().toISOString().split("T")[0]}
                    />

                    
                    <div className="max-h-[60vh] overflow-y-auto border border-gray-300 rounded-lg">
                        <table className="w-full border-collapse border border-gray-300 table-fixed">
                            <thead className="bg-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="border p-2 w-[150px]">Item</th>
                                    <th className="border p-2 w-[100px]">Price (₹)</th>
                                    <th className="border p-2 w-[100px]">Quantity</th>
                                    <th className="border p-2 w-[120px]">Total (₹)</th>
                                    <th className="border p-2 w-[180px]">Shop</th>
                                    <th className="border p-2 w-[180px]">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.length > 0 ? (
                                    expenses.map((expense) => (
                                        <tr key={expense._id} className="text-center">
                                            <td className="border p-2 w-[150px] break-words">{expense.itemName}</td>
                                            <td className="border p-2 w-[100px] break-words">₹{expense.price}</td>
                                            <td className="border p-2 w-[100px] break-words">{expense.quantity}</td>
                                            <td className="border p-2 w-[120px] break-words">₹{expense.price * expense.quantity}</td>
                                            <td className="border p-2 w-[180px] break-words">{expense.shopName}</td>
                                            <td className="border p-2 w-[180px] break-words">{expense.category}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border p-2 text-center">No expenses recorded for this date</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    
                    <p className="text-xl font-bold text-center mt-4">Total Expense: ₹{totalExpense}</p>
                </div>
            </main>


            
            <ToastContainer />
            <RightSideBar />
        </div>
    );
};

export default DailyExpenses;
