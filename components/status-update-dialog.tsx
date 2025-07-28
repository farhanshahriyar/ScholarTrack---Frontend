"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import type { Scholarship, ScholarshipStatus } from "@/app/page"

interface StatusUpdateDialogProps {
  scholarship: Scholarship
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (scholarship: Scholarship) => void
}

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    description: "Not yet started or waiting to apply",
    color: "text-yellow-600",
  },
  {
    value: "applied",
    label: "Applied",
    icon: AlertCircle,
    description: "Application has been submitted",
    color: "text-blue-600",
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle,
    description: "Scholarship has been awarded",
    color: "text-green-600",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    description: "Application was not successful",
    color: "text-red-600",
  },
]

export function StatusUpdateDialog({ scholarship, open, onOpenChange, onUpdate }: StatusUpdateDialogProps) {
  const [newStatus, setNewStatus] = useState<ScholarshipStatus>(scholarship.status)
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onUpdate({
      ...scholarship,
      status: newStatus,
      notes: notes.trim() ? `${scholarship.notes}\n\nStatus Update: ${notes}`.trim() : scholarship.notes,
    })

    setNotes("")
    onOpenChange(false)
  }

  const currentStatus = statusOptions.find((s) => s.value === scholarship.status)
  const selectedStatus = statusOptions.find((s) => s.value === newStatus)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>Update the status for "{scholarship.institutionName}"</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Current Status</Label>
              {currentStatus && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <currentStatus.icon className="h-3 w-3" />
                  {currentStatus.label}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(value: ScholarshipStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className={`h-4 w-4 ${option.color}`} />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStatus && newStatus !== scholarship.status && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <selectedStatus.icon className={`h-4 w-4 ${selectedStatus.color}`} />
                  <span className="font-medium">Changing to: {selectedStatus.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedStatus.description}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Update Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this status change..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={newStatus === scholarship.status}>
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
