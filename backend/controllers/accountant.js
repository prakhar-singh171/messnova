import Expense from "../models/Expense.js";
import dotenv from "dotenv";

dotenv.config();

const addExpense = async (req, res) => {
    if(req.user.role !== "accountant")
        return res.status(401).json({success:false, message:"Unauthorized Access."});

    try {
        const data = req.body;
        data.totalCost = data.price * data.quantity;
        data.hostel = req.user.hostel;
        // console.log(data);
        const expense = await Expense.create(data);
        return res.status(201).json({success:true, message:"Expense added successfully."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:"Server error."});
    }
}


export {
    addExpense,
};