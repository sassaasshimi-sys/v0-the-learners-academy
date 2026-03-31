'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Search, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical,
  Plus
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
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useData } from '@/contexts/data-context'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/premium-motion'
import { format, startOfDay, startOfWeek, startOfMonth, isSameDay, isSameWeek, isSameMonth, subDays } from 'date-fns'
import { toast } from 'sonner'
import { useTransition } from 'react'

/*
  Design Rules:
  - No Bold
  - No Italics
  - Subtle STAGGERED Animations
  - Editorial Excellence
*/

export default function FeeRegistryPage() {
  const { feePayments, recordPayment } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Partial' | 'Unpaid'>('All')
  const [isPending, startTransition] = useTransition()

  // --- Calculations ---
  const today = new Date()
  
  const stats = useMemo(() => {
    const daily = feePayments
      .filter(p => p.paymentDate && isSameDay(new Date(p.paymentDate), today))
      .reduce((sum, p) => sum + p.amountPaid, 0)
    
    const weekly = feePayments
      .filter(p => p.paymentDate && isSameWeek(new Date(p.paymentDate), today))
      .reduce((sum, p) => sum + p.amountPaid, 0)
    
    const monthly = feePayments
      .filter(p => p.paymentDate && isSameMonth(new Date(p.paymentDate), today))
      .reduce((sum, p) => sum + p.amountPaid, 0)

    const totalOutstanding = feePayments
      .reduce((sum, p) => sum + (p.totalAmount - p.amountPaid), 0)

    return { daily, weekly, monthly, totalOutstanding }
  }, [feePayments])

  const filteredPayments = useMemo(() => {
    return feePayments.filter(p => {
      const matchesSearch = p.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.course.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [feePayments, searchQuery, filterStatus])

  const handleQuickPayment = async (paymentId: string) => {
    const amount = prompt("Enter payment amount:")
    if (!amount || isNaN(Number(amount))) return

    startTransition(async () => {
      try {
        await recordPayment(paymentId, Number(amount))
        toast.success("Payment recorded successfully.")
      } catch (error) {
        toast.error("Failed to record payment.")
      }
    })
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Header Area */}
      <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-normal text-foreground font-normal">
            Institutional Fee Registry
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-normal max-w-2xl opacity-80 leading-relaxed">
            Administrative ledger for tuition collection, payment scheduling, and real-time financial tracking across all academic sessions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary/10 rounded-xl px-6 h-12 font-normal text-xs uppercase tracking-[0.15em] hover:bg-primary/5 transition-all">
            <Filter className="w-4 h-4 mr-3 opacity-40" /> Filter View
          </Button>
          <Button className="rounded-xl px-8 h-12 font-normal text-xs uppercase tracking-[0.15em] bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Export Audit Record
          </Button>
        </div>
      </motion.div>

      {/* Metric Cards - Daily, Weekly, Monthly */}
      <motion.div variants={STAGGER_ITEM} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Daily Collection', value: stats.daily, info: 'Today', icon: Clock, color: 'text-primary' },
          { label: 'Weekly Velocity', value: stats.weekly, info: 'Current Week', icon: ArrowUpRight, color: 'text-success' },
          { label: 'Monthly Volume', value: stats.monthly, info: 'Current Month', icon: DollarSign, color: 'text-primary' },
          { label: 'Total Outstanding', value: stats.totalOutstanding, info: 'Uncollected', icon: AlertCircle, color: 'text-destructive' },
        ].map((stat, i) => (
          <Card key={i} className="border-primary/5 bg-card/40 backdrop-blur-md shadow-premium hover-lift transition-premium">
            <CardContent className="pt-8 pb-7">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/5">
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 font-normal opacity-60">{stat.label}</p>
                  <h3 className="font-serif text-2xl font-normal tracking-tight mb-3">
                    ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-2 font-normal opacity-50 uppercase tracking-widest">{stat.info}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Registry Table */}
      <motion.div variants={STAGGER_ITEM} className="space-y-6">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-6">
            <h2 className="font-serif text-2xl font-normal text-foreground">Student Accounts</h2>
            <div className="flex gap-1 bg-muted/20 p-1 rounded-xl border border-primary/5">
              {['All', 'Paid', 'Partial', 'Unpaid'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] uppercase tracking-widest rounded-lg transition-all font-normal",
                    filterStatus === status 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <Input
              placeholder="Search registry entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-muted/10 border-primary/5 rounded-2xl focus:bg-background transition-all font-normal text-sm"
            />
          </div>
        </div>

        <Card className="border-primary/5 shadow-premium rounded-[2rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow className="border-b border-primary/5 hover:bg-transparent h-16">
                    <TableHead className="w-[300px] text-[10px] uppercase tracking-[0.2em] pl-10 h-16 font-normal text-muted-foreground">Candidate Member</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[0.2em] h-16 font-normal text-muted-foreground">Class Curriculum</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[0.2em] h-16 font-normal text-muted-foreground">Financial Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[0.2em] h-16 font-normal text-muted-foreground">Equity Contribution</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[0.2em] h-16 font-normal text-muted-foreground">Last Audit</TableHead>
                    <TableHead className="text-right pr-10 h-16 text-[10px] uppercase tracking-[0.2em] font-normal text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-32 opacity-30">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-serif text-xl font-normal">No registry entries found</p>
                        <p className="text-[10px] uppercase tracking-widest mt-2 font-normal">System awaiting transactional data</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((entry) => {
                      const balance = entry.totalAmount - entry.amountPaid
                      const progress = (entry.amountPaid / entry.totalAmount) * 100

                      return (
                        <TableRow key={entry.id} className="group border-b border-primary/5 hover:bg-primary/[0.02] transition-premium h-20">
                          <TableCell className="pl-10">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 border border-primary/5 shadow-sm group-hover:scale-105 transition-transform">
                                <AvatarImage src={entry.student.avatar} />
                                <AvatarFallback className="text-[10px] bg-primary/5 text-primary font-normal">
                                  {entry.student.name.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-normal text-foreground leading-none mb-1">{entry.student.name}</p>
                                <p className="text-[9px] uppercase tracking-tighter text-muted-foreground font-normal">ID: {entry.student.studentId || 'GEN-ST'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-normal text-foreground">{entry.course.title}</span>
                              <span className="text-[9px] uppercase tracking-widest text-primary/60 font-normal mt-0.5">{entry.course.level}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-transparent transition-all",
                              entry.status === 'Paid' && "bg-success/5 text-success border-success/10",
                              entry.status === 'Partial' && "bg-warning/5 text-warning border-warning/10",
                              entry.status === 'Unpaid' && "bg-destructive/5 text-destructive border-destructive/10"
                            )}>
                              <div className={cn(
                                "w-1 h-1 rounded-full",
                                entry.status === 'Paid' && "bg-success",
                                entry.status === 'Partial' && "bg-warning",
                                entry.status === 'Unpaid' && "bg-destructive"
                              )} />
                              {entry.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2 w-40">
                              <div className="flex justify-between items-end">
                                <span className="text-[11px] font-normal leading-none">${entry.amountPaid.toLocaleString()}</span>
                                <span className="text-[9px] text-muted-foreground font-normal opacity-50 uppercase tracking-tighter">Budget: ${entry.totalAmount.toLocaleString()}</span>
                              </div>
                              <Progress value={progress} className="h-1 bg-muted/30 [&>div]:bg-primary" />
                              {balance > 0 && (
                                <span className="text-[8px] text-destructive uppercase tracking-widest font-normal">Outstanding: ${balance.toLocaleString()}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground opacity-60">
                              <Clock className="w-3 h-3" />
                              <span className="text-[11px] font-normal">
                                {entry.paymentDate ? format(new Date(entry.paymentDate), 'MMM d, yyyy') : 'No History'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full hover:bg-primary/5 transition-all">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground opacity-40 group-hover:opacity-100" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-primary/5 shadow-premium p-1.5 overflow-hidden">
                                <DropdownMenuLabel className="text-[8px] uppercase tracking-[0.3em] opacity-40 px-4 py-3 font-normal">Account Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="opacity-5" />
                                <DropdownMenuItem onClick={() => handleQuickPayment(entry.id)} className="gap-3 cursor-pointer py-3 rounded-xl focus:bg-primary/5 transition-all font-normal">
                                  <Plus className="w-4 h-4 text-primary opacity-60" /> <span className="text-xs">Record Contribution</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-3 cursor-pointer py-3 rounded-xl focus:bg-muted font-normal">
                                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-60" /> <span className="text-xs">Issue Statement</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="opacity-5" />
                                <DropdownMenuItem className="gap-3 cursor-pointer py-3 rounded-xl focus:bg-destructive/5 text-destructive font-normal">
                                  <AlertCircle className="w-4 h-4 opacity-70" /> <span className="text-xs">Send Due Reminder</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
