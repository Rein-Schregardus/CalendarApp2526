import type { TEventAttendance } from "@/types/TEventAttendance";
import type IEventModel from "../../types/IEventModel";
import Modal from "./Modal";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/hooks/UserContext";
import { addMinutes, format, parse } from "date-fns";
import { GlobalModalContext } from "@/context/GlobalModalContext";
import AdvancedOptions from "../Forms/AdvancedOptions";
import { EventForm, type EventDto } from "../Forms/EventForm";

type TViewEventModal = {
  event: IEventModel
}

const ViewEventModal = ({event}: TViewEventModal) => {
  const [attendance, setAttendance] = useState<TEventAttendance>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currUser = useContext(UserContext);
  const modalContext = useContext(GlobalModalContext);

  // Fetch event data
  useEffect(() =>{ const method = async () => {
    if (isLoading === false) return;
    const response = await fetch(`http://localhost:5005/api/EventAttendance?EventId=${event.id}`, {credentials: "include", method: "Get"}).then(r => r.json());
    const typeResponse: TEventAttendance = {
      eventId: response.eventId,
      UserEmail: response.attendees}

    setAttendance(typeResponse);
    setIsLoading(false);
}
method();
}, [isLoading]);

  const attend = async () => {
    await fetch(`http://localhost:5005/api/EventAttendance?EventId=${event.id}`, {credentials: "include", method: "Post"});
    setIsLoading(true);
  }

    const unAttend = async () => {
    await fetch(`http://localhost:5005/api/EventAttendance?EventId=${event.id}`, {credentials: "include", method: "Delete"});
    setIsLoading(true);
  }

  return (
    <Modal title={event.title} size="lg" rightContent={
      <>
        <strong>Attendees</strong>
        <ul>
          {attendance?.UserEmail.includes(currUser.getCurrUser()?.email ?? "") && <li className="bg-accent rounded-md text-primary font-bold p-2 text-center">You are attending</li>}
          <li><hr className="text-secondary border-1" /></li>
          {
            attendance?.UserEmail.length === 0 && <li>No attendees yet.</li>
          }
          {
            attendance?.UserEmail.map(ua => {
              return <li>{ua}</li>
            })}
        </ul>
      </>
    }>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-soft-text">
          <strong>Time:</strong> {event.start.toLocaleDateString()} {event.start.toLocaleTimeString()}
        </p>
        <p className="text-soft-text">{event.description}</p>
        <p className="text-sm text-soft-text">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-sm text-soft-text">
          <strong>Organiser:</strong> {event.createdBy}
        </p>
                <p className="text-sm text-soft-text">
          <strong>Id:</strong> {event.id}
        </p>
        <div className="flex justify-evenly gap-2">
        {
        event.createdBy == currUser.getCurrUser()?.email &&
        <button
          className="bg-secondary rounded-md grow cursor-pointer w-min"
            onClick={() => {
              const dto: EventDto = {id: event.id, title: event.title, description: event.description, start: format(event.start, "yyyy-MM-dd'T'HH:mm"), duration: event.duration, locationName: event.location  };
              modalContext.setModal(<Modal
                title={"New Event"}
                leftContent={<EventForm eventToEdit={dto} />}
                rightContent={<AdvancedOptions />}
            />)}}>
            Edit...
        </button>
        }
        {
        isLoading ? <button className="bg-text-soft-text text-primary rounded-md grow">Loading Attendance</button>:
          attendance?.UserEmail.includes(currUser.getCurrUser()?.email ?? "")?
            <button className="bg-red-400 text-primary rounded-md grow cursor-pointer" onClick={unAttend}>Don't go</button>:
            <button className="bg-green-600 text-primary rounded-md grow cursor-pointer" onClick={attend}>Attend</button>}
        {event.createdBy == currUser.getCurrUser()?.id.toString() && <button className="bg-accent text-primary rounded-md px-7 cursor-pointer">Edit Event</button>}
        </div>
      </div>
    </Modal>)
};

export default ViewEventModal;

  // id?: number;
  // title: string;
  // description?: string;
  // start: string; // "yyyy-MM-dd HH:mm"
  // duration: number; // minutes
  // locationId?: number;
  // locationName?: string;