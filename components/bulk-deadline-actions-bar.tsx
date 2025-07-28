"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, X, Bell, Download, Trash2, Calendar, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BulkDeadlineActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
}

export function BulkDeadlineActionsBar({ selectedCount, onClearSelection }: BulkDeadlineActionsBarProps) {
  const { toast } = useToast()

  const handleBulkAction = (action: string) => {
    toast({
      title: "Action completed",
      description: `${action} applied to ${selectedCount} deadline${selectedCount > 1 ? "s" : ""}.`,
    })
    onClearSelection()
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="font-medium">
              {selectedCount} selected
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 px-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Clear selection</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Actions Dropdown */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction("Mark as completed")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Set reminders")}>
                    <Bell className="mr-2 h-4 w-4" />
                    Set Reminders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Reschedule")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Export")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Delete")} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Mark as completed")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Completed
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Set reminders")}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Set Reminders
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Export")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Delete")}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
