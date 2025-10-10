import { useState, useEffect } from "react";
import { fetchHelper } from "../../helpers/fetchHelper";

interface EventDto {
  id: number;
  title: string;
  description?: string;
  date: string;        // ISO string
  startTime: string;   // "HH:mm" format
  endTime: string;     // "HH:mm" format
  locationId?: number;
  locationName?: string;
}

interface EventFormProps {
  event?: EventDto;
  onSave?: (event: EventDto) => void;
}

export const EventForm = ({ event, onSave }: EventFormProps) => {
  const initialFormData: EventDto = {
    id: event?.id || 0,
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    locationId: event?.locationId || 0,
    locationName: event?.locationName || "",
  };

  const [formData, setFormData] = useState<EventDto>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 🔍 Validate form fields whenever formData changes
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length > 100) newErrors.title = "Title cannot exceed 100 characters";

    if (formData.description && formData.description.length > 500)
      newErrors.description = "Description cannot exceed 500 characters";

    if (!formData.date) newErrors.date = "Date is required";

    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    if (formData.startTime && formData.endTime && formData.endTime < formData.startTime)
      newErrors.endTime = "End time cannot be before start time";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  // 🧠 Handle input change
  const handleChange = (field: keyof EventDto, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // 🧹 Clear form fields
  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // 💾 Submit to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const body = {
        id: 0, // auto-incremented by DB
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        locationId: formData.locationId ?? 0,
        locationName: formData.locationName,
        createdBy: 0, // backend fills this via JWT
        createdAt: new Date().toISOString(),
      };

      const savedEvent = await fetchHelper("/api/Events", {
        method: "POST",
        body: JSON.stringify(body),
      });

      console.log("✅ Event created:", savedEvent);
      if (onSave) onSave(savedEvent);

      // Reset form after save
      setFormData(initialFormData);
    } catch (error: any) {
      console.error("❌ Error saving event:", error);
      setSubmitError(error.message || "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="flex flex-col">
        <label className="font-semibold text-sm mb-1">Title *</label>
        <input
          type="text"
          placeholder="Event Title"
          className={`border p-2 rounded ${errors.title ? "border-red-500" : "border-gray-300"}`}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-semibold text-sm mb-1">Description</label>
        <textarea
          placeholder="Event Description"
          className={`border p-2 rounded resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
        />
        {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description}</span>}
      </div>

      {/* Date & Time */}
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col">
          <label className="font-semibold text-sm mb-1">Date *</label>
          <input
            type="date"
            className={`border p-2 rounded ${errors.date ? "border-red-500" : "border-gray-300"}`}
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date}</span>}
        </div>

        <div className="flex-1 flex flex-col">
          <label className="font-semibold text-sm mb-1">Start Time *</label>
          <input
            type="time"
            className={`border p-2 rounded ${errors.startTime ? "border-red-500" : "border-gray-300"}`}
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
          {errors.startTime && <span className="text-red-500 text-xs mt-1">{errors.startTime}</span>}
        </div>

        <div className="flex-1 flex flex-col">
          <label className="font-semibold text-sm mb-1">End Time *</label>
          <input
            type="time"
            className={`border p-2 rounded ${errors.endTime ? "border-red-500" : "border-gray-300"}`}
            value={formData.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
          />
          {errors.endTime && <span className="text-red-500 text-xs mt-1">{errors.endTime}</span>}
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col">
        <label className="font-semibold text-sm mb-1">Location</label>
        <input
          type="text"
          placeholder="Location Name"
          className="border p-2 rounded border-gray-300"
          value={formData.locationName}
          onChange={(e) => handleChange("locationName", e.target.value)}
        />
      </div>

      {/* Error display */}
      {submitError && <div className="text-red-500 text-sm">{submitError}</div>}

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 font-semibold"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`px-4 py-2 rounded text-white font-semibold ${
            isValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
