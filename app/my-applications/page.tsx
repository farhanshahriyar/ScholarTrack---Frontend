"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Filter, LayoutGrid, List, Table, SortAsc, SortDesc, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicationCard } from "@/components/application-card"
import { ApplicationTable } from "@/components/application-table"
import { ApplicationList } from "@/components/application-list"
import { AddApplicationDialog } from "@/components/add-application-dialog"
import { BulkApplicationActionsBar } from "@/components/bulk-application-actions-bar"
import { ApplicationFilters } from "@/components/application-filters"
import { ApplicationStats } from "@/components/application-stats"
import { DocumentUploadDialog } from "@/components/document-upload-dialog"
import { InterviewScheduleDialog } from "@/components/interview-schedule-dialog"

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "interview-scheduled"
  | "approved"
  | "rejected"
  | "waitlisted"
export type ApplicationPriority = "low" | "medium" | "high" | "urgent"

export interface ApplicationDocument {
  id: string
  name: string
  type: "transcript" | "essay" | "recommendation" | "resume" | "portfolio" | "other"
  uploadedAt: string
  size: number
  url: string
}

export interface Application {
  id: string
  scholarshipName: string
  institutionName: string
  amount: number
  deadline: string
  submissionDate?: string
  status: ApplicationStatus
  priority: ApplicationPriority
  applicationLink: string
  notes: string
  documents: ApplicationDocument[]
  interviewDate?: string
  interviewType?: "in-person" | "video" | "phone"
  followUpDate?: string
  contactEmail?: string
  contactPhone?: string
  requirements: string[]
  progress: number // 0-100
  createdAt: string
  updatedAt: string
}

// Mock data - this would come from Supabase later
const initialApplications: Application[] = [
  {
    id: "1",
    scholarshipName: "Stanford University Merit Scholarship",
    institutionName: "Stanford University",
    amount: 25000,
    deadline: "2024-03-15",
    submissionDate: "2024-01-20",
    status: "under-review",
    priority: "high",
    applicationLink: "https://stanford.edu/scholarships/merit",
    notes: "Submitted all required documents. Waiting for review committee decision.",
    documents: [
      {
        id: "doc1",
        name: "Personal Statement.pdf",
        type: "essay",
        uploadedAt: "2024-01-15T10:00:00Z",
        size: 245760,
        url: "#",
      },
      {
        id: "doc2",
        name: "Official Transcript.pdf",
        type: "transcript",
        uploadedAt: "2024-01-16T14:30:00Z",
        size: 512000,
        url: "#",
      },
    ],
    requirements: ["Personal Statement", "Official Transcript", "Two Recommendation Letters", "Resume"],
    progress: 100,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    scholarshipName: "MIT Engineering Excellence Award",
    institutionName: "MIT",
    amount: 30000,
    deadline: "2024-02-28",
    status: "draft",
    priority: "urgent",
    applicationLink: "https://mit.edu/scholarships/engineering",
    notes: "Need to complete portfolio submission and get final recommendation letter.",
    documents: [
      {
        id: "doc3",
        name: "Resume.pdf",
        type: "resume",
        uploadedAt: "2024-01-10T09:15:00Z",
        size: 156000,
        url: "#",
      },
    ],
    requirements: ["Portfolio", "Resume", "Two Recommendation Letters", "Technical Essay"],
    progress: 60,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    scholarshipName: "Harvard Undergraduate Scholarship",
    institutionName: "Harvard University",
    amount: 40000,
    deadline: "2024-04-01",
    submissionDate: "2024-01-25",
    status: "interview-scheduled",
    priority: "high",
    applicationLink: "https://harvard.edu/financial-aid",
    notes: "Interview scheduled for next week. Prepare for questions about leadership experience.",
    documents: [
      {
        id: "doc4",
        name: "Leadership Essay.pdf",
        type: "essay",
        uploadedAt: "2024-01-20T16:20:00Z",
        size: 298000,
        url: "#",
      },
    ],
    interviewDate: "2024-02-05T14:00:00Z",
    interviewType: "video",
    contactEmail: "admissions@harvard.edu",
    requirements: ["Leadership Essay", "FAFSA", "Interview"],
    progress: 100,
    createdAt: "2024-01-05T16:20:00Z",
    updatedAt: "2024-01-25T11:45:00Z",
  },
  {
    id: "4",
    scholarshipName: "UC Berkeley Chancellor's Scholarship",
    institutionName: "UC Berkeley",
    amount: 15000,
    deadline: "2024-01-31",
    submissionDate: "2024-01-28",
    status: "rejected",
    priority: "medium",
    applicationLink: "https://berkeley.edu/scholarships/chancellor",
    notes: "Application was rejected due to late submission of community service documentation.",
    documents: [],
    requirements: ["Community Service Documentation", "Academic Transcript", "Personal Statement"],
    progress: 85,
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-30T09:30:00Z",
  },
  {
    id: "5",
    scholarshipName: "Yale Academic Excellence Grant",
    institutionName: "Yale University",
    amount: 35000,
    deadline: "2024-03-30",
    status: "submitted",
    priority: "high",
    applicationLink: "https://yale.edu/scholarships/academic",
    submissionDate: "2024-01-22",
    notes: "All documents submitted successfully. Awaiting initial review.",
    documents: [
      {
        id: "doc5",
        name: "Academic Portfolio.pdf",
        type: "portfolio",
        uploadedAt: "2024-01-20T14:00:00Z",
        size: 1024000,
        url: "#",
      },
    ],
    followUpDate: "2024-02-15",
    contactEmail: "scholarships@yale.edu",
    requirements: ["Academic Portfolio", "Personal Statement", "Recommendation Letters"],
    progress: 100,
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-22T16:15:00Z",
  },
  {
    id: "6",
    scholarshipName: "Princeton Leadership Scholarship",
    institutionName: "Princeton University",
    amount: 28000,
    deadline: "2024-04-15",
    status: "draft",
    priority: "medium",
    applicationLink: "https://princeton.edu/scholarships/leadership",
    notes: "Working on leadership portfolio. Need to schedule group interview.",
    documents: [],
    requirements: ["Leadership Portfolio", "Group Interview", "Peer Recommendations"],
    progress: 25,
    createdAt: "2024-01-08T11:30:00Z",
    updatedAt: "2024-01-08T11:30:00Z",
  },
  {
    id: "7",
    scholarshipName: "Columbia Journalism Fellowship",
    institutionName: "Columbia University",
    amount: 20000,
    deadline: "2024-02-15",
    status: "waitlisted",
    priority: "medium",
    applicationLink: "https://columbia.edu/journalism/fellowship",
    submissionDate: "2024-01-18",
    notes: "Placed on waitlist. Submitted additional writing samples as requested.",
    documents: [
      {
        id: "doc6",
        name: "Writing Portfolio.pdf",
        type: "portfolio",
        uploadedAt: "2024-01-15T09:45:00Z",
        size: 756000,
        url: "#",
      },
    ],
    followUpDate: "2024-03-01",
    contactEmail: "journalism@columbia.edu",
    requirements: ["Writing Portfolio", "Published Work Samples", "Interview"],
    progress: 100,
    createdAt: "2024-01-03T09:45:00Z",
    updatedAt: "2024-01-25T13:20:00Z",
  },
  {
    id: "8",
    scholarshipName: "NYU Arts & Sciences Scholarship",
    institutionName: "New York University",
    amount: 22000,
    deadline: "2024-05-01",
    status: "approved",
    priority: "low",
    applicationLink: "https://nyu.edu/scholarships/arts-sciences",
    submissionDate: "2024-01-20",
    notes: "Congratulations! Scholarship approved. Award letter received.",
    documents: [
      {
        id: "doc7",
        name: "Creative Project.pdf",
        type: "portfolio",
        uploadedAt: "2024-01-18T15:10:00Z",
        size: 2048000,
        url: "#",
      },
    ],
    requirements: ["Creative Project", "Academic Transcript", "Artist Statement"],
    progress: 100,
    createdAt: "2024-01-20T15:10:00Z",
    updatedAt: "2024-01-28T10:00:00Z",
  },
]

type ViewMode = "cards" | "table" | "list"
type SortField = "scholarshipName" | "amount" | "deadline" | "status" | "priority" | "progress" | "createdAt"
type SortOrder = "asc" | "desc"

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [progressFilter, setProgressFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("deadline")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false)
  const [isInterviewScheduleOpen, setIsInterviewScheduleOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedApplicationForDocument, setSelectedApplicationForDocument] = useState<string | null>(null)
  const [selectedApplicationForInterview, setSelectedApplicationForInterview] = useState<Application | null>(null)

  // Advanced filtering and sorting logic
  const filteredAndSortedApplications = useMemo(() => {
    const filtered = applications.filter((application) => {
      // Search filter
      const matchesSearch =
        application.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.notes.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || application.status === statusFilter

      // Priority filter
      const matchesPriority = priorityFilter === "all" || application.priority === priorityFilter

      // Progress filter
      let matchesProgress = true
      if (progressFilter !== "all") {
        const progress = application.progress
        switch (progressFilter) {
          case "not-started":
            matchesProgress = progress === 0
            break
          case "in-progress":
            matchesProgress = progress > 0 && progress < 100
            break
          case "completed":
            matchesProgress = progress === 100
            break
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesProgress
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "deadline" || sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === "amount" || sortField === "progress") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [applications, searchTerm, statusFilter, priorityFilter, progressFilter, sortField, sortOrder])

  const handleAddApplication = (newApplication: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    const application: Application = {
      ...newApplication,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setApplications((prev) => [application, ...prev])
  }

  const handleUpdateApplication = (updatedApplication: Application) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === updatedApplication.id ? { ...updatedApplication, updatedAt: new Date().toISOString() } : a,
      ),
    )
  }

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
    setSelectedApplications((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  const handleBulkDelete = () => {
    setApplications((prev) => prev.filter((a) => !selectedApplications.includes(a.id)))
    setSelectedApplications([])
  }

  const handleBulkStatusUpdate = (status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) =>
        selectedApplications.includes(a.id) ? { ...a, status, updatedAt: new Date().toISOString() } : a,
      ),
    )
    setSelectedApplications([])
  }

  const handleBulkPriorityUpdate = (priority: ApplicationPriority) => {
    setApplications((prev) =>
      prev.map((a) =>
        selectedApplications.includes(a.id) ? { ...a, priority, updatedAt: new Date().toISOString() } : a,
      ),
    )
    setSelectedApplications([])
  }

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredAndSortedApplications.length) {
      setSelectedApplications([])
    } else {
      setSelectedApplications(filteredAndSortedApplications.map((a) => a.id))
    }
  }

  const handleSelectApplication = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting applications...")
  }

  const handleDocumentUpload = (applicationId: string) => {
    setSelectedApplicationForDocument(applicationId)
    setIsDocumentUploadOpen(true)
  }

  const handleScheduleInterview = (application: Application) => {
    setSelectedApplicationForInterview(application)
    setIsInterviewScheduleOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setProgressFilter("all")
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || priorityFilter !== "all" || progressFilter !== "all"

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
            <p className="text-muted-foreground">Track and manage your scholarship application progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDocumentUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </div>
        </div>

        {/* Stats */}
        <ApplicationStats applications={applications} />

        {/* Search and View Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={hasActiveFilters ? "border-primary" : ""}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Controls */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortOrder === "asc" ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("deadline")}>
                  Deadline {sortField === "deadline" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("priority")}>
                  Priority {sortField === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("progress")}>
                  Progress {sortField === "progress" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("amount")}>
                  Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("scholarshipName")}>
                  Name {sortField === "scholarshipName" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>
                  Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none border-x"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <ApplicationFilters
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            progressFilter={progressFilter}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onProgressFilterChange={setProgressFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* Bulk Actions Bar */}
        {selectedApplications.length > 0 && (
          <BulkApplicationActionsBar
            selectedCount={selectedApplications.length}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkPriorityUpdate={handleBulkPriorityUpdate}
            onClearSelection={() => setSelectedApplications([])}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredAndSortedApplications.length} of {applications.length} applications
            {hasActiveFilters && (
              <Button variant="link" className="h-auto p-0 ml-2 text-sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
          {viewMode === "table" && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedApplications.length === filteredAndSortedApplications.length &&
                  filteredAndSortedApplications.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span>Select all</span>
            </div>
          )}
        </div>

        {/* Content Views */}
        {filteredAndSortedApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first scholarship application"}
                </p>
                {hasActiveFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "cards" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onUpdate={handleUpdateApplication}
                    onDelete={handleDeleteApplication}
                    onDocumentUpload={handleDocumentUpload}
                    onScheduleInterview={handleScheduleInterview}
                    isSelected={selectedApplications.includes(application.id)}
                    onSelect={handleSelectApplication}
                    showSelection={selectedApplications.length > 0}
                  />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <ApplicationList
                applications={filteredAndSortedApplications}
                selectedApplications={selectedApplications}
                onUpdate={handleUpdateApplication}
                onDelete={handleDeleteApplication}
                onDocumentUpload={handleDocumentUpload}
                onScheduleInterview={handleScheduleInterview}
                onSelect={handleSelectApplication}
              />
            )}

            {viewMode === "table" && (
              <ApplicationTable
                applications={filteredAndSortedApplications}
                selectedApplications={selectedApplications}
                onUpdate={handleUpdateApplication}
                onDelete={handleDeleteApplication}
                onDocumentUpload={handleDocumentUpload}
                onScheduleInterview={handleScheduleInterview}
                onSelect={handleSelectApplication}
                onSelectAll={handleSelectAll}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            )}
          </>
        )}

        {/* Dialogs */}
        <AddApplicationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddApplication} />

        <DocumentUploadDialog
          open={isDocumentUploadOpen}
          onOpenChange={setIsDocumentUploadOpen}
          applicationId={selectedApplicationForDocument}
          applications={applications}
          onUpdate={handleUpdateApplication}
        />

        <InterviewScheduleDialog
          open={isInterviewScheduleOpen}
          onOpenChange={setIsInterviewScheduleOpen}
          application={selectedApplicationForInterview}
          onUpdate={handleUpdateApplication}
        />
      </div>
    </DashboardLayout>
  )
}
