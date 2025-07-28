"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Calendar, Clock, User, FileText, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Activity types
type ActivityType = "application" | "deadline" | "document" | "interview" | "follow-up" | "note"

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  scholarshipName: string
  timestamp: string
  status?: "completed" | "pending" | "overdue"
  priority?: "high" | "medium" | "low"
  tags?: string[]
}

// Mock activity data
const initialActivities: Activity[] = [
  {
    id: "1",
    type: "application",
    title: "Application Submitted",
    description: "Successfully submitted application for Stanford University Merit Scholarship",
    scholarshipName: "Stanford University Merit Scholarship",
    timestamp: "2024-01-20T14:30:00Z",
    status: "completed",
    priority: "high",
    tags: ["application", "submitted"],
  },
  {
    id: "2",
    type: "deadline",
    title: "Deadline Reminder",
    description: "MIT Engineering Excellence Award application deadline in 3 days",
    scholarshipName: "MIT Engineering Excellence Award",
    timestamp: "2024-01-25T09:00:00Z",
    status: "pending",
    priority: "high",
    tags: ["deadline", "urgent"],
  },
  {
    id: "3",
    type: "document",
    title: "Documents Uploaded",
    description: "Uploaded transcripts and recommendation letters",
    scholarshipName: "Harvard Undergraduate Scholarship",
    timestamp: "2024-01-18T16:45:00Z",
    status: "completed",
    priority: "medium",
    tags: ["documents", "transcripts"],
  },
  {
    id: "4",
    type: "interview",
    title: "Interview Scheduled",
    description: "Phone interview scheduled for Princeton Leadership Scholarship",
    scholarshipName: "Princeton Leadership Scholarship",
    timestamp: "2024-01-22T11:00:00Z",
    status: "pending",
    priority: "high",
    tags: ["interview", "scheduled"],
  },
  {
    id: "5",
    type: "follow-up",
    title: "Follow-up Required",
    description: "Need to follow up on application status",
    scholarshipName: "Yale Academic Excellence Grant",
    timestamp: "2024-01-19T13:20:00Z",
    status: "pending",
    priority: "medium",
    tags: ["follow-up", "status"],
  },
  {
    id: "6",
    type: "note",
    title: "Personal Note",
    description: "Remember to prepare portfolio for Columbia Journalism Fellowship",
    scholarshipName: "Columbia Journalism Fellowship",
    timestamp: "2024-01-17T10:15:00Z",
    status: "pending",
    priority: "low",
    tags: ["note", "portfolio"],
  },
  {
    id: "7",
    type: "application",
    title: "Application Started",
    description: "Started working on NYU Arts & Sciences Scholarship application",
    scholarshipName: "NYU Arts & Sciences Scholarship",
    timestamp: "2024-01-16T14:00:00Z",
    status: "pending",
    priority: "medium",
    tags: ["application", "in-progress"],
  },
  {
    id: "8",
    type: "deadline",
    title: "Deadline Passed",
    description: "UC Berkeley Chancellor's Scholarship deadline has passed",
    scholarshipName: "UC Berkeley Chancellor's Scholarship",
    timestamp: "2024-01-31T23:59:00Z",
    status: "overdue",
    priority: "high",
    tags: ["deadline", "overdue"],
  },
]

const activityTypeConfig = {
  application: { icon: FileText, color: "bg-blue-500", label: "Application" },
  deadline: { icon: Clock, color: "bg-red-500", label: "Deadline" },
  document: { icon: FileText, color: "bg-green-500", label: "Document" },
  interview: { icon: User, color: "bg-purple-500", label: "Interview" },
  "follow-up": { icon: Calendar, color: "bg-orange-500", label: "Follow-up" },
  note: { icon: FileText, color: "bg-gray-500", label: "Note" },
}

const statusConfig = {
  completed: { color: "bg-green-100 text-green-800", label: "Completed" },
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  overdue: { color: "bg-red-100 text-red-800", label: "Overdue" },
}

const priorityConfig = {
  high: { color: "bg-red-100 text-red-800", label: "High" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
  low: { color: "bg-green-100 text-green-800", label: "Low" },
}

export default function MyActivityPage() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Filter and sort activities
  const filteredAndSortedActivities = useMemo(() => {
    const filtered = activities.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || activity.type === typeFilter
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter
      const matchesPriority = priorityFilter === "all" || activity.priority === priorityFilter

      return matchesSearch && matchesType && matchesStatus && matchesPriority
    })

    // Sort activities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "oldest":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (priorityOrder[b.priority || "low"] || 1) - (priorityOrder[a.priority || "low"] || 1)
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

    return filtered
  }, [activities, searchTerm, typeFilter, statusFilter, priorityFilter, sortBy])

  // Export activities to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()

    // Add title and header
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text("Activity Report", 20, 20)

    // Add generation info
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
    doc.text(`Total Activities: ${filteredAndSortedActivities.length}`, 20, 45)

    // Add summary statistics
    doc.text(`Completed: ${stats.completed} | Pending: ${stats.pending} | Overdue: ${stats.overdue}`, 20, 55)

    // Prepare table data
    const tableData = filteredAndSortedActivities.map((activity) => [
      new Date(activity.timestamp).toLocaleDateString(),
      new Date(activity.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      activityTypeConfig[activity.type].label,
      activity.title,
      activity.scholarshipName,
      activity.status ? statusConfig[activity.status].label : "N/A",
      activity.priority ? priorityConfig[activity.priority].label : "N/A",
      activity.description.length > 50 ? activity.description.substring(0, 50) + "..." : activity.description,
    ])

    // Create the table
    autoTable(doc, {
      head: [["Date", "Time", "Type", "Title", "Scholarship", "Status", "Priority", "Description"]],
      body: tableData,
      startY: 65,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left",
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
      columnStyles: {
        0: { cellWidth: 22 }, // Date
        1: { cellWidth: 18 }, // Time
        2: { cellWidth: 20 }, // Type
        3: { cellWidth: 35 }, // Title
        4: { cellWidth: 40 }, // Scholarship
        5: { cellWidth: 20 }, // Status
        6: { cellWidth: 18 }, // Priority
        7: { cellWidth: 45 }, // Description
      },
      margin: { top: 65, left: 10, right: 10 },
      tableWidth: "auto",
      theme: "striped",
    })

    // Add footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${pageCount} | Generated from Scholarship Management Dashboard`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" },
      )
    }

    // Save the PDF
    doc.save(`activity-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const getActivityStats = () => {
    const total = activities.length
    const completed = activities.filter((a) => a.status === "completed").length
    const pending = activities.filter((a) => a.status === "pending").length
    const overdue = activities.filter((a) => a.status === "overdue").length
    const highPriority = activities.filter((a) => a.priority === "high").length

    return { total, completed, pending, overdue, highPriority }
  }

  const stats = getActivityStats()

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return activityTime.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Activity</h1>
            <p className="text-muted-foreground">Track all your scholarship-related activities and progress</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportToPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overdue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriority}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedActivities.length} of {activities.length} activities
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredAndSortedActivities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setTypeFilter("all")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedActivities.map((activity) => {
              const ActivityIcon = activityTypeConfig[activity.type].icon
              return (
                <Card key={activity.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Activity Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activityTypeConfig[activity.type].color}`}
                      >
                        <ActivityIcon className="h-5 w-5 text-white" />
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-semibold">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">{activity.scholarshipName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.status && (
                              <Badge className={statusConfig[activity.status].color}>
                                {statusConfig[activity.status].label}
                              </Badge>
                            )}
                            {activity.priority && (
                              <Badge variant="outline" className={priorityConfig[activity.priority].color}>
                                {priorityConfig[activity.priority].label}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(activity.timestamp)}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        {activity.tags && activity.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {activity.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
