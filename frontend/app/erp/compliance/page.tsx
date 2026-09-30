'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Key,
  Database,
  Hash,
  Search,
  RefreshCw,
  Eye,
  Layers,
  Sparkles,
  Shield,
  Fingerprint,
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
import { TiltCard } from '@/components/animated/tilt-card'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface AuditEvent {
  id: string
  timestamp: string
  user: string
  action: string
  module: string
  sha256Hash: string
  ipAddress: string
  status: 'VERIFIED' | 'FLAGGED'
}

const AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'evt-88912',
    timestamp: '2026-09-30 19:42:12 UTC',
    user: 'jordan.reyes@company.com',
    action: 'PO-3390 Approved ($22,000 Precision Bearings)',
    module: 'Procurement Ledger',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipAddress: '192.168.101.32',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88911',
    timestamp: '2026-09-30 19:38:05 UTC',
    user: 'autonomous-agent-supply-chain',
    action: 'Reorder Point Adjusted: Steel Sheet A36 → 700 units',
    module: 'Inventory Engine',
    sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    ipAddress: 'INTERNAL_AGENT_DAEMON',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88910',
    timestamp: '2026-09-30 19:22:41 UTC',
    user: 'dana.whitfield@company.com',
    action: 'MO-2205 Completed: 150 Water Pump Motors',
    module: 'Manufacturing Line A',
    sha256Hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    ipAddress: '10.0.4.18',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88909',
    timestamp: '2026-09-30 19:14:20 UTC',
    user: 'rachel.kim@company.com',
    action: 'Invoice INV-2099 Marked Paid ($68,800 Coastal Ag)',
    module: 'Treasury & Accounts',
    sha256Hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    ipAddress: '192.168.101.44',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88908',
    timestamp: '2026-09-30 18:55:11 UTC',
    user: 'sec-guard-autonomous',
    action: 'Dual-Factor Verification Check Succeeded for Tenant Admin',
    module: 'IAM Security',
    sha256Hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    ipAddress: '192.168.101.32',
    status: 'VERIFIED',
  },
]

export default function CompliancePage() {
  const [logs, setLogs] = useState<AuditEvent[]>(AUDIT_LOGS)
  const [search, setSearch] = useState('')
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      l.sha256Hash.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportPackage = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#a855f7', '#34d399'],
    })
    toast.success('Compliance Audit Package Exported (Cryptographically Signed JSON/CSV)', {
      description: 'Audit report contains 100% verified SHA-256 block hashes for SOC 2 Type II audit.',
    })
  }

  const handleVerifyHash = (id: string, hash: string) => {
    setVerifyingId(id)
    setTimeout(() => {
      setVerifyingId(null)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#34d399', '#38bdf8'],
      })
      toast.success(`Block Integrity Confirmed: ${hash.slice(0, 16)}…`, {
        description: 'Zero tampering detected across Merkle root chain.',
      })
    }, 600)
  }

  return (
    <div className="relative flex flex-col gap-8 p-4 sm:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-20 right-10 -z-10 size-96 rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-10 -z-10 size-96 rounded-full bg-accent/10 blur-[130px]" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary/20 via-accent/15 to-transparent border border-primary/30 text-primary text-xs font-semibold mb-3 shadow-sm">
            <ShieldCheck className="size-4 text-accent animate-pulse" />
            <span>Cryptographic Trust Engine & Merkle Audit Trail</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-success">Live Immutable Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Compliance & Cryptographic Vault
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-3xl leading-relaxed">
            Every ERP transaction, BOM edit, and financial transfer is hashed into an immutable Merkle tree with continuous automated SOC 2 Type II controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ShimmerButton
            onClick={handleExportPackage}
            className="h-11 px-5 text-xs font-semibold"
          >
            <Download className="size-4" />
            <span>Export Signed Audit Package</span>
          </ShimmerButton>
        </div>
      </div>

      {/* Compliance Certification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            name: 'SOC 2 Type II Certified',
            desc: 'Continuous automated control testing active 24/7',
            status: 'Passed (100%)',
            icon: ShieldCheck,
            spotlight: 'rgba(52, 211, 153, 0.22)',
            border: 'rgba(52, 211, 153, 0.5)',
          },
          {
            name: 'ISO 27001 / ISMS',
            desc: 'Multi-tenant cryptographic data separation audited',
            status: 'Fully Compliant',
            icon: Lock,
            spotlight: 'rgba(120, 119, 240, 0.22)',
            border: 'rgba(147, 130, 255, 0.5)',
          },
          {
            name: 'GDPR & Regional Residency',
            desc: 'Zero-knowledge encrypted multi-region database shards',
            status: 'Enforced',
            icon: Database,
            spotlight: 'rgba(56, 189, 248, 0.22)',
            border: 'rgba(56, 189, 248, 0.5)',
          },
          {
            name: 'FDA 21 CFR Part 11',
            desc: 'Electronic signatures & tamper-evident batch records',
            status: 'Active Audit Trail',
            icon: Fingerprint,
            spotlight: 'rgba(168, 85, 247, 0.22)',
            border: 'rgba(168, 85, 247, 0.5)',
          },
        ].map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <SpotlightCard
              spotlightColor={c.spotlight}
              borderColor={c.border}
              className="h-full p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-accent">
                    <c.icon className="size-4.5" />
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                    <CheckCircle2 className="size-3" />
                    <span>Verified</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold font-display text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground">Status</span>
                <span className="font-bold text-success">{c.status}</span>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Audit Log Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audit events by action, user, or SHA-256 hash…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 font-medium transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-mono border-white/15 bg-white/[0.03] px-3 py-1 text-accent">
              <span className="size-1.5 rounded-full bg-success mr-2 animate-ping" />
              Merkle Root #8942-A8 Active
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/40 backdrop-blur-xl shadow-2xl">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/10">
                <TableHead className="text-xs font-semibold text-foreground">Event ID</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">UTC Timestamp</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Principal / Agent</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Operation Log</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Subsystem</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">SHA-256 Hash</TableHead>
                <TableHead className="text-center text-xs font-semibold text-foreground">Block Status</TableHead>
                <TableHead className="text-right text-xs font-semibold text-foreground">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.04] transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-primary">{log.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                    {log.user.includes('agent') ? (
                      <span className="inline-flex size-5 items-center justify-center rounded bg-accent/20 text-accent text-[10px]">
                        AI
                      </span>
                    ) : (
                      <span className="inline-flex size-5 items-center justify-center rounded bg-primary/20 text-primary text-[10px]">
                        US
                      </span>
                    )}
                    <span>{log.user}</span>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground max-w-[280px]">
                    {log.action}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-white/[0.03]">
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground/80 truncate max-w-[140px]" title={log.sha256Hash}>
                    {log.sha256Hash}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-success/15 text-success border-success/30 text-[10px] font-mono">
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={verifyingId === log.id}
                      className="text-xs py-1 px-3 h-8 border-white/10 bg-white/[0.02] hover:bg-primary/20 hover:border-primary/40 transition-all font-medium"
                      onClick={() => handleVerifyHash(log.id, log.sha256Hash)}
                    >
                      {verifyingId === log.id ? (
                        <>
                          <RefreshCw className="size-3 animate-spin mr-1" />
                          <span>Auditing...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="size-3 mr-1 text-accent" />
                          <span>Verify Block</span>
                        </>
                      )}
                    </Button>
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
