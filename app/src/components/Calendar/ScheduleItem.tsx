import type { TScheduleItem } from "@/types/TScheduleItem";
import { getColor } from "../ScheduleColorSettings";
import { addMinutes, format, parseISO } from "date-fns";
import { useContext } from "react";
import { GlobalModalContext } from "@/context/GlobalModalContext";
import ViewEventModal from "../Modal/ViewEventModal";
import type IEventModel from "@/types/IEventModel";
import type { TExtensiveReservation } from "@/types/TExtensiveReservation";
import ViewReservationModal from "../Modal/ViewReservationModal";

type ScheduleItem = {
  item: TScheduleItem
  top: number,
  height: number,
  left: string,
  columnWidth: number
}

const ScheduleItem = ({item, top, height, left, columnWidth}: ScheduleItem) => {

  const modalContext = useContext(GlobalModalContext);

  const clicked = () => {
    switch (item.type) {
      case "Event":
          const event: IEventModel = {
            id: item.payload.id,
            title: item.payload.title,
            description: item.payload.description,
            start: parseISO(item.payload.start),
            duration: item.payload.duration,
            location: item.payload.locationName,
            createdBy: item.payload.createdBy,
            createdAt: parseISO(item.payload.createdAt),
          }
          modalContext.setModal(<ViewEventModal event={event}/>)
        break;
        case "RoomReservation":
          const reservation: TExtensiveReservation = {
            id: item.payload.id,
            start: parseISO(item.payload.start),
            duration: item.payload.duration,
            locationId: item.payload.locationId,
            locationName: item.payload.locationName,
            creatorId: item.payload.creatorId,
            creatorMail: item.payload.creatorMail
          }
          modalContext.setModal(<ViewReservationModal reservation={reservation}/>);

      default:
        break;
    }
  }

  return(
    <div
      key={item.id}
      className="absolute flex flex-col flex-wrap text-primary text-sm rounded-lg shadow-md pointer-events-auto cursor-pointer bg-amber-500 overflow-hidden"
      style={{
        backgroundColor: getColor(item.type) || "#73bd33",
        top,
        height,
        left,
        width: `calc(${columnWidth}% - 8px)`,
        marginLeft: "4px",
      }}
      onClick={() => clicked()}
    >
      <div className="h-[3px] w-[100%]" />
      <span className="font-semibold text-md w-[100%] ml-1 truncate">{item.title}</span>
      <span className="text-xs w-[100%] m-1">
        {format(item.start, "HH:mm")} - {format(addMinutes(item.start, item.duration), "HH:mm")}
      </span>
    </div>
  )
}

export default ScheduleItem;