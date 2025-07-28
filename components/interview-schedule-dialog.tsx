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
import { Calendar, Video, Phone, Users } from "lucide-react"
import type { Application } from "@/app/my-applications/page"

interface InterviewScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: Application | null
  onUpdate: (application: Application) => void
}

export function InterviewScheduleDialog({ open, onOpenChange, application, onUpdate }: InterviewScheduleDialogProps) {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewType: "" as "in-person" | "video" | "phone" | "",
    location: "",
    notes: "",
  })

  useEffect(() => {
    if (application) {
      const interviewDateTime = application.interviewDate ? new Date(application.interviewDate) : null
      setFormData({
        interviewDate: interviewDateTime ? interviewDateTime.toISOString().split("T")[0] : "",
        interviewTime: interviewDateTime ? interviewDateTime.toTimeString().slice(0, 5) : "",
        interviewType: application.interviewType || "",
        location: "",
        notes: application.notes || "",
      })
    }
  }, [application])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!application || !formData.interviewDate || !formData.interviewTime || !formData.interviewType) {
      return
    }

    const interviewDateTime = new Date(`${formData.interviewDate}T${formData.interviewTime}:00`)

    const updatedApplication: Application = {
      ...application,
      interviewDate: interviewDateTime.toISOString(),
      interviewType: formData.interviewType,
      status: "interview-scheduled",
      notes: formData.notes,
    }

    onUpdate(updatedApplication)
    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            {application
              ? `Schedule an interview for ${application.scholarshipName}`
              : "Select an application to schedule an interview"}
          </DialogDescription>
        </DialogHeader>

        {application && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview Date *</Label>
                <Input
                  id="interviewDate"
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => handleChange("interviewDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interviewTime">Interview Time *</Label>
                <Input
                  id="interviewTime"
                  type="time"
                  value={formData.interviewTime}
                  onChange={(e) => handleChange("interviewTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type *</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(value: "in-person" | "video" | "phone") => handleChange("interviewType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      In-Person Interview
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Call Interview
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Interview
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.interviewType === "in-person" && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Interview location or address"
                />
              </div>
            )}

            {formData.interviewType === "video" && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  📹 Video interview scheduled. Make sure to test your camera and microphone beforehand.
                </p>
              </div>
            )}

            {formData.interviewType === "phone" && (
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">
                  📞 Phone interview scheduled. Ensure you have good signal and are in a quiet environment.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Interview Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Preparation notes, questions to ask, or other reminders..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
