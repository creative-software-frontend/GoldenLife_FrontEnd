import React from "react";
import { Quote } from "lucide-react"; // Make sure you have lucide-react installed
import { Review } from "@/data/reviewsData";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="h-full p-8 rounded-2xl text-white bg-gradient-to-br from-primary/50 to-primary flex flex-col shadow-xl relative overflow-hidden">
      {/* Background pattern overlay for texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <Quote className="w-10 h-10 mb-6 opacity-80" />
      
      <p className="text-lg leading-relaxed flex-grow mb-8 italic">
        "{review.content}"
      </p>
      
      <div className="flex items-center mt-auto">
        <img
          src={review.image}
          alt={review.name}
          className="w-14 h-14 rounded-full border-2 border-white mr-4 object-cover"
        />
        <div>
          <h4 className="text-xl font-bold">{review.name}</h4>
          <p className="text-sm opacity-90">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;