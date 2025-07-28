"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X, Download } from "lucide-react"
import type { Application, ApplicationDocument } from "@/app/my-applications/page"

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string | null
  applications: Application[]
  onUpdate: (application: Application) => void
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  applicationId,
  applications,
  onUpdate,
}: DocumentUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<ApplicationDocument["type"]>("other")
  const [documentName, setDocumentName] = useState("")

  const application = applications.find((a) => a.id === applicationId)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDocumentName(file.name)
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !application) return

    const newDocument: ApplicationDocument = {
      id: Date.now().toString(),
      name: documentName || selectedFile.name,
      type: documentType,
      uploadedAt: new Date().toISOString(),
      size: selectedFile.size,
      url: "#", // In real app, this would be the uploaded file URL
    }

    const updatedApplication: Application = {
      ...application,
      documents: [...application.documents, newDocument],
      progress: Math.min(100, Math.round(((application.documents.length + 1) / application.requirements.length) * 100)),
    }

    onUpdate(updatedApplication)

    // Reset form
    setSelectedFile(null)
    setDocumentName("")
    setDocumentType("other")
  }

  const handleRemoveDocument = (documentId: string) => {
    if (!application) return

    const updatedApplication: Application = {
      ...application,
      documents: application.documents.filter((doc) => doc.id !== documentId),
      progress: Math.max(0, Math.round(((application.documents.length - 1) / application.requirements.length) * 100)),
    }

    onUpdate(updatedApplication)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getDocumentTypeColor = (type: ApplicationDocument["type"]) => {
    const colors = {
      transcript: "bg-blue-100 text-blue-800",
      essay: "bg-green-100 text-green-800",
      recommendation: "bg-purple-100 text-purple-800",
      resume: "bg-orange-100 text-orange-800",
      portfolio: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[type]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Management</DialogTitle>
          <DialogDescription>
            {application
              ? `Upload and manage documents for ${application.scholarshipName}`
              : "Select an application to manage documents"}
          </DialogDescription>
        </DialogHeader>

        {application && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upload New Document</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </div>

                {selectedFile && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Enter document name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select
                        value={documentType}
                        onValueChange={(value: ApplicationDocument["type"]) => setDocumentType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transcript">Transcript</SelectItem>
                          <SelectItem value="essay">Essay/Personal Statement</SelectItem>
                          <SelectItem value="recommendation">Recommendation Letter</SelectItem>
                          <SelectItem value="resume">Resume/CV</SelectItem>
                          <SelectItem value="portfolio">Portfolio</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleUpload} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements Checklist</h3>
              <div className="space-y-2">
                {application.requirements.map((requirement, index) => {
                  const hasDocument = application.documents.some(
                    (doc) =>
                      requirement.toLowerCase().includes(doc.type) ||
                      doc.name.toLowerCase().includes(requirement.toLowerCase()),
                  )
                  return (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className={hasDocument ? "line-through text-muted-foreground" : ""}>{requirement}</span>
                      <Badge variant={hasDocument ? "default" : "secondary"}>
                        {hasDocument ? "✓ Complete" : "Pending"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Uploaded Documents ({application.documents.length})</h3>
              {application.documents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No documents uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {application.documents.map((document) => (
                    <Card key={document.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{document.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className={getDocumentTypeColor(document.type)}>
                                  {document.type}
                                </Badge>
                                <span>{formatFileSize(document.size)}</span>
                                <span>•</span>
                                <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => window.open(document.url, "_blank")}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDocument(document.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
