import { useState } from "react";
import ScheduleColorButton from "./ScheduleColorButton";



  const getColor = (scheduleItemType: "Event" | "RoomReservation"): string  => {
  return localStorage.getItem("scheduleColor-" + scheduleItemType) || availableColors[1];
}

// colors form red (left) to pruple (right)
const availableColors = ["#e6382c","#c9a244", "#81bd33", "#26a671", "#2e90ab", "#3f4599" , "#824196"];

const ScheduleColorSetting = () => {

  const [forceUpdate, _setForceUpdate] = useState<boolean>(false);
  const doForceUpdate = () => {
    _setForceUpdate(!forceUpdate);
  }

const saveColor = (scheduleItemType: "Event" | "RoomReservation", hexCode: string) => {
  localStorage.setItem("scheduleColor-" + scheduleItemType, hexCode)
  doForceUpdate();
}

  return (
    <div className="rounded-md shadow-md bg-secondary w-max">
      <span className="font-semibold">Schedule Colors</span>
    <div>


      <div>
        <span>Events:</span>
        <ul className="flex flex-row gap-1">
          {availableColors.map((color, i) =>
            <li key={`colorbutton-${i}`}>
              <ScheduleColorButton saveColor={() => saveColor("Event", color)} getColor={() => getColor("Event") } color={color} category="Event" />
            </li>
          )}
        </ul>
      </div>

      <div>
        <span>Reservations:</span>
        <ul className="flex flex-row gap-1">
          {availableColors.map((color, i) =>
            <li key={`colorbutton-${i}`}>
              <ScheduleColorButton saveColor={() => saveColor("RoomReservation", color)} getColor={() => getColor("RoomReservation") } color={color} category="RoomReservation" />
            </li>
          )}
        </ul>
      </div>
    </div>
    </div>
  )
}

export { ScheduleColorSetting, getColor };