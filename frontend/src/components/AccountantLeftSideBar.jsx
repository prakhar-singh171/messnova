import React from 'react';
import axios from 'axios';
import APIRoutes from '../utils/APIRoutes';
import { showToast } from '../utils/toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaComment, FaCheck, FaUtensils, FaBell, FaSignOutAlt, FaMoneyBillAlt, FaWallet } from 'react-icons/fa';

const AccountantLeftSideBar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(APIRoutes.logout, {}, { withCredentials: true });
      // navigate('/login');
      showToast('Logged out successfully.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-1/5 bg-gradient-to-b from-gray-200 to-pink-200 p-4 flex flex-col">
      {/* Branding */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">
          <span className="text-red-500">Accountant</span> Dashboard
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 space-y-2 flex-1">
        <Link
          to="/dashboard"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaUser className="mr-2" /> Dashboard
        </Link>
        <Link
          to="/student-complaints"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaComment className="mr-2" /> Student Complaints
        </Link>
        <Link
          to="/resolved-complaints"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaCheck className="mr-2" /> Resolved Complaints
        </Link>
        <Link
          to="/mess-menu"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaUtensils className="mr-2" /> Mess Menu
        </Link>
        <Link
          to="/add-notice"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaBell className="mr-2" /> Add Notice
        </Link>
        <Link
          to="/add-expenses"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaMoneyBillAlt className="mr-2" /> Add Expenses
        </Link>
        <Link
          to="/daily-expenses"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaWallet className="mr-2" /> Daily Expenses
        </Link>
        <Link
          to="/monthly-expenses"
          className="block text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaWallet className="mr-2" /> Monthly Expenses
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 bg-green-400 rounded-md text-white font-semibold flex items-center hover:bg-green-500"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default AccountantLeftSideBar;
