type TSchedualItem = {
  id: number,
  title: string,
  color: string,
  start: Date,
  duration: number
  type: "Event" | "RoomReservation"
}

export type {TSchedualItem};