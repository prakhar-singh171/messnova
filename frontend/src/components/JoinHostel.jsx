import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JoinHostel = ( { hostelCode, setHostelCode, handleJoinHostel } ) => {
    return (
      <div className="join-hostel-page flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">You have not joined any hostel yet</h2>
        <form onSubmit={handleJoinHostel} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter Hostel Code"
            value={hostelCode}
            onChange={(e) => setHostelCode(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Join Hostel
          </button>
        </form>
        <ToastContainer />
      </div>
    );
};

export default JoinHostel;