import React from "react";

interface EventCard {
  title: string;
  description: string;
  date: string;
}

const EventCard: React.FC<EventCard> = ({ title, description, date }) => {
  return (
    <div className="p-5 rounded-md border-2 border-gray-100 hover:shadow-md transition-shadow duration-200 border-t-4 border-t-[#035fd0] hover:border-t-[#4f84c5] cursor-pointer">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-md text-gray-600">{title}</h1>
        <span className="text-gray-300 text-xs">{date}</span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">
        {description.length > 30 ? description.slice(0, 30) + "..." : description}
      </p>
    </div>
  );
};

export default EventCard;
