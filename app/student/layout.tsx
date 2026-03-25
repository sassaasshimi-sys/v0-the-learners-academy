"use client"

import { ReactNode, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Lock, ClipboardList, LogOut, User, Bell } from "lucide-react"
import { motion } from "framer-motion"

const assessmentNavItems = [
  {
    title: "Access Vault",
    href: "/student",
    icon: Lock,
  },
  {
    title: "Assessments",
    href: "/student/assessments",
    icon: ClipboardList,
  },
]

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isStudentRoot = pathname === "/student"

  useEffect(() => {
    if (!isLoading && !user && !isStudentRoot) {
      router.push("/auth/login")
    } else if (!isLoading && user && user.role !== "student") {
      router.push(`/${user.role}`)
    }
  }, [user, isLoading, router, isStudentRoot])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if ((!user || user.role !== "student") && !isStudentRoot) {
    return null
  }

  if (!user && isStudentRoot) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-foreground">
          {children}
        </main>
      </div>
    )
  }

  // At this point, if we are here, we must have a user (because of the guard at line 57)
  // But TypeScript needs a hint.
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/student" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="The Learners Academy"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-semibold text-foreground">
                The Learners Academy
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Assessment Portal</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {assessmentNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "gap-2",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || 'Student'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(user?.name || 'Student')
                        .split(" ")
                        .filter(Boolean)
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex items-center justify-around border-t py-2 md:hidden bg-card/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          {assessmentNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-premium",
                    isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{item.title}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-foreground">
        {children}
      </main>
    </div>
  )
}
