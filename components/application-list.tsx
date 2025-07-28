"use client"

import { useState } from "react"
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
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
} from "lucide-react"
import type { Application } from "@/app/my-applications/page"
import { EditApplicationDialog } from "@/components/edit-application-dialog"

interface ApplicationListProps {
  applications: Application[]
  selectedApplications: string[]
  onUpdate: (application: Application) => void
  onDelete: (id: string) => void
  onDocumentUpload: (id: string) => void
  onScheduleInterview: (application: Application) => void
  onSelect: (id: string) => void
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
  urgent: { label: "Urgent", color: "text-red-600", bgColor: "bg-red-100" },
  high: { label: "High", color: "text-orange-600", bgColor: "bg-orange-100" },
  medium: { label: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  low: { label: "Low", color: "text-green-600", bgColor: "bg-green-100" },
}

export function ApplicationList({
  applications,
  selectedApplications,
  onUpdate,
  onDelete,
  onDocumentUpload,
  onScheduleInterview,
  onSelect,
}: ApplicationListProps) {
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
      return { text: `${diffDays} days left`, className: "text-orange-600" }
    } else {
      return { text: date.toLocaleDateString(), className: "" }
    }
  }

  return (
    <>
      <div className="space-y-3">
        {applications.map((application) => {
          const statusInfo = statusConfig[application.status]
          const priorityInfo = priorityConfig[application.priority]
          const StatusIcon = statusInfo.icon
          const deadlineInfo = formatDeadline(application.deadline)
          const isSelected = selectedApplications.includes(application.id)

          return (
            <Card key={application.id} className={`group transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox checked={isSelected} onCheckedChange={() => onSelect(application.id)} className="mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-6 truncate">{application.scholarshipName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{application.institutionName}</p>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">${application.amount.toLocaleString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${deadlineInfo.className}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{deadlineInfo.text}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{application.documents.length} docs</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <Badge
                            variant={statusInfo.variant}
                            className={
                              application.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                            }
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${priorityInfo.bgColor} ${priorityInfo.color} border-current`}
                          >
                            <Flag className="mr-1 h-3 w-3" />
                            {priorityInfo.label}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{application.progress}%</span>
                          </div>
                          <Progress value={application.progress} className="h-2" />
                        </div>

                        {application.notes && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{application.notes}</p>
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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
