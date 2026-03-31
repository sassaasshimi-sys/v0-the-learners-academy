'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileEdit,
  History,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useData } from '@/contexts/data-context'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/premium-motion'
import { markAttendance, getTeacherAttendance } from '@/lib/actions/attendance'
import { toast } from 'sonner'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isWeekend, getDay } from 'date-fns'

/*
  Design Rules:
  - No Bold
  - No Italics
  - Subtle Animations
  - Premium Editorial Aesthetics
*/

export default function AttendancePage() {
  const { teachers, refresh } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch attendance records for the current month
  useEffect(() => {
    async function fetchAttendance() {
      setIsLoading(true)
      try {
        const data = await getTeacherAttendance(currentDate.getMonth(), currentDate.getFullYear())
        setAttendanceData(data)
      } catch (error) {
        console.error('Failed to fetch attendance:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAttendance()
  }, [currentDate])

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const selectedTeacher = useMemo(() => 
    teachers.find(t => t.id === selectedTeacherId), 
  [teachers, selectedTeacherId])

  const handleMarkAttendance = async (teacherId: string, date: string, status: string, substituteCount: number = 0) => {
    try {
      await markAttendance(teacherId, date, status, substituteCount)
      toast.success('Marked Successfully')
      // Refresh local data
      const data = await getTeacherAttendance(currentDate.getMonth(), currentDate.getFullYear())
      setAttendanceData(data)
    } catch (error) {
      toast.error('Failed to update record')
    }
  }

  const getAttendanceForDay = (teacherId: string, day: Date) => {
    return attendanceData.find(a => 
      a.teacherId === teacherId && 
      new Date(a.date).toDateString() === day.toDateString()
    )
  }

  const getTeacherStats = (teacherId: string) => {
    const teacherRecords = attendanceData.filter(a => a.teacherId === teacherId)
    return {
      present: teacherRecords.filter(r => r.status === 'Present').length,
      absent: teacherRecords.filter(r => r.status === 'Absent').length,
      late: teacherRecords.filter(r => r.status === 'Late').length,
      leave: teacherRecords.filter(r => r.status === 'Leave').length,
      substitutions: teacherRecords.reduce((sum, r) => sum + (r.substituteCount || 0), 0)
    }
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <motion.div 
      className="space-y-8"
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Header */}
      <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-5xl tracking-normal text-foreground font-normal">
            Attendance Registry
          </h1>
          <p className="text-muted-foreground mt-2 text-base font-normal max-w-2xl opacity-80">
            Administrative tracking of faculty engagement and substitute deployments.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border px-5 py-2.5 rounded-2xl border-primary/5 shadow-sm">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 hover:bg-primary/5 rounded-full">
            <ChevronLeft className="w-4 h-4 opacity-50" />
          </Button>
          <div className="flex items-center gap-3 min-w-[160px] justify-center">
            <Calendar className="w-4 h-4 text-primary opacity-40" />
            <span className="text-[10px] tracking-[0.25em] uppercase opacity-70 font-normal">{format(currentDate, 'MMMM yyyy')}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 hover:bg-primary/5 rounded-full">
            <ChevronRight className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={STAGGER_ITEM} className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Present Today', value: attendanceData.filter(a => isToday(new Date(a.date)) && a.status === 'Present').length, icon: CheckCircle2, color: 'text-success' },
          { label: 'Absent Today', value: attendanceData.filter(a => isToday(new Date(a.date)) && a.status === 'Absent').length, icon: XCircle, color: 'text-destructive' },
          { label: 'Substitutions', value: attendanceData.reduce((sum, a) => sum + (a.substituteCount || 0), 0), icon: FileEdit, color: 'text-primary' },
          { label: 'Late Entries', value: attendanceData.filter(a => isToday(new Date(a.date)) && a.status === 'Late').length, icon: Clock, color: 'text-warning' },
        ].map((stat, i) => (
          <Card key={i} className="border-primary/5 shadow-sm hover:shadow-md transition-premium">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 font-normal">{stat.label}</p>
                  <p className="font-serif text-3xl font-normal">{stat.value}</p>
                </div>
                <stat.icon className={cn("h-5 w-5 opacity-30", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Sidebar: Teacher List */}
        <motion.div variants={STAGGER_ITEM} className="lg:col-span-1 border rounded-2xl bg-card border-primary/5 p-4 h-fit shadow-sm">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal">Faculty Directory</span>
            <Users className="w-4 h-4 text-muted-foreground opacity-20" />
          </div>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {teachers.map(teacher => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-premium text-left hover:bg-muted/40 group",
                  selectedTeacherId === teacher.id ? "bg-primary/5 border border-primary/10 shadow-sm" : "border border-transparent"
                )}
              >
                <Avatar className="h-9 w-9 border border-transparent group-hover:border-primary/10 transition-all">
                  <AvatarImage src={teacher.avatar} />
                  <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className={cn("text-sm truncate font-normal", selectedTeacherId === teacher.id ? "text-foreground" : "text-muted-foreground")}>
                    {teacher.name}
                  </p>
                  <p className="text-[9px] uppercase tracking-tighter opacity-40 font-normal">{teacher.employeeId}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Main Panel: Calendar Grid */}
        <motion.div variants={STAGGER_ITEM} className="lg:col-span-3 space-y-6">
          {selectedTeacher ? (
            <Card className="border-primary/5 shadow-premium overflow-hidden">
              <CardHeader className="border-b border-primary/5 bg-muted/10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-primary/10 shadow-sm">
                      <AvatarImage src={selectedTeacher.avatar} />
                      <AvatarFallback className="font-serif bg-primary/5 text-primary text-lg font-normal">
                        {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-serif text-2xl tracking-normal font-normal">{selectedTeacher.name}</CardTitle>
                      <CardDescription className="text-[9px] uppercase tracking-[0.2em] font-normal opacity-70">
                        {selectedTeacher.employeeId} — Academic Personnel Dashboard
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 px-6 bg-background/50 py-2.5 rounded-xl border border-primary/5">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-muted-foreground uppercase font-normal tracking-wide">Present</span>
                      <span className="text-xl font-serif text-success font-normal">{getTeacherStats(selectedTeacher.id).present}</span>
                    </div>
                    <Separator orientation="vertical" className="h-8 opacity-10" />
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-muted-foreground uppercase font-normal tracking-wide">Substitutes</span>
                      <span className="text-xl font-serif text-primary font-normal">{getTeacherStats(selectedTeacher.id).substitutions}</span>
                    </div>
                    <Separator orientation="vertical" className="h-8 opacity-10" />
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-muted-foreground uppercase font-normal tracking-wide">Other</span>
                      <span className="text-xl font-serif text-muted-foreground font-normal">
                        {getTeacherStats(selectedTeacher.id).absent + getTeacherStats(selectedTeacher.id).leave + getTeacherStats(selectedTeacher.id).late}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/5">
                      <TableRow className="border-b border-primary/5 hover:bg-transparent">
                        <TableHead className="w-[150px] text-[10px] uppercase tracking-[0.2em] pl-8 h-14 font-normal text-muted-foreground">Date</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-[0.2em] h-14 font-normal text-muted-foreground">Status</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-[0.2em] h-14 font-normal text-muted-foreground">Substitution</TableHead>
                        <TableHead className="text-right pr-8 text-[10px] uppercase tracking-[0.2em] h-14 font-normal text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daysInMonth.map((day) => {
                        const record = getAttendanceForDay(selectedTeacher.id, day)
                        const isWeekendDay = isWeekend(day)
                        const formattedDate = format(day, 'yyyy-MM-dd')
                        
                        return (
                          <TableRow key={formattedDate} className={cn(
                            "group transition-premium border-b border-primary/5 hover:bg-primary/5",
                            isToday(day) && "bg-primary/5"
                          )}>
                            <TableCell className="pl-8 py-4">
                              <div className="flex flex-col">
                                <span className={cn("text-sm font-normal", isWeekendDay ? "text-muted-foreground/40" : "text-foreground")}>
                                  {format(day, 'EEEE, MMM d')}
                                </span>
                                {isToday(day) && <span className="text-[8px] uppercase tracking-widest text-primary mt-1 font-normal">Present Day</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              {record ? (
                                <div className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-transparent transition-all",
                                  record.status === 'Present' && "bg-success/10 text-success border-success/10",
                                  record.status === 'Absent' && "bg-destructive/10 text-destructive border-destructive/10",
                                  record.status === 'Late' && "bg-warning/10 text-warning border-warning/10",
                                  record.status === 'Leave' && "bg-muted text-muted-foreground"
                                )}>
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    record.status === 'Present' && "bg-success",
                                    record.status === 'Absent' && "bg-destructive",
                                    record.status === 'Late' && "bg-warning",
                                    record.status === 'Leave' && "bg-muted-foreground"
                                  )} />
                                  {record.status}
                                </div>
                              ) : (
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-20 group-hover:opacity-60 transition-opacity font-normal">
                                  Unmarked
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] transition-all border border-primary/10",
                                  (record?.substituteCount || 0) > 0 
                                    ? "bg-primary/10 text-primary shadow-sm" 
                                    : "bg-muted/20 text-muted-foreground/30"
                                )}>
                                  {record?.substituteCount || 0}
                                </div>
                                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-normal">
                                  Classes Conducted
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-10 w-10 hover:bg-primary/10 rounded-full transition-all text-muted-foreground">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 overflow-hidden rounded-2xl border-primary/10 shadow-premium p-1.5">
                                  <DropdownMenuLabel className="text-[8px] uppercase tracking-[0.3em] opacity-40 px-4 py-3 font-normal">Institutional Status</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="opacity-5" />
                                  <DropdownMenuItem onClick={() => handleMarkAttendance(selectedTeacher.id, formattedDate, 'Present')} className="gap-3 cursor-pointer py-2.5 rounded-xl focus:bg-success/5 font-normal">
                                    <CheckCircle2 className="w-4 h-4 text-success opacity-70" /> <span className="text-xs">Faculty Present</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkAttendance(selectedTeacher.id, formattedDate, 'Late')} className="gap-3 cursor-pointer py-2.5 rounded-xl focus:bg-warning/5 font-normal">
                                    <Clock className="w-4 h-4 text-warning opacity-70" /> <span className="text-xs">Late Entry Record</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkAttendance(selectedTeacher.id, formattedDate, 'Leave')} className="gap-3 cursor-pointer py-2.5 rounded-xl focus:bg-indigo-50 font-normal">
                                    <Calendar className="w-4 h-4 text-indigo-400 opacity-70" /> <span className="text-xs">Academic Leave</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkAttendance(selectedTeacher.id, formattedDate, 'Absent')} className="gap-3 cursor-pointer py-2.5 rounded-xl focus:bg-destructive/5 font-normal">
                                    <XCircle className="w-4 h-4 text-destructive opacity-70" /> <span className="text-xs">Mark Unannounced Absence</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="opacity-5" />
                                  <DropdownMenuLabel className="text-[8px] uppercase tracking-[0.3em] opacity-40 px-4 py-3 font-normal">Deployment Metrics</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    onClick={() => handleMarkAttendance(selectedTeacher.id, formattedDate, record?.status || 'Present', (record?.substituteCount || 0) + 1)} 
                                    className="gap-3 cursor-pointer py-2.5 rounded-xl focus:bg-primary/5 font-normal"
                                  >
                                    <Plus className="w-4 h-4 text-primary opacity-70" /> <span className="text-xs text-primary">Assign Substitution</span>
                                  </DropdownMenuItem>
                                  {(record?.substituteCount || 0) > 0 && (
                                    <DropdownMenuItem 
                                      onClick={() => handleMarkAttendance(selectedTeacher.id, formattedDate, record?.status || 'Present', Math.max(0, (record?.substituteCount || 0) - 1))} 
                                      className="gap-3 cursor-pointer py-2.5 rounded-xl focus:bg-destructive/5 font-normal"
                                    >
                                      <ChevronLeft className="w-4 h-4 text-destructive opacity-70" /> <span className="text-xs text-destructive">Revoke Assignment</span>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 border border-primary/5 rounded-[2.5rem] bg-card shadow-inner-premium transition-premium">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary opacity-20" />
              </div>
              <p className="font-serif text-2xl text-foreground opacity-60 font-normal">Select Academic Personnel</p>
              <p className="text-[10px] uppercase tracking-[0.3em] mt-3 opacity-40 font-normal">Institutional Registry Access Required</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
