"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import z from "zod"
import { ChangeStatus } from "./change-status"

export type Payment = {
  id: number
  title: string
  quantity: number
  email: string
  status: "Pendiente" | "Enviado" | "Entregado"
  purchasedAt: string
  city: string | null
  indications: string | null
  postalCode: string | null
  state: string | null
  street: string | null
  streetNumber: number | null
  delivery: boolean
  phone: string | null
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Telefono
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Producto
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "purchasedAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Comprado el
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateString = z.string().parse(row.getValue("purchasedAt"))
      const date = new Date(dateString.replace(" ", "T"))
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()

      return <div className="font-medium">{`${day}/${month}/${year}`}</div>
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(z.string().parse(rowA.getValue(columnId)).replace(" ", "T")).getTime()
      const dateB = new Date(z.string().parse(rowB.getValue(columnId)).replace(" ", "T")).getTime()
      return dateA - dateB
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div>Cantidad</div>,
    cell: ({ row }) => {
      const amount = Number.parseInt(row.getValue("quantity"))

      return <div className="font-medium">{amount}</div>
    },
  },
  {
    accessorKey: "address",
    header: () => <div>Dirección</div>,
    cell: ({ row }) => {
      if (!row.original.delivery) return <div>Retiro en deposito</div>
      return (
        <div className="font-medium">
          <p>{row.original.state}</p>
          <p>{row.original.city}</p>
          <p>
            {row.original.street} {row.original.streetNumber}
          </p>
          <p>Codigo postal: {row.original.postalCode}</p>
          <p>{row.original.indications}</p>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ChangeStatus id={row.original.id} status={row.original.status} />
    },
  },
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString.replace(" ", "T"))
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "Enviado":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "Entregado":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const MobileCard = ({
  order,
  isSelected,
  onSelect,
}: {
  order: Payment
  isSelected: boolean
  onSelect: (value: boolean) => void
}) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} aria-label="Select order" />
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>
        <ChangeStatus id={order.id} status={order.status} />
      </div>

      <div className="space-y-2">
        <div>
          <p className="font-semibold text-sm text-gray-600">Producto</p>
          <p className="font-medium">{order.title}</p>
        </div>

          <div>
            <p className="font-semibold text-sm text-gray-600">Email</p>
            <p className="text-sm">{order.email}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-600">Teléfono</p>
            <p className="text-sm">{order.phone || "N/A"}</p>
          </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-sm text-gray-600">Cantidad</p>
            <p className="text-sm">{order.quantity}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-600">Fecha</p>
            <p className="text-sm">{formatDate(order.purchasedAt)}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-600">Dirección</p>
          {!order.delivery ? (
            <p className="text-sm">Retiro en depósito</p>
          ) : (
            <div className="text-sm">
              <p>
                {order.state}, {order.city}
              </p>
              <p>
                {order.street} {order.streetNumber}
              </p>
              {order.postalCode && <p>CP: {order.postalCode}</p>}
              {order.indications && <p>{order.indications}</p>}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

export function DataTableDemo({ data }: { data: Payment[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto hidden md:flex bg-transparent">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <MobileCard
                key={row.id}
                order={row.original}
                isSelected={row.getIsSelected()}
                onSelect={(value) => row.toggleSelected(value)}
              />
            ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay resultados.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previo
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
