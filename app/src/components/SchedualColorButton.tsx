type TSchedualColorButton = {
  saveColor: (schedualItemType: "Event" | "RoomReservation", hexCode: string) => void,
  getColor: (schedualItemType: "Event" | "RoomReservation") => string,
  color: string
  category: "Event" | "RoomReservation"
}

const schedualColorButton = ({saveColor, getColor, color, category}: TSchedualColorButton) => {
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

export default schedualColorButton;