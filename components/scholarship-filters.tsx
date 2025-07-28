"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ScholarshipFiltersProps {
  statusFilter: string
  amountFilter: string
  deadlineFilter: string
  onStatusFilterChange: (value: string) => void
  onAmountFilterChange: (value: string) => void
  onDeadlineFilterChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function ScholarshipFilters({
  statusFilter,
  amountFilter,
  deadlineFilter,
  onStatusFilterChange,
  onAmountFilterChange,
  onDeadlineFilterChange,
  onClearFilters,
  hasActiveFilters,
}: ScholarshipFiltersProps) {
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Range</label>
              <Select value={amountFilter} onValueChange={onAmountFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All amounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="under-20k">Under $20,000</SelectItem>
                  <SelectItem value="20k-30k">$20,000 - $30,000</SelectItem>
                  <SelectItem value="30k-40k">$30,000 - $40,000</SelectItem>
                  <SelectItem value="over-40k">Over $40,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Select value={deadlineFilter} onValueChange={onDeadlineFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All deadlines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Deadlines</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="future">Future</SelectItem>
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
              {amountFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Amount: {amountFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onAmountFilterChange("all")} />
                </Badge>
              )}
              {deadlineFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Deadline: {deadlineFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onDeadlineFilterChange("all")} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
