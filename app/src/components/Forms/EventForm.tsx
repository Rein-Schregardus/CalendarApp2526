import { BaseForm, type FormField, type ValidationRule } from "./BaseForm";

export interface EventDto {
  id: number;
  title: string;
  description?: string;
  date: string;       // ISO string 
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  locationId?: number;
  locationName?: string;

  [key: string]: unknown; // needed for BaseForm generic
}

interface EventFormProps {
  event?: EventDto;
  onSave?: (event: EventDto) => void;
}

export const EventForm = ({ event, onSave }: EventFormProps) => {
  // Validation rules
  const requiredRule: ValidationRule<EventDto> = {
    rule: (value) => (typeof value === "string" ? value.trim() !== "" : value !== undefined),
    message: "This field is required",
  };

  const maxLengthRule = (field: keyof EventDto, max: number): ValidationRule<EventDto> => ({
    rule: (value) => (typeof value === "string" ? value.length <= max : true),
    message: `${String(field)} cannot exceed ${max} characters`,
  });

  const endAfterStartRule: ValidationRule<EventDto> = {
    rule: (value, formData) => !formData?.startTime || !value || value >= formData.startTime,
    message: "End time cannot be before start time",
  };

  // Define fields with widths (for row layouts)
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
      name: "locationName",
      label: "Location",
      type: "text",
      width: "full",
      placeholder: "Location Name",
    },
  ];

  const initialValues: Partial<EventDto> = event ?? {
    id: 0,
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    locationId: 0,
    locationName: "",
  };

  return (
    <BaseForm<EventDto>
      fields={fields}
      initialValues={initialValues}
      onSubmit={(data) => onSave?.(data)}
      submitLabel="Create"
    />
  );
};
