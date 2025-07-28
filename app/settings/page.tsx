"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsLayout } from "@/components/settings-layout"
import { ProfileSettings } from "@/components/profile-settings"
import { AccountSettings } from "@/components/account-settings"
import { AppearanceSettings } from "@/components/appearance-settings"
import { NotificationSettings } from "@/components/notification-settings"
import { PrivacySettings } from "@/components/privacy-settings"
import { DataSettings } from "@/components/data-settings"
import { ApplicationPreferences } from "@/components/application-preferences"
import { IntegrationSettings } from "@/components/integration-settings"

type SettingsSection =
  | "profile"
  | "account"
  | "appearance"
  | "notifications"
  | "privacy"
  | "data"
  | "applications"
  | "integrations"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />
      case "account":
        return <AccountSettings />
      case "appearance":
        return <AppearanceSettings />
      case "notifications":
        return <NotificationSettings />
      case "privacy":
        return <PrivacySettings />
      case "data":
        return <DataSettings />
      case "applications":
        return <ApplicationPreferences />
      case "integrations":
        return <IntegrationSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
          {renderSettingsContent()}
        </SettingsLayout>
      </div>
    </DashboardLayout>
  )
}
