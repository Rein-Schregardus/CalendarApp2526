import React from "react";

export interface ColumnConfig<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
  editable?: boolean;
  optionsKey?: string;
  options?: { id: number; label: string; value: string }[];
}

interface DataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  onAdd?: (item: Partial<T>) => void | Promise<void>;
  onUpdate?: (item: T) => void | Promise<void>;
  onDelete?: (item: T) => void | Promise<void>;
  onRowClick?: (item: T) => void | Promise<void>;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  onAdd,
  onDelete,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      {onAdd && (
        <button
          className="mb-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          onClick={() => onAdd({} as Partial<T>)}
        >
          Add
        </button>
      )}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="border px-3 py-2 text-left bg-secondary text-text"
              >
                {col.header}
              </th>
            ))}
            {onDelete && <th className="border px-3 py-2 bg-secondary text-text">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-secondary/50 cursor-pointer transition"
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={String(col.accessor)} className="px-3 py-2">
                  {col.render ? col.render(item) : String(item[col.accessor])}
                </td>
              ))}
              {onDelete && (
                <td className="px-3 py-2">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening drawer
                      onDelete(item);
                    }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
