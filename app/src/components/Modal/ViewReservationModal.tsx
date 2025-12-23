import Modal from "./Modal";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/hooks/UserContext";
import { addMinutes } from "date-fns";
import type { TExtensiveReservation } from "@/types/TExtensiveReservation";
import { GlobalModalContext } from "@/context/GlobalModalContext";

type TViewReservationModal = {
  reservation: TExtensiveReservation
}

const ViewReservationModal = ({reservation}: TViewReservationModal) => {

  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const modalContext = useContext(GlobalModalContext);

  const deleteReservation = async() => {
    setIsRemoving(true);
    await fetch(`http://localhost:5005/api/Reservation/${reservation.id}`, {method: "Delete", credentials: "include"});
    modalContext.removeModal();
  }


   return (
    <Modal title={`Reservation for ${reservation.locationName}`} size="md" >
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-600">
          <p><strong>Date: </strong> {reservation.start.toLocaleDateString()}</p>
          <p><strong>Start: </strong> {reservation.start.toLocaleTimeString()}</p>
          <p><strong>End: </strong> {addMinutes(reservation.start, reservation.duration).toLocaleTimeString()}</p>
          <p><strong>Location: </strong>{reservation.locationName}</p>
        </div>
          <p className="text-sm text-gray-600"> Creator: {reservation.creatorMail}</p>
          {
            isRemoving?
            <div>Removing in process</div>
            :
            <button className="bg-orange-700 text-primary rounded-md grow cursor-pointer w-fit p-1" onClick={() => {deleteReservation()}}>Delete Reservation</button>
          }
      </div>
    </Modal>)
};

export default ViewReservationModal;