// "use client"

// import { Button } from "@/components/Button"
// import { Searchbar } from "@/components/Searchbar"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/Select"
// import { conditions, regions, statuses } from "@/data/data"
// import { TableDataLimits } from "@/lib/constants"
// import { formatters } from "@/lib/utils"
// import { RiDownloadLine } from "@remixicon/react"
// import { Table } from "@tanstack/react-table"
// import { useState } from "react"
// import { useDebouncedCallback } from "use-debounce"
// import { DataTableFilter } from "./DataTableFilter"
// import { ViewOptions } from "./DataTableViewOptions"

// interface DataTableToolbarProps<TData> {
//   table: Table<TData>
// }

// export function Filterbar<TData>({ table }: DataTableToolbarProps<TData>) {
//   const isFiltered = table.getState().columnFilters.length > 0
//   const [searchTerm, setSearchTerm] = useState<string>("")

//   const debouncedSetFilterValue = useDebouncedCallback((value) => {
//     table.getColumn("title")?.setFilterValue(value)
//   }, 300)

//   const handleSearchChange = (event: any) => {
//     const value = event.target.value
//     setSearchTerm(value)
//     debouncedSetFilterValue(value)
//   }

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
//       <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
//         {table.getColumn("status")?.getIsVisible() && (
//           <DataTableFilter
//             column={table.getColumn("status")}
//             title="Status"
//             options={statuses}
//             type="select"
//           />
//         )}
//         {table.getColumn("region")?.getIsVisible() && (
//           <DataTableFilter
//             column={table.getColumn("region")}
//             title="Region"
//             options={regions}
//             type="checkbox"
//           />
//         )}
//         {table.getColumn("costs")?.getIsVisible() && (
//           <DataTableFilter
//             column={table.getColumn("costs")}
//             title="Costs"
//             type="number"
//             options={conditions}
//             formatter={formatters.currency}
//           />
//         )}
//         {table.getColumn("title")?.getIsVisible() && (
//           <Searchbar
//             type="search"
//             placeholder="Search by owner..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="w-full sm:max-w-[250px] sm:[&>input]:h-[30px]"
//           />
//         )}
//         {isFiltered && (
//           <Button
//             variant="ghost"
//             onClick={() => table.resetColumnFilters()}
//             className="border border-gray-200 px-2 font-semibold text-indigo-600 sm:border-none sm:py-1 dark:border-gray-800 dark:text-indigo-500"
//           >
//             Clear filters
//           </Button>
//         )}
//       </div>
//       <div className="flex items-center gap-2">
//         <label className="text-sm font-medium text-white dark:text-gray-50">
//           Items per page
//         </label>
//         <Select
//           value={table.getState().pagination.pageSize.toString()}
//           onValueChange={(value) => table.setPageSize(Number(value))}
//         >
//           <SelectTrigger className="h-8 w-20">
//             <SelectValue placeholder="Select" />
//           </SelectTrigger>
//           <SelectContent align="end">
//             {TableDataLimits.map((limit) => (
//               <SelectItem key={limit.value} value={limit.value}>
//                 {limit.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Button
//           variant="secondary"
//           className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
//         >
//           <RiDownloadLine className="size-4 shrink-0" aria-hidden="true" />
//           Export
//         </Button>
//         <ViewOptions table={table} />
//       </div>
//     </div>
//   )
// }

const DataTableFilterbar = () => {
  return <div></div>;
};

export default DataTableFilterbar;
