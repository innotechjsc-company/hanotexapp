'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  searchable = true,
  filterable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  className = '',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const handleExport = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const exportData = selectedRows.length > 0 
      ? selectedRows.map(row => row.original)
      : data;
    
    const csv = convertToCSV(exportData);
    downloadCSV(csv, 'export.csv');
  };

  const convertToCSV = (data: T[]) => {
    if (data.length === 0) return '';
    
    const headers = columns.map(col => col.header as string).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = (row as any)[col.accessorKey as string];
        return `"${value || ''}"`;
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {filterable && (
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {exportable && (
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            )}
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-1 ${
                          header.column.getCanSort() ? 'cursor-pointer hover:text-gray-700' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronUp 
                              className={`h-3 w-3 ${
                                header.column.getIsSorted() === 'asc' ? 'text-blue-600' : 'text-gray-400'
                              }`} 
                            />
                            <ChevronDown 
                              className={`h-3 w-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc' ? 'text-blue-600' : 'text-gray-400'
                              }`} 
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
