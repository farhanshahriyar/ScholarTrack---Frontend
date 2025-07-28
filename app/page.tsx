"use client"

import { useState } from "react"
import { Plus, Search, Filter, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScholarshipCard } from "@/components/scholarship-card"
import { AddScholarshipDialog } from "@/components/add-scholarship-dialog"
import { ActivityLog } from "@/components/activity-log"
import { StatsCards } from "@/components/stats-cards"

export type ScholarshipStatus = "applied" | "approved" | "rejected" | "pending"

export interface Scholarship {
  id: string
  institutionName: string
  amount: number
  deadline: string
  applicationLink: string
  notes: string
  status: ScholarshipStatus
  createdAt: string
  updatedAt: string
}

export interface ActivityLogEntry {
  id: string
  scholarshipId: string
  scholarshipName: string
  action: string
  oldStatus?: ScholarshipStatus
  newStatus?: ScholarshipStatus
  timestamp: string
  details?: string
}

// Mock data - this would come from Supabase later
const initialScholarships: Scholarship[] = [
  {
    id: "1",
    institutionName: "Stanford University Merit Scholarship",
    amount: 25000,
    deadline: "2024-03-15",
    applicationLink: "https://stanford.edu/scholarships/merit",
    notes: "Requires 3.8 GPA minimum, essay on leadership experience",
    status: "applied",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    institutionName: "MIT Engineering Excellence Award",
    amount: 30000,
    deadline: "2024-02-28",
    applicationLink: "https://mit.edu/scholarships/engineering",
    notes: "STEM focused, need recommendation letters from 2 professors",
    status: "pending",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    institutionName: "Harvard Undergraduate Scholarship",
    amount: 40000,
    deadline: "2024-04-01",
    applicationLink: "https://harvard.edu/financial-aid",
    notes: "Need-based scholarship, requires FAFSA completion",
    status: "approved",
    createdAt: "2024-01-05T16:20:00Z",
    updatedAt: "2024-01-25T11:45:00Z",
  },
  {
    id: "4",
    institutionName: "UC Berkeley Chancellor's Scholarship",
    amount: 15000,
    deadline: "2024-01-31",
    applicationLink: "https://berkeley.edu/scholarships/chancellor",
    notes: "California residents only, community service requirement",
    status: "rejected",
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-28T09:30:00Z",
  },
]

const initialActivityLog: ActivityLogEntry[] = [
  {
    id: "1",
    scholarshipId: "3",
    scholarshipName: "Harvard Undergraduate Scholarship",
    action: "Status Updated",
    oldStatus: "applied",
    newStatus: "approved",
    timestamp: "2024-01-25T11:45:00Z",
    details: "Received approval notification via email",
  },
  {
    id: "2",
    scholarshipId: "4",
    scholarshipName: "UC Berkeley Chancellor's Scholarship",
    action: "Status Updated",
    oldStatus: "applied",
    newStatus: "rejected",
    timestamp: "2024-01-28T09:30:00Z",
    details: "Did not meet GPA requirements",
  },
  {
    id: "3",
    scholarshipId: "1",
    scholarshipName: "Stanford University Merit Scholarship",
    action: "Application Submitted",
    newStatus: "applied",
    timestamp: "2024-01-20T14:30:00Z",
    details: "Submitted application with all required documents",
  },
]

export default function Dashboard() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships)
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(initialActivityLog)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || scholarship.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddScholarship = (newScholarship: Omit<Scholarship, "id" | "createdAt" | "updatedAt">) => {
    const scholarship: Scholarship = {
      ...newScholarship,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setScholarships((prev) => [scholarship, ...prev])

    // Add to activity log
    const logEntry: ActivityLogEntry = {
      id: Date.now().toString(),
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.institutionName,
      action: "Scholarship Added",
      newStatus: scholarship.status,
      timestamp: new Date().toISOString(),
      details: `Added new scholarship application`,
    }
    setActivityLog((prev) => [logEntry, ...prev])
  }

  const handleUpdateScholarship = (updatedScholarship: Scholarship) => {
    const oldScholarship = scholarships.find((s) => s.id === updatedScholarship.id)

    setScholarships((prev) =>
      prev.map((s) =>
        s.id === updatedScholarship.id ? { ...updatedScholarship, updatedAt: new Date().toISOString() } : s,
      ),
    )

    // Add to activity log if status changed
    if (oldScholarship && oldScholarship.status !== updatedScholarship.status) {
      const logEntry: ActivityLogEntry = {
        id: Date.now().toString(),
        scholarshipId: updatedScholarship.id,
        scholarshipName: updatedScholarship.institutionName,
        action: "Status Updated",
        oldStatus: oldScholarship.status,
        newStatus: updatedScholarship.status,
        timestamp: new Date().toISOString(),
        details: `Status changed from ${oldScholarship.status} to ${updatedScholarship.status}`,
      }
      setActivityLog((prev) => [logEntry, ...prev])
    }
  }

  const handleDeleteScholarship = (id: string) => {
    const scholarship = scholarships.find((s) => s.id === id)
    if (scholarship) {
      setScholarships((prev) => prev.filter((s) => s.id !== id))

      // Add to activity log
      const logEntry: ActivityLogEntry = {
        id: Date.now().toString(),
        scholarshipId: id,
        scholarshipName: scholarship.institutionName,
        action: "Scholarship Deleted",
        timestamp: new Date().toISOString(),
        details: `Removed scholarship application`,
      }
      setActivityLog((prev) => [logEntry, ...prev])
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Scholarship Dashboard
            </h1>
            <p className="text-muted-foreground">Track and manage your scholarship applications</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Scholarship
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards scholarships={scholarships} />

        {/* Main Content */}
        <Tabs defaultValue="scholarships" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="scholarships" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scholarships Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onUpdate={handleUpdateScholarship}
                  onDelete={handleDeleteScholarship}
                />
              ))}
            </div>

            {filteredScholarships.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <School className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by adding your first scholarship application"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Scholarship
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog activities={activityLog} />
          </TabsContent>
        </Tabs>

        {/* Add Scholarship Dialog */}
        <AddScholarshipDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddScholarship} />
      </div>
    </DashboardLayout>
  )
}
