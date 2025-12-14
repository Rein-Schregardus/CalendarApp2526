import EventCard from "./EventCard";
import type IEventModel from "../types/IEventModel";
import { Link } from "react-router-dom";
import { useState } from "react";
import { parseISO } from "date-fns";

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

  const [events, setEvents] = useState<IEventModel[]>()

  const  FetchEvents = async() => {
      try{
          const response = await fetch("http://localhost:5005/api/Events/GetFiltered?time=Future", {credentials: "include"});
          const body = await response.json();
          setEvents(
            body.map((ev: any) => {
              return {
                  id: ev.id,
                  title: ev.title,
                  description: ev.description,
                  start: parseISO(ev.start),
                  duration: ev.duration,
                  location: ev.location,
                  createdBy: ev.createdBy,
                  createdAt: new Date(),
                  // createdAt:  new Date(ev.createdAt)
              } as IEventModel
          }))
      }
      catch(e){
        return;
      }
  }
  FetchEvents();
  return (
    <div className="bg-primary p-4 rounded-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold my-4">Upcoming Events</h1>
        <Link to={"/events"}>
        <button className="flex items-center border-none text-gray-500 hover:text-accent cursor-pointer transition">
          <span className="text-md">View more...</span>
        </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {events?.slice(0, 3).map((event, i) => (
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
