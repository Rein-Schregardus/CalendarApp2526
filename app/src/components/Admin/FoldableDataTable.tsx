import React from "react";
import { useState } from "react";
import { type DataTableProps } from "./DataTable";

type FoldableProps<T extends { id: string | number }> = Omit<
  DataTableProps<T>,
  "onUpdate"
> & {
  renderExpandedContent: (row: T) => React.ReactNode;
};

export default function FoldableDataTable<T extends { id: string | number }>({
  columns,
  data,
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
            <React.Fragment key={row.id}>
              <tr
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggle(row.id)}
              >
                <td className="border p-2 text-center">
                  {expanded.has(row.id) ? "▼" : "▶"}
                </td>

                {columns.map((col) => (
                  <td key={col.key as string} className="border p-2">
                    {String(row[col.key])}
                  </td>
                ))}

                <td className="border p-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {expanded.has(row.id) && (
                <tr key={`${row.id}-expanded`}>
                  <td
                    colSpan={columns.length + 2}
                    className="border p-2 bg-gray-50"
                  >
                    {renderExpandedContent(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
