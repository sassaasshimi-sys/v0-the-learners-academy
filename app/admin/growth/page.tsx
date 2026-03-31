'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  UserPlus, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  GraduationCap,
  Waves,
  History,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Cell
} from 'recharts'
import { useData } from '@/contexts/data-context'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/premium-motion'
import { format, startOfDay, startOfWeek, startOfMonth, isSameDay, isSameWeek, isSameMonth, subDays, eachDayOfInterval, subMonths } from 'date-fns'
import { cn } from '@/lib/utils'

/*
  Design Rules:
  - No Bold
  - No Italics
  - Subtle Animations
  - Premium Editorial Style
*/

export default function GrowthPage() {
  const { students, courses, isLoading } = useData()

  const stats = useMemo(() => {
    const today = new Date()
    
    const daily = students.filter(s => s.enrolledAt && isSameDay(new Date(s.enrolledAt), today)).length
    const weekly = students.filter(s => s.enrolledAt && isSameWeek(new Date(s.enrolledAt), today)).length
    const monthly = students.filter(s => s.enrolledAt && isSameMonth(new Date(s.enrolledAt), today)).length
    
    // Retention / Conversion mocks
    const totalStudents = students.length
    const activeRate = (students.filter(s => s.status === 'active').length / totalStudents) * 100

    return { daily, weekly, monthly, totalStudents, activeRate }
  }, [students])

  const trendData = useMemo(() => {
    // Last 30 days registration trend
    const end = new Date()
    const start = subDays(end, 29)
    const interval = eachDayOfInterval({ start, end })

    return interval.map(date => {
      const count = students.filter(s => s.enrolledAt && isSameDay(new Date(s.enrolledAt), date)).length
      return {
        date: format(date, 'MMM d'),
        count
      }
    })
  }, [students])

  const levelBreakdown = useMemo(() => {
    const levels = ['pre-foundation', 'foundation', 'beginner', 'intermediate', 'advanced']
    const counts = levels.map(level => ({
      name: level.toUpperCase(),
      count: courses
        .filter(c => c.level.toLowerCase().includes(level))
        .reduce((sum, c) => sum + c.enrolled, 0)
    }))
    return counts
  }, [courses])

  if (isLoading) return null

  return (
    <motion.div 
      className="space-y-6"
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Editorial Header */}
      <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl tracking-normal text-foreground font-normal">
            Growth & Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-normal max-w-2xl opacity-80">
            Institutional trajectory analysis, student retention metrics, and long-term academic growth forecasting.
          </p>
        </div>
        <div className="flex bg-muted/20 p-1.5 rounded-2xl border border-primary/5">
          <div className="px-6 py-2.5 flex items-center gap-3 bg-card border border-primary/5 shadow-sm rounded-xl">
            <Waves className="w-4 h-4 text-primary opacity-60" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-normal text-muted-foreground">Market Momentum Index</span>
          </div>
        </div>
      </motion.div>

      {/* Primary Conversion Row */}
      <motion.div variants={STAGGER_ITEM} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Daily Admissions', value: stats.daily, context: 'Registry Log (24h)', icon: UserPlus, color: 'text-primary' },
          { label: 'Weekly Growth', value: stats.weekly, context: 'Market Cycle (7d)', icon: TrendingUp, color: 'text-success' },
          { label: 'Monthly Delta', value: stats.monthly, context: 'Strategic Phase (30d)', icon: Activity, color: 'text-primary' },
          { label: 'Effective Reach', value: stats.totalStudents, context: 'Cumulative Registry', icon: Users, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <Card key={i} className="border-primary/5 shadow-premium rounded-[1.75rem] bg-card/40 backdrop-blur-md group hover:bg-card/60 transition-all">
            <CardContent className="pt-10 pb-8 relative">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className={cn("w-5 h-5", stat.color, "opacity-70")} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 font-normal opacity-60">{stat.label}</p>
                  <h3 className="font-serif text-2xl font-normal tracking-tight mb-3">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/5">
                    <History className="w-3 h-3 text-muted-foreground opacity-30" />
                    <span className="text-[10px] text-muted-foreground opacity-40 uppercase tracking-[0.2em] font-normal">{stat.context}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Rich Visual Data Row */}
      <motion.div variants={STAGGER_ITEM} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Admission Velocity Chart */}
        <Card className="lg:col-span-3 border-primary/5 shadow-premium rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-primary/5 p-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-3xl font-normal">Recruitment Velocity</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal opacity-60 mt-1">Stochastic entry distribution (Trailing 30-Day Window)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
                  <span className="text-[9px] uppercase tracking-widest opacity-40">Registered</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-16">
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.06} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, opacity: 0.4, letterSpacing: '0.1em' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, opacity: 0.4 }} 
                  />
                  <Tooltip 
                    cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card) / 0.9)', 
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px', 
                      border: '1px solid hsl(var(--primary) / 0.08)',
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#growthGradient)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Level Distribution Bar Chart */}
        <Card className="lg:col-span-2 border-primary/5 shadow-premium rounded-[2.5rem] overflow-hidden bg-muted/[0.01]">
          <CardHeader className="bg-muted/10 border-b border-primary/5 p-10 text-center">
            <h3 className="font-serif text-3xl font-normal">Registry Composition</h3>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal opacity-60 mt-1">Cross-sectional study by academic tier.</p>
          </CardHeader>
          <CardContent className="p-10 flex flex-col items-center justify-center gap-12 min-h-[400px]">
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={levelBreakdown} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground))" opacity={0.06} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, opacity: 0.5, letterSpacing: '0.1em' }}
                    width={100}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--card))', fontSize: '10px' }} />
                  <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={24}>
                    {levelBreakdown.map((entry, index) => (
                      <Cell key={index} fill={`oklch(0.62 0.17 ${240 + (index * 30)})`} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-10 w-full border-t border-primary/5 pt-10">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground opacity-50 font-normal">Retention Index</span>
                <p className="font-serif text-2xl font-normal text-success mt-2">{stats.activeRate.toFixed(1)}%</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <ArrowUpRight className="w-3 h-3 text-success opacity-40" />
                  <span className="text-[8px] uppercase tracking-tighter text-muted-foreground opacity-40 font-normal">Strategic Benchmark</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground opacity-50 font-normal">Active Curriculum</span>
                <p className="font-serif text-2xl font-normal text-foreground mt-2">{courses.length}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Target className="w-3 h-3 text-primary opacity-40" />
                  <span className="text-[8px] uppercase tracking-tighter text-muted-foreground opacity-40 font-normal">Educational Scale</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Insights / Narrative */}
      <motion.div variants={STAGGER_ITEM} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-primary/5 shadow-inner bg-card">
          <CardContent className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-success/5 border border-success/5 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-success opacity-60" />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal opacity-50 mb-1">Academic Proficiency</p>
                <p className="text-sm font-normal text-foreground leading-tight">Advanced level enrollment has exceeded forecasted targets for the Spring cycle.</p>
             </div>
          </CardContent>
        </Card>
        <Card className="border-primary/5 shadow-inner bg-card">
          <CardContent className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/5 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary opacity-60" />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal opacity-50 mb-1">Operational Cadence</p>
                <p className="text-sm font-normal text-foreground leading-tight">Registry processing time for new candidates has been optimized to sub-24h levels.</p>
             </div>
          </CardContent>
        </Card>
        <Card className="border-primary/5 shadow-inner bg-card">
          <CardContent className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-indigo-400/5 border border-indigo-400/5 flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-400 opacity-60" />
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal opacity-50 mb-1">Strategic Scaling</p>
                <p className="text-sm font-normal text-foreground leading-tight">Expansion of specialized classes (IELTS/Speaking) is fueling 40% of Q1 growth.</p>
             </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
