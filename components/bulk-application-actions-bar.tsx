"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, X, FileText, AlertTriangle, CheckCircle, XCircle, Clock, Calendar, Flag } from "lucide-react"
import type { ApplicationStatus, ApplicationPriority } from "@/app/my-applications/page"

interface BulkApplicationActionsBarProps {
  selectedCount: number
  onBulkDelete: () => void
  onBulkStatusUpdate: (status: ApplicationStatus) => void
  onBulkPriorityUpdate: (priority: ApplicationPriority) => void
  onClearSelection: () => void
}

export function BulkApplicationActionsBar({
  selectedCount,
  onBulkDelete,
  onBulkStatusUpdate,
  onBulkPriorityUpdate,
  onClearSelection,
}: BulkApplicationActionsBarProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedCount} application{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Select onValueChange={(value: ApplicationStatus) => onBulkStatusUpdate(value)}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="submitted">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Submitted
                    </div>
                  </SelectItem>
                  <SelectItem value="under-review">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      Under Review
                    </div>
                  </SelectItem>
                  <SelectItem value="interview-scheduled">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Interview Scheduled
                    </div>
                  </SelectItem>
                  <SelectItem value="approved">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Approved
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Rejected
                    </div>
                  </SelectItem>
                  <SelectItem value="waitlisted">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Waitlisted
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value: ApplicationPriority) => onBulkPriorityUpdate(value)}>
                <SelectTrigger className="w-[150px] h-8">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-600" />
                      Urgent
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-orange-600" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-yellow-600" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-green-600" />
                      Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
