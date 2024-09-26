import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <FaStar className="text-[#F7BA00]" />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt className="text-[#F7BA00]" />
          ) : (
            <FaRegStar className="text-[#F7BA00]" />
          )}
        </span>
      ))}
      {text && <span className="ml-2">{text}</span>}
    </div>
  );
};

export default Rating;
