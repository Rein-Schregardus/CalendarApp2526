import Modal from "./Modal";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/hooks/UserContext";
import { addMinutes } from "date-fns";
import type { TExtensiveReservation } from "@/types/TExtensiveReservation";

type TViewReservationModal = {
  reservation: TExtensiveReservation
}

const ViewReservationModal = ({reservation}: TViewReservationModal) => {

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
      </div>
    </Modal>)
};

export default ViewReservationModal;