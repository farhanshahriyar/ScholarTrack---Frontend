import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Scholarship } from "@/app/page"

interface StatsCardsProps {
  scholarships: Scholarship[]
}

export function StatsCards({ scholarships }: StatsCardsProps) {
  const stats = {
    total: scholarships.length,
    totalAmount: scholarships.reduce((sum, s) => sum + s.amount, 0),
    applied: scholarships.filter((s) => s.status === "applied").length,
    approved: scholarships.filter((s) => s.status === "approved").length,
    rejected: scholarships.filter((s) => s.status === "rejected").length,
    pending: scholarships.filter((s) => s.status === "pending").length,
  }

  const approvedAmount = scholarships.filter((s) => s.status === "approved").reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Active scholarship applications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Combined scholarship value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${approvedAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{stats.approved} approved applications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Overview</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {stats.pending > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {stats.pending} Pending
              </Badge>
            )}
            {stats.applied > 0 && (
              <Badge variant="default" className="text-xs">
                {stats.applied} Applied
              </Badge>
            )}
            {stats.approved > 0 && (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                {stats.approved} Approved
              </Badge>
            )}
            {stats.rejected > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.rejected} Rejected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
