import { type FormField } from "../BaseForm";

export type GroupFormData = {
  groupName: string;
  userIds: string[]; // array of selected user IDs
};

export type UserOption = {
  id: string;
  username: string;
  fullName: string;
  email: string;
};

const groupFields: FormField<GroupFormData>[] = [
  {
    name: "groupName",
    label: "Group Name",
    type: "text",
    validations: [{ rule: (v) => (v as string).trim().length > 0, message: "Name required" }],
    width: "full",
    searchable: true,
    searchFunction: (option, search) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
  },
];

export { groupFields };
