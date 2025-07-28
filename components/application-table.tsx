"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Upload,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { Application } from "@/app/my-applications/page"
import { EditApplicationDialog } from "@/components/edit-application-dialog"

interface ApplicationTableProps {
  applications: Application[]
  selectedApplications: string[]
  onUpdate: (application: Application) => void
  onDelete: (id: string) => void
  onDocumentUpload: (id: string) => void
  onScheduleInterview: (application: Application) => void
  onSelect: (id: string) => void
  onSelectAll: () => void
  sortField: string
  sortOrder: "asc" | "desc"
  onSort: (field: any) => void
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "secondary" as const,
    icon: FileText,
    color: "text-gray-600",
  },
  submitted: {
    label: "Submitted",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-blue-600",
  },
  "under-review": {
    label: "Under Review",
    variant: "default" as const,
    icon: Clock,
    color: "text-yellow-600",
  },
  "interview-scheduled": {
    label: "Interview Scheduled",
    variant: "default" as const,
    icon: Calendar,
    color: "text-purple-600",
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
  waitlisted: {
    label: "Waitlisted",
    variant: "default" as const,
    icon: AlertTriangle,
    color: "text-orange-600",
  },
}

const priorityConfig = {
  urgent: { label: "Urgent", color: "text-red-600" },
  high: { label: "High", color: "text-orange-600" },
  medium: { label: "Medium", color: "text-yellow-600" },
  low: { label: "Low", color: "text-green-600" },
}

export function ApplicationTable({
  applications,
  selectedApplications,
  onUpdate,
  onDelete,
  onDocumentUpload,
  onScheduleInterview,
  onSelect,
  onSelectAll,
  sortField,
  sortOrder,
  onSort,
}: ApplicationTableProps) {
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: "Expired", className: "text-red-600" }
    } else if (diffDays === 0) {
      return { text: "Due today", className: "text-red-600" }
    } else if (diffDays <= 7) {
      return { text: `${diffDays}d left`, className: "text-orange-600" }
    } else {
      return { text: date.toLocaleDateString(), className: "" }
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
                    checked={selectedApplications.length === applications.length && applications.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => onSort("scholarshipName")}
                    className="h-auto p-0 font-semibold"
                  >
                    Scholarship
                    {getSortIcon("scholarshipName")}
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
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort("priority")} className="h-auto p-0 font-semibold">
                    Priority
                    {getSortIcon("priority")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort("progress")} className="h-auto p-0 font-semibold">
                    Progress
                    {getSortIcon("progress")}
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => {
                const statusInfo = statusConfig[application.status]
                const priorityInfo = priorityConfig[application.priority]
                const StatusIcon = statusInfo.icon
                const deadlineInfo = formatDeadline(application.deadline)

                return (
                  <TableRow key={application.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedApplications.includes(application.id)}
                        onCheckedChange={() => onSelect(application.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <div className="font-medium truncate">{application.scholarshipName}</div>
                        <div className="text-sm text-muted-foreground truncate">{application.institutionName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${application.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${deadlineInfo.className}`}>{deadlineInfo.text}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusInfo.variant}
                        className={
                          application.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                        }
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityInfo.color}>
                        <Flag className="mr-1 h-3 w-3" />
                        {priorityInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{application.progress}%</span>
                        </div>
                        <Progress value={application.progress} className="h-1" />
                      </div>
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
                          <DropdownMenuItem onClick={() => setEditingApplication(application)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDocumentUpload(application.id)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onScheduleInterview(application)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(application.applicationLink, "_blank")}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Application
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(application.id)} className="text-red-600">
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
      {editingApplication && (
        <EditApplicationDialog
          application={editingApplication}
          open={!!editingApplication}
          onOpenChange={(open) => !open && setEditingApplication(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
