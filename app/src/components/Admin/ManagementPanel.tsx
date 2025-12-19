import UsersTile from "./UsersTile";
import RolesTile from "./RolesTile";
import GroupsTile from "./GroupsTile";
interface ManagementPanelProps {
  active: string;
  onBack: () => void;
  adminId: number;
}

const ManagementPanel = ({ active, onBack, adminId }: ManagementPanelProps) => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-auto scrollbar-hide">
      <button
        className="mb-4 text-[var(--color-accent)] font-medium hover:underline"
        onClick={onBack}
      >
        &larr; Back to Dashboard
      </button>

      {/* USERS */}
      {active === "users" && <UsersTile adminId={adminId} />}

      {/* ROLES */}
      {active === "roles" && <RolesTile adminId={adminId} />}

      {/* GROUPS */}
      {active === "groups" && <GroupsTile adminId={adminId} />}
    </div>
  );
};

export default ManagementPanel;
