import { useState, useEffect, type JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export type ValidationRule<T> = {
  rule: (value: T[keyof T], formData?: T) => boolean;
  message: string;
};

export type FormField<T> = {
  name: keyof T;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "time" | "select" | "multiselect";
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  component?: JSX.Element;
  validations?: ValidationRule<T>[];
  width?: "full" | "1/2" | "1/3" | "2/3";
  multiple?: boolean; // for multiselect
  searchable?: boolean;
  searchFunction?: (option: { value: string | number; label: string }, search: string) => boolean;
};

interface BaseFormProps<T extends Record<string, unknown>> {
  fields: FormField<T>[];
  initialValues?: Partial<T>;
  onSubmit: (data: T) => void;
  submitLabel?: string;
  extraButtons?: JSX.Element;
}

export function BaseForm<T extends Record<string, unknown>>({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = "Submit",
}: BaseFormProps<T>) {
  const [formData, setFormData] = useState<T>(() => ({
    ...fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === "multiselect" ? [] : "" }), {} as T),
    ...initialValues,
  }));

  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      if (field.validations) {
        for (const v of field.validations) {
          if (!v.rule(value, formData)) {
            newErrors[field.name] = v.message;
            break;
          }
        }
      }
    });

    setErrors(newErrors as Record<keyof T, string>);

    const requiredFields = fields.filter((f) =>
      f.validations?.some((v) => v.message.toLowerCase().includes("required"))
    );

    const validRequiredCount = requiredFields.filter(
      (f) => !(f.name in newErrors) && formData[f.name] !== ""
    ).length;

    const percentage = Math.round((validRequiredCount / requiredFields.length) * 100);
    setProgress(percentage);
  }, [formData, fields]);

  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      ...fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === "multiselect" ? [] : "" }), {} as T),
      ...initialValues,
    });
    setErrors({} as Record<keyof T, string>);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
      handleClear();
    }
  };

  const getFlexWidth = (width?: string) => {
    switch (width) {
      case "1/2": return "w-[calc(50%-0.5rem)]";
      case "1/3": return "w-[calc(33.33%-0.66rem)]";
      case "2/3": return "w-[calc(66.66%-0.66rem)]";
      case "full":
      default: return "w-full";
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded transition-all duration-1000 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: progress < 40 ? "#ef4444" : progress < 80 ? "#facc15" : "#22c55e",
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field) => {
          const value = formData[field.name];
          const error = errors[field.name];
          const flexClass = getFlexWidth(field.width);

          if (field.component) {
            return (
              <div key={String(field.name)} className={`${flexClass} flex flex-col`}>
                {field.component}
                {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
              </div>
            );
          }

          return (
            <div key={String(field.name)} className={`${flexClass} flex flex-col`}>
              <label className="font-semibold text-sm mb-1">{field.label}</label>

              {field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  className={`border p-2 rounded resize-none ${error ? "border-red-500" : "border-gray-300"}`}
                  value={value as string}
                  onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
                  rows={4}
                />
              ) : field.type === "select" || field.type === "multiselect" ? (
                <select
                  multiple={field.type === "multiselect"}
                  value={value as string | string[] | number}
                  onChange={(e) => {
                    if (field.type === "multiselect") {
                      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                      handleChange(field.name, selected as T[keyof T]);
                    } else {
                      handleChange(field.name, e.target.value as T[keyof T]);
                    }
                  }}
                  className={`border p-2 rounded ${error ? "border-red-500" : "border-gray-300"}`}
                >
                  {!field.multiple && <option value="">Select</option>}
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className={`border p-2 rounded ${error ? "border-red-500" : "border-gray-300"}`}
                  value={value as string | number}
                  onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
                />
              )}

              {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            </div>
          );
        })}
      </div>

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
          className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded font-semibold text-white transition-all duration-300
            ${Object.keys(errors).length === 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={Object.keys(errors).length > 0}
        >
          <FontAwesomeIcon icon={faCheck} /> {submitLabel}
        </button>
      </div>
    </form>
  );
}
