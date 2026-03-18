import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import APIRoutes from '../utils/APIRoutes';
import { ToastContainer } from 'react-toastify';
import StudentDashboard from './StudentDashboard';
import ChiefWardenDashboard from './ChiefWardenDashboard';
import AccountantDashboard from './AccountantDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(APIRoutes.authCheck, { withCredentials: true });
        // console.log(response);
        if (response.data.isAuthenticated) {
          setRole(response.data.user.role);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const renderPanel = () => {
    switch (role) {
      case 'student':
        return <StudentDashboard />;
      case 'chiefWarden':
        return <ChiefWardenDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
      default:
        return <div>Dashboard Panel</div>;
    }
  };

  return (
    <div className="dashboard">
      {role && renderPanel()}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;