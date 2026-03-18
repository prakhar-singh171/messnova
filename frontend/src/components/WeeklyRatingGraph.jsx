import React, { useEffect, useState } from "react";
import axios from "axios";
import APIRoutes from "../utils/APIRoutes.js";

const WeeklyRatingGraph = () => {
  const [weeklyRatings, setWeeklyRatings] = useState([]);

  useEffect(() => {
    const fetchWeeklyRatings = async () => {
      try {
        const { data } = await axios.get(APIRoutes.getWeeklyRatings, { withCredentials: true });
        setWeeklyRatings(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching weekly ratings:", error);
      }
    };
    fetchWeeklyRatings();
  }, []);

  // Expect weeklyRatings to be an array of objects with day and averageRating,
  // e.g. [{ day: "Mon", averageRating: 3.5 }, ...]
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">Weekly Ratings Graph</h3>
      <div className="flex justify-around mt-4">
        {weeklyRatings.map((entry, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-8 h-24 bg-gray-200 relative">
              <div
                className="absolute bottom-0 w-full bg-yellow-500"
                style={{ height: `${(entry.averageRating / 5) * 100}%` }}
              ></div>
            </div>
            <span className="mt-2">{entry.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyRatingGraph;