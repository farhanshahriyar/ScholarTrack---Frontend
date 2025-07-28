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
import type { Application, ApplicationStatus, ApplicationPriority } from "@/app/my-applications/page"

interface EditApplicationDialogProps {
  application: Application
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (application: Application) => void
}

export function EditApplicationDialog({ application, open, onOpenChange, onUpdate }: EditApplicationDialogProps) {
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
    submissionDate: "",
    interviewDate: "",
    interviewType: "",
    followUpDate: "",
  })

  useEffect(() => {
    if (application) {
      setFormData({
        scholarshipName: application.scholarshipName,
        institutionName: application.institutionName,
        amount: application.amount.toString(),
        deadline: application.deadline,
        applicationLink: application.applicationLink,
        notes: application.notes,
        status: application.status,
        priority: application.priority,
        contactEmail: application.contactEmail || "",
        contactPhone: application.contactPhone || "",
        requirements: application.requirements.join(", "),
        submissionDate: application.submissionDate || "",
        interviewDate: application.interviewDate ? application.interviewDate.split("T")[0] : "",
        interviewType: application.interviewType || "",
        followUpDate: application.followUpDate || "",
      })
    }
  }, [application])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.scholarshipName || !formData.institutionName || !formData.amount || !formData.deadline) {
      return
    }

    onUpdate({
      ...application,
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
      submissionDate: formData.submissionDate || undefined,
      interviewDate: formData.interviewDate ? `${formData.interviewDate}T00:00:00Z` : undefined,
      interviewType: formData.interviewType as "in-person" | "video" | "phone" | undefined,
      followUpDate: formData.followUpDate || undefined,
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
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>Update the application details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scholarshipName">Scholarship Name *</Label>
              <Input
                id="scholarshipName"
                value={formData.scholarshipName}
                onChange={(e) => handleChange("scholarshipName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution *</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => handleChange("institutionName", e.target.value)}
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
              <Label htmlFor="submissionDate">Submission Date</Label>
              <Input
                id="submissionDate"
                type="date"
                value={formData.submissionDate}
                onChange={(e) => handleChange("submissionDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleChange("followUpDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interviewDate">Interview Date</Label>
              <Input
                id="interviewDate"
                type="date"
                value={formData.interviewDate}
                onChange={(e) => handleChange("interviewDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type</Label>
              <Select value={formData.interviewType} onValueChange={(value) => handleChange("interviewType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
            <Input
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
