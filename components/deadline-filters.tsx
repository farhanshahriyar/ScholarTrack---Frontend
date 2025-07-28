"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, X, ChevronDown, SlidersHorizontal, ArrowUpDown } from "lucide-react"

interface DeadlineFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  categoryFilter: string
  onCategoryFilterChange: (category: string) => void
  priorityFilter: string
  onPriorityFilterChange: (priority: string) => void
  dateRangeFilter: string
  onDateRangeFilterChange: (range: string) => void
  sortBy: string
  onSortByChange: (sort: string) => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (order: "asc" | "desc") => void
  onClearFilters: () => void
}

export function DeadlineFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  dateRangeFilter,
  onDateRangeFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: DeadlineFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const activeFilters = [
    statusFilter !== "all" && { key: "status", value: statusFilter, label: `Status: ${statusFilter}` },
    categoryFilter !== "all" && { key: "category", value: categoryFilter, label: `Category: ${categoryFilter}` },
    priorityFilter !== "all" && { key: "priority", value: priorityFilter, label: `Priority: ${priorityFilter}` },
    dateRangeFilter !== "all" && { key: "dateRange", value: dateRangeFilter, label: `Date: ${dateRangeFilter}` },
  ].filter(Boolean)

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case "status":
        onStatusFilterChange("all")
        break
      case "category":
        onCategoryFilterChange("all")
        break
      case "priority":
        onPriorityFilterChange("all")
        break
      case "dateRange":
        onDateRangeFilterChange("all")
        break
    }
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deadlines by title, description, or scholarship..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between md:hidden">
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid gap-3">
                  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="application">Applications</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="interview">Interviews</SelectItem>
                      <SelectItem value="test">Tests</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateRangeFilter} onValueChange={onDateRangeFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="next-week">Next Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="next-month">Next Month</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="application">Applications</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="interview">Interviews</SelectItem>
                <SelectItem value="test">Tests</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRangeFilter} onValueChange={onDateRangeFilterChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="next-week">Next Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="next-month">Next Month</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeFilter(filter.key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
