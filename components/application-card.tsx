"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  ExternalLink,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Upload,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Video,
  Phone,
  Users,
} from "lucide-react"
import type { Application } from "@/app/my-applications/page"
import { EditApplicationDialog } from "@/components/edit-application-dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface ApplicationCardProps {
  application: Application
  onUpdate: (application: Application) => void
  onDelete: (id: string) => void
  onDocumentUpload: (id: string) => void
  onScheduleInterview: (application: Application) => void
  isSelected?: boolean
  onSelect?: (id: string) => void
  showSelection?: boolean
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

export function ApplicationCard({
  application,
  onUpdate,
  onDelete,
  onDocumentUpload,
  onScheduleInterview,
  isSelected = false,
  onSelect,
  showSelection = false,
}: ApplicationCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const statusInfo = statusConfig[application.status]
  const priorityInfo = priorityConfig[application.priority]
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

  const deadlineInfo = formatDeadline(application.deadline)

  const getInterviewIcon = () => {
    switch (application.interviewType) {
      case "video":
        return Video
      case "phone":
        return Phone
      case "in-person":
        return Users
      default:
        return Calendar
    }
  }

  const InterviewIcon = getInterviewIcon()

  return (
    <>
      <Card className={`group hover:shadow-md transition-shadow ${isSelected ? "ring-2 ring-primary" : ""}`}>
        <CardHeader className="pb-3">
          {showSelection && onSelect && (
            <div className="absolute top-3 left-3 z-10">
              <Checkbox checked={isSelected} onCheckedChange={() => onSelect(application.id)} />
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-6 truncate">{application.scholarshipName}</CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                {application.institutionName}
              </CardDescription>
              <div className="flex items-center gap-4 text-sm mt-2">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">${application.amount.toLocaleString()}</span>
                </div>
                <div className={`flex items-center gap-1 ${deadlineInfo.urgent ? "text-red-600" : ""}`}>
                  <Calendar className="h-4 w-4" />
                  <span>{deadlineInfo.text}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Application
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
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Status and Priority */}
            <div className="flex items-center justify-between">
              <Badge
                variant={statusInfo.variant}
                className={application.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
              >
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusInfo.label}
              </Badge>
              <Badge variant="outline" className={`${priorityInfo.bgColor} ${priorityInfo.color} border-current`}>
                <Flag className="mr-1 h-3 w-3" />
                {priorityInfo.label}
              </Badge>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{application.progress}%</span>
              </div>
              <Progress value={application.progress} className="h-2" />
            </div>

            {/* Documents */}
            <div className="flex items-center justify-between text-sm">
              <span>Documents</span>
              <span className="font-medium">{application.documents.length} uploaded</span>
            </div>

            {/* Interview Info */}
            {application.interviewDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <InterviewIcon className="h-4 w-4" />
                <span>
                  {application.interviewType} interview on {new Date(application.interviewDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Notes */}
            {application.notes && <p className="text-sm text-muted-foreground line-clamp-2">{application.notes}</p>}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDocumentUpload(application.id)}>
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(application.applicationLink, "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditApplicationDialog
        application={application}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdate}
      />
    </>
  )
}
