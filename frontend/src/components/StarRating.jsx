import React from "react";

const StarRating = ({ rating, starCount = 5, starSize = "text-2xl" }) => {
  const percentage = (rating / starCount) * 100;
  const stars = "★★★★★";

  return (
    <div className="relative inline-block">
      <div className={`${starSize} text-gray-300`}>{stars}</div>
      <div
        className={`${starSize} text-yellow-500 absolute top-0 left-0 overflow-hidden`}
        style={{ width: `${percentage}%` }}
      >
        {stars}
      </div>
    </div>
  );
};

export default StarRating;