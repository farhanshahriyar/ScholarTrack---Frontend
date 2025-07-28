"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Palette, Bell, Shield, Database, FileText, Plug } from "lucide-react"

type SettingsSection =
  | "profile"
  | "account"
  | "appearance"
  | "notifications"
  | "privacy"
  | "data"
  | "applications"
  | "integrations"

interface SettingsLayoutProps {
  children: React.ReactNode
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

const settingsSections = [
  {
    id: "profile" as const,
    label: "Profile",
    icon: User,
    description: "Manage personal information",
  },
  {
    id: "account" as const,
    label: "Account",
    icon: Settings,
    description: "Email, password, and security",
  },
  {
    id: "appearance" as const,
    label: "Appearance",
    icon: Palette,
    description: "Theme and display preferences",
  },
  {
    id: "notifications" as const,
    label: "Notifications",
    icon: Bell,
    description: "Email and notification settings",
  },
  {
    id: "privacy" as const,
    label: "Privacy",
    icon: Shield,
    description: "Privacy and data sharing settings",
  },
  {
    id: "data" as const,
    label: "Data Management",
    icon: Database,
    description: "Export, backup, and delete data",
  },
  {
    id: "applications" as const,
    label: "Application Preferences",
    icon: FileText,
    description: "Default settings for applications",
  },
  {
    id: "integrations" as const,
    label: "Integrations",
    icon: Plug,
    description: "Connect external services",
  },
]

export function SettingsLayout({ children, activeSection, onSectionChange }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Settings Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsSections.map((section, index) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                  <div key={section.id}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${isActive ? "bg-secondary" : "hover:bg-accent"}`}
                      onClick={() => onSectionChange(section.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">{section.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 hidden lg:block">
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                    {index < settingsSections.length - 1 && <Separator className="my-2" />}
                  </div>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Settings Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
