import { useState } from "react";
import SchedualColorButton from "./SchedualColorButton";



  const getColor = (schedualItemType: "Event" | "RoomReservation"): string  => {
  return localStorage.getItem("schedualColor-" + schedualItemType) || availableColors[0];
}

// colors form red (left) to pruple (right)
const availableColors = ["#e6382c","#c9a244", "#81bd33", "#26a671", "#2e90ab", "#3f4599" , "#824196"];

const SchedualColorSetting = () => {

  const [forceUpdate, _setForceUpdate] = useState<boolean>(false);
  const doForceUpdate = () => {
    _setForceUpdate(!forceUpdate);
  }

const saveColor = (schedualItemType: "Event" | "RoomReservation", hexCode: string) => {
  localStorage.setItem("schedualColor-" + schedualItemType, hexCode)
  doForceUpdate();
}

  return (
    <div className="rounded-md shadow-md bg-secondary w-max">
      <span className="font-semibold">Schedual Colors</span>
    <div>


      <div>
        <span>Events:</span>
        <ul className="flex flex-row gap-1">
          {availableColors.map((color, i) =>
            <li key={`colorbutton-${i}`}>
              <SchedualColorButton saveColor={() => saveColor("Event", color)} getColor={() => getColor("Event") } color={color} category="Event" />
            </li>
          )}
        </ul>
      </div>

      <div>
        <span>Reservations:</span>
        <ul className="flex flex-row gap-1">
          {availableColors.map((color, i) =>
            <li key={`colorbutton-${i}`}>
              <SchedualColorButton saveColor={() => saveColor("RoomReservation", color)} getColor={() => getColor("RoomReservation") } color={color} category="RoomReservation" />
            </li>
          )}
        </ul>
      </div>
    </div>
    </div>
  )
}

export { SchedualColorSetting, getColor };