"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { Scholarship } from "@/app/page"
import { EditScholarshipDialog } from "@/components/edit-scholarship-dialog"
import { StatusUpdateDialog } from "@/components/status-update-dialog"

interface ScholarshipTableProps {
  scholarships: Scholarship[]
  selectedScholarships: string[]
  onUpdate: (scholarship: Scholarship) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onSelectAll: () => void
  sortField: string
  sortOrder: "asc" | "desc"
  onSort: (field: any) => void
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-600",
  },
  applied: {
    label: "Applied",
    variant: "default" as const,
    icon: AlertCircle,
    color: "text-blue-600",
  },
  approved: {
    label: "Approved",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600",
  },
}

export function ScholarshipTable({
  scholarships,
  selectedScholarships,
  onUpdate,
  onDelete,
  onSelect,
  onSelectAll,
  sortField,
  sortOrder,
  onSort,
}: ScholarshipTableProps) {
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null)
  const [statusUpdateScholarship, setStatusUpdateScholarship] = useState<Scholarship | null>(null)

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: "Expired", urgent: true, className: "text-red-600" }
    } else if (diffDays === 0) {
      return { text: "Due today", urgent: true, className: "text-red-600" }
    } else if (diffDays <= 7) {
      return { text: `${diffDays}d left`, urgent: true, className: "text-orange-600" }
    } else {
      return { text: date.toLocaleDateString(), urgent: false, className: "" }
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedScholarships.length === scholarships.length && scholarships.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => onSort("institutionName")}
                    className="h-auto p-0 font-semibold"
                  >
                    Institution
                    {getSortIcon("institutionName")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort("amount")} className="h-auto p-0 font-semibold">
                    Amount
                    {getSortIcon("amount")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort("deadline")} className="h-auto p-0 font-semibold">
                    Deadline
                    {getSortIcon("deadline")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort("status")} className="h-auto p-0 font-semibold">
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholarships.map((scholarship) => {
                const statusInfo = statusConfig[scholarship.status]
                const StatusIcon = statusInfo.icon
                const deadlineInfo = formatDeadline(scholarship.deadline)

                return (
                  <TableRow key={scholarship.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedScholarships.includes(scholarship.id)}
                        onCheckedChange={() => onSelect(scholarship.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium truncate">{scholarship.institutionName}</div>
                        {scholarship.notes && (
                          <div className="text-sm text-muted-foreground truncate mt-1">{scholarship.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${scholarship.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${deadlineInfo.className}`}>{deadlineInfo.text}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusInfo.variant}
                        className={
                          scholarship.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                        }
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setStatusUpdateScholarship(scholarship)}>
                            <StatusIcon className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingScholarship(scholarship)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(scholarship.applicationLink, "_blank")}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(scholarship.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingScholarship && (
        <EditScholarshipDialog
          scholarship={editingScholarship}
          open={!!editingScholarship}
          onOpenChange={(open) => !open && setEditingScholarship(null)}
          onUpdate={onUpdate}
        />
      )}

      {/* Status Update Dialog */}
      {statusUpdateScholarship && (
        <StatusUpdateDialog
          scholarship={statusUpdateScholarship}
          open={!!statusUpdateScholarship}
          onOpenChange={(open) => !open && setStatusUpdateScholarship(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
