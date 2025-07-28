"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Users, BarChart3, Cookie, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PrivacySettings() {
  const { toast } = useToast()
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
    showEmail: false,
    showPhone: false,
    allowSearchEngines: false,
    shareAnalytics: true,
    allowCookies: true,
    thirdPartyIntegrations: false,
  })

  const [dataSettings, setDataSettings] = useState({
    retentionPeriod: "2years",
    autoDelete: false,
    anonymizeData: true,
  })

  const handlePrivacyToggle = (setting: string, value: boolean | string) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: "Privacy setting updated",
      description: `${setting.replace(/([A-Z])/g, " $1").toLowerCase()} has been updated.`,
    })
  }

  const handleDataToggle = (setting: string, value: boolean | string) => {
    setDataSettings((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: "Data setting updated",
      description: `${setting.replace(/([A-Z])/g, " $1").toLowerCase()} has been updated.`,
    })
  }

  const downloadPrivacyReport = () => {
    toast({
      title: "Privacy report generated",
      description: "Your privacy report is being prepared for download.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Privacy
          </CardTitle>
          <CardDescription>Control who can see your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              value={privacySettings.profileVisibility}
              onValueChange={(value) => handlePrivacyToggle("profileVisibility", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can view</SelectItem>
                <SelectItem value="limited">Limited - Only verified users</SelectItem>
                <SelectItem value="private">Private - Only you can view</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Show Email Address</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your email address in your profile</p>
            </div>
            <Switch
              id="show-email"
              checked={privacySettings.showEmail}
              onCheckedChange={(checked) => handlePrivacyToggle("showEmail", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-phone">Show Phone Number</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your phone number in your profile</p>
            </div>
            <Switch
              id="show-phone"
              checked={privacySettings.showPhone}
              onCheckedChange={(checked) => handlePrivacyToggle("showPhone", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="search-engines">Search Engine Indexing</Label>
              <p className="text-sm text-muted-foreground">Allow search engines to index your public profile</p>
            </div>
            <Switch
              id="search-engines"
              checked={privacySettings.allowSearchEngines}
              onCheckedChange={(checked) => handlePrivacyToggle("allowSearchEngines", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Data Sharing
          </CardTitle>
          <CardDescription>Manage how your data is shared and used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="share-analytics">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve our service by sharing anonymous usage data</p>
            </div>
            <Switch
              id="share-analytics"
              checked={privacySettings.shareAnalytics}
              onCheckedChange={(checked) => handlePrivacyToggle("shareAnalytics", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="third-party">Third-party Integrations</Label>
              <p className="text-sm text-muted-foreground">
                Allow third-party services to access your data with your permission
              </p>
            </div>
            <Switch
              id="third-party"
              checked={privacySettings.thirdPartyIntegrations}
              onCheckedChange={(checked) => handlePrivacyToggle("thirdPartyIntegrations", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cookies & Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookies & Tracking
          </CardTitle>
          <CardDescription>Manage cookies and tracking preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-cookies">Allow Cookies</Label>
              <p className="text-sm text-muted-foreground">
                Enable cookies for better user experience and functionality
              </p>
            </div>
            <Switch
              id="allow-cookies"
              checked={privacySettings.allowCookies}
              onCheckedChange={(checked) => handlePrivacyToggle("allowCookies", checked)}
            />
          </div>

          <div className="pl-6 space-y-4">
            <div className="text-sm">
              <p className="font-medium mb-2">Cookie Categories:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Essential cookies (always enabled)</li>
                <li>• Analytics cookies (track usage patterns)</li>
                <li>• Preference cookies (remember your settings)</li>
                <li>• Marketing cookies (personalized content)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Retention
          </CardTitle>
          <CardDescription>Control how long your data is stored</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="retention-period">Data Retention Period</Label>
            <Select
              value={dataSettings.retentionPeriod}
              onValueChange={(value) => handleDataToggle("retentionPeriod", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
                <SelectItem value="5years">5 Years</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">How long to keep your data after account deletion</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-delete">Auto-delete Inactive Data</Label>
              <p className="text-sm text-muted-foreground">Automatically delete data from inactive applications</p>
            </div>
            <Switch
              id="auto-delete"
              checked={dataSettings.autoDelete}
              onCheckedChange={(checked) => handleDataToggle("autoDelete", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="anonymize-data">Anonymize Analytics Data</Label>
              <p className="text-sm text-muted-foreground">Remove personal identifiers from analytics data</p>
            </div>
            <Switch
              id="anonymize-data"
              checked={dataSettings.anonymizeData}
              onCheckedChange={(checked) => handleDataToggle("anonymizeData", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Privacy Report
          </CardTitle>
          <CardDescription>Download a report of your privacy settings and data usage</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadPrivacyReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Privacy Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
