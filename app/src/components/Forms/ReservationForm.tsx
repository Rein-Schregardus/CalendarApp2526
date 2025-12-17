import { useState, useEffect } from "react";
import { addMinutes, parse, parseISO } from "date-fns";
import { BaseForm, type FormField, type ValidationRule } from "./BaseForm";

export interface ReservationDto {
  id?: number;
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

interface ReservationFormProps {
  onSaved?: (Reservation: ReservationDto) => void;
}

export const ReservationForm = ({ onSaved }: ReservationFormProps) => {
  const [roomOptions, setRoomOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [formValues, setFormValues] = useState<Partial<ReservationDto>>({
    title: "",
    description: "",
    start: "",
    duration: 30,
    locationId: undefined,
  });

  // === Validation rules ===
  const requiredRule: ValidationRule<ReservationDto> = {
    rule: (value) =>
      typeof value === "string" ? value.trim() !== "" : value !== undefined,
    message: "This field is required",
  };

  const maxLengthRule = (
    field: keyof ReservationDto,
    max: number
  ): ValidationRule<ReservationDto> => ({
    rule: (value) => (typeof value === "string" ? value.length <= max : true),
    message: `${String(field)} cannot exceed ${max} characters`,
  });

  const endAfterStartRule: ValidationRule<ReservationDto> = {
    rule: (value, formData) =>
      formData == undefined || formData.duration <= 0,
    message: "End time cannot be before start time",
  };

  // === Form fields ===
  const fields: FormField<ReservationDto>[] = [
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
  const handleSubmit = async (data: ReservationDto): Promise<void> => {
    try {
      const payload: Partial<ReservationDto> = {
        start: data.start,
        startTime: data.startTime,
        duration: data.duration
      };
      if (data.locationId) payload.locationId = data.locationId;

      const res = await fetch("http://localhost:5005/api/reservation", {
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
          `Server error (${res.status}): ${text || "Failed to create Reservation"}`
        );
      }

      const createdReservation: ReservationDto = await res.json();
      onSaved?.(createdReservation);
      alert("Reservation created successfully!");
    } catch (err) {
      console.error(
        "Error creating Reservation:",
        err instanceof Error ? err.message : err
      );
      alert(
        err instanceof Error
          ? err.message
          : "Unknown error occurred while creating Reservation."
      );
    }
  };

  return (
    <BaseForm<ReservationDto>
      fields={fields}
      initialValues={formValues as ReservationDto}
      onSubmit={handleSubmit}
      onChange={(updated) => setFormValues(updated)}
      submitLabel="Create"
    />
  );
};
