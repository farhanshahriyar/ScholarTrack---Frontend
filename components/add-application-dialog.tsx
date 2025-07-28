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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Application, ApplicationStatus, ApplicationPriority } from "@/app/my-applications/page"

interface AddApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (application: Omit<Application, "id" | "createdAt" | "updatedAt">) => void
}

export function AddApplicationDialog({ open, onOpenChange, onAdd }: AddApplicationDialogProps) {
  const [formData, setFormData] = useState({
    scholarshipName: "",
    institutionName: "",
    amount: "",
    deadline: "",
    applicationLink: "",
    notes: "",
    status: "draft" as ApplicationStatus,
    priority: "medium" as ApplicationPriority,
    contactEmail: "",
    contactPhone: "",
    requirements: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.scholarshipName || !formData.institutionName || !formData.amount || !formData.deadline) {
      return
    }

    onAdd({
      scholarshipName: formData.scholarshipName,
      institutionName: formData.institutionName,
      amount: Number.parseFloat(formData.amount),
      deadline: formData.deadline,
      applicationLink: formData.applicationLink,
      notes: formData.notes,
      status: formData.status,
      priority: formData.priority,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      requirements: formData.requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      documents: [],
      progress: 0,
    })

    // Reset form
    setFormData({
      scholarshipName: "",
      institutionName: "",
      amount: "",
      deadline: "",
      applicationLink: "",
      notes: "",
      status: "draft",
      priority: "medium",
      contactEmail: "",
      contactPhone: "",
      requirements: "",
    })

    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>Create a new scholarship application to track your progress.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scholarshipName">Scholarship Name *</Label>
              <Input
                id="scholarshipName"
                value={formData.scholarshipName}
                onChange={(e) => handleChange("scholarshipName", e.target.value)}
                placeholder="e.g., Merit Scholarship"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution *</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => handleChange("institutionName", e.target.value)}
                placeholder="e.g., Stanford University"
                required
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                placeholder="admissions@university.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
            <Input
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="Personal Statement, Transcript, Recommendation Letters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional information, requirements, deadlines..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
