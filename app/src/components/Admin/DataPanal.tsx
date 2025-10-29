import { useEffect, useState } from "react";
import apiClient from "../../helpers/apiClient";

type DataPanelProps<T> = {
  fetchEndpoint: string;
  title?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
};

const DataPanel = <T,>({
  fetchEndpoint,
  title,
  renderItem,
}: DataPanelProps<T>) => {
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-inner overflow-y-auto">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="space-y-2">
          {data.length === 0 ? (
            <p className="text-gray-400">No data found.</p>
          ) : (
            data.map(renderItem)
          )}
        </div>
      )}
    </div>
  );
};

export default DataPanel;
