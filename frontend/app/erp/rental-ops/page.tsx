'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  RotateCcw,
  BookOpen,
  Crown,
  Camera,
  PartyPopper,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface RentalOrder {
  id: string
  itemName: string
  category: 'Bridal & Costumes' | 'Books & Library' | 'Camera & Gear' | 'Party & Event'
  renterName: string
  renterPhone: string
  rentStartDate: string
  dueDate: string
  depositHeld: number
  rentalFee: number
  status: 'ACTIVE_RENT' | 'OVERDUE' | 'RETURNED' | 'INSPECTION_NEEDED'
  daysOverdue?: number
  conditionNotes?: string
}

const INITIAL_RENTALS: RentalOrder[] = [
  {
    id: 'RNT-9901',
    itemName: 'Designer Velvet Bridal Lehenga (Maroon / Size M)',
    category: 'Bridal & Costumes',
    renterName: 'Priya Sharma',
    renterPhone: '+1 (555) 349-2210',
    rentStartDate: '2026-09-27',
    dueDate: '2026-10-02',
    depositHeld: 350,
    rentalFee: 85,
    status: 'ACTIVE_RENT',
  },
  {
    id: 'RNT-9902',
    itemName: 'Sony FX3 Cinema Camera + 24-70mm GM Lens Kit',
    category: 'Camera & Gear',
    renterName: 'Marcus Vance Studios',
    renterPhone: '+1 (555) 890-4412',
    rentStartDate: '2026-09-25',
    dueDate: '2026-09-29',
    depositHeld: 600,
    rentalFee: 140,
    status: 'OVERDUE',
    daysOverdue: 2,
  },
  {
    id: 'RNT-9903',
    itemName: 'The Art of Computer Programming (Vol 1–4 Hardcover)',
    category: 'Books & Library',
    renterName: 'Alex Chen',
    renterPhone: '+1 (555) 772-1094',
    rentStartDate: '2026-09-15',
    dueDate: '2026-10-15',
    depositHeld: 50,
    rentalFee: 12,
    status: 'ACTIVE_RENT',
  },
  {
    id: 'RNT-9904',
    itemName: 'Luxury Canopy Tent & 40 Banquet Gold Chairs',
    category: 'Party & Event',
    renterName: 'Grand Horizon Events',
    renterPhone: '+1 (555) 431-9080',
    rentStartDate: '2026-09-28',
    dueDate: '2026-10-01',
    depositHeld: 450,
    rentalFee: 220,
    status: 'ACTIVE_RENT',
  },
  {
    id: 'RNT-9905',
    itemName: 'Classic Italian Black Tuxedo (Size 42R)',
    category: 'Bridal & Costumes',
    renterName: 'David Miller',
    renterPhone: '+1 (555) 621-3388',
    rentStartDate: '2026-09-22',
    dueDate: '2026-09-26',
    depositHeld: 200,
    rentalFee: 65,
    status: 'INSPECTION_NEEDED',
    conditionNotes: 'Returned on time. Pending dry-cleaning & seam inspection.',
  },
]

export default function RentalOpsPage() {
  const [rentals, setRentals] = useState<RentalOrder[]>(INITIAL_RENTALS)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const filteredRentals = rentals.filter((r) => {
    const matchesSearch =
      r.itemName.toLowerCase().includes(search.toLowerCase()) ||
      r.renterName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    const matchesCat = activeCategory === 'ALL' || r.category === activeCategory
    return matchesSearch && matchesCat
  })

  const handleReturnItem = (id: string, deposit: number) => {
    setRentals(
      rentals.map((r) => (r.id === id ? { ...r, status: 'RETURNED' } : r))
    )

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#34d399', '#38bdf8', '#a855f7'],
    })

    toast.success(`Item Checked-In (${id})`, {
      description: `Security deposit of $${deposit} released to customer. Stock returned to inventory.`,
    })
  }

  const handleSendReminder = (phone: string, item: string) => {
    toast.info(`WhatsApp Return Due Alert Sent to ${phone}`, {
      description: `Automated polite return reminder dispatched for ${item}.`,
    })
  }

  const activeRentCount = rentals.filter((r) => r.status === 'ACTIVE_RENT').length
  const overdueCount = rentals.filter((r) => r.status === 'OVERDUE').length
  const totalDepositEscrow = rentals
    .filter((r) => r.status !== 'RETURNED')
    .reduce((sum, r) => sum + r.depositHeld, 0)

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 right-10 -z-10 size-96 rounded-full bg-purple-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 left-10 -z-10 size-96 rounded-full bg-primary/15 blur-[140px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3 shadow-sm">
            <RotateCcw className="size-3.5" />
            <span>Rental & Circulation Ops Engine</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-success">Live Deposit Escrow Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Rental, Book & Asset Dispatch Hub
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-3xl leading-relaxed">
            Manage clothes, books, cameras, and event party rentals with automated due-date return alarms, security deposit escrow holds, and condition inspections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ShimmerButton
            className="h-11 px-5 text-xs font-semibold"
            onClick={() => toast.info('Barcode / QR Camera Scanner activated')}
          >
            <QrCode className="size-4" />
            <span>Fast Check-Out / In</span>
          </ShimmerButton>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Active Items on Rent', value: activeRentCount, desc: 'Across all customer orders', icon: RotateCcw, spotlight: 'rgba(147, 130, 255, 0.2)', border: 'rgba(147, 130, 255, 0.45)' },
          { label: 'Overdue Returns', value: overdueCount, desc: 'Late fees calculating daily', icon: AlertTriangle, spotlight: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.45)', isAlert: true },
          { label: 'Security Deposit Escrow', value: `$${totalDepositEscrow}`, desc: 'Held in customer escrow', icon: DollarSign, spotlight: 'rgba(52, 211, 153, 0.2)', border: 'rgba(52, 211, 153, 0.45)' },
          { label: 'Due in Next 48 Hours', value: 2, desc: 'WhatsApp reminders scheduled', icon: Clock, spotlight: 'rgba(56, 189, 248, 0.2)', border: 'rgba(56, 189, 248, 0.45)' },
        ].map((m, i) => (
          <SpotlightCard
            key={m.label}
            spotlightColor={m.spotlight}
            borderColor={m.border}
            className="p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">{m.label}</span>
              <span className={cn('p-2 rounded-xl bg-white/[0.04] border border-white/10', m.isAlert ? 'text-destructive' : 'text-accent')}>
                <m.icon className="size-4" />
              </span>
            </div>
            <div>
              <div className={cn('font-display text-3xl font-extrabold', m.isAlert ? 'text-destructive' : 'text-foreground')}>
                {m.value}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{m.desc}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Main Table & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rental order by ID, item name, or renter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'Bridal & Costumes', 'Books & Library', 'Camera & Gear', 'Party & Event'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  activeCategory === cat
                    ? 'bg-primary/20 border border-primary/40 text-primary'
                    : 'bg-white/[0.02] border border-white/5 text-muted-foreground hover:text-foreground'
                )}
              >
                {cat === 'ALL' ? 'All Rentals' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rentals Table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/40 backdrop-blur-xl shadow-2xl">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/10">
                <TableHead className="text-xs font-semibold text-foreground">Order ID</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Rented Item & Catalog</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Customer / Contact</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Due Date</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Deposit Held</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Rental Fee</TableHead>
                <TableHead className="text-center text-xs font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.map((r) => (
                <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-primary">{r.id}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-xs text-foreground">{r.itemName}</div>
                    <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground mt-0.5 inline-block">
                      {r.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-foreground">{r.renterName}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.renterPhone}</div>
                  </TableCell>
                  <TableCell>
                    <div className={cn('text-xs font-mono font-medium', r.status === 'OVERDUE' ? 'text-destructive font-bold' : 'text-foreground')}>
                      {r.dueDate}
                    </div>
                    {r.daysOverdue && (
                      <span className="text-[10px] text-destructive font-bold block">
                        {r.daysOverdue} days late
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-emerald-400 font-semibold">
                    ${r.depositHeld}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground font-semibold">
                    ${r.rentalFee}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-mono',
                        r.status === 'ACTIVE_RENT' && 'bg-primary/15 border-primary/30 text-primary',
                        r.status === 'OVERDUE' && 'bg-destructive/15 border-destructive/30 text-destructive',
                        r.status === 'RETURNED' && 'bg-success/15 border-success/30 text-success',
                        r.status === 'INSPECTION_NEEDED' && 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      )}
                    >
                      {r.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === 'OVERDUE' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7.5 px-2.5 border-destructive/30 text-destructive hover:bg-destructive/15"
                          onClick={() => handleSendReminder(r.renterPhone, r.itemName)}
                        >
                          Alert Renter
                        </Button>
                      )}
                      {r.status !== 'RETURNED' && (
                        <Button
                          size="sm"
                          className="text-xs h-7.5 px-2.5 bg-success/20 text-success hover:bg-success/30 border border-success/30 font-semibold"
                          onClick={() => handleReturnItem(r.id, r.depositHeld)}
                        >
                          <CheckCircle2 className="size-3.5 mr-1" />
                          <span>Check-In</span>
                        </Button>
                      )}
                      {r.status === 'RETURNED' && (
                        <span className="text-[11px] text-success font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          <span>Deposit Returned</span>
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
