import { useState, useEffect } from "react";
import { addMinutes, parse, parseISO } from "date-fns";
import { BaseForm, type FormField, type ValidationRule } from "./BaseForm";

export interface EventDto {
  id?: number;
  title: string;
  description?: string;
  start: string; // "yyyy-MM-dd HH:mm"
  duration: number; // minutes
  locationId?: number;
  locationName?: string;

  [key: string]: string | number | undefined;
}

interface LocationOption {
  id: number;
  locationName: string;
}

interface EventFormProps {
  onSaved?: (event: EventDto) => void;
}

export const EventForm = ({ onSaved }: EventFormProps) => {
  const [roomOptions, setRoomOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [formValues, setFormValues] = useState<Partial<EventDto>>({
    title: "",
    description: "",
    start: "",
    duration: 30,
    locationId: undefined,
  });

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
      formData == undefined || formData.duration <= 0,
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
      name: "start",
      label: "Start *",
      type: "datetime-local",
      validations: [requiredRule],
      width: "1/3",
    },
    {
      name: "duration",
      label: "Duration *",
      type: "number",
      validations: [requiredRule],
      width: "1/3",
    },
    {
      name: "locationId",
      label: "Location *",
      type: "select",
      options: roomOptions,
      validations: [requiredRule],
      width: "full",
      placeholder: "Select a room",
    },
  ];

  // === Helper to convert local date+time into UTC ISO string ===
  const toUtcIso = (date: string, time: string): string => {
    const local = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
    return new Date(
      Date.UTC(
        local.getFullYear(),
        local.getMonth(),
        local.getDate(),
        local.getHours(),
        local.getMinutes(),
        local.getSeconds(),
        local.getMilliseconds()
      )
    ).toISOString();
  };

  // === Fetch available rooms effect ===
  useEffect(() => {
    const { start, duration } = formValues;
    async function loadRooms(): Promise<void> {
      try {
        let url = "";

        // No filters → get all locations
        if (!start || !duration) {
          url = "http://localhost:5005/Locations";
        } else {
          const params = new URLSearchParams({
            start: parseISO(start).toUTCString(),
            end: addMinutes(start, duration).toUTCString(),
          });
          url = `http://localhost:5005/Locations/available?${params}`;
        }

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error(await res.text());

        const list: LocationOption[] = await res.json();

        setRoomOptions(
          list.map((l) => ({ value: l.id, label: l.locationName }))
        );
      } catch (err) {
        console.error(
          "Failed to load rooms:",
          err instanceof Error ? err.message : err
        );
      }
    }

    loadRooms();
  }, [formValues.start, formValues.duration]);

  // === Submit handler ===
  const handleSubmit = async (data: EventDto): Promise<void> => {
    try {
      const payload: Partial<EventDto> = {
        title: data.title,
        description: data.description,
        start: data.start,
        startTime: data.startTime,
        duration: data.duration
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
      console.error(
        "Error creating event:",
        err instanceof Error ? err.message : err
      );
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
      initialValues={formValues as EventDto}
      onSubmit={handleSubmit}
      onChange={(updated) => setFormValues(updated)}
      submitLabel="Create"
    />
  );
};
