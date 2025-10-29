import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../helpers/apiClient";
import SectionTile from "./SectionTile";

type ManagementTile = { title: string; content: React.ReactNode };

type AdminSectionProps<T> = {
  title: string;
  onBack: () => void;
  fetchEndpoint: string;
  renderDataItem: (item: T, index: number) => React.ReactNode;
  managementTiles: ManagementTile[];
};

const AdminSection = <T,>({
  title,
  onBack,
  fetchEndpoint,
  renderDataItem,
  managementTiles,
}: AdminSectionProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<T[]>(fetchEndpoint)
      .then((res) => setData(res.data ?? []))
      .catch((err) => setError(err?.message ?? "Error fetching data"))
      .finally(() => setLoading(false));
  }, [fetchEndpoint]);

  return (
    <div className="flex flex-col flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold capitalize">{title}</h2>
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 text-sm hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left: Data */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-inner overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Existing {title}</h3>
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="space-y-2">
              {data.length === 0 ? (
                <p className="text-gray-400">No data found.</p>
              ) : (
                data.map(renderDataItem)
              )}
            </div>
          )}
        </div>

        {/* Right: Management tiles */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {managementTiles.map((tile, idx) => (
            <SectionTile key={idx} title={tile.title}>
              {tile.content}
            </SectionTile>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
