import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import { AsyncBoundary } from "@/components/async-boundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { inviteQueryKeyFn, useApiInvite, useApiInviteDelete, useApiInviteSend } from "@/gen";
import { useApiInvalidate } from "@/hooks/use-api-invalidate";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { useToast } from "@/hooks/use-toast";
import { isPast } from "@/lib/date";
import { Permission } from "@snipet/permission";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import type { InviteEntity, TenantEntity } from "@/gen";
import type {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState
} from "@tanstack/react-table";
export const InvitesTable = () => {
  const { tenant, isLoading, error } = useTenant();
  return (
    <AsyncBoundary isLoading={isLoading} error={error}>
      <Component tenant={tenant!} />
    </AsyncBoundary>
  )
}

const empty: InviteEntity[] = [];
const Component = ({ tenant }: { tenant: TenantEntity }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({});
  const { data: invites } = useApiInvite({ tenantId: tenant.id, params: { relations: ["role"] } });
  const { mutate: deleteInvite } = useApiInviteDelete();
  const { mutate: createInvite } = useApiInviteSend();

  const invalidate = useApiInvalidate();

  const { toast } = useToast();
  const { canInTenant } = useAuth();
  
  const handleResend = (email: string, roleId: string) => {
    createInvite({
      tenantId: tenant.id,
      data: { emails: [{ email, roleId }] }
    }, { 
      onSuccess: () => {
        toast({ title: "Invite sent", description: "The invite has been sent." })
        invalidate(inviteQueryKeyFn({ tenantId: tenant.id }));
      }
    })
  }

  const handleCancel = (id: string) => {
    deleteInvite(
      { tenantId: tenant.id, id },
      {
        onSuccess: () => {
          toast({ title: "Invite canceled", description: "The invite has been canceled." })
          invalidate(inviteQueryKeyFn({ tenantId: tenant.id }));
        }
      }
    );
  }

  const inviteColumns: ColumnDef<InviteEntity>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <span className="capitalize">{row.original.role?.name}</span>
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Status",
      cell: ({ row }) => {
        if (moment(row.original.expiresAt).isAfter(moment())) {
          return <Badge variant="outline">Active</Badge>
        }
        return <Badge variant="outline" className="text-destructive border-destructive">Expired</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return canInTenant(Permission.DELETE_INVITE) ? (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                  isPast(row.original.expiresAt) && (
                    <DropdownMenuItem onClick={() => handleResend(row.original.email, row.original.roleId)}>
                      Resend
                    </DropdownMenuItem>
                  )
                }
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleCancel(row.getValue("id"))}>
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null
      },
    },
  ]

  const invitesTable = useReactTable({
    data: invites ?? empty,
    columns: inviteColumns,
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
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {invitesTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {invitesTable.getRowModel().rows?.length ? (
              invitesTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={inviteColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {invitesTable.getFilteredRowModel().rows.length} invite(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => invitesTable.previousPage()}
            disabled={!invitesTable.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => invitesTable.nextPage()}
            disabled={!invitesTable.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}