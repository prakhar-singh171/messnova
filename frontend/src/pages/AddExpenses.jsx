import React,{ useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import AccountantLeftSideBar from "../components/AccountantLeftSideBar";
import RightSideBar from "../components/RightSideBar";
import { showToast } from "../utils/toast";
import APIRoutes from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        itemName: "",
        price: "",
        quantity: "",
        shopName: "",
        category: "fruitsAndVegetables",
        date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(APIRoutes.authCheck, { withCredentials: true });
                // console.log(data);
                if (data.isAuthenticated && data.user.role === 'accountant') {
                    // console.log(data.user);
                    setUser(data.user);
                }
                else {
                    navigate("/login");
                }
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "date") {
            const today = new Date().toISOString().split("T")[0];
            if (value > today) return; // Prevent selecting a future date
        }
        setFormData({ ...formData, [name]: value });
    };

    const totalCost = (formData.price * formData.quantity) || 0;

    const handleValidation = () => {
        if (!formData.itemName || !formData.price || !formData.quantity || !formData.shopName) {
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(handleValidation())
        {
            try {
                // console.log(formData);
                const { data } = await axios.post(APIRoutes.addExpense, formData, { withCredentials: true });
                if(data.success)
                {
                    showToast(data.message, "success");
                    setFormData({
                        itemName: "",
                        price: "",
                        quantity: "",
                        shopName: "",
                        category: "fruitsAndVegetables",
                        date: new Date().toISOString().split("T")[0]
                    });
                }
                else
                    showToast(data.message,"error");
            } catch (error) {
                console.error("Error adding expense:", error);
                showToast(error.response.data.message, "error");
            }
        }
        else
        {
            showToast("Please fill all the fields","error");
        }
    };

    if(!user){
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-pink-100 to-orange-100">
            <AccountantLeftSideBar />

            {/* Main Content */}
            <main className="flex-1 flex justify-center items-center text-xl font-semibold text-gray-700">
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg" >
                    <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} placeholder="Item Name" className="w-full p-2 border rounded" />
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" className="w-full p-2 border rounded" />
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full p-2 border rounded" />
                        <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Shop Name" className="w-full p-2 border rounded" />

                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="fruitsAndVegetables">Fruits & Vegetables</option>
                            <option value="spices">Spices</option>
                            <option value="dairyProducts">Dairy Products</option>
                            <option value="maintainance">Maintenance</option>
                            <option value="grocery">Grocery</option>
                            <option value="other">Other</option>
                        </select>

                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" max={new Date().toISOString().split("T")[0]} />

                        <p className="text-lg font-semibold">Total Cost: ₹{totalCost}</p>

                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            Add Expense
                        </button>
                    </form>
                </div>
            </main>

            {/* Right Sidebar */}
            <RightSideBar />
            <ToastContainer />
        </div>
    );
};

export default AddExpense;
