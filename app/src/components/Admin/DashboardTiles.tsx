import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShieldAlt, faUsers } from "@fortawesome/free-solid-svg-icons";

interface DashboardTilesProps {
  onSelect: (tab: string) => void;
}

const DashboardTiles = ({ onSelect }: DashboardTilesProps) => {
  const tiles = [
    { name: "Users", icon: faUser, key: "users" },
    { name: "Roles", icon: faShieldAlt, key: "roles" },
    { name: "Groups", icon: faUsers, key: "groups" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="cursor-pointer p-6 rounded-xl bg-primary border-secondary border
                     hover:bg-secondary  hover:text-white transition flex flex-col items-center justify-center shadow-md"
          onClick={() => onSelect(tile.key)}
        >
          <div className="text-4xl mb-2">
            <FontAwesomeIcon icon={tile.icon} />
          </div>
          <div className="font-semibold text-lg">{tile.name}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTiles;
