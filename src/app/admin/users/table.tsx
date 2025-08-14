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
import type { SelectUser } from "@/db/schema"

export const columns: ColumnDef<SelectUser>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name") || "Sin nombre"}</div>,
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
    accessorKey: "dni",
    header: "DNI",
    cell: ({ row }) => <div>{row.getValue("dni") || "No registrado"}</div>,
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
    cell: ({ row }) => <div>{row.getValue("phone") || "No registrado"}</div>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ciudad
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("city") || "No registrada"}</div>,
  },
  {
    accessorKey: "address",
    header: () => <div>Dirección Completa</div>,
    cell: ({ row }) => {
      const hasAddress = row.original.street && row.original.streetNumber

      if (!hasAddress) {
        return <div className="text-muted-foreground">Sin dirección registrada</div>
      }

      return (
        <div className="font-medium space-y-1">
          <div className="font-semibold">
            {row.original.street} {row.original.streetNumber}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.city}, {row.original.state}
          </div>
          <div className="text-sm text-muted-foreground">CP: {row.original.postalCode}</div>
          {row.original.indications && <div className="text-sm text-blue-600">📝 {row.original.indications}</div>}
        </div>
      )
    },
  },
  {
    accessorKey: "deliveryStatus",
    header: "Estado Delivery",
    cell: ({ row }) => {
      const hasCompleteAddress =
        row.original.street &&
        row.original.streetNumber &&
        row.original.city &&
        row.original.state &&
        row.original.postalCode &&
        row.original.dni &&
        row.original.phone

      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            hasCompleteAddress ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {hasCompleteAddress ? "✅ Completo" : "❌ Incompleto"}
        </div>
      )
    },
  },
]

function MobileUserCard({ user }: { user: SelectUser }) {
  const hasCompleteAddress =
    user.street && user.streetNumber && user.city && user.state && user.postalCode && user.dni && user.phone

  const hasAddress = user.street && user.streetNumber

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header con nombre y email */}
          <div className="flex flex-col space-y-1">
            <h3 className="font-semibold text-lg capitalize">{user.name || "Sin nombre"}</h3>
            <p className="text-sm text-muted-foreground lowercase">{user.email}</p>
          </div>

          {/* Estado de delivery */}
          <div className="flex justify-start">
            <Badge
              variant={hasCompleteAddress ? "default" : "destructive"}
              className={
                hasCompleteAddress
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }
            >
              {hasCompleteAddress ? "✅ Completo" : "❌ Incompleto"}
            </Badge>
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">DNI:</span>
              <p className="mt-1">{user.dni || "No registrado"}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Teléfono:</span>
              <p className="mt-1">{user.phone || "No registrado"}</p>
            </div>
          </div>

          {/* Dirección */}
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Dirección:</span>
            {hasAddress ? (
              <div className="mt-1 space-y-1">
                <p className="font-medium">
                  {user.street} {user.streetNumber}
                </p>
                <p className="text-muted-foreground">
                  {user.city}, {user.state}
                </p>
                <p className="text-muted-foreground">CP: {user.postalCode}</p>
                {user.indications && <p className="text-blue-600">📝 {user.indications}</p>}
              </div>
            ) : (
              <p className="mt-1 text-muted-foreground">Sin dirección registrada</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function UsersTable({ data }: { data: SelectUser[] }) {
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
          placeholder="Buscar por email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-transparent hidden md:flex">
              Columnas <ChevronDown />
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

      <div className="md:hidden">
        {table.getRowModel().rows?.length ? (
          <div className="space-y-4">
            {table.getRowModel().rows.map((row) => (
              <MobileUserCard key={row.id} user={row.original} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No hay resultados.</div>
        )}
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
