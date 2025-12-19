import React, { useState } from "react";
import {  type ColumnConfig } from "./DataTable";

interface FoldableDataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  renderExpandedContent: (item: T) => React.ReactNode;
  onAdd?: (item: Partial<T>) => void | Promise<void>;
  onDelete?: (item: T) => void | Promise<void>;
}

export default function FoldableDataTable<T extends { id: number }>({
  columns,
  data,
  renderExpandedContent,
  onAdd,
  onDelete,
}: FoldableDataTableProps<T>) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const copy = new Set(expanded);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setExpanded(copy);
  };

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
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <tr className="border-b">
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="px-2 py-1">
                    {col.render ? col.render(item) : String(item[col.accessor])}
                  </td>
                ))}
                <td className="px-2 py-1 flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {expanded.has(item.id) ? "Collapse" : "Expand"}
                  </button>
                  {onDelete && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
              {expanded.has(item.id) && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-2 py-1 bg-gray-50">
                    {renderExpandedContent(item)}
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
