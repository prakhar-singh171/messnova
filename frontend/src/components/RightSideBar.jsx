import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import APIRoutes from "../utils/APIRoutes.js";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating"; // Import the new StarRating component
import WeeklyRatingGraph from "./WeeklyRatingGraph";

function RightSideBar() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const noticeContainerRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userHasRated, setUserHasRated] = useState(null);
  const [graphView, setGraphView] = useState(false);

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
    const fetchData = async () => {
      try {
        const { data } = await axios.get(APIRoutes.getNotices, { withCredentials: true });
        setNotices(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const { data } = await axios.get(APIRoutes.getAverageRating, { withCredentials: true });
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        // console.log(data);
        if (role === "student" && data.userHasRated) {
          setUserHasRated(true);
          // Assuming rating object has a "rating" property that stores the value
          setRating(data.rating.rating);
        } else {
          setUserHasRated(false);
        }
      } catch (error) {
        console.log("Error fetching average rating:", error);
      }
    };
    if (role) {
      fetchAverageRating();
    }
  }, [role]);

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      showToast("Please select a rating before submitting!", "error");
      return;
    }

    try {
      await axios.post(APIRoutes.submitRating, { rating }, { withCredentials: true });
      showToast("Thank you for your rating!", "success");

      // Refresh average rating after submission
      const { data } = await axios.get(APIRoutes.getAverageRating, { withCredentials: true });
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
      if (role === "student" && data.userHasRated) {
        setUserHasRated(true);
        setRating(data.rating.rating);
      } else {
        setUserHasRated(false);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      showToast(error.data.message, "error");
    }
  };

  return (
    <aside className="w-1/5 bg-gradient-to-b from-yellow-200 to-red-200 p-4 flex flex-col">
      {/* Notices Section */}
      <div
        ref={noticeContainerRef}
        className="bg-white p-4 rounded-lg shadow-md overflow-y-auto"
        style={{ maxHeight: "26rem", height: notices.length > 0 ? "auto" : "6rem" }}
      >
        <h2 className="text-lg font-bold text-center">Updates</h2>
        {notices.length > 0 ? (
          notices.map((notice, index) => (
            <div key={index} className="mt-2 p-2 bg-gray-100 rounded-md">
              <p className="text-sm font-semibold">{notice.title}</p>
              <p className="text-xs text-gray-500">{notice.description}</p>
              <p className="text-xs text-gray-500">
                Time: {new Date(notice.time || notice.createdAt).toLocaleString()}
              </p>
              <a href={notice.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Download
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No notices available</p>
        )}
      </div>

      {/* Meal Rating Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4 text-center">
        {role && role === "student" && (
          <>
            <h2 className="text-lg font-bold">Rate Today's Meal</h2>
            <div className="flex justify-center my-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-2xl cursor-pointer ${(hover || rating) > i ? "text-yellow-500" : "text-gray-300"}`}
                  onMouseEnter={() => {if(!setUserHasRated)  setHover(i + 1)}}
                  onMouseLeave={() => {if(!setUserHasRated)  setHover(0)}}
                  onClick={() => setRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700">Your Rating: {rating || "0"}</p>
            {userHasRated != null && !userHasRated && (
              <div className="flex justify-center mt-2">
                <button onClick={handleRatingSubmit} className="bg-blue-500 text-white px-4 py-1 rounded-md">
                  Submit
                </button>
              </div>
            )}
          </>
        )}

        {/* Toggle between Average and Weekly Ratings */}
        {graphView ? (
          <WeeklyRatingGraph />
        ) : (
          <div className="mt-4">
            <h3 className="text-md font-semibold">Average Rating</h3>
            <div className="flex justify-center my-1">
              <StarRating rating={averageRating} />
            </div>
            <p className="text-gray-700">
              {(averageRating || 0).toFixed(1)} ({totalRatings || 0} ratings)
            </p>
          </div>
        )}

        <div className="flex justify-center mt-2">
          <button
            onClick={() => setGraphView(!graphView)}
            className="bg-gray-500 text-white px-4 py-1 rounded-md"
          >
            {graphView ? "Back" : "Graph"}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default RightSideBar;
