"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, X, Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  bio: string
  university: string
  major: string
  graduationYear: string
  gpa: string
  interests: string[]
  avatar: string
}

const initialProfile: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1995-06-15",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  bio: "Computer Science student passionate about technology and innovation. Currently pursuing a Bachelor's degree with a focus on artificial intelligence and machine learning.",
  university: "Stanford University",
  major: "Computer Science",
  graduationYear: "2024",
  gpa: "3.8",
  interests: ["Technology", "AI/ML", "Research", "Innovation"],
  avatar: "",
}

const availableInterests = [
  "Technology",
  "AI/ML",
  "Research",
  "Innovation",
  "Engineering",
  "Medicine",
  "Business",
  "Arts",
  "Science",
  "Mathematics",
  "Literature",
  "History",
  "Psychology",
  "Environmental Studies",
  "Social Work",
  "Education",
]

export function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleInterestAdd = (interest: string) => {
    if (!profile.interests.includes(interest)) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }))
    }
  }

  const handleInterestRemove = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const maxSize = 2 * 1024 * 1024 // 2MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      })
      return false
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const processImageFile = (file: File) => {
    if (!validateFile(file)) return

    setIsUploading(true)
    setUploadProgress(0)

    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setProfile((prevProfile) => ({ ...prevProfile, avatar: result }))
              setIsUploading(false)
              toast({
                title: "Avatar updated",
                description: "Your profile picture has been successfully updated.",
              })
              return 100
            }
            return prev + 10
          })
        }, 100)
      }
    }

    reader.onerror = () => {
      setIsUploading(false)
      setUploadProgress(0)
      toast({
        title: "Upload failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      })
    }

    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleCancel = () => {
    setIsUploading(false)
    setUploadProgress(0)
  }

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture and personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div
                className={`relative group cursor-pointer transition-all duration-300 ${isDragOver ? "scale-105" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={!isUploading ? handleAvatarUpload : undefined}
              >
                <Avatar className="h-24 w-24 transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback>
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {!isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs font-medium">{uploadProgress}%</div>
                  </div>
                )}
              </div>
              {isUploading && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              {!isUploading ? (
                <>
                  <Button
                    onClick={handleAvatarUpload}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload new picture
                  </Button>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-300 ${
                      isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <p className="text-sm text-muted-foreground">Or drag and drop an image here</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 2MB</p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Uploading... {uploadProgress}%</span>
                  </div>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={profile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Update your address and location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={profile.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={profile.state} onChange={(e) => handleInputChange("state", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={profile.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={profile.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
          <CardDescription>Update your educational background and academic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={profile.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input id="major" value={profile.major} onChange={(e) => handleInputChange("major", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                value={profile.graduationYear}
                onChange={(e) => handleInputChange("graduationYear", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input id="gpa" value={profile.gpa} onChange={(e) => handleInputChange("gpa", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="cursor-pointer">
                  {interest}
                  <X className="ml-1 h-3 w-3" onClick={() => handleInterestRemove(interest)} />
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleInterestAdd}>
              <SelectTrigger>
                <SelectValue placeholder="Add an interest" />
              </SelectTrigger>
              <SelectContent>
                {availableInterests
                  .filter((interest) => !profile.interests.includes(interest))
                  .map((interest) => (
                    <SelectItem key={interest} value={interest}>
                      {interest}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
        >
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
