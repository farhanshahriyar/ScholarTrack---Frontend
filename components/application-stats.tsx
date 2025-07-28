import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, FileText, Target, Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react"
import type { Application } from "@/app/my-applications/page"

interface ApplicationStatsProps {
  applications: Application[]
}

export function ApplicationStats({ applications }: ApplicationStatsProps) {
  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === "draft").length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    underReview: applications.filter((a) => a.status === "under-review").length,
    interviewScheduled: applications.filter((a) => a.status === "interview-scheduled").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    waitlisted: applications.filter((a) => a.status === "waitlisted").length,
  }

  const totalValue = applications.reduce((sum, a) => sum + a.amount, 0)
  const approvedValue = applications.filter((a) => a.status === "approved").reduce((sum, a) => sum + a.amount, 0)
  const avgProgress =
    applications.length > 0 ? applications.reduce((sum, a) => sum + a.progress, 0) / applications.length : 0

  // Calculate upcoming deadlines
  const now = new Date()
  const upcomingDeadlines = applications.filter((a) => {
    const deadline = new Date(a.deadline)
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 14 && a.status === "draft"
  }).length

  // Calculate interviews this week
  const interviewsThisWeek = applications.filter((a) => {
    if (!a.interviewDate) return false
    const interviewDate = new Date(a.interviewDate)
    const diffTime = interviewDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  }).length

  const successRate = stats.total > 0 ? (stats.approved / (stats.approved + stats.rejected)) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
              {stats.draft} Draft
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
              {stats.submitted} Submitted
            </div>
          </div>
          <Progress value={avgProgress} className="mt-2 h-1" />
          <p className="text-xs text-muted-foreground mt-1">{avgProgress.toFixed(0)}% average completion</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">${approvedValue.toLocaleString()} approved</div>
          <Progress value={(approvedValue / totalValue) * 100} className="mt-2 h-1" />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
            {stats.approved} approved applications
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {successRate > 50 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            {stats.approved} of {stats.approved + stats.rejected} decided
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
              {stats.waitlisted} Waitlisted
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1" />
              {stats.underReview} Under Review
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Urgent Actions</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-orange-500 mr-2" />
                <span>Due Soon</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{upcomingDeadlines}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <span>Interviews</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{interviewsThisWeek}</span>
            </div>
          </div>
          {(upcomingDeadlines > 0 || interviewsThisWeek > 0) && (
            <div className="mt-2">
              <div className="w-full bg-red-100 rounded-full h-1">
                <div
                  className="bg-red-500 h-1 rounded-full"
                  style={{ width: `${Math.min(((upcomingDeadlines + interviewsThisWeek) / stats.total) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
