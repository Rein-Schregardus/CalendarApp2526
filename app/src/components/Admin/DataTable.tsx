import React from "react";

export interface ColumnConfig<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
  editable?: boolean;
}

interface DataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  onAdd?: (item: Partial<T>) => void | Promise<void>;
  onUpdate?: (item: T) => void | Promise<void>;
  onDelete?: (item: T) => void | Promise<void>;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  onAdd,
  onUpdate,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div>
      {onAdd && (
        <button
          className="mb-2 bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => onAdd({} as Partial<T>)}
        >
          Add
        </button>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)} className="border px-2 py-1 text-left">
                {col.header}
              </th>
            ))}
            {(onUpdate || onDelete) && <th className="border px-2 py-1">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              {columns.map((col) => (
                <td key={String(col.accessor)} className="px-2 py-1">
                  {col.render ? col.render(item) : String(item[col.accessor])}
                </td>
              ))}
              {(onUpdate || onDelete) && (
                <td className="px-2 py-1 flex gap-2">
                  {onUpdate && (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => onUpdate(item)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
