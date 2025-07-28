"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

interface DeadlineCalendarProps {
  searchQuery: string
  statusFilter: string
  categoryFilter: string
  priorityFilter: string
  dateRangeFilter: string
}

interface Deadline {
  id: string
  title: string
  date: Date
  category: string
  priority: "critical" | "high" | "medium" | "low"
  status: "upcoming" | "overdue" | "completed" | "cancelled"
  scholarship: string
}

export function DeadlineCalendar({
  searchQuery,
  statusFilter,
  categoryFilter,
  priorityFilter,
  dateRangeFilter,
}: DeadlineCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Mock data - replace with actual data
  const deadlines: Deadline[] = [
    {
      id: "1",
      title: "MIT Application Deadline",
      date: new Date(2024, 1, 15),
      category: "application",
      priority: "critical",
      status: "upcoming",
      scholarship: "MIT Merit Scholarship",
    },
    {
      id: "2",
      title: "Stanford Essay Submission",
      date: new Date(2024, 1, 18),
      category: "document",
      priority: "high",
      status: "upcoming",
      scholarship: "Stanford Excellence Award",
    },
    {
      id: "3",
      title: "Harvard Interview",
      date: new Date(2024, 1, 20),
      category: "interview",
      priority: "high",
      status: "upcoming",
      scholarship: "Harvard Leadership Grant",
    },
    {
      id: "4",
      title: "Yale Recommendation Letters",
      date: new Date(2024, 1, 12),
      category: "document",
      priority: "medium",
      status: "completed",
      scholarship: "Yale Academic Scholarship",
    },
    {
      id: "5",
      title: "Princeton Application",
      date: new Date(2024, 1, 10),
      category: "application",
      priority: "critical",
      status: "overdue",
      scholarship: "Princeton Innovation Fund",
    },
  ]

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getDeadlinesForDate = (date: Date) => {
    return deadlines.filter((deadline) => isSameDay(deadline.date, date))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-3 w-3" />
      case "overdue":
        return <AlertTriangle className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-blue-600 bg-blue-50"
      case "overdue":
        return "text-red-600 bg-red-50"
      case "completed":
        return "text-green-600 bg-green-50"
      case "cancelled":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const selectedDateDeadlines = selectedDate ? getDeadlinesForDate(selectedDate) : []

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dayDeadlines = getDeadlinesForDate(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentDate)

                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      min-h-24 p-1 border rounded-lg cursor-pointer transition-colors
                      ${isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"}
                      ${!isCurrentMonth ? "opacity-50" : ""}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                    <div className="space-y-1">
                      {dayDeadlines.slice(0, 2).map((deadline) => (
                        <div
                          key={deadline.id}
                          className={`
                            text-xs p-1 rounded text-white truncate
                            ${getPriorityColor(deadline.priority)}
                          `}
                          title={deadline.title}
                        >
                          {deadline.title}
                        </div>
                      ))}
                      {dayDeadlines.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayDeadlines.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {selectedDateDeadlines.length > 0 ? (
                  selectedDateDeadlines.map((deadline) => (
                    <div key={deadline.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{deadline.title}</h4>
                        <div className={`p-1 rounded ${getStatusColor(deadline.status)}`}>
                          {getStatusIcon(deadline.status)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{deadline.scholarship}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(deadline.priority)} text-white border-none`}
                        >
                          {deadline.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {deadline.category}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No deadlines on this date</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click on a date to view deadlines</p>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Priority Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { priority: "critical", label: "Critical", color: "bg-red-500" },
              { priority: "high", label: "High", color: "bg-orange-500" },
              { priority: "medium", label: "Medium", color: "bg-yellow-500" },
              { priority: "low", label: "Low", color: "bg-green-500" },
            ].map((item) => (
              <div key={item.priority} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
