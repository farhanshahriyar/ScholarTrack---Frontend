"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileText, Settings, Clock, Target, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ApplicationPreferences() {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState({
    defaultPriority: "medium",
    autoSaveInterval: "5",
    showProgressBar: true,
    enableDeadlineWarnings: true,
    warningDays: "7",
    defaultDocumentFolder: "Documents/Scholarships",
    autoFillProfile: true,
    requireConfirmation: true,
  })

  const [templates, setTemplates] = useState({
    personalStatement: "I am writing to express my strong interest in...",
    coverLetter: "Dear Scholarship Committee,\n\nI am pleased to submit my application...",
    thankYouNote: "Dear [Name],\n\nThank you for considering my application...",
  })

  const [defaultValues, setDefaultValues] = useState({
    applicationSource: "online",
    expectedGraduation: "2024",
    fieldOfStudy: "Computer Science",
    gpa: "3.85",
    contactPreference: "email",
  })

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleTemplateChange = (key: string, value: string) => {
    setTemplates((prev) => ({ ...prev, [key]: value }))
  }

  const handleDefaultValueChange = (key: string, value: string) => {
    setDefaultValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your application preferences have been updated successfully.",
    })
  }

  const resetToDefaults = () => {
    setPreferences({
      defaultPriority: "medium",
      autoSaveInterval: "5",
      showProgressBar: true,
      enableDeadlineWarnings: true,
      warningDays: "7",
      defaultDocumentFolder: "Documents/Scholarships",
      autoFillProfile: true,
      requireConfirmation: true,
    })
    toast({
      title: "Preferences reset",
      description: "All preferences have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Default Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Default Settings
          </CardTitle>
          <CardDescription>Set default values for new applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-priority">Default Priority</Label>
              <Select
                value={preferences.defaultPriority}
                onValueChange={(value) => handlePreferenceChange("defaultPriority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto-save-interval">Auto-save Interval (minutes)</Label>
              <Select
                value={preferences.autoSaveInterval}
                onValueChange={(value) => handlePreferenceChange("autoSaveInterval", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-progress">Show Progress Bar</Label>
              <p className="text-sm text-muted-foreground">Display progress bars for application completion</p>
            </div>
            <Switch
              id="show-progress"
              checked={preferences.showProgressBar}
              onCheckedChange={(checked) => handlePreferenceChange("showProgressBar", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-fill">Auto-fill Profile Information</Label>
              <p className="text-sm text-muted-foreground">Automatically fill forms with your profile data</p>
            </div>
            <Switch
              id="auto-fill"
              checked={preferences.autoFillProfile}
              onCheckedChange={(checked) => handlePreferenceChange("autoFillProfile", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-confirmation">Require Confirmation</Label>
              <p className="text-sm text-muted-foreground">Ask for confirmation before submitting applications</p>
            </div>
            <Switch
              id="require-confirmation"
              checked={preferences.requireConfirmation}
              onCheckedChange={(checked) => handlePreferenceChange("requireConfirmation", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Deadline Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Deadline Management
          </CardTitle>
          <CardDescription>Configure deadline warnings and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="deadline-warnings">Enable Deadline Warnings</Label>
              <p className="text-sm text-muted-foreground">Show warnings for approaching deadlines</p>
            </div>
            <Switch
              id="deadline-warnings"
              checked={preferences.enableDeadlineWarnings}
              onCheckedChange={(checked) => handlePreferenceChange("enableDeadlineWarnings", checked)}
            />
          </div>

          {preferences.enableDeadlineWarnings && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="warning-days">Warning Period (days before deadline)</Label>
              <Select
                value={preferences.warningDays}
                onValueChange={(value) => handlePreferenceChange("warningDays", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Management
          </CardTitle>
          <CardDescription>Configure document storage and organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-folder">Default Document Folder</Label>
            <Input
              id="document-folder"
              value={preferences.defaultDocumentFolder}
              onChange={(e) => handlePreferenceChange("defaultDocumentFolder", e.target.value)}
              placeholder="Documents/Scholarships"
            />
            <p className="text-sm text-muted-foreground">Default location for saving uploaded documents</p>
          </div>
        </CardContent>
      </Card>

      {/* Default Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Default Form Values
          </CardTitle>
          <CardDescription>Pre-fill common application fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="application-source">Application Source</Label>
              <Select
                value={defaultValues.applicationSource}
                onValueChange={(value) => handleDefaultValueChange("applicationSource", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected-graduation">Expected Graduation</Label>
              <Input
                id="expected-graduation"
                value={defaultValues.expectedGraduation}
                onChange={(e) => handleDefaultValueChange("expectedGraduation", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-of-study">Field of Study</Label>
              <Input
                id="field-of-study"
                value={defaultValues.fieldOfStudy}
                onChange={(e) => handleDefaultValueChange("fieldOfStudy", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                value={defaultValues.gpa}
                onChange={(e) => handleDefaultValueChange("gpa", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-preference">Preferred Contact Method</Label>
            <Select
              value={defaultValues.contactPreference}
              onValueChange={(value) => handleDefaultValueChange("contactPreference", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="mail">Mail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
          <CardDescription>Create templates for commonly used documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personal-statement">Personal Statement Template</Label>
            <Textarea
              id="personal-statement"
              value={templates.personalStatement}
              onChange={(e) => handleTemplateChange("personalStatement", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-letter">Cover Letter Template</Label>
            <Textarea
              id="cover-letter"
              value={templates.coverLetter}
              onChange={(e) => handleTemplateChange("coverLetter", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thank-you-note">Thank You Note Template</Label>
            <Textarea
              id="thank-you-note"
              value={templates.thankYouNote}
              onChange={(e) => handleTemplateChange("thankYouNote", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSavePreferences}>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
