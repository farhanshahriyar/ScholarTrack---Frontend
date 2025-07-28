"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, AlertTriangle, CheckCircle, TrendingUp, Target } from "lucide-react"

export function DeadlineStats() {
  // Mock data - replace with actual data
  const stats = {
    total: 24,
    upcoming: 8,
    overdue: 2,
    completed: 14,
    completionRate: 85,
    weeklyTrend: "+12%",
    criticalDeadlines: 3,
    thisWeek: 5,
  }

  const categoryBreakdown = [
    { category: "Applications", count: 8, color: "bg-blue-500" },
    { category: "Documents", count: 6, color: "bg-green-500" },
    { category: "Interviews", count: 4, color: "bg-purple-500" },
    { category: "Tests", count: 3, color: "bg-orange-500" },
    { category: "Other", count: 3, color: "bg-gray-500" },
  ]

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              {stats.weeklyTrend} from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">{stats.thisWeek} due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="flex items-center gap-1">
              <Badge variant="destructive" className="text-xs">
                {stats.criticalDeadlines} Critical
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">{stats.completionRate}% completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Completion Progress
            </CardTitle>
            <CardDescription>Your deadline completion rate this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{stats.upcoming}</div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Breakdown</CardTitle>
            <CardDescription>Deadlines by category type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.count}</span>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
