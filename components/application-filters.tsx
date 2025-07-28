"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ApplicationFiltersProps {
  statusFilter: string
  priorityFilter: string
  progressFilter: string
  onStatusFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onProgressFilterChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function ApplicationFilters({
  statusFilter,
  priorityFilter,
  progressFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onProgressFilterChange,
  onClearFilters,
  hasActiveFilters,
}: ApplicationFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Progress</label>
              <Select value={progressFilter} onValueChange={onProgressFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All progress" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Progress</SelectItem>
                  <SelectItem value="not-started">Not Started (0%)</SelectItem>
                  <SelectItem value="in-progress">In Progress (1-99%)</SelectItem>
                  <SelectItem value="completed">Completed (100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onStatusFilterChange("all")} />
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {priorityFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onPriorityFilterChange("all")} />
                </Badge>
              )}
              {progressFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Progress: {progressFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onProgressFilterChange("all")} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
