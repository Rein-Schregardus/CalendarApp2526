type TScheduleItem = {
  id: number,
  title: string,
  color: string,
  start: Date,
  duration: number
  type: "Event" | "RoomReservation",
  payload: any // the payload is type specific information, so a Event will have a different payload than RoomReservation
}

export type {TScheduleItem};