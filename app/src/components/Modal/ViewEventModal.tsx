import type { TEventAttendance } from "@/types/TEventAttendance";
import type IEventModel from "../../types/IEventModel";
import Modal from "./Modal";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/hooks/UserContext";
import { addMinutes } from "date-fns";
import { GlobalModalContext } from "@/context/GlobalModalContext";

type TViewEventModal = {
  event: IEventModel
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewEventModal = ({event, setOpenModal}: TViewEventModal) => {
  const modalContext = useContext(GlobalModalContext);
  const [attendance, setAttendance] = useState<TEventAttendance>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currUser = useContext(UserContext);

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
        <p className="text-sm text-gray-600">
          <strong>Time:</strong> {event.start.toLocaleDateString()} {addMinutes(event.start, event.duration).toLocaleTimeString()}
        </p>
        <p className="text-gray-700">{event.description}</p>
        <p className="text-sm text-gray-600">
          <strong>Organiser:</strong> {event.createdBy}
        </p>
        <div className="flex justify-evenly">
        {
        isLoading ? <button className="bg-gray-500 text-primary rounded-md grow">Loading Attendance</button>:
          attendance?.UserEmail.includes(currUser.getCurrUser()?.email ?? "")?
            <button className="bg-red-400 text-primary rounded-md grow cursor-pointer" onClick={unAttend}>Don't go</button>:
            <button className="bg-green-600 text-primary rounded-md grow cursor-pointer" onClick={attend}>Attend</button>}
        {event.createdBy == currUser.getCurrUser()?.id.toString() && <button className="bg-accent text-primary rounded-md px-7 cursor-pointer">Edit Event</button>}
        </div>
      </div>
    </Modal>)
};

export default ViewEventModal;