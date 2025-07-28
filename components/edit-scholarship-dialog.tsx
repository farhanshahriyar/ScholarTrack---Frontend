"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scholarship, ScholarshipStatus } from "@/app/page"

interface EditScholarshipDialogProps {
  scholarship: Scholarship
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (scholarship: Scholarship) => void
}

export function EditScholarshipDialog({ scholarship, open, onOpenChange, onUpdate }: EditScholarshipDialogProps) {
  const [formData, setFormData] = useState({
    institutionName: "",
    amount: "",
    deadline: "",
    applicationLink: "",
    notes: "",
    status: "pending" as ScholarshipStatus,
  })

  useEffect(() => {
    if (scholarship) {
      setFormData({
        institutionName: scholarship.institutionName,
        amount: scholarship.amount.toString(),
        deadline: scholarship.deadline,
        applicationLink: scholarship.applicationLink,
        notes: scholarship.notes,
        status: scholarship.status,
      })
    }
  }, [scholarship])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.institutionName || !formData.amount || !formData.deadline) {
      return
    }

    onUpdate({
      ...scholarship,
      institutionName: formData.institutionName,
      amount: Number.parseFloat(formData.amount),
      deadline: formData.deadline,
      applicationLink: formData.applicationLink,
      notes: formData.notes,
      status: formData.status,
    })

    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Scholarship</DialogTitle>
          <DialogDescription>Update the scholarship details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Institution/Scholarship Name *</Label>
            <Input
              id="institutionName"
              value={formData.institutionName}
              onChange={(e) => handleChange("institutionName", e.target.value)}
              placeholder="e.g., Stanford Merit Scholarship"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="25000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationLink">Application Link</Label>
            <Input
              id="applicationLink"
              type="url"
              value={formData.applicationLink}
              onChange={(e) => handleChange("applicationLink", e.target.value)}
              placeholder="https://university.edu/scholarships"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Requirements, deadlines, additional information..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Scholarship</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
