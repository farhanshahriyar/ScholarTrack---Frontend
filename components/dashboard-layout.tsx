"use client"

import type React from "react"
import { useState } from "react"
import { GraduationCap, Home, FileText, Activity, Settings, Menu, Bell, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "All Scholarships", href: "/all-scholarships", icon: FileText },
  { name: "My Applications", href: "/my-applications", icon: FileText },
  { name: "Deadlines", href: "/my-deadlines", icon: Calendar },
  { name: "Activity", href: "/my-activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 lg:px-6">
        <GraduationCap className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
        <span className="ml-2 text-lg lg:text-xl font-bold">
          <Link href="/">
            ScholarTrack
          </Link>
        </span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 lg:px-4">
        <nav className="space-y-1 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <item.icon className="mr-3 h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User info */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>FS</AvatarFallback>
          </Avatar>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium truncate">Farhan Shahriyar</p>
            <p className="text-xs text-muted-foreground truncate">farhan.abir9999@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 flex h-14 lg:h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-2 lg:gap-x-4">
              {/* Notifications */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full p-0 text-xs">3</Badge>
                    <span className="sr-only">View notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-w-[calc(100vw-2rem)]" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                      <span>Notifications</span>
                      <Badge variant="secondary" className="ml-2">
                        3
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="max-h-96">
                    <div className="space-y-1">
                      <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                        <div className="flex items-start w-full gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Application Deadline Approaching</p>
                            <p className="text-xs text-muted-foreground mt-1">MIT Scholarship deadline is in 3 days</p>
                            <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                        <div className="flex items-start w-full gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Application Status Updated</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your Stanford application is now under review
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                        <div className="flex items-start w-full gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Interview Scheduled</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Harvard interview scheduled for tomorrow at 2 PM
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </ScrollArea>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center">
                    <span className="text-sm text-muted-foreground">View all notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Farhan Shahriyar</p>
                      <p className="text-xs leading-none text-muted-foreground">farhan.abir9999@gmail.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
