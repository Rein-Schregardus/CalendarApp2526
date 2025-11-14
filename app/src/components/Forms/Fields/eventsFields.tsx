import { type FormField } from "../BaseForm";

export type EventsFormData = {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  locationId?: number;
  createdBy: number;
};

const eventsFields: FormField<EventsFormData>[] = [
  {
    name: "title",
    label: "Event Title",
    type: "text",
    placeholder: "Enter event title",
    validations: [
      { rule: (v) => typeof v === "string" && v.trim().length > 0, message: "Title is required" },
    ],
    width: "full",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter event description",
    width: "full",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    validations: [
      { rule: (v) => !!v, message: "Date is required" },
    ],
    width: "1/3",
  },
  {
    name: "startTime",
    label: "Start Time",
    type: "time",
    validations: [
      { rule: (v) => !!v, message: "Start time is required" },
    ],
    width: "1/3",
  },
  {
    name: "endTime",
    label: "End Time",
    type: "time",
    validations: [
      { rule: (v) => !!v, message: "End time is required" },
      {
        rule: (v, form) =>
          !form?.startTime || (v !== undefined && v > form.startTime),
        message: "End time must be after start time",
      },
    ],
    width: "1/3",
  },
  {
    name: "locationId",
    label: "Location",
    type: "select",
    options: [
      // populate dynamically with available locations
      { value: 1, label: "Main Hall" },
      { value: 2, label: "Conference Room" },
      { value: 3, label: "Auditorium" },
    ],
    width: "1/2",
  },
  {
    name: "createdBy",
    label: "Creator ID",
    type: "number",
    validations: [
      { rule: (v) => !!v, message: "Creator ID is required" },
    ],
    width: "1/2",
  },
];

export { eventsFields };
