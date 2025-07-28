"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Mail, Lock, Shield, Smartphone, Key, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AccountSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSettings, setEmailSettings] = useState({
    currentEmail: "john.doe@example.com",
    newEmail: "",
    emailVerified: true,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: "30",
  })

  const handleEmailChange = async () => {
    if (!emailSettings.newEmail) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Email update requested",
        description: "Please check your new email address for verification.",
      })
      setEmailSettings((prev) => ({ ...prev, newEmail: "", emailVerified: false }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorToggle = async (enabled: boolean) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: enabled }))
      toast({
        title: enabled ? "2FA Enabled" : "2FA Disabled",
        description: enabled
          ? "Two-factor authentication has been enabled for your account."
          : "Two-factor authentication has been disabled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    // This would handle account deletion
    toast({
      title: "Account deletion",
      description: "Account deletion functionality would be implemented here.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Address
          </CardTitle>
          <CardDescription>Manage your email address and verification status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{emailSettings.currentEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                {emailSettings.emailVerified ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
            {!emailSettings.emailVerified && (
              <Button variant="outline" size="sm">
                Resend Verification
              </Button>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                value={emailSettings.newEmail}
                onChange={(e) => setEmailSettings((prev) => ({ ...prev, newEmail: e.target.value }))}
                placeholder="Enter new email address"
              />
            </div>
            <Button onClick={handleEmailChange} disabled={isLoading || !emailSettings.newEmail}>
              {isLoading ? "Updating..." : "Update Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password
          </CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>

          <Button onClick={handlePasswordChange} disabled={isLoading}>
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              id="two-factor"
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-notifications">Login Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone signs into your account</p>
            </div>
            <Switch
              id="login-notifications"
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, loginNotifications: checked }))}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
              min="5"
              max="480"
            />
            <p className="text-sm text-muted-foreground">Automatically log out after this period of inactivity</p>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">Chrome on Windows • San Francisco, CA</p>
                <p className="text-xs text-muted-foreground">Last active: Now</p>
              </div>
              <Badge variant="default">Current</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Mobile App</p>
                <p className="text-sm text-muted-foreground">iPhone • San Francisco, CA</p>
                <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Revoke All Other Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers, including all scholarship applications, documents, and settings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
