'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, ArrowRight, Shield, Lock, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PORTALS = [
  {
    title: 'Admin Portal',
    subtitle: 'System Control',
    description: 'Configure institutional settings, manage user access, and oversee system health.',
    href: '/admin',
    icon: Shield,
    color: '#f59e0b', // amber-500
    bg: 'bg-amber-500/10',
    hoverBorder: 'hover:border-amber-500/30',
    hoverShadow: 'hover:shadow-amber-500/10',
    accent: 'Restricted'
  },
  {
    title: 'Teacher Portal',
    subtitle: 'Instructional Command',
    description: 'Manage classes, design assessments, and monitor student performance metrics.',
    href: '/teacher',
    icon: Users,
    color: '#10b981', // emerald-500
    bg: 'bg-emerald-500/10',
    hoverBorder: 'hover:border-emerald-500/30',
    hoverShadow: 'hover:shadow-emerald-500/10',
    accent: 'Faculty Only'
  },
  {
    title: 'Assessment Portal',
    subtitle: 'Academic Vault',
    description: 'Enter your secure credentials to initiate proctored academic assessments.',
    href: '/student',
    icon: ClipboardList,
    color: '#3b82f6', // blue-500
    bg: 'bg-blue-500/10',
    hoverBorder: 'hover:border-blue-500/30',
    hoverShadow: 'hover:shadow-blue-500/10',
    accent: 'Student Access'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 lg:px-8 bg-linear-to-b from-background to-muted/30 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="p-5 rounded-[2rem] bg-card/50 backdrop-blur-xl border border-primary/10 shadow-2xl">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-4 text-foreground">
            The Learners Academy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A digital ecosystem architected for institutional excellence, pedagogical precision, and academic integrity.
          </p>
        </motion.div>

        {/* Portal Grid */}
        <motion.div 
          className="grid gap-6 md:gap-8 md:grid-cols-3 w-full"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {PORTALS.map((portal) => (
            <motion.div
              key={portal.title}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
              className="group h-full"
            >
              <Link href={portal.href} className="block h-full">
                <Card className={`h-full border-border bg-card/60 backdrop-blur-2xl overflow-hidden transition-all duration-500 shadow-xl ${portal.hoverBorder} ${portal.hoverShadow} relative flex flex-col`}>
                  
                  {/* Hover Accent Glow */}
                  <div className="absolute inset-0 bg-linear-to-br from-transparent to-transparent group-hover:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                    <div className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground border border-border">
                      {portal.accent}
                    </div>
                  </div>

                  <CardContent className="p-8 md:p-10 flex flex-col items-center text-center h-full relative z-10 flex-grow">
                    <div className={`p-5 rounded-3xl ${portal.bg} mb-8 ring-1 ring-black/5 dark:ring-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <portal.icon className="w-10 h-10" style={{ color: portal.color }} />
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-6">
                      {portal.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-10 flex-grow">
                      {portal.description}
                    </p>

                    <Button variant="outline" className="mt-auto w-full group/btn h-12 text-sm font-bold uppercase tracking-widest transition-premium border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50">
                      Enter Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Integrity Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 flex flex-wrap justify-center gap-6 md:gap-12 text-muted-foreground opacity-60"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold">
            <Lock className="w-3.5 h-3.5" />
            Encrypted
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold">
            <Shield className="w-3.5 h-3.5" />
            Audit-Ready
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            Institutional
          </div>
        </motion.div>

      </div>
    </div>
  )
}
