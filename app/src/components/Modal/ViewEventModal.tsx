import type IEventModel from "../../types/IEventModel";
import Modal from "./Modal";
import { useState } from "react";

type ViewEventModal = {
  event: IEventModel
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewEventModal = ({event, setOpenModal}: ViewEventModal) => {
  const [isUserAttending, setIsUserAttending] = useState<boolean | null>(false);

  return (
    <Modal setOpenModal={setOpenModal} title={event.title} size="lg" rightContent={
      <>
        <strong>Attendees</strong>
        <ul>
          {isUserAttending && <li className="bg-accent rounded-md text-primary font-bold p-2 text-center">You are attending</li>}
          <li><hr className="text-secondary border-1" /></li>
          <li>more people</li>
          <li>more people</li>
          <li>more people</li>
        </ul>
      </>
    }>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          <strong>Time:</strong> {event.startTime.toLocaleString()}
        </p>
        <p className="text-gray-700">{event.description}</p>
        <p className="text-sm text-gray-600">
          <strong>Organiser:</strong> {event.createdBy}
        </p>
        {isUserAttending ?
          <button className="bg-red-400 text-primary rounded-md" onClick={() => setIsUserAttending(false)}>Don't go</button> :
          <button className="bg-green-600 text-primary rounded-md" onClick={() => setIsUserAttending(true)}>Attend</button>}

      </div>
    </Modal>)
};

export default ViewEventModal;