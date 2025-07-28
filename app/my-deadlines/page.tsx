"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DeadlineStats } from "@/components/deadline-stats"
import { DeadlineFilters } from "@/components/deadline-filters"
import { DeadlineCalendar } from "@/components/deadline-calendar"
import { DeadlineList } from "@/components/deadline-list"
import { DeadlineTable } from "@/components/deadline-table"
import { AddDeadlineDialog } from "@/components/add-deadline-dialog"
import { BulkDeadlineActionsBar } from "@/components/bulk-deadline-actions-bar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, List, Table } from "lucide-react"

export default function MyDeadlinesPage() {
  const [selectedDeadlines, setSelectedDeadlines] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateRangeFilter, setDateRangeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState("calendar")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleSelectionChange = (selected: string[]) => {
    setSelectedDeadlines(selected)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setPriorityFilter("all")
    setDateRangeFilter("all")
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">My Deadlines</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Track and manage all your scholarship deadlines in one place
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Deadline
          </Button>
        </div>

        {/* Statistics */}
        <DeadlineStats />

        {/* Filters */}
        <DeadlineFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          dateRangeFilter={dateRangeFilter}
          onDateRangeFilterChange={setDateRangeFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onClearFilters={handleClearFilters}
        />

        {/* Bulk Actions */}
        {selectedDeadlines.length > 0 && (
          <BulkDeadlineActionsBar
            selectedCount={selectedDeadlines.length}
            onClearSelection={() => setSelectedDeadlines([])}
          />
        )}

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <DeadlineCalendar
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              priorityFilter={priorityFilter}
              dateRangeFilter={dateRangeFilter}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <DeadlineList
              selectedDeadlines={selectedDeadlines}
              onSelectionChange={handleSelectionChange}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              priorityFilter={priorityFilter}
              dateRangeFilter={dateRangeFilter}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <DeadlineTable
              selectedDeadlines={selectedDeadlines}
              onSelectionChange={handleSelectionChange}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              priorityFilter={priorityFilter}
              dateRangeFilter={dateRangeFilter}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </TabsContent>
        </Tabs>

        {/* Add Deadline Dialog */}
        <AddDeadlineDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
    </DashboardLayout>
  )
}
