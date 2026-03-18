import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import APIRoutes from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChiefWardenLeftSideBar from "../components/ChiefWardenLeftSidebar";
import AccountantLeftSideBar from "../components/AccountantLeftSideBar";
import StudentLeftSideBar from "../components/StudentLeftSideBar";
import RightSideBar from "../components/RightSideBar";

const MonthlyExpense = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [expenseData, setExpenseData] = useState([]);
    const [categorySummary, setCategorySummary] = useState({});
    const [totalExpense, setTotalExpense] = useState(0);

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
        const fetchMonthlyExpenses = async () => {
            try {
                const response = await axios.get(`${APIRoutes.monthlyExpense}?month=${selectedMonth}`, { withCredentials: true });
                const expenses = response.data;
                setExpenseData(expenses);

                let categoryWise = {};
                let total = 0;
                expenses.forEach(({ category, price, quantity }) => {
                    const amount = price * quantity;
                    total += amount;
                    categoryWise[category] = (categoryWise[category] || 0) + amount;
                });

                setTotalExpense(total);
                setCategorySummary(categoryWise);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchMonthlyExpenses();
    }, [selectedMonth]);

    if (role === "") {
        return <div>Loading...</div>
    }

    const data = {
        labels: Object.keys(categorySummary),
        datasets: [
            {
                label: "Expense (₹)",
                data: Object.values(categorySummary),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
        ],
    };

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
            <main className="flex-1 flex flex-col justify-center items-center p-6 text-xl font-semibold text-gray-700">
                <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg"
                    style={{ background: "linear-gradient(to bottom, #fde2e4, #fad2e1)" }}
                    >
                    <h2 className="text-2xl font-bold mb-4 text-center">Monthly Expense Summary</h2>

                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />

                    <p className="text-lg font-semibold">Total Expense: ₹{totalExpense}</p>

                    {Object.keys(categorySummary).length > 0 ? (
                        <Bar data={data} />
                    ) : (
                        <p className="text-center text-gray-500">No expenses recorded for this month.</p>
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            <ToastContainer />
            <RightSideBar />
        </div>

    );
};

export default MonthlyExpense;
