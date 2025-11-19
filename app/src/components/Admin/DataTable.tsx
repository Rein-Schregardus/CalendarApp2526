import { useState } from "react";

type Column<T> = {
  header: string;
  key: keyof T;
  editable?: boolean; // if false, field is read-only
  options?: { label: string; value: string | number }[]; // for foreign keys
};

type DataTableProps<T extends { id: string | number }> = {
  columns: Column<T>[];
  data: T[];
  onAdd: (row: Partial<T>) => void;
  onUpdate: (row: Partial<T> & { id: T["id"] }) => void;
  onDelete: (row: T) => void;
};

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onAdd,
  onUpdate,
  onDelete,
}: DataTableProps<T>) {
  const [newRow, setNewRow] = useState<Partial<T>>({});
  const [editingId, setEditingId] = useState<T["id"] | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<T>>({});

  const handleAddChange = <K extends keyof T>(key: K, value: string | number) => {
    setNewRow((prev) => ({ ...prev, [key]: value as T[K] }));
  };

  const handleEditChange = <K extends keyof T>(key: K, value: string | number) => {
    setEditedRow((prev) => ({ ...prev, [key]: value as T[K] }));
  };

  const handleAdd = () => {
    onAdd(newRow);
    setNewRow({});
  };

  const handleUpdate = () => {
    if (editingId !== null) {
      onUpdate({ ...(editedRow as Partial<T> & { id: T["id"] }) });
      setEditingId(null);
      setEditedRow({});
    }
  };

  const renderCellValue = (row: T, col: Column<T>, isEditing: boolean) => {
    const value = isEditing
      ? editedRow[col.key] ?? row[col.key]
      : row[col.key];

    if (isEditing && col.editable !== false) {
      if (col.options) {
        return (
          <select
            className="border rounded p-1 w-full"
            value={value as string | number | undefined}
            onChange={(e) => handleEditChange(col.key, e.target.value)}
          >
            <option value="">Select {col.header}</option>
            {col.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }
      return (
        <input
          className="border rounded p-1 w-full"
          value={value != null ? String(value) : ""}
          onChange={(e) => handleEditChange(col.key, e.target.value)}
        />
      );
    }

    // read-only display
    return value != null ? String(value) : "";
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className="border p-2 bg-gray-100 text-left"
            >
              {col.header}
            </th>
          ))}
          <th className="border p-2 bg-gray-100">Actions</th>
        </tr>
      </thead>

      <tbody>
        {/* Add row */}
        <tr className="bg-gray-50">
          {columns.map((col) => (
            <td key={String(col.key)} className="p-2 border">
              {col.options ? (
                <select
                  className="border rounded p-1 w-full"
                  value={newRow[col.key] as string | number | undefined ?? ""}
                  onChange={(e) => handleAddChange(col.key, e.target.value)}
                >
                  <option value="">Select {col.header}</option>
                  {col.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="border rounded p-1 w-full"
                  value={
                    newRow[col.key] != null ? String(newRow[col.key]) : ""
                  }
                  onChange={(e) => handleAddChange(col.key, e.target.value)}
                />
              )}
            </td>
          ))}
          <td className="p-2 border">
            <button
              className="px-2 py-1 bg-green-500 text-white rounded"
              onClick={handleAdd}
            >
              Add
            </button>
          </td>
        </tr>

        {/* Existing rows */}
        {data.map((row) => {
          const isEditing = editingId === row.id;
          return (
            <tr key={row.id} className={isEditing ? "bg-yellow-50" : ""}>
              {columns.map((col) => (
                <td key={String(col.key)} className="p-2 border">
                  {renderCellValue(row, col, isEditing)}
                </td>
              ))}
              <td className="p-2 border flex gap-2">
                {isEditing ? (
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => {
                      setEditingId(row.id);
                      setEditedRow(row);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => onDelete(row)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
