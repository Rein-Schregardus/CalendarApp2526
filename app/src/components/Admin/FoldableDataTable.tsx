import { useState } from "react";
import { type DataTableProps } from "./DataTable";

type FoldableProps<T extends { id: string | number }> = Omit<DataTableProps<T>, "onUpdate"> & {
  renderExpandedContent: (row: T) => React.ReactNode;
};

export default function FoldableDataTable<T extends { id: string | number }>({
  columns,
  data,
  onAdd,
  onDelete,
  renderExpandedContent,
}: FoldableProps<T>) {
  const [expanded, setExpanded] = useState<Set<T["id"]>>(new Set());

  const toggle = (id: T["id"]) => {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpanded(next);
  };

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-10"></th>
            {columns.map((col, i) => (
              <th key={i} className="border p-2 bg-gray-100 text-left">
                {col.header}
              </th>
            ))}
            <th className="border p-2 bg-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <>
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggle(row.id)}
              >
                <td className="border p-2 text-center">
                  {expanded.has(row.id) ? "▼" : "▶"}
                </td>

                {columns.map((col, i) => (
                  <td key={i} className="border p-2">
                    {String(row[col.key])}
                  </td>
                ))}

                <td className="border p-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent folding
                      onDelete(row);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {expanded.has(row.id) && (
                <tr key={`${row.id}-expanded`}>
                  <td colSpan={columns.length + 2} className="border p-2 bg-gray-50">
                    {renderExpandedContent(row)}
                  </td>
                </tr>
              )}
            </>
          ))}

          {/* Add row */}
          <tr className="bg-gray-100">
            <td className="border p-2"></td>

            {columns.map((col, i) => (
              <td key={i} className="border p-2">
                {col.editable !== false && !col.options && (
                  <input
                    className="border rounded p-1 w-full"
                    onChange={(e) =>
                      onAdd({ [col.key]: e.target.value } as Partial<T>)
                    }
                  />
                )}
              </td>
            ))}

            <td className="border p-2">
              <button className="px-2 py-1 bg-green-500 text-white rounded">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
