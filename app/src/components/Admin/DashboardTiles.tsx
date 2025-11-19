const tiles = [
  { key: "users", label: "Manage Users" },
  { key: "roles", label: "Manage Roles" },
  { key: "groups", label: "Manage Groups" },
];

const DashboardTiles = ({ onSelect }: { onSelect: (key: string) => void }) => (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-1">
    {tiles.map((tile) => (
      <button
        key={tile.key}
        onClick={() => onSelect(tile.key)}
        className="bg-white rounded-2xl shadow-md flex items-center justify-center text-lg font-semibold hover:shadow-xl hover:bg-gray-100 transition-all duration-200 aspect-square"
      >
        {tile.label}
      </button>
    ))}
  </div>
);

export default DashboardTiles;