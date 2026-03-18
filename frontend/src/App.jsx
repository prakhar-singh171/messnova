import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Register";
import StudentRegister from "./pages/StudentRegister";
import ChiefWardenRegister from "./pages/ChiefWardenRegister";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MessMenu from "./pages/MessMenu";
import AddAccountant from "./pages/AddAccountant";
import RaiseComplaint from "./pages/RaiseComplaint";
import AddNotice from "./pages/AddNotice";
import StudentComplaints from "./pages/StudentComplaints";
import ResolvedComplaints from "./pages/ResolvedComplaints";
import AddExpense from "./pages/AddExpenses";
import DailyExpenses from "./pages/DailyExpense";
import MonthlyExpense from "./pages/MonthlyExpense";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/chief-warden-register" element={<ChiefWardenRegister />} />
          <Route path="/register/student-register" element={<StudentRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/mess-menu' element={<MessMenu />} />
          <Route path='/add-accountant' element={<AddAccountant />} />
          <Route path='/add-notice' element={<AddNotice />} />
          <Route path='/raise-complaint' element={<RaiseComplaint />} />
          <Route path='/student-complaints' element={<StudentComplaints />} />
          <Route path='/resolved-complaints' element={<ResolvedComplaints />} />
          <Route path='/add-expenses' element={<AddExpense />} />
          <Route path='/daily-expenses' element={<DailyExpenses />} />
          <Route path='/monthly-expenses' element={<MonthlyExpense />} />
          <Route path='*' element={<Dashboard />} />
        </Routes>
        <ToastContainer/>
      </div>
    </BrowserRouter>
  )
}