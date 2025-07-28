"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, X, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import type { ScholarshipStatus } from "@/app/page"

interface BulkActionsBarProps {
  selectedCount: number
  onBulkDelete: () => void
  onBulkStatusUpdate: (status: ScholarshipStatus) => void
  onClearSelection: () => void
}

export function BulkActionsBar({
  selectedCount,
  onBulkDelete,
  onBulkStatusUpdate,
  onClearSelection,
}: BulkActionsBarProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedCount} scholarship{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Select onValueChange={(value: ScholarshipStatus) => onBulkStatusUpdate(value)}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="applied">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      Applied
                    </div>
                  </SelectItem>
                  <SelectItem value="approved">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Approved
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Rejected
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
