'use client';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  rowClassName?: string;
}

export default function Table({
  columns,
  data,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No items found',
  rowClassName = '',
}: TableProps) {
  if (isLoading) {
    return (
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <div className="divide-y divide-white/5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              {columns.map((col, j) => (
                <div key={j} className="flex-1">
                  <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty || data.length === 0) {
    return (
      <div className="border border-white/10 rounded-lg bg-slate-900/30 p-12 text-center">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-white/10 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-slate-900/30">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`hover:bg-slate-800/30 transition-colors ${rowClassName}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 text-sm ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                  }`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
