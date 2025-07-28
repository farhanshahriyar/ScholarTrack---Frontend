"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MoreHorizontal,
  ExternalLink,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import type { Scholarship } from "@/app/page"
import { EditScholarshipDialog } from "@/components/edit-scholarship-dialog"
import { StatusUpdateDialog } from "@/components/status-update-dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface ScholarshipCardProps {
  scholarship: Scholarship
  onUpdate: (scholarship: Scholarship) => void
  onDelete: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string) => void
  showSelection?: boolean
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

export function ScholarshipCard({
  scholarship,
  onUpdate,
  onDelete,
  isSelected = false,
  onSelect,
  showSelection = false,
}: ScholarshipCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const statusInfo = statusConfig[scholarship.status]
  const StatusIcon = statusInfo.icon

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: "Expired", urgent: true }
    } else if (diffDays === 0) {
      return { text: "Due today", urgent: true }
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, urgent: true }
    } else {
      return { text: date.toLocaleDateString(), urgent: false }
    }
  }

  const deadlineInfo = formatDeadline(scholarship.deadline)

  return (
    <>
      <Card className={`group hover:shadow-md transition-shadow ${isSelected ? "ring-2 ring-primary" : ""}`}>
        <CardHeader className="pb-3">
          {showSelection && onSelect && (
            <div className="absolute top-3 left-3 z-10">
              <Checkbox checked={isSelected} onCheckedChange={() => onSelect(scholarship.id)} />
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-6 truncate">{scholarship.institutionName}</CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">${scholarship.amount.toLocaleString()}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${deadlineInfo.urgent ? "text-red-600" : ""}`}>
                    <Calendar className="h-4 w-4" />
                    <span>{deadlineInfo.text}</span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsStatusOpen(true)}>
                  <StatusIcon className="mr-2 h-4 w-4" />
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(scholarship.applicationLink, "_blank")}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge
                variant={statusInfo.variant}
                className={scholarship.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
              >
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusInfo.label}
              </Badge>
            </div>

            {scholarship.notes && <p className="text-sm text-muted-foreground line-clamp-2">{scholarship.notes}</p>}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsStatusOpen(true)} className="flex-1">
                <StatusIcon className="mr-2 h-4 w-4" />
                Update Status
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(scholarship.applicationLink, "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditScholarshipDialog
        scholarship={scholarship}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdate}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        scholarship={scholarship}
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        onUpdate={onUpdate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the scholarship "{scholarship.institutionName}" and all associated data. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(scholarship.id)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
