'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  UserPlus, 
  Users, 
  ArrowUpRight, 
  Calendar, 
  Filter, 
  Download,
  MoreVertical,
  Search,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { cn } from '@/lib/utils'

const dailyGrowthData = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 24 },
  { day: 'Fri', count: 32 },
  { day: 'Sat', count: 10 },
  { day: 'Sun', count: 8 },
]

const recentCohort = [
  { id: 'REG-201', name: 'Alexander Wright', date: 'Today, 10:45 AM', level: 'Advanced', status: 'Verified', source: 'Organic' },
  { id: 'REG-202', name: 'Sophia Chen', date: 'Today, 09:12 AM', level: 'Intermediate', status: 'Pending', source: 'Referral' },
  { id: 'REG-203', name: 'Marcus Miller', date: 'Yesterday', level: 'Beginner', status: 'Verified', source: 'Digital Ad' },
  { id: 'REG-204', name: 'Isabella Ross', date: 'Yesterday', level: 'Advanced', status: 'Verified', source: 'Organic' },
  { id: 'REG-205', name: 'Julian Thorne', date: 'June 27, 2026', level: 'Foundation', status: 'On Hold', source: 'Direct' },
  { id: 'REG-206', name: 'Elena Gilbert', date: 'June 26, 2026', level: 'Intermediate', status: 'Verified', source: 'Organic' },
  { id: 'REG-207', name: 'Damon Salvatore', date: 'June 26, 2026', level: 'Beginner', status: 'Verified', source: 'Referral' },
]

export default function RegistrationReportsPage() {
  return (
    <div className="space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-1000 pb-20">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-1">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">
             Registration Pulse
          </h1>
          <p className="font-sans text-xs tracking-[0.3em] font-black uppercase opacity-30">
             Growth Intelligence // Real-time Enrollment audit
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Search registry..." 
                className="w-64 h-12 pl-10 rounded-2xl border-primary/10 bg-card/60 backdrop-blur-md focus-visible:ring-primary/20 transition-all font-medium"
              />
           </div>
           <Button variant="outline" className="h-12 w-12 rounded-2xl p-0 border-primary/10 bg-card hover:bg-primary/5">
              <Filter className="w-4 h-4 opacity-40" />
           </Button>
           <Button className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-premium font-bold tracking-tight">
              Export Growth Data
           </Button>
        </div>
      </div>

      {/* 2. Top-Level Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <MetricCard 
            label="Registrations Today" 
            value="32" 
            sub="Active inquiries: 14" 
            trend="+18%" 
            icon={UserPlus} 
            color="oklch(0.62 0.17 240)" 
         />
         <MetricCard 
            label="Weekly Cumulative" 
            value="154" 
            sub="Target: 180" 
            trend="+24.5%" 
            icon={TrendingUp} 
            color="oklch(0.70 0.17 160)" 
         />
         <MetricCard 
            label="Conversion Velocity" 
            value="78%" 
            sub="Inquiry to Enrollment" 
            trend="+5.2%" 
            icon={Sparkles} 
            color="oklch(0.78 0.18 75)" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 3. Weekday Density Chart */}
         <Card className="lg:col-span-2 border-primary/5 shadow-sm overflow-hidden bg-card/60 backdrop-blur-xl">
            <CardHeader className="px-10 py-8 border-b border-primary/5 flex flex-row items-center justify-between">
               <div className="space-y-1">
                  <CardTitle className="font-serif text-2xl font-bold">Strategic Density</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-widest font-black opacity-30">Registration Volume per Weekday</CardDescription>
               </div>
               <div className="flex bg-muted/20 p-1 rounded-xl">
                  <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest bg-card shadow-sm rounded-lg">Weekday</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest opacity-40">Monthly</Button>
               </div>
            </CardHeader>
            <CardContent className="pt-12 pb-8 px-6">
               <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={dailyGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                        <XAxis 
                           dataKey="day" 
                           axisLine={false} 
                           tickLine={false} 
                           className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40"
                           dy={20}
                        />
                        <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           className="text-[10px] font-bold text-muted-foreground/30"
                        />
                        <Tooltip 
                           cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                           contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                              borderRadius: '16px',
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                           }}
                        />
                        <Bar 
                           dataKey="count" 
                           radius={[8, 8, 0, 0]}
                           animationDuration={1500}
                        >
                           {dailyGrowthData.map((entry, index) => (
                              <Cell 
                                 key={`cell-${index}`} 
                                 fill={entry.count > 25 ? 'oklch(0.62 0.17 240)' : 'oklch(0.62 0.17 240 / 0.1)'} 
                              />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         {/* 4. Quick Highlights / Meta */}
         <div className="space-y-8">
            <Card className="border-primary/5 bg-sidebar text-white shadow-xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
               <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-xl italic font-bold">Growth Insight</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-sm font-medium leading-relaxed opacity-70 italic font-serif">
                     "Friday remains your definitive registration peak. We suggest focusing faculty deployments on this day to handle physical audits."
                  </p>
                  <div className="pt-4 border-t border-white/10">
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        <span>Predicted Sat Volume</span>
                        <span>14-16 Registrations</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-sm">
               <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg font-bold">Registry Channels</CardTitle>
                  <CardDescription className="text-[10px] uppercase font-black tracking-widest opacity-30">Lead Source Attribution</CardDescription>
               </CardHeader>
               <CardContent className="space-y-5 pt-4">
                  <ChannelRow label="Organic Search" value={42} percentage={65} color="oklch(0.62 0.17 240)" />
                  <ChannelRow label="Referral" value={18} percentage={25} color="oklch(0.70 0.17 160)" />
                  <ChannelRow label="Digital Ads" value={8} percentage={10} color="oklch(0.78 0.18 75)" />
               </CardContent>
            </Card>
         </div>
      </div>

      {/* 5. Historical Cohort Table */}
      <Card className="border-primary/5 shadow-sm overflow-hidden min-h-[500px] mb-20 bg-card/60 backdrop-blur-xl">
         <CardHeader className="px-10 py-8 border-b border-primary/5 flex flex-row items-center justify-between">
            <div className="space-y-1">
               <CardTitle className="font-serif text-2xl font-bold">Enrollment Ledger</CardTitle>
               <CardDescription className="text-xs uppercase tracking-widest font-black opacity-30">Chronological Registration Log</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mr-4 italic">Registry Audit V4</span>
               <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-primary/5 hover:bg-primary/5 text-xs font-bold">Filter Status</Button>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="border-b border-primary/5 bg-muted/5">
                        <th className="px-10 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Personnel Name</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Registration ID</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Academic Level</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Enrollment Date</th>
                        <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Acquisition</th>
                        <th className="px-10 py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                     {recentCohort.map((reg, idx) => (
                        <motion.tr 
                           key={reg.id}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           className="hover:bg-muted/10 transition-premium group cursor-pointer"
                        >
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="text-xs font-black tracking-tighter">{reg.name.split(' ').map(n => n[0]).join('')}</span>
                                 </div>
                                 <p className="font-serif font-bold text-base text-foreground/80">{reg.name}</p>
                              </div>
                           </td>
                           <td className="px-6 py-6 font-mono text-[10px] font-bold text-muted-foreground/40 tracking-widest">{reg.id}</td>
                           <td className="px-6 py-6">
                              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/10 opacity-60">
                                 {reg.level}
                              </Badge>
                           </td>
                           <td className="px-6 py-6 text-[11px] font-bold text-muted-foreground/50">{reg.date}</td>
                           <td className="px-6 py-6 text-[10px] font-black uppercase tracking-widest opacity-30">{reg.source}</td>
                           <td className="px-10 py-6 text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                 <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    reg.status === 'Verified' ? "bg-success shadow-[0_0_8px_rgba(var(--success),0.6)]" : 
                                    reg.status === 'Pending' ? "bg-warning" : "bg-destructive/40"
                                 )} />
                                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{reg.status}</span>
                                 <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4 opacity-40" />
                                 </Button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-8 border-t border-primary/5 flex items-center justify-center">
               <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:bg-transparent gap-3">
                  System Load Completed // View Archival Registry
               </Button>
            </div>
         </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value, sub, trend, icon: Icon, color }: any) {
   return (
      <Card className="border-primary/5 shadow-sm hover-lift transition-premium group overflow-hidden">
         <CardContent className="p-10 relative">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
               <Icon className="w-32 h-32" style={{ color }} />
            </div>
            <div className="flex items-start justify-between relative z-10 font-sans">
               <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{label}</span>
                  <div className="flex items-baseline gap-2">
                     <h2 className="font-serif text-5xl font-bold tracking-tight text-foreground/90">{value}</h2>
                     <div className="flex items-center gap-1 text-[10px] font-black text-success tracking-widest">
                        <ArrowUpRight className="w-3 h-3" />
                        {trend}
                     </div>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground/30 pt-1">{sub}</p>
               </div>
               <div className="p-3 rounded-2xl border border-primary/5 bg-card/40 backdrop-blur-md">
                  <Icon className="w-5 h-5" style={{ color }} />
               </div>
            </div>
         </CardContent>
      </Card>
   )
}

function ChannelRow({ label, value, percentage, color }: any) {
   return (
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-foreground/60">{label}</span>
            <span className="text-[10px] font-black text-muted-foreground/30">{value} Regs</span>
         </div>
         <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full rounded-full"
               style={{ backgroundColor: color }}
            />
         </div>
      </div>
   )
}
