"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Filter, LayoutGrid, List, Table, SortAsc, SortDesc, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScholarshipCard } from "@/components/scholarship-card"
import { ScholarshipTable } from "@/components/scholarship-table"
import { ScholarshipList } from "@/components/scholarship-list"
import { AddScholarshipDialog } from "@/components/add-scholarship-dialog"
import { BulkActionsBar } from "@/components/bulk-actions-bar"
import { ScholarshipFilters } from "@/components/scholarship-filters"
import { ScholarshipStats } from "@/components/scholarship-stats"
import type { Scholarship, ScholarshipStatus } from "@/app/page"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Mock data - this would come from Supabase later
const initialScholarships: Scholarship[] = [
  {
    id: "1",
    institutionName: "Stanford University Merit Scholarship",
    amount: 25000,
    deadline: "2024-03-15",
    applicationLink: "https://stanford.edu/scholarships/merit",
    notes:
      "Requires 3.8 GPA minimum, essay on leadership experience. Need to submit transcripts and two recommendation letters.",
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
    notes: "STEM focused, need recommendation letters from 2 professors. Portfolio submission required.",
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
    notes: "Need-based scholarship, requires FAFSA completion. Interview may be required.",
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
    notes: "California residents only, community service requirement. Minimum 200 hours of volunteer work.",
    status: "rejected",
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-28T09:30:00Z",
  },
  {
    id: "5",
    institutionName: "Yale Academic Excellence Grant",
    amount: 35000,
    deadline: "2024-03-30",
    applicationLink: "https://yale.edu/scholarships/academic",
    notes:
      "Merit-based award for outstanding academic achievement. Requires personal statement and academic portfolio.",
    status: "applied",
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-22T16:15:00Z",
  },
  {
    id: "6",
    institutionName: "Princeton Leadership Scholarship",
    amount: 28000,
    deadline: "2024-04-15",
    applicationLink: "https://princeton.edu/scholarships/leadership",
    notes: "For students demonstrating exceptional leadership potential. Group interview process included.",
    status: "pending",
    createdAt: "2024-01-08T11:30:00Z",
    updatedAt: "2024-01-08T11:30:00Z",
  },
  {
    id: "7",
    institutionName: "Columbia Journalism Fellowship",
    amount: 20000,
    deadline: "2024-02-15",
    applicationLink: "https://columbia.edu/journalism/fellowship",
    notes: "For aspiring journalists. Portfolio of published work required. Internship component included.",
    status: "applied",
    createdAt: "2024-01-03T09:45:00Z",
    updatedAt: "2024-01-18T13:20:00Z",
  },
  {
    id: "8",
    institutionName: "NYU Arts & Sciences Scholarship",
    amount: 22000,
    deadline: "2024-05-01",
    applicationLink: "https://nyu.edu/scholarships/arts-sciences",
    notes: "Interdisciplinary scholarship for liberal arts students. Creative project submission required.",
    status: "pending",
    createdAt: "2024-01-20T15:10:00Z",
    updatedAt: "2024-01-20T15:10:00Z",
  },
]

type ViewMode = "cards" | "table" | "list"
type SortField = "institutionName" | "amount" | "deadline" | "status" | "createdAt"
type SortOrder = "asc" | "desc"

export default function AllScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [amountFilter, setAmountFilter] = useState<string>("all")
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("deadline")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Advanced filtering and sorting logic
  const filteredAndSortedScholarships = useMemo(() => {
    const filtered = scholarships.filter((scholarship) => {
      // Search filter
      const matchesSearch =
        scholarship.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.notes.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || scholarship.status === statusFilter

      // Amount filter
      let matchesAmount = true
      if (amountFilter !== "all") {
        const amount = scholarship.amount
        switch (amountFilter) {
          case "under-20k":
            matchesAmount = amount < 20000
            break
          case "20k-30k":
            matchesAmount = amount >= 20000 && amount < 30000
            break
          case "30k-40k":
            matchesAmount = amount >= 30000 && amount < 40000
            break
          case "over-40k":
            matchesAmount = amount >= 40000
            break
        }
      }

      // Deadline filter
      let matchesDeadline = true
      if (deadlineFilter !== "all") {
        const deadline = new Date(scholarship.deadline)
        const now = new Date()
        const diffTime = deadline.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (deadlineFilter) {
          case "overdue":
            matchesDeadline = diffDays < 0
            break
          case "this-week":
            matchesDeadline = diffDays >= 0 && diffDays <= 7
            break
          case "this-month":
            matchesDeadline = diffDays >= 0 && diffDays <= 30
            break
          case "future":
            matchesDeadline = diffDays > 30
            break
        }
      }

      return matchesSearch && matchesStatus && matchesAmount && matchesDeadline
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "deadline" || sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === "amount") {
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
  }, [scholarships, searchTerm, statusFilter, amountFilter, deadlineFilter, sortField, sortOrder])

  const handleAddScholarship = (newScholarship: Omit<Scholarship, "id" | "createdAt" | "updatedAt">) => {
    const scholarship: Scholarship = {
      ...newScholarship,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setScholarships((prev) => [scholarship, ...prev])
  }

  const handleUpdateScholarship = (updatedScholarship: Scholarship) => {
    setScholarships((prev) =>
      prev.map((s) =>
        s.id === updatedScholarship.id ? { ...updatedScholarship, updatedAt: new Date().toISOString() } : s,
      ),
    )
  }

  const handleDeleteScholarship = (id: string) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id))
    setSelectedScholarships((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  const handleBulkDelete = () => {
    setScholarships((prev) => prev.filter((s) => !selectedScholarships.includes(s.id)))
    setSelectedScholarships([])
  }

  const handleBulkStatusUpdate = (status: ScholarshipStatus) => {
    setScholarships((prev) =>
      prev.map((s) =>
        selectedScholarships.includes(s.id) ? { ...s, status, updatedAt: new Date().toISOString() } : s,
      ),
    )
    setSelectedScholarships([])
  }

  const handleSelectAll = () => {
    if (selectedScholarships.length === filteredAndSortedScholarships.length) {
      setSelectedScholarships([])
    } else {
      setSelectedScholarships(filteredAndSortedScholarships.map((s) => s.id))
    }
  }

  const handleSelectScholarship = (id: string) => {
    setSelectedScholarships((prev) =>
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
    // Show export options
    const exportType = window.confirm("Click OK for Excel export, Cancel for PDF export")

    if (exportType) {
      // Export to Excel
      exportToExcel()
    } else {
      // Export to PDF
      exportToPDF()
    }
  }

  const exportToExcel = () => {
    const exportData = filteredAndSortedScholarships.map((scholarship) => ({
      "Institution Name": scholarship.institutionName,
      Amount: `$${scholarship.amount.toLocaleString()}`,
      Deadline: new Date(scholarship.deadline).toLocaleDateString(),
      Status: scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1),
      "Application Link": scholarship.applicationLink,
      Notes: scholarship.notes,
      Created: new Date(scholarship.createdAt).toLocaleDateString(),
      Updated: new Date(scholarship.updatedAt).toLocaleDateString(),
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scholarships")

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 20),
    }))
    worksheet["!cols"] = colWidths

    // Generate buffer and create blob for browser download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `scholarships-${new Date().toISOString().split("T")[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text("Scholarship Applications Report", 20, 20)

    // Add generation date
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
    doc.text(`Total Scholarships: ${filteredAndSortedScholarships.length}`, 20, 45)

    // Prepare table data
    const tableData = filteredAndSortedScholarships.map((scholarship) => [
      scholarship.institutionName,
      `$${scholarship.amount.toLocaleString()}`,
      new Date(scholarship.deadline).toLocaleDateString(),
      scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1),
      scholarship.notes.length > 50 ? scholarship.notes.substring(0, 50) + "..." : scholarship.notes,
    ])

    // Add table using the autoTable plugin
    autoTable(doc, {
      head: [["Institution", "Amount", "Deadline", "Status", "Notes"]],
      body: tableData,
      startY: 55,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 60 },
      },
    })

    doc.save(`scholarships-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setAmountFilter("all")
    setDeadlineFilter("all")
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || amountFilter !== "all" || deadlineFilter !== "all"

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Scholarships</h1>
            <p className="text-muted-foreground">Manage and track all your scholarship applications</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportToExcel()}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToPDF()}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Scholarship
            </Button>
          </div>
        </div>

        {/* Stats */}
        <ScholarshipStats scholarships={scholarships} />

        {/* Search and View Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
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
                <DropdownMenuItem onClick={() => handleSort("amount")}>
                  Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("institutionName")}>
                  Name {sortField === "institutionName" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>
                  Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                  Created {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
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
          <ScholarshipFilters
            statusFilter={statusFilter}
            amountFilter={amountFilter}
            deadlineFilter={deadlineFilter}
            onStatusFilterChange={setStatusFilter}
            onAmountFilterChange={setAmountFilter}
            onDeadlineFilterChange={setDeadlineFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* Bulk Actions Bar */}
        {selectedScholarships.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedScholarships.length}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onClearSelection={() => setSelectedScholarships([])}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredAndSortedScholarships.length} of {scholarships.length} scholarships
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
                  selectedScholarships.length === filteredAndSortedScholarships.length &&
                  filteredAndSortedScholarships.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span>Select all</span>
            </div>
          )}
        </div>

        {/* Content Views */}
        {filteredAndSortedScholarships.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
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
                    Add Scholarship
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "cards" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onUpdate={handleUpdateScholarship}
                    onDelete={handleDeleteScholarship}
                    isSelected={selectedScholarships.includes(scholarship.id)}
                    onSelect={handleSelectScholarship}
                    showSelection={selectedScholarships.length > 0}
                  />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <ScholarshipList
                scholarships={filteredAndSortedScholarships}
                selectedScholarships={selectedScholarships}
                onUpdate={handleUpdateScholarship}
                onDelete={handleDeleteScholarship}
                onSelect={handleSelectScholarship}
              />
            )}

            {viewMode === "table" && (
              <ScholarshipTable
                scholarships={filteredAndSortedScholarships}
                selectedScholarships={selectedScholarships}
                onUpdate={handleUpdateScholarship}
                onDelete={handleDeleteScholarship}
                onSelect={handleSelectScholarship}
                onSelectAll={handleSelectAll}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            )}
          </>
        )}

        {/* Add Scholarship Dialog */}
        <AddScholarshipDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddScholarship} />
      </div>
    </DashboardLayout>
  )
}
