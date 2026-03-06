"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Check, X, Eye, AlertTriangle } from "lucide-react"
import type { ReportedContent } from "@/lib/types"

interface ContentModerationProps {
  reportedContent: ReportedContent[]
  onResolveReport: (reportId: string, action: "approve" | "reject", notes?: string) => void
}

export function ContentModeration({ reportedContent, onResolveReport }: ContentModerationProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")

  const filteredReports = reportedContent.filter((report) => {
    const matchesSearch =
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "review":
        return "bg-blue-100 text-blue-800"
      case "proposal":
        return "bg-purple-100 text-purple-800"
      case "requirement":
        return "bg-green-100 text-green-800"
      case "user":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleResolve = (action: "approve" | "reject") => {
    if (selectedReport) {
      onResolveReport(selectedReport.id, action, resolutionNotes)
      setSelectedReport(null)
      setResolutionNotes("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>Review and moderate reported content</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="proposal">Proposals</SelectItem>
                <SelectItem value="requirement">Requirements</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setTypeFilter("all")
                setStatusFilter("pending")
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Reports Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge className={getTypeColor(report.type)} variant="secondary">
                        {report.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.reason}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{report.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report)
                                // Auto-open resolution dialog
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onResolveReport(report.id, "reject")}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No reports found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Review the reported content and take appropriate action</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Content Type</label>
                  <Badge className={getTypeColor(selectedReport.type)} variant="secondary">
                    {selectedReport.type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedReport.status)} variant="secondary">
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Reported Date</label>
                  <p className="text-sm">{selectedReport.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Content ID</label>
                  <p className="text-sm font-mono">{selectedReport.contentId}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Reason</label>
                <p className="text-sm">{selectedReport.reason}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm">{selectedReport.description}</p>
              </div>

              {selectedReport.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium">Resolution Notes (Optional)</label>
                    <Textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Add notes about your decision..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleResolve("approve")} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Approve & Take Action
                    </Button>
                    <Button variant="outline" onClick={() => handleResolve("reject")} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Dismiss Report
                    </Button>
                  </div>
                </div>
              )}

              {selectedReport.status !== "pending" && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Resolved on {selectedReport.resolvedAt?.toLocaleDateString()}
                    {selectedReport.resolvedBy && ` by ${selectedReport.resolvedBy}`}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
