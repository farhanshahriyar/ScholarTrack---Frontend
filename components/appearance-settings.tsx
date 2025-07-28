"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Monitor, Moon, Sun, Palette, Eye, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AppearanceSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    compactMode: false,
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
    sidebarCollapsed: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: "Setting updated",
      description: `${setting.replace(/([A-Z])/g, " $1").toLowerCase()} has been updated.`,
    })
  }

  const resetToDefaults = () => {
    setTheme("system")
    setSettings({
      compactMode: false,
      reducedMotion: false,
      highContrast: false,
      fontSize: "medium",
      sidebarCollapsed: false,
    })
    toast({
      title: "Settings reset",
      description: "All appearance settings have been reset to defaults.",
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="h-20 flex-col gap-2"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-6 w-6" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="h-20 flex-col gap-2"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-6 w-6" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="h-20 flex-col gap-2"
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-6 w-6" />
              <span>System</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-medium capitalize">{resolvedTheme}</span>
          </p>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Display
          </CardTitle>
          <CardDescription>Customize how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding for a more compact interface</p>
            </div>
            <Switch
              id="compact-mode"
              checked={settings.compactMode}
              onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange("fontSize", value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sidebar-collapsed">Collapsed Sidebar</Label>
              <p className="text-sm text-muted-foreground">Start with the sidebar collapsed by default</p>
            </div>
            <Switch
              id="sidebar-collapsed"
              checked={settings.sidebarCollapsed}
              onCheckedChange={(checked) => handleSettingChange("sidebarCollapsed", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Accessibility
          </CardTitle>
          <CardDescription>Settings to improve accessibility and usability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => handleSettingChange("reducedMotion", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => handleSettingChange("highContrast", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your settings affect the interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sample Scholarship Card</h3>
              <span className="text-sm text-muted-foreground">$25,000</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This is how your scholarship cards will appear with the current settings.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Apply</Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
