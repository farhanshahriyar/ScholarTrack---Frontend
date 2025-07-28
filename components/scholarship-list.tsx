"use client"

import { useState } from "react"
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
  Calendar,
  DollarSign,
} from "lucide-react"
import type { Scholarship } from "@/app/page"
import { EditScholarshipDialog } from "@/components/edit-scholarship-dialog"
import { StatusUpdateDialog } from "@/components/status-update-dialog"

interface ScholarshipListProps {
  scholarships: Scholarship[]
  selectedScholarships: string[]
  onUpdate: (scholarship: Scholarship) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
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

export function ScholarshipList({
  scholarships,
  selectedScholarships,
  onUpdate,
  onDelete,
  onSelect,
}: ScholarshipListProps) {
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
      return { text: `${diffDays} days left`, urgent: true, className: "text-orange-600" }
    } else {
      return { text: date.toLocaleDateString(), urgent: false, className: "" }
    }
  }

  return (
    <>
      <div className="space-y-3">
        {scholarships.map((scholarship) => {
          const statusInfo = statusConfig[scholarship.status]
          const StatusIcon = statusInfo.icon
          const deadlineInfo = formatDeadline(scholarship.deadline)
          const isSelected = selectedScholarships.includes(scholarship.id)

          return (
            <Card key={scholarship.id} className={`group transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox checked={isSelected} onCheckedChange={() => onSelect(scholarship.id)} className="mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-6 truncate">{scholarship.institutionName}</h3>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">${scholarship.amount.toLocaleString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${deadlineInfo.className}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{deadlineInfo.text}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <Badge
                            variant={statusInfo.variant}
                            className={
                              scholarship.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                            }
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </div>

                        {scholarship.notes && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{scholarship.notes}</p>
                        )}
                      </div>

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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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
