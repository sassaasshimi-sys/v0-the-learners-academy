'use client'

import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  DollarSign,
  UserPlus,
  Award,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/premium-motion'
import { cn, getInitials } from '@/lib/utils'
import { useData } from '@/contexts/data-context'
import { useAuth } from '@/contexts/auth-context'
import { useHasMounted } from '@/hooks/use-has-mounted'
import { TrimesterBanner } from '@/components/shared/trimester-banner'
import { StabilityBoundary } from '@/components/stability/stability-boundary'

export default function AdminDashboard() {
  const hasMounted = useHasMounted()
  const { user } = useAuth()
  const { students, teachers, courses, stats, isInitialized } = useData()
  
  // ALL hooks must be declared here (Step 1)
  
  const enrollmentTrendData = useMemo(() => {
    if (!students || !Array.isArray(students)) return []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const nowRef = new Date()
    const trend = Array(6).fill(0).map((_, i) => {
      const d = new Date(nowRef)
      d.setDate(1)
      d.setMonth(d.getMonth() - 5 + i)
      const mIdx = d.getMonth()
      return {
        name: months[mIdx] || 'Unknown',
        value: 0,
        monthIdx: mIdx,
        year: d.getFullYear()
      }
    })

    students.filter(Boolean).forEach(student => {
      if (!student || !student.enrolledAt) return
      const date = new Date(student.enrolledAt)
      if (isNaN(date.getTime())) return
      
      const mIdx = date.getMonth()
      const yr = date.getFullYear()
      
      const bucket = trend.find(t => t.monthIdx === mIdx && t.year === yr)
      if (bucket) {
        bucket.value += 1
      }
    })

    return trend.map(({ name, value }) => ({ name, value }))
  }, [students])

  const coursePopularityData = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return []
    return [...courses.filter(Boolean)]
      .sort((a, b) => (Number(b?.enrolled) || 0) - (Number(a?.enrolled) || 0))
      .slice(0, 5)
      .map(course => {
        const title = course?.title || 'Untitled Course'
        return {
          name: title.length > 15 ? title.substring(0, 15) + '...' : title,
          value: course?.enrolled || 0
        }
      })
  }, [courses])

  // UNIFIED STABILITY GUARD (Step 2)
  if (!hasMounted || !isInitialized) {
    return <DashboardSkeleton />
  }

  // Business logic variables (Step 3) - Only runs after hydration
  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      sub: 'Cumulative Record',
      icon: GraduationCap,
      href: '/admin/students',
    },
    {
      title: 'Active Teachers',
      value: stats?.totalTeachers || 0,
      sub: 'Faculty Roster',
      icon: Users,
      href: '/admin/teachers',
    },
    {
      title: 'Institutional Growth',
      value: stats?.newEnrollments || 0,
      sub: 'Last 30 Days',
      icon: UserPlus,
      href: '/admin/students',
    },
    {
      title: 'Realized Revenue',
      value: typeof stats?.revenue === 'number' ? `Rs. ${stats.revenue.toLocaleString()}` : 'Rs. 0',
      sub: 'Fees Collected',
      icon: DollarSign,
      href: '/admin/economics',
    },
  ]

  const recentStudents = (students || []).filter(Boolean).slice(0, 5)
  const activeClasses = (courses || []).filter(c => c && c.status === 'active').slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGGER_CONTAINER}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <motion.div variants={STAGGER_ITEM}>
          <h1 className="font-serif text-3xl text-foreground font-medium">
            Welcome, {(String(user?.name || 'Admin')).split(' ').filter(Boolean)[0] || 'Admin'}
          </h1>
        </motion.div>
      </motion.div>

      <TrimesterBanner className="mb-2" />

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch"
        initial="hidden"
        animate="visible"
        variants={STAGGER_CONTAINER}
      >
        {statCards.map((stat) => (
          <motion.div key={stat.title} variants={STAGGER_ITEM}>
            <Link href={stat.href}>
              <Card className="glass-1 hover-lift cursor-pointer transition-premium rounded-2xl shadow-premium hover:translate-y-[-2px] h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                  <CardTitle className="text-editorial-label text-xl font-serif font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground opacity-50" />
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1">
                  <div className="text-2xl font-serif font-normal">{stat.value}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-muted-foreground font-normal">{stat.sub}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <StabilityBoundary name="Enrollment Analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-serif font-medium">
                <UserPlus className="w-5 h-5 text-primary" />
                Enrollment Trend
              </CardTitle>
              <CardDescription>Student enrollments over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentTrendData}>
                    <defs>
                      <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#enrollmentGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </StabilityBoundary>

        <StabilityBoundary name="Class Metrics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-serif font-medium">
                <Award className="w-5 h-5 text-accent" />
                Class Popularity
              </CardTitle>
              <CardDescription>Most enrolled classes this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coursePopularityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      className="text-xs" 
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--accent))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </StabilityBoundary>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <Card className="glass-1 lg:col-span-2 rounded-2xl shadow-premium transition-premium hover:translate-y-[-2px] h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Latest student enrollments</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/students">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-premium group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 flex items-center justify-center border group-hover:scale-105 transition-transform text-primary">
                      <span className="text-xs font-normal">
                        {getInitials(student.name, 'S')}
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-base leading-tight font-normal">{student.name}</p>
                      <p className="text-editorial-label text-xs lowercase opacity-70">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className="text-editorial-label text-xs">Term Progress</span>
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress} className="w-16 h-1" />
                        <span className="text-xs font-normal">{student.progress}%</span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-xs font-normal px-2 py-0.5",
                        student.status === 'active' 
                          ? 'text-success border-success/20 bg-success/5' 
                          : 'text-muted-foreground border-border bg-muted/20'
                      )}
                    >
                      {student.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 py-4 flex-1">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/students/registration">
                <UserPlus className="w-5 h-5 mr-3 text-primary" />
                Add New Student
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/teachers/registration">
                <Users className="w-5 h-5 mr-3 text-primary" />
                Add New Teacher
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/classes">
                <BookOpen className="w-5 h-5 mr-3 text-primary" />
                Create Class
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Classes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Classes</CardTitle>
            <CardDescription>Overview of current educational cycles</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5">
            <Link href="/admin/classes" className="flex items-center">
              Manage Registry
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {activeClasses.map((course) => (
              <div key={course.id} className="group p-5 border bg-card hover-lift transition-premium cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="text-xs font-normal bg-primary/5 text-primary">
                    {course.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {course.enrolled}/{course.capacity}
                  </span>
                </div>
                <p className="font-normal text-sm mb-1 line-clamp-1">{course.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{course.teacherName}</p>
                <Progress value={(course.enrolled / course.capacity) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
