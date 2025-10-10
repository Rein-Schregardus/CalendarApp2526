interface EventDto {
  id: number;
  title: string;
  description?: string;
  date: string;        // ISO string
  startTime: string;   // "HH:mm" format
  endTime: string;     // "HH:mm" format
  locationName?: string;
}

import { useState } from "react";
// import { EventDto } from "../../types/EventDto";

interface EventFormProps {
  event?: EventDto;
  onSave?: (event: EventDto) => void;
}

export const EventForm = ({ event, onSave }: EventFormProps) => {
  const [formData, setFormData] = useState<EventDto>({
    id: event?.id || 0,
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    locationName: event?.locationName || ""
  });

  const handleChange = (field: keyof EventDto, value: string | number | undefined) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    console.log("Saving event:", formData);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Title"
        className="border p-2 rounded"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        className="border p-2 rounded resize-none"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="date"
          className="border p-2 rounded w-1/2"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
        <input
          type="time"
          className="border p-2 rounded w-1/2"
          value={formData.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          required
        />
        <input
          type="time"
          className="border p-2 rounded w-1/2"
          value={formData.endTime}
          onChange={(e) => handleChange("endTime", e.target.value)}
          required
        />
      </div>

      <input
        type="text"
        placeholder="Location Name"
        className="border p-2 rounded"
        value={formData.locationName}
        onChange={(e) => handleChange("locationName", e.target.value)}
      />

      <div className="flex justify-end gap-2 mt-3">
        <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};
