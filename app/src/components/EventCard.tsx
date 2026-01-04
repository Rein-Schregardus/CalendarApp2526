import {useContext, useState} from "react";
import type IEventModel from "../types/IEventModel";
import SmallButton from "./SmallButton";
import ViewEventModal from "./Modal/ViewEventModal";
import { addMinutes } from "date-fns";
import { GlobalModalContext } from "@/context/GlobalModalContext";

type EventCard = {
  event: IEventModel;
}

const EventCard = ({ event }: EventCard) => {

const modalContext = useContext(GlobalModalContext);

  return (
    <>
      <div className="p-5 rounded-md border-2 bg-primary border-background hover:shadow-md transition-shadow duration-200 border-t-4 border-t-accent cursor-pointer" onClick={() => {modalContext.setModal(<ViewEventModal  event={event}/>)}}>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-md">{event.title}</h1>
          <span className="text-soft-text text-xs">{event.start.toLocaleString()}</span>
        </div>
        <p className="mt-2 text-soft-text text-sm truncate">
          {event.description}
        </p>
      </div>
    </>
  );
}
export default EventCard;
