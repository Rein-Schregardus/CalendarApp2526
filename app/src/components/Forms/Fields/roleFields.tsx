import { type FormField } from "../BaseForm";

export type RoleFormData = {
  roleName: string;
};

const roleFields: FormField<RoleFormData>[] = [
  {
    name: "roleName",
    label: "Role Name",
    type: "text",
    placeholder: "Enter role name",
    validations: [
      { rule: (v) => v.trim().length > 0, message: "Role name is required" },
    ],
    width: "1/2",
  },
];

export { roleFields };
