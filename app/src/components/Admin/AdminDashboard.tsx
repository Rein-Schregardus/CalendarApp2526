import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type TIcon = Parameters<typeof FontAwesomeIcon>[0]["icon"];

// Generic Section type
export type Section<K extends string = string> = {
  key: K;
  title: string;
  description: string;
  icon: TIcon;
  info?: string;
};

// Generic props for AdminDashboard
export type AdminDashboardProps<K extends string> = {
  sections: Section<K>[];
  onSelectSection: (key: K) => void;
};

const AdminDashboard = <K extends string>({
  sections,
  onSelectSection,
}: AdminDashboardProps<K>) => (
  <div className="p-4 sm:p-6 lg:p-8">
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
    >
      {sections.map((section) => (
        <div
          key={section.key}
          onClick={() => onSelectSection(section.key)}
          className="cursor-pointer bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 
                     flex flex-col justify-between p-6 aspect-square"
        >
          {/* Top content */}
          <div className="flex flex-col space-y-2">
            <FontAwesomeIcon icon={section.icon} className="text-4xl text-accent" />
            <span className="text-lg font-semibold break-words">{section.title}</span>
            <span className="text-gray-500 text-sm break-words">{section.description}</span>
          </div>

          {/* Section info at bottom */}
          {section.info && (
            <span className="text-gray-700 text-sm font-medium mt-2 bg-gray-100 px-2 py-1 rounded inline-block">
              {section.info}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
