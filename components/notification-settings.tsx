"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Mail, Smartphone, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  const [emailNotifications, setEmailNotifications] = useState({
    deadlineReminders: true,
    statusUpdates: true,
    newOpportunities: false,
    weeklyDigest: true,
    marketingEmails: false,
  })

  const [pushNotifications, setPushNotifications] = useState({
    deadlineReminders: true,
    statusUpdates: true,
    interviewReminders: true,
    documentRequests: true,
  })

  const [reminderSettings, setReminderSettings] = useState({
    deadlineReminder1: "7", // days before
    deadlineReminder2: "1", // days before
    interviewReminder: "24", // hours before
    followUpReminder: "14", // days after submission
  })

  const [preferences, setPreferences] = useState({
    frequency: "immediate",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
    timezone: "America/Los_Angeles",
  })

  const handleEmailToggle = (setting: string, value: boolean) => {
    setEmailNotifications((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: "Email notification updated",
      description: `${setting.replace(/([A-Z])/g, " $1").toLowerCase()} ${value ? "enabled" : "disabled"}.`,
    })
  }

  const handlePushToggle = (setting: string, value: boolean) => {
    setPushNotifications((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: "Push notification updated",
      description: `${setting.replace(/([A-Z])/g, " $1").toLowerCase()} ${value ? "enabled" : "disabled"}.`,
    })
  }

  const handleReminderChange = (setting: string, value: string) => {
    setReminderSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handlePreferenceChange = (setting: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [setting]: value }))
  }

  const testNotification = () => {
    toast({
      title: "Test notification sent!",
      description: "Check your email and push notifications.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Choose what email notifications you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="deadline-reminders-email">Deadline Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming application deadlines</p>
            </div>
            <Switch
              id="deadline-reminders-email"
              checked={emailNotifications.deadlineReminders}
              onCheckedChange={(checked) => handleEmailToggle("deadlineReminders", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="status-updates-email">Status Updates</Label>
              <p className="text-sm text-muted-foreground">Notifications when your application status changes</p>
            </div>
            <Switch
              id="status-updates-email"
              checked={emailNotifications.statusUpdates}
              onCheckedChange={(checked) => handleEmailToggle("statusUpdates", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-opportunities-email">New Opportunities</Label>
              <p className="text-sm text-muted-foreground">Get notified about new scholarship opportunities</p>
            </div>
            <Switch
              id="new-opportunities-email"
              checked={emailNotifications.newOpportunities}
              onCheckedChange={(checked) => handleEmailToggle("newOpportunities", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest-email">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Weekly summary of your applications and deadlines</p>
            </div>
            <Switch
              id="weekly-digest-email"
              checked={emailNotifications.weeklyDigest}
              onCheckedChange={(checked) => handleEmailToggle("weeklyDigest", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Tips, guides, and product updates</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={emailNotifications.marketingEmails}
              onCheckedChange={(checked) => handleEmailToggle("marketingEmails", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Manage push notifications for mobile and desktop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="deadline-reminders-push">Deadline Reminders</Label>
              <p className="text-sm text-muted-foreground">Push notifications for upcoming deadlines</p>
            </div>
            <Switch
              id="deadline-reminders-push"
              checked={pushNotifications.deadlineReminders}
              onCheckedChange={(checked) => handlePushToggle("deadlineReminders", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="status-updates-push">Status Updates</Label>
              <p className="text-sm text-muted-foreground">Instant notifications for status changes</p>
            </div>
            <Switch
              id="status-updates-push"
              checked={pushNotifications.statusUpdates}
              onCheckedChange={(checked) => handlePushToggle("statusUpdates", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="interview-reminders-push">Interview Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminders for scheduled interviews</p>
            </div>
            <Switch
              id="interview-reminders-push"
              checked={pushNotifications.interviewReminders}
              onCheckedChange={(checked) => handlePushToggle("interviewReminders", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="document-requests-push">Document Requests</Label>
              <p className="text-sm text-muted-foreground">Notifications for missing or required documents</p>
            </div>
            <Switch
              id="document-requests-push"
              checked={pushNotifications.documentRequests}
              onCheckedChange={(checked) => handlePushToggle("documentRequests", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reminder Timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reminder Timing
          </CardTitle>
          <CardDescription>Customize when you receive reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline-reminder-1">First Deadline Reminder</Label>
              <Select
                value={reminderSettings.deadlineReminder1}
                onValueChange={(value) => handleReminderChange("deadlineReminder1", value)}
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

            <div className="space-y-2">
              <Label htmlFor="deadline-reminder-2">Final Deadline Reminder</Label>
              <Select
                value={reminderSettings.deadlineReminder2}
                onValueChange={(value) => handleReminderChange("deadlineReminder2", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="2">2 days before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interview-reminder">Interview Reminder</Label>
              <Select
                value={reminderSettings.interviewReminder}
                onValueChange={(value) => handleReminderChange("interviewReminder", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="24">1 day before</SelectItem>
                  <SelectItem value="48">2 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow-up-reminder">Follow-up Reminder</Label>
              <Select
                value={reminderSettings.followUpReminder}
                onValueChange={(value) => handleReminderChange("followUpReminder", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 week after</SelectItem>
                  <SelectItem value="14">2 weeks after</SelectItem>
                  <SelectItem value="30">1 month after</SelectItem>
                  <SelectItem value="60">2 months after</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>General notification preferences and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="frequency">Notification Frequency</Label>
            <Select value={preferences.frequency} onValueChange={(value) => handlePreferenceChange("frequency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly digest</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quiet-hours">Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Pause notifications during specified hours</p>
            </div>
            <Switch
              id="quiet-hours"
              checked={preferences.quietHours}
              onCheckedChange={(checked) => handlePreferenceChange("quietHours", checked)}
            />
          </div>

          {preferences.quietHours && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start Time</Label>
                <Select
                  value={preferences.quietStart}
                  onValueChange={(value) => handlePreferenceChange("quietStart", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0")
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiet-end">End Time</Label>
                <Select
                  value={preferences.quietEnd}
                  onValueChange={(value) => handlePreferenceChange("quietEnd", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0")
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange("timezone", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
          <CardDescription>Send a test notification to verify your settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testNotification}>Send Test Notification</Button>
        </CardContent>
      </Card>
    </div>
  )
}
