import { type FormField } from "../BaseForm";

export type UserFormData = {
  name: string;
  email: string;
  role: string;
};

const userFields: FormField<UserFormData>[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter user name",
    validations: [
      { rule: (v) => v.trim().length > 0, message: "Name is required" },
    ],
    width: "1/2",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email address",
    validations: [
      { rule: (v) => v.trim().length > 0, message: "Email is required" },
      {
        rule: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    ],
    width: "1/2",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "employee", label: "Employee" },
      { value: "manager", label: "Manager" },
    ],
    validations: [
      { rule: (v) => v !== "", message: "Role selection is required" },
    ],
    width: "1/3",
  },
];

export { userFields };
