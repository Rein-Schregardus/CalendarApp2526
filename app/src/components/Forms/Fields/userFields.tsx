import { type FormField } from "../BaseForm";
import { useRoles } from "../../../hooks/useRoles";

export type UserFormData = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  roleName: string;
};

export function useUserFields(): FormField<UserFormData>[] {
  const { roles, loading } = useRoles();

  return [
    {
      name: "fullName",
      label: "Full name",
      type: "text",
      placeholder: "John Doe",
      validations: [
        { rule: (v) => v.trim().length > 0, message: "Full name is required" },
      ],
      width: "1/2",
    },
    {
      name: "userName",
      label: "User name",
      type: "text",
      placeholder: "johndoe",
      validations: [
        { rule: (v) => v.trim().length > 0, message: "User name is required" },
      ],
      width: "1/2",
    },
    {
      name: "email",
      label: "Email address",
      type: "text",
      placeholder: "johndoe@example.com",
      validations: [
        { rule: (v) => v.trim().length > 0, message: "Email address is required" },
        {
          rule: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: "Invalid email format",
        },
      ],
      width: "full",
    },
    {
      name: "roleName",
      label: "Role",
      type: "select",
      options: loading
        ? [{ value: "", label: "Loading roles..." }]
        : roles.map((role) => ({
            value: role.id.toString(),
            label: role.roleName,
          })),
      placeholder: "Select a role",
      validations: [
        { rule: (v) => v !== "", message: "Role selection is required" },
      ],
      width: "1/3",
    },
    {
      name: "password",
      label: "Password",
      type: "text",
      validations: [
        { rule: (v) => v.trim().length > 0, message: "Password is required" },
        { rule: (v) => v.trim().length >= 8, message: "Password must be at least 8 characters" },
        { rule: (v) => /[A-Z]/.test(v), message: "Password must contain at least one uppercase letter" },
        { rule: (v) => /[a-z]/.test(v), message: "Password must contain at least one lowercase letter" },
        { rule: (v) => /[0-9]/.test(v), message: "Password must contain at least one number" },
        { rule: (v) => /[\W_]/.test(v), message: "Password must contain at least one special character" },
      ],
      width: "2/3",
    }
  ];
}
