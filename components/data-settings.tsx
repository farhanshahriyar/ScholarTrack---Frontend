"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Download, Upload, Trash2, Database, HardDrive, Cloud, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DataSettings() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const dataStats = {
    totalSize: "2.4 GB",
    applications: 45,
    documents: 127,
    activities: 892,
    lastBackup: "2024-01-15T10:30:00Z",
  }

  const handleExportData = async (format: string) => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      toast({
        title: "Export completed",
        description: `Your data has been exported in ${format.toUpperCase()} format.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleImportData = async () => {
    setIsImporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Import completed",
        description: "Your data has been imported successfully.",
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeleteAllData = async () => {
    toast({
      title: "Data deletion initiated",
      description: "All your data will be permanently deleted within 24 hours.",
      variant: "destructive",
    })
  }

  const handleCreateBackup = async () => {
    toast({
      title: "Backup created",
      description: "A new backup of your data has been created.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Overview
          </CardTitle>
          <CardDescription>Summary of your stored data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{dataStats.applications}</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{dataStats.documents}</div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{dataStats.activities}</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{dataStats.totalSize}</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Last Backup</p>
              <p className="text-sm text-muted-foreground">
                {new Date(dataStats.lastBackup).toLocaleDateString()} at{" "}
                {new Date(dataStats.lastBackup).toLocaleTimeString()}
              </p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Up to date
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>Download your data in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Exporting data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => handleExportData("json")}
              disabled={isExporting}
            >
              <Download className="h-6 w-6" />
              <span>JSON Format</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => handleExportData("csv")}
              disabled={isExporting}
            >
              <Download className="h-6 w-6" />
              <span>CSV Format</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => handleExportData("pdf")}
              disabled={isExporting}
            >
              <Download className="h-6 w-6" />
              <span>PDF Report</span>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Export includes:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>All scholarship applications and their details</li>
              <li>Uploaded documents and metadata</li>
              <li>Activity logs and timeline</li>
              <li>Profile information and settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>Import data from other scholarship management tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop your data file here</p>
            <p className="text-sm text-muted-foreground mb-4">Supports JSON, CSV, and Excel formats</p>
            <Button onClick={handleImportData} disabled={isImporting}>
              {isImporting ? "Importing..." : "Choose File"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Supported formats:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>JSON files from other scholarship platforms</li>
              <li>CSV files with application data</li>
              <li>Excel spreadsheets with scholarship information</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Backup & Restore
          </CardTitle>
          <CardDescription>Manage your data backups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Automatic Backups</p>
                <p className="text-sm text-muted-foreground">Daily backups are created automatically</p>
              </div>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Recent Backups</p>
            <div className="space-y-2">
              {[
                { date: "2024-01-15", size: "2.4 GB", type: "Automatic" },
                { date: "2024-01-14", size: "2.3 GB", type: "Automatic" },
                { date: "2024-01-10", size: "2.2 GB", type: "Manual" },
              ].map((backup, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{backup.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {backup.size} • {backup.type}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreateBackup} className="w-full">
            Create Manual Backup
          </Button>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>Monitor your storage usage and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Documents</span>
              <span className="text-sm text-muted-foreground">1.8 GB</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Application Data</span>
              <span className="text-sm text-muted-foreground">0.4 GB</span>
            </div>
            <Progress value={16} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Activity Logs</span>
              <span className="text-sm text-muted-foreground">0.2 GB</span>
            </div>
            <Progress value={8} className="h-2" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-medium">Total Usage</span>
            <span className="font-medium">2.4 GB of 5 GB</span>
          </div>
          <Progress value={48} className="h-3" />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible data operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your scholarship applications,
                  documents, activity logs, and any other data associated with your account. All backups will also be
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllData} className="bg-destructive hover:bg-destructive/90">
                  Delete All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <p className="text-sm text-muted-foreground">
            This will permanently delete all your data including applications, documents, and settings. This action
            cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
