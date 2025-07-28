"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, Cloud, Link, CheckCircle, XCircle, Settings, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function IntegrationSettings() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState({
    googleCalendar: { connected: true, syncDeadlines: true, syncInterviews: true },
    outlook: { connected: false, syncDeadlines: false, syncInterviews: false },
    gmail: { connected: true, autoImport: false, sendReminders: true },
    dropbox: { connected: false, autoBackup: false },
    googleDrive: { connected: true, autoBackup: true, folder: "ScholarTrack" },
    slack: { connected: false, notifications: false, channel: "" },
    zapier: { connected: false, workflows: 0 },
    ifttt: { connected: false, applets: 0 },
  })

  const handleToggleIntegration = async (service: string, connected: boolean) => {
    if (connected) {
      // Connect integration
      toast({
        title: `Connecting to ${service}`,
        description: "Please authorize the connection in the popup window.",
      })
      // Simulate connection
      setTimeout(() => {
        setIntegrations((prev) => ({
          ...prev,
          [service]: { ...prev[service as keyof typeof prev], connected: true },
        }))
        toast({
          title: `${service} connected`,
          description: `Successfully connected to ${service}.`,
        })
      }, 2000)
    } else {
      // Disconnect integration
      setIntegrations((prev) => ({
        ...prev,
        [service]: { ...prev[service as keyof typeof prev], connected: false },
      }))
      toast({
        title: `${service} disconnected`,
        description: `Successfully disconnected from ${service}.`,
      })
    }
  }

  const handleSettingChange = (service: string, setting: string, value: boolean | string) => {
    setIntegrations((prev) => ({
      ...prev,
      [service]: { ...prev[service as keyof typeof prev], [setting]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Calendar Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integrations
          </CardTitle>
          <CardDescription>Sync deadlines and interviews with your calendar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-sm text-muted-foreground">Sync with Google Calendar</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.googleCalendar.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button
                  variant={integrations.googleCalendar.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleIntegration("googleCalendar", !integrations.googleCalendar.connected)}
                >
                  {integrations.googleCalendar.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>

            {integrations.googleCalendar.connected && (
              <div className="pl-11 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gc-deadlines">Sync Application Deadlines</Label>
                  <Switch
                    id="gc-deadlines"
                    checked={integrations.googleCalendar.syncDeadlines}
                    onCheckedChange={(checked) => handleSettingChange("googleCalendar", "syncDeadlines", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gc-interviews">Sync Interview Appointments</Label>
                  <Switch
                    id="gc-interviews"
                    checked={integrations.googleCalendar.syncInterviews}
                    onCheckedChange={(checked) => handleSettingChange("googleCalendar", "syncInterviews", checked)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Outlook Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Outlook Calendar</p>
                  <p className="text-sm text-muted-foreground">Sync with Microsoft Outlook</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.outlook.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button
                  variant={integrations.outlook.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleIntegration("outlook", !integrations.outlook.connected)}
                >
                  {integrations.outlook.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Integrations
          </CardTitle>
          <CardDescription>Connect your email for automated workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gmail */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Gmail</p>
                  <p className="text-sm text-muted-foreground">john.doe@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.gmail.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button
                  variant={integrations.gmail.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleIntegration("gmail", !integrations.gmail.connected)}
                >
                  {integrations.gmail.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>

            {integrations.gmail.connected && (
              <div className="pl-11 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gmail-import">Auto-import Scholarship Emails</Label>
                  <Switch
                    id="gmail-import"
                    checked={integrations.gmail.autoImport}
                    onCheckedChange={(checked) => handleSettingChange("gmail", "autoImport", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gmail-reminders">Send Email Reminders</Label>
                  <Switch
                    id="gmail-reminders"
                    checked={integrations.gmail.sendReminders}
                    onCheckedChange={(checked) => handleSettingChange("gmail", "sendReminders", checked)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cloud Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Storage
          </CardTitle>
          <CardDescription>Backup and sync your documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Drive */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Cloud className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Google Drive</p>
                  <p className="text-sm text-muted-foreground">Backup documents to Google Drive</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.googleDrive.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button
                  variant={integrations.googleDrive.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleIntegration("googleDrive", !integrations.googleDrive.connected)}
                >
                  {integrations.googleDrive.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>

            {integrations.googleDrive.connected && (
              <div className="pl-11 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gdrive-backup">Auto-backup Documents</Label>
                  <Switch
                    id="gdrive-backup"
                    checked={integrations.googleDrive.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("googleDrive", "autoBackup", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gdrive-folder">Backup Folder</Label>
                  <Input
                    id="gdrive-folder"
                    value={integrations.googleDrive.folder}
                    onChange={(e) => handleSettingChange("googleDrive", "folder", e.target.value)}
                    placeholder="ScholarTrack"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Dropbox */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Cloud className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Dropbox</p>
                  <p className="text-sm text-muted-foreground">Sync documents with Dropbox</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.dropbox.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button
                  variant={integrations.dropbox.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleIntegration("dropbox", !integrations.dropbox.connected)}
                >
                  {integrations.dropbox.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Automation Tools
          </CardTitle>
          <CardDescription>Connect automation platforms for advanced workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zapier */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <Link className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Zapier</p>
                  <p className="text-sm text-muted-foreground">
                    {integrations.zapier.connected
                      ? `${integrations.zapier.workflows} active workflows`
                      : "Create automated workflows"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.zapier.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => window.open("https://zapier.com", "_blank")}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* IFTTT */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <Link className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">IFTTT</p>
                  <p className="text-sm text-muted-foreground">
                    {integrations.ifttt.connected
                      ? `${integrations.ifttt.applets} active applets`
                      : "If This Then That automation"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.ifttt.connected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => window.open("https://ifttt.com", "_blank")}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Access
          </CardTitle>
          <CardDescription>Manage API keys and webhook endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input id="api-key" value="sk-1234567890abcdef..." readOnly className="font-mono" />
              <Button variant="outline" size="sm">
                Copy
              </Button>
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input id="webhook-url" placeholder="https://your-app.com/webhooks/scholartrack" />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Use our API to:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Create and manage applications programmatically</li>
              <li>Receive real-time updates via webhooks</li>
              <li>Export data in various formats</li>
              <li>Integrate with custom applications</li>
            </ul>
          </div>

          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View API Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
