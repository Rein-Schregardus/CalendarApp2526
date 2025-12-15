import type { TSchedualItem } from "@/types/TSchedualItem";
import { getColor } from "../SchedualColorSettings";
import { addMinutes, format } from "date-fns";

type SchedualItem = {
  item: TSchedualItem
  top: number,
  height: number,
  left: string,
  columnWidth: number
}

const SchedualItem = ({item, top, height, left, columnWidth}: SchedualItem) => {
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
    >
      <div className="h-[3px] w-[100%]" />
      <span className="font-semibold text-md w-[100%] ml-1 truncate">{item.title}</span>
      <span className="text-xs w-[100%] m-1">
        {format(item.start, "HH:mm")} - {format(addMinutes(item.start, item.duration), "HH:mm")}
      </span>
    </div>
  )
}

export default SchedualItem;