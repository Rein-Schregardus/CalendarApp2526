import { BaseForm, type FormField, type ValidationRule } from "./BaseForm";
import { parse } from "date-fns";

export interface EventDto {
  id?: number;
  title: string;
  description?: string;
  date: string; // ISO string
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  locationId?: number;
  locationName?: string;

  [key: string]: unknown;
}

interface EventFormProps {
  onSaved?: (event: EventDto) => void;
}

export const EventForm = ({ onSaved }: EventFormProps) => {
  // === Validation rules ===
  const requiredRule: ValidationRule<EventDto> = {
    rule: (value) =>
      typeof value === "string" ? value.trim() !== "" : value !== undefined,
    message: "This field is required",
  };

  const maxLengthRule = (
    field: keyof EventDto,
    max: number
  ): ValidationRule<EventDto> => ({
    rule: (value) => (typeof value === "string" ? value.length <= max : true),
    message: `${String(field)} cannot exceed ${max} characters`,
  });

  const endAfterStartRule: ValidationRule<EventDto> = {
    rule: (value, formData) =>
      !formData?.startTime || !value || value >= formData.startTime,
    message: "End time cannot be before start time",
  };

  // === Form fields ===
  const fields: FormField<EventDto>[] = [
    {
      name: "title",
      label: "Title *",
      type: "text",
      validations: [requiredRule, maxLengthRule("title", 100)],
      width: "full",
      placeholder: "Event Title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      validations: [maxLengthRule("description", 500)],
      width: "full",
      placeholder: "Event Description",
    },
    {
      name: "date",
      label: "Date *",
      type: "date",
      validations: [requiredRule],
      width: "1/3",
    },
    {
      name: "startTime",
      label: "Start Time *",
      type: "time",
      validations: [requiredRule],
      width: "1/3",
    },
    {
      name: "endTime",
      label: "End Time *",
      type: "time",
      validations: [requiredRule, endAfterStartRule],
      width: "1/3",
    },
    {
      name: "locationId",
      label: "Location ID",
      type: "number",
      width: "full",
      placeholder: "Optional Location ID",
    },
  ];

  const initialValues: Partial<EventDto> = {
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    locationId: undefined,
  };

  // === Helper to convert local date+time to UTC ISO string ===
  const toUtcIso = (date: string, time: string) => {
    const local = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
    const utc = new Date(
      Date.UTC(
        local.getFullYear(),
        local.getMonth(),
        local.getDate(),
        local.getHours(),
        local.getMinutes(),
        local.getSeconds(),
        local.getMilliseconds()
      )
    );
    return utc.toISOString();
  };

  // === Submit handler ===
  const handleSubmit = async (data: EventDto) => {
    try {
      const payload: Partial<EventDto> = {
        title: data.title,
        description: data.description,
        date: toUtcIso(data.date, data.startTime), // UTC ISO
        startTime: data.startTime,
        endTime: data.endTime,
      };

      if (data.locationId) payload.locationId = data.locationId;

      const res = await fetch("http://localhost:5005/api/Events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        alert("You are not authorized. Please log in again.");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Server error (${res.status}): ${text || "Failed to create event"}`
        );
      }

      const createdEvent: EventDto = await res.json();
      onSaved?.(createdEvent);
      alert("Event created successfully!");
    } catch (err) {
      console.error("Error creating event:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Unknown error occurred while creating event."
      );
    }
  };

  return (
    <BaseForm<EventDto>
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel="Create"
    />
  );
};
