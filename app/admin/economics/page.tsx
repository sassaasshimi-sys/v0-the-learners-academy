'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  Building2, 
  BookOpen, 
  Megaphone,
  Download,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'

const mockTrendData = [
  { month: 'Jan', amount: 82000 },
  { month: 'Feb', amount: 94000 },
  { month: 'Mar', amount: 89000 },
  { month: 'Apr', amount: 105000 },
  { month: 'May', amount: 112000 },
  { month: 'Jun', amount: 124500 },
]

const categories = [
  { 
    title: 'Personnel Salaries', 
    amount: '74,200', 
    change: '+4.2%', 
    trend: 'up',
    icon: Briefcase,
    color: 'oklch(0.62 0.17 240)',
    description: 'Faculty and administrative payroll'
  },
  { 
    title: 'Infrastructure', 
    amount: '18,500', 
    change: '-2.1%', 
    trend: 'down',
    icon: Building2,
    color: 'oklch(0.70 0.14 240)',
    description: 'Rent, utilities, and maintenance'

  },
  { 
    title: 'Academic Supplies', 
    amount: '12,800', 
    change: '+12.5%', 
    trend: 'up',
    icon: BookOpen,
    color: 'oklch(0.70 0.17 160)',
    description: 'Books, labs, and classroom tech'
  },
  { 
    title: 'Institutional Marketing', 
    amount: '19,000', 
    change: '+8.0%', 
    trend: 'up',
    icon: Megaphone,
    color: 'oklch(0.78 0.18 75)',
    description: 'Brand awareness and digital ad spend'
  },
]

const recentTransactions = [
  { id: 'TX-8001', category: 'Supplies', description: 'Advanced Physics Lab Equipment', date: 'Jun 28, 2026', amount: '4,500.00', status: 'Completed' },
  { id: 'TX-8002', category: 'Salaries', description: 'Adjunct Faculty Disbursement - Q2', date: 'Jun 25, 2026', amount: '12,800.00', status: 'Completed' },
  { id: 'TX-8003', category: 'Marketing', description: 'Premium Social Media Campaign', date: 'Jun 21, 2026', amount: '2,400.00', status: 'Pending' },
  { id: 'TX-8004', category: 'Infrastructure', description: 'Academic Wing Fiber Connection', date: 'Jun 19, 2026', amount: '1,200.00', status: 'Completed' },
  { id: 'TX-8005', category: 'Academic', description: 'Curriculum Licensing - Global Stds', date: 'Jun 15, 2026', amount: '3,800.00', status: 'Completed' },
]

export default function EconomicsPage() {
  return (
    <div className="space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-1000 pb-20">
      {/* 1. Master Ledger Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-1">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">
             Institutional Economics
          </h1>
          <p className="font-sans text-xs tracking-[0.3em] font-black uppercase opacity-30">
             Financial Performance // Trimester II • 2026
          </p>
        </div>

        <div className="flex items-center gap-4">
           <Button variant="outline" className="h-12 px-6 rounded-2xl gap-3 border-primary/10 bg-card hover:bg-primary/5 transition-premium font-bold tracking-tight">
              <Download className="w-4 h-4 opacity-40" />
              Download Ledger
           </Button>
           <Button className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-premium font-bold tracking-tight">
              New Expenditure
           </Button>
        </div>
      </div>

      {/* 2. Global Balance Horizon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 overflow-hidden border-primary/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] bg-card/60 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-primary/5 px-10 py-8">
               <div className="space-y-1">
                  <CardTitle className="font-serif text-2xl font-bold">Expenditure Velocity</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-widest font-black opacity-40">Monthly Cumulative spend Trend</CardDescription>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">+12.4% vs Last Trimester</span>
               </div>
            </CardHeader>
            <CardContent className="pt-12 px-2">
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={mockTrendData}>
                        <defs>
                           <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40"
                          dy={20}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          className="text-[10px] font-bold text-muted-foreground/30"
                          tickFormatter={(v) => `$${v/1000}k`}
                        />
                        <Tooltip 
                           contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                              borderRadius: '16px',
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                           }}
                           labelClassName="text-xs font-black uppercase tracking-widest opacity-30 mb-2 block"
                        />
                        <Area 
                           type="monotone" 
                           dataKey="amount" 
                           stroke="var(--color-primary)" 
                           strokeWidth={4} 
                           fill="url(#expenditureGradient)" 
                           animationDuration={2000}
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="border-primary/5 bg-primary shadow-[0_40px_100px_-30px_rgba(var(--primary),0.35)] text-primary-foreground relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110 duration-1000" />
            <CardHeader className="px-10 py-8">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Total Managed Capital</span>
               <CardTitle className="font-serif text-5xl font-bold tracking-tight">$124,500.00</CardTitle>
               <div className="flex items-center gap-2 mt-4 inline-flex px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">
                  <ArrowUpRight className="w-3 h-3" />
                  Calculated against Trimester II target
               </div>
            </CardHeader>
            <CardContent className="px-10 pb-10 mt-4 space-y-6">
               <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-60">
                     <span>Budget Utilization</span>
                     <span>92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-white shadow-[0_0_15px_white]"
                     />
                  </div>
               </div>
               <p className="text-sm opacity-60 font-medium leading-relaxed italic font-serif">
                  "Institutional integrity begins with financial transparency. Our economic model remains resilient through strategic allocation."
               </p>
            </CardContent>
         </Card>
      </div>

      {/* 3. Categorical breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {categories.map((cat, idx) => (
            <motion.div
               key={cat.title}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * idx, duration: 0.8 }}
            >
               <Card className="hover-lift transition-premium border-primary/5 shadow-sm group">
                  <CardContent className="p-8">
                     <div className="flex items-center justify-between mb-8">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                           <cat.icon className="w-6 h-6" />
                        </div>
                        <div className={cn(
                           "flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-black tracking-widest",
                           cat.trend === 'up' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        )}>
                           {cat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                           {cat.change}
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-serif font-bold text-lg text-foreground/90">{cat.title}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{cat.description}</p>
                     </div>
                     <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-3xl font-serif font-bold tracking-tight">${cat.amount}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Audit V2</span>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         ))}
      </div>

      {/* 4. Chronological Ledger */}
      <Card className="border-primary/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] bg-card/60 backdrop-blur-xl">
         <CardHeader className="px-10 py-8 border-b border-primary/5 flex flex-row items-center justify-between">
            <div className="space-y-1">
               <CardTitle className="font-serif text-2xl font-bold italic">Financial Transactions</CardTitle>
               <CardDescription className="text-xs uppercase tracking-widest font-black opacity-30">Real-time expenditure feed</CardDescription>
            </div>
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-transparent transition-opacity gap-2 group">
               View All Audit Logs
               <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
         </CardHeader>
         <CardContent className="p-0">
            <div className="divide-y divide-primary/5">
               {recentTransactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 px-10 py-6 hover:bg-muted/10 transition-premium group">
                     <div className="md:col-span-2 space-y-1">
                        <p className="font-serif font-bold text-base text-foreground/80 group-hover:text-primary transition-colors">{tx.description}</p>
                        <div className="flex items-center gap-3">
                           <span className="font-mono text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest">{tx.id}</span>
                           <div className="w-1 h-1 rounded-full bg-primary/20" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">{tx.date}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold tracking-[0.2em] font-sans">
                           {tx.category.toUpperCase()}
                        </Badge>
                     </div>

                     <div className="md:col-span-2 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-xl font-serif font-bold tracking-tight">${tx.amount}</span>
                           <div className="flex items-center gap-1.5">
                              <div className={cn(
                                 "w-1 h-1 rounded-full",
                                 tx.status === 'Completed' ? "bg-success shadow-[0_0_8px_rgba(var(--success),0.8)]" : "bg-warning"
                              )} />
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{tx.status}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex justify-end pr-2">
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-primary/5 hover:bg-primary hover:text-white transition-premium group-hover:opacity-100 opacity-20">
                           <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  )
}
