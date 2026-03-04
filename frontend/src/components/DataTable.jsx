import { ChevronLeft, ChevronRight, Loader2, Database } from "lucide-react";

/**
 * DataTable Component
 * Reusable table for admin pages with pagination
 */
const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  emptyMessage = "No data found",
  emptyIcon: EmptyIcon = Database,
}) => {
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-3 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white shadow-sm">
        <div className="text-center">
          <EmptyIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {/* Table wrapper with horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                className="transition-colors hover:bg-gray-50"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-gray-700 ${
                      column.cellClassName || ""
                    }`}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : column.accessor
                        ? row[column.accessor]
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Page numbers */}
            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
