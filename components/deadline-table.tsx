"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Bell,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react"
import { format, formatDistanceToNow, isPast } from "date-fns"

interface DeadlineTableProps {
  selectedDeadlines: string[]
  onSelectionChange: (selected: string[]) => void
  searchQuery: string
  statusFilter: string
  categoryFilter: string
  priorityFilter: string
  dateRangeFilter: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface Deadline {
  id: string
  title: string
  description: string
  date: Date
  category: string
  priority: "critical" | "high" | "medium" | "low"
  status: "upcoming" | "overdue" | "completed" | "cancelled"
  scholarship: string
  reminderSet: boolean
  notes?: string
}

export function DeadlineTable({
  selectedDeadlines,
  onSelectionChange,
  searchQuery,
  statusFilter,
  categoryFilter,
  priorityFilter,
  dateRangeFilter,
  sortBy,
  sortOrder,
}: DeadlineTableProps) {
  // Mock data - replace with actual data
  const deadlines: Deadline[] = [
    {
      id: "1",
      title: "MIT Application Deadline",
      description: "Submit complete application including essays, transcripts, and recommendations",
      date: new Date(2024, 1, 15),
      category: "application",
      priority: "critical",
      status: "upcoming",
      scholarship: "MIT Merit Scholarship",
      reminderSet: true,
      notes: "Need to finalize personal statement",
    },
    {
      id: "2",
      title: "Stanford Essay Submission",
      description: "Submit supplemental essays for Stanford application",
      date: new Date(2024, 1, 18),
      category: "document",
      priority: "high",
      status: "upcoming",
      scholarship: "Stanford Excellence Award",
      reminderSet: true,
    },
    {
      id: "3",
      title: "Harvard Interview",
      description: "Alumni interview scheduled via video call",
      date: new Date(2024, 1, 20),
      category: "interview",
      priority: "high",
      status: "upcoming",
      scholarship: "Harvard Leadership Grant",
      reminderSet: false,
    },
    {
      id: "4",
      title: "Yale Recommendation Letters",
      description: "Ensure all recommendation letters are submitted",
      date: new Date(2024, 1, 12),
      category: "document",
      priority: "medium",
      status: "completed",
      scholarship: "Yale Academic Scholarship",
      reminderSet: false,
    },
    {
      id: "5",
      title: "Princeton Application",
      description: "Complete Princeton University scholarship application",
      date: new Date(2024, 1, 10),
      category: "application",
      priority: "critical",
      status: "overdue",
      scholarship: "Princeton Innovation Fund",
      reminderSet: true,
      notes: "URGENT: Application is overdue!",
    },
  ]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(deadlines.map((d) => d.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectDeadline = (deadlineId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedDeadlines, deadlineId])
    } else {
      onSelectionChange(selectedDeadlines.filter((id) => id !== deadlineId))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeStatus = (date: Date) => {
    if (isPast(date)) {
      return {
        text: `${formatDistanceToNow(date)} ago`,
        color: "text-red-600",
      }
    } else {
      return {
        text: `in ${formatDistanceToNow(date)}`,
        color: "text-blue-600",
      }
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedDeadlines.length === deadlines.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-semibold">
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-semibold">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-semibold">
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-semibold">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Scholarship</TableHead>
              <TableHead>Reminder</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deadlines.map((deadline) => {
              const timeStatus = getTimeStatus(deadline.date)
              const isSelected = selectedDeadlines.includes(deadline.id)

              return (
                <TableRow key={deadline.id} className={isSelected ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectDeadline(deadline.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{deadline.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{deadline.description}</div>
                      {deadline.notes && (
                        <div className="text-xs text-orange-600 font-medium">Note: {deadline.notes}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{format(deadline.date, "MMM d, yyyy")}</div>
                      <div className={`text-sm ${timeStatus.color}`}>{timeStatus.text}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deadline.status)}
                      <Badge className={getStatusColor(deadline.status)}>{deadline.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{deadline.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-primary">{deadline.scholarship}</div>
                  </TableCell>
                  <TableCell>
                    {deadline.reminderSet ? (
                      <Bell className="h-4 w-4 text-blue-600" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Set Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Scholarship
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {deadlines.length === 0 && (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No deadlines found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or add a new deadline to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
