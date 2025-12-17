type TScheduleColorButton = {
  saveColor: (scheduleItemType: "Event" | "RoomReservation", hexCode: string) => void,
  getColor: (scheduleItemType: "Event" | "RoomReservation") => string,
  color: string
  category: "Event" | "RoomReservation"
}

const scheduleColorButton = ({saveColor, getColor, color, category}: TScheduleColorButton) => {
  return (
    <button
      className={`w-5 h-5 rounded-full bg-[${color}]`}
      onClick={() => saveColor("Event", color)}
      style={
        {
          width: getColor(category) == color ? "2rem" : "1.25rem",
          backgroundColor: color
        }
      } />
  )

}

export default scheduleColorButton;