import {useState} from "react";
import type IEventModel from "../types/IEventModel";
import SmallButton from "./SmallButton";

type EventCard = {
  event: IEventModel;
}

const EventCard = ({ event }: EventCard) => {

  const [openModal, setOpenModal] = useState(false);


  const handleEventClick = () => {
    setOpenModal(true);
  };
  return (
    <>
      <div className="p-5 rounded-md border-2 border-gray-100 hover:shadow-md transition-shadow duration-200 border-t-4 border-t-accent cursor-pointer" onClick={() => {handleEventClick()}}>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-md">{event.title}</h1>
          <span className="text-gray-400 text-xs">{event.startTime.toLocaleString()}</span>
        </div>
        <p className="mt-2 text-gray-500 text-sm truncate">
          {event.description}
        </p>
      </div>
      {/* MODAL */}
      {openModal && (
        <ViewEventModal setOpenModal={setOpenModal} event={event}/>
      )}
    </>
  );
}
export default EventCard;
