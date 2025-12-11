import EventCard from "./EventCard";
import type IEventModel from "../types/IEventModel";
import { Link } from "react-router-dom";

const events:IEventModel[] = [
  {
    id: 1,
    title: "edvenatous",
    description: "Just some sample text where we describe more about how the",
    start: new Date(),
    duration: 30,
    location: "",
    createdBy: "",
    createdAt: new Date()
  }
];

const UpcomingEvents = () => {


  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold my-4">Upcoming Events</h1>
        <Link to={"/events"}>
        <button className="flex items-center border-none text-gray-500 hover:text-accent cursor-pointer transition">
          <span className="text-md">View more...</span>
        </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {events.slice(0, 3).map((event, i) => (
          <div key={i}>
            <EventCard
              event={event}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
