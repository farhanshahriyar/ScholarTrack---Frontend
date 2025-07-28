"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface AddDeadlineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDeadlineDialog({ open, onOpenChange }: AddDeadlineDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: undefined as Date | undefined,
    category: "",
    priority: "",
    scholarship: "",
    reminderEnabled: true,
    reminderDays: "7",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.date || !formData.category || !formData.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Deadline added",
        description: "Your deadline has been successfully created.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: undefined,
        category: "",
        priority: "",
        scholarship: "",
        reminderEnabled: true,
        reminderDays: "7",
        notes: "",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create deadline. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Deadline
          </DialogTitle>
          <DialogDescription>
            Create a new deadline to track important dates for your scholarship applications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., MIT Application Deadline"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of what needs to be done..."
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Deadline Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Select deadline date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scholarship */}
          <div className="space-y-2">
            <Label htmlFor="scholarship">Related Scholarship</Label>
            <Input
              id="scholarship"
              value={formData.scholarship}
              onChange={(e) => handleInputChange("scholarship", e.target.value)}
              placeholder="e.g., MIT Merit Scholarship"
            />
          </div>

          {/* Reminder Settings */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminder">Set Reminder</Label>
                <p className="text-sm text-muted-foreground">Get notified before the deadline</p>
              </div>
              <Switch
                id="reminder"
                checked={formData.reminderEnabled}
                onCheckedChange={(checked) => handleInputChange("reminderEnabled", checked)}
              />
            </div>

            {formData.reminderEnabled && (
              <div className="space-y-2">
                <Label htmlFor="reminderDays">Remind me</Label>
                <Select
                  value={formData.reminderDays}
                  onValueChange={(value) => handleInputChange("reminderDays", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="7">1 week before</SelectItem>
                    <SelectItem value="14">2 weeks before</SelectItem>
                    <SelectItem value="30">1 month before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes or reminders..."
              rows={2}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Creating..." : "Create Deadline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
