import { useEffect, useState } from "react";
import { BaseForm } from "../Forms/BaseForm";
import apiClient from "../../helpers/apiClient";

const CrudSection = ({ title, fields, endpoints, onBack }) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const res = await apiClient.get(endpoints.fetch);
    if (res.data) setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data) => {
    const res = await apiClient.post(endpoints.create, data);
    if (res.data) load();
  };

  const handleUpdate = async (data) => {
    const res = await apiClient.put(`${endpoints.update}/${selected.id}`, data);
    if (res.data) {
      setSelected(null);
      load();
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    await apiClient.delete(`${endpoints.update}/${selected.id}`);
    setSelected(null);
    load();
  };

  return (
    <div className="flex-1 p-6">
      <button className="mb-4 text-blue-600" onClick={onBack}>← Back</button>
      <h2 className="text-xl font-semibold mb-4">Manage {title}</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow overflow-auto max-h-[75vh]">
          <h3 className="text-lg font-medium mb-3">Records</h3>
          <ul className="space-y-2">
            {items.map((x) => (
              <li
                key={x.id}
                onClick={() => setSelected(x)}
                className={`p-3 border rounded cursor-pointer ${selected?.id === x.id ? "bg-blue-50 border-blue-500" : "bg-white"}`}
              >
                {Object.values(x).join(" • ")}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          {selected ? (
            <>
              <h3 className="text-lg font-medium mb-3">Update {title}</h3>
              <BaseForm fields={fields} initialData={selected} onSubmit={handleUpdate} submitLabel="Update" />
              <button onClick={handleDelete} className="mt-4 text-red-600 underline">Delete</button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-3">Add {title}</h3>
              <BaseForm fields={fields} onSubmit={handleCreate} submitLabel="Create" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrudSection;