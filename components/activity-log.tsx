import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Clock, AlertCircle, Plus, Edit, Trash2, ArrowRight } from "lucide-react"
import type { ActivityLogEntry } from "@/app/page"

interface ActivityLogProps {
  activities: ActivityLogEntry[]
}

const getActionIcon = (action: string) => {
  switch (action) {
    case "Status Updated":
      return ArrowRight
    case "Scholarship Added":
      return Plus
    case "Scholarship Deleted":
      return Trash2
    case "Application Submitted":
      return CheckCircle
    default:
      return Edit
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Clock
    case "applied":
      return AlertCircle
    case "approved":
      return CheckCircle
    case "rejected":
      return XCircle
    default:
      return AlertCircle
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-600"
    case "applied":
      return "text-blue-600"
    case "approved":
      return "text-green-600"
    case "rejected":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))

  if (diffMinutes < 1) {
    return "Just now"
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

export function ActivityLog({ activities }: ActivityLogProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
          <p className="text-muted-foreground text-center">
            Activity logs will appear here when you add or update scholarships
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent changes and updates to your scholarship applications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const ActionIcon = getActionIcon(activity.action)
              const isStatusUpdate = activity.action === "Status Updated"

              return (
                <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <ActionIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground mt-1">{activity.scholarshipName}</p>

                        {isStatusUpdate && activity.oldStatus && activity.newStatus && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {React.createElement(getStatusIcon(activity.oldStatus), {
                                className: `h-3 w-3 mr-1 ${getStatusColor(activity.oldStatus)}`,
                              })}
                              {activity.oldStatus}
                            </Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <Badge variant="outline" className="text-xs">
                              {React.createElement(getStatusIcon(activity.newStatus), {
                                className: `h-3 w-3 mr-1 ${getStatusColor(activity.newStatus)}`,
                              })}
                              {activity.newStatus}
                            </Badge>
                          </div>
                        )}

                        {activity.details && <p className="text-xs text-muted-foreground mt-2">{activity.details}</p>}
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
