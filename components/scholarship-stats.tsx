import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Target, Clock, CheckCircle } from "lucide-react"
import type { Scholarship } from "@/app/page"

interface ScholarshipStatsProps {
  scholarships: Scholarship[]
}

export function ScholarshipStats({ scholarships }: ScholarshipStatsProps) {
  const stats = {
    total: scholarships.length,
    totalAmount: scholarships.reduce((sum, s) => sum + s.amount, 0),
    applied: scholarships.filter((s) => s.status === "applied").length,
    approved: scholarships.filter((s) => s.status === "approved").length,
    rejected: scholarships.filter((s) => s.status === "rejected").length,
    pending: scholarships.filter((s) => s.status === "pending").length,
  }

  const approvedAmount = scholarships.filter((s) => s.status === "approved").reduce((sum, s) => sum + s.amount, 0)
  const successRate = stats.total > 0 ? (stats.approved / (stats.applied + stats.approved + stats.rejected)) * 100 : 0

  // Calculate deadlines
  const now = new Date()
  const upcomingDeadlines = scholarships.filter((s) => {
    const deadline = new Date(s.deadline)
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 30
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
              {stats.pending} Pending
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
              {stats.applied} Applied
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">${approvedAmount.toLocaleString()} approved</div>
          <Progress value={(approvedAmount / stats.totalAmount) * 100} className="mt-2 h-1" />
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
            {stats.approved} of {stats.applied + stats.approved + stats.rejected} decided
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <div className="text-xs text-muted-foreground mt-1">Due within 30 days</div>
          {upcomingDeadlines > 0 && (
            <div className="mt-2">
              <div className="w-full bg-orange-100 rounded-full h-1">
                <div
                  className="bg-orange-500 h-1 rounded-full"
                  style={{ width: `${Math.min((upcomingDeadlines / stats.total) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
