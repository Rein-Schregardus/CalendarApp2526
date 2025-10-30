import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  faUserPlus,
  faUserTie,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import NavSideBar from "../components/NavSideBar";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminSection from "../components/Admin/AdminSection";
import { BaseForm, type FormField } from "../components/Forms/BaseForm";
import apiClient from "../helpers/apiClient";

// Typed fields
import {
  userFields,
  type UserFormData,
} from "../components/Forms/Fields/userFields";
import {
  roleFields,
  type RoleFormData,
} from "../components/Forms/Fields/roleFields";
import {
  groupFields,
  type GroupFormData,
} from "../components/Forms/Fields/groupFields";

// Generic SectionConfig
export type SectionConfig<TFormData, K extends string> = {
  key: K;
  title: string;
  description: string;
  icon: typeof faUserPlus;
  info?: string;
  fields: FormField<TFormData>[];
  renderItem: (item: TFormData, idx: number) => JSX.Element;
};

// Section form mapping for type safety
type SectionFormDataMap = {
  users: UserFormData;
  roles: RoleFormData;
  groups: GroupFormData;
};

// Map section keys to endpoints
const sectionEndpoints: Record<keyof SectionFormDataMap, string> = {
  users: "/Authenticate/Users",
  roles: "/api/Role",
  groups: "/api/Groups", // adjust if needed
};

// Define sections
const sections: (
  | SectionConfig<UserFormData, "users">
  | SectionConfig<RoleFormData, "roles">
  | SectionConfig<GroupFormData, "groups">
)[] = [
  {
    key: "users",
    title: "Manage Users",
    description: "Add/edit users",
    icon: faUserPlus,
    info: "120 users",
    fields: userFields,
    renderItem: (user, idx) => (
      <div key={idx} className="border p-2 rounded text-sm">
        {user.name} - {user.email} ({user.role})
      </div>
    ),
  },
  {
    key: "roles",
    title: "Manage Roles",
    description: "Manage roles",
    icon: faUserTie,
    info: "5 roles",
    fields: roleFields,
    renderItem: (role, idx) => (
      <div key={idx} className="border p-2 rounded text-sm">
        {role.roleName}
      </div>
    ),
  },
  {
    key: "groups",
    title: "Manage Groups",
    description: "Organize groups",
    icon: faLayerGroup,
    info: "12 groups",
    fields: groupFields,
    renderItem: (group, idx) => (
      <div key={idx} className="border p-2 rounded text-sm">
        {group.groupName}
      </div>
    ),
  },
];

type LogEntry = {
  action: "Created" | "Updated" | "Deleted";
  data: string;
  who: string;
  when: string;
};

const AdminPage = ({ adminName }: { adminName: string }) => {
  const [activeSectionKey, setActiveSectionKey] = useState<
    keyof SectionFormDataMap | null
  >(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const navigate = useNavigate();

  const addLog = (entry: Omit<LogEntry, "when">) => {
    const timestamp = new Date().toLocaleString();
    setLog((prev) => [{ ...entry, when: timestamp }, ...prev]);
  };

  const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome, {adminName}!</p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 font-medium text-sm hover:underline"
      >
        Go to Calendar App
      </button>
    </header>
  );

  if (!activeSectionKey) {
    return (
      <div className="h-screen flex bg-gray-50 text-gray-800">
        <NavSideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex flex-1 overflow-hidden px-6 py-4 gap-6">
            <div className="flex-1 overflow-y-auto">
              <AdminDashboard<keyof SectionFormDataMap>
                sections={sections.map((s) => ({
                  key: s.key,
                  title: s.title,
                  description: s.description,
                  icon: s.icon,
                  info: s.info,
                }))}
                onSelectSection={setActiveSectionKey}
              />
            </div>

            <div className="w-1/4 bg-white p-4 rounded shadow-sm overflow-y-auto max-h-full">
              <h2 className="text-lg font-semibold mb-3">Activity Log</h2>
              <ul className="space-y-3 text-gray-700 text-sm">
                {log.length === 0 ? (
                  <li className="text-gray-400 italic">No changes yet</li>
                ) : (
                  log.map((entry, idx) => (
                    <li
                      key={idx}
                      className={`p-3 rounded border-l-4 ${
                        entry.action === "Created"
                          ? "border-green-500 bg-green-50"
                          : entry.action === "Updated"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      <div className="font-medium">{entry.action}</div>
                      <div>{entry.data}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.who} • {entry.when}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active section & typed form data
  const activeSection = sections.find((s) => s.key === activeSectionKey)!;
  type ActiveFormData = SectionFormDataMap[typeof activeSection.key];

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      <NavSideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <AdminSection<ActiveFormData>
          title={activeSection.title}
          onBack={() => setActiveSectionKey(null)}
          fetchEndpoint={sectionEndpoints[activeSection.key]}
          renderDataItem={
            activeSection.renderItem as (item: ActiveFormData, idx: number) => JSX.Element
          }
          managementTiles={[
            {
              title: `Add ${activeSection.title}`,
              content: (
                <BaseForm<ActiveFormData>
                  fields={activeSection.fields as FormField<ActiveFormData>[]}
                  onSubmit={async (data) => {
                    const endpoint = sectionEndpoints[activeSection.key];

                    const result = await apiClient.post<ActiveFormData, ActiveFormData>(
                      endpoint,
                      data
                    );

                    if (result.error) {
                      console.error("API error:", result.error.message);
                    } else if (result.data) {
                      addLog({
                        action: "Created",
                        data: JSON.stringify(result.data),
                        who: adminName,
                      });
                    }
                  }}
                  submitLabel="Create"
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AdminPage;
