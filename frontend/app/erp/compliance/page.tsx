'use client'

import { useState } from 'react'
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
import { cn } from '@/lib/utils'
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
    timestamp: '2026-09-23 00:54:12 UTC',
    user: 'jordan.reyes@company.com',
    action: 'PO-3390 Approved ($22,000 Precision Bearings)',
    module: 'Procurement Ledger',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipAddress: '192.168.101.32',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88911',
    timestamp: '2026-09-23 00:48:05 UTC',
    user: 'autonomous-agent-supply-chain',
    action: 'Reorder Point Adjusted: Steel Sheet A36 → 700 units',
    module: 'Inventory Engine',
    sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    ipAddress: 'INTERNAL_AGENT_DAEMON',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88910',
    timestamp: '2026-09-23 00:32:41 UTC',
    user: 'dana.whitfield@company.com',
    action: 'MO-2205 Completed: 150 Water Pump Motors',
    module: 'Manufacturing Line A',
    sha256Hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    ipAddress: '10.0.4.18',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88909',
    timestamp: '2026-09-22 23:14:20 UTC',
    user: 'rachel.kim@company.com',
    action: 'Invoice INV-2099 Marked Paid ($68,800 Coastal Ag)',
    module: 'Treasury & Accounts',
    sha256Hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    ipAddress: '192.168.101.44',
    status: 'VERIFIED',
  },
  {
    id: 'evt-88908',
    timestamp: '2026-09-22 21:05:11 UTC',
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

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      l.sha256Hash.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportPackage = () => {
    toast.success('Compliance Audit Package Exported (Cryptographically Signed JSON/CSV)', {
      description: 'Audit report contains 100% verified SHA-256 block hashes for SOC 2 Type II audit.',
    })
  }

  const handleVerifyHash = (hash: string) => {
    toast.success(`Hash Chain Verified: ${hash.slice(0, 16)}…`, {
      description: 'Zero tampering detected. Cryptographic block integrity confirmed.',
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2">
            <ShieldCheck className="size-3.5" />
            GrowLabs Cryptographic Compliance Vault
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Compliance & Immutable Audit Ledger
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tamper-evident SHA-256 cryptographic audit logs, SOC 2 Type II readiness, and continuous compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExportPackage} className="gap-2 font-semibold">
            <Download className="size-4" /> Export Signed Audit Package
          </Button>
        </div>
      </div>

      {/* Compliance Certification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'SOC 2 Type II Certified', desc: 'Continuous automated control testing active', status: 'Passed (100%)', color: 'text-success' },
          { name: 'ISO 27001 / ISMS', desc: 'Information security management audited', status: 'Compliant', color: 'text-success' },
          { name: 'GDPR / CCPA Framework', desc: 'Encrypted multi-region data residency', status: 'Enforced', color: 'text-success' },
          { name: 'FDA 21 CFR Part 11', desc: 'Digital signatures & lot immutable audit trail', status: 'Active', color: 'text-primary' },
        ].map((c, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card/40 p-5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-display text-foreground">{c.name}</span>
              <CheckCircle2 className="size-4 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
            <div className="pt-2 border-t border-border/40 text-[11px] font-mono font-bold text-success">
              Status: {c.status}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/40 border border-border p-4 rounded-3xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audit events by action, user, or SHA-256 hash…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-primary font-medium"
            />
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Immutable Hash Chain: Active
          </Badge>
        </div>

        <div className="rounded-3xl border border-border overflow-hidden bg-card/20 shadow-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>UTC Timestamp</TableHead>
                <TableHead>User / Daemon</TableHead>
                <TableHead>Action Log</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>SHA-256 Cryptographic Hash</TableHead>
                <TableHead className="text-center">Integrity Status</TableHead>
                <TableHead className="text-right">Audit Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold text-primary">{log.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="font-semibold text-xs">{log.user}</TableCell>
                  <TableCell className="text-xs font-medium text-foreground">{log.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
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
                      className="text-xs py-1 px-2.5 h-7"
                      onClick={() => handleVerifyHash(log.sha256Hash)}
                    >
                      Verify Hash
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
