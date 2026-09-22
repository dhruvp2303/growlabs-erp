'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Employee, Department } from '@/lib/mock/data'
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

export default function HrPage() {
  const [employees, setEmployees] = useState<Employee[]>()
  const [departments, setDepartments] = useState<any[]>()
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'directory' | 'departments' | 'leave'>('directory')

  useEffect(() => {
    async function loadHrData() {
      try {
        const empData = await mockApi.getEmployees()
        const deptData = await mockApi.getDepartments()
        setEmployees(empData)
        setDepartments(deptData)
      } catch (err) {
        toast.error('Failed to load HR data.')
      } finally {
        setLoading(false)
      }
    }
    loadHrData()
  }, [])

  const uniqueDepartments = useMemo(() => {
    if (!employees) return ['All']
    return ['All', ...Array.from(new Set(employees.map((e) => e.department)))]
  }, [employees])

  // Filtered Employees
  const processedEmployees = useMemo(() => {
    if (!employees) return []
    let result = [...employees]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q),
      )
    }

    if (deptFilter !== 'All') {
      result = result.filter((e) => e.department === deptFilter)
    }

    return result
  }, [employees, search, deptFilter])

  const stats = useMemo(() => {
    if (!employees) return { headcount: 0, averageAttendance: 0, onLeaveCount: 0 }
    const headcount = employees.length
    const averageAttendance = employees.reduce((sum, e) => sum + e.attendance, 0) / (headcount || 1)
    const onLeaveCount = employees.filter((e) => e.status === 'on-leave').length
    return { headcount, averageAttendance, onLeaveCount }
  }, [employees])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading HR Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">HR & Workforce</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Oversee corporate headcount, review attendance rates, and manage leave approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> Onboard Employee
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Headcount</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.headcount} Employees</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Users className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Average Attendance</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display text-success">{stats.averageAttendance.toFixed(1)}%</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-warning/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-warning font-semibold uppercase tracking-wider">Employees On Leave</p>
            <h3 className="text-2xl font-bold mt-1.5 text-warning font-display">{stats.onLeaveCount} Active</h3>
          </div>
          <div className="rounded-xl bg-warning/10 text-warning p-3">
            <Calendar className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'directory'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Employee Directory
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'departments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Departments Headcount
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'leave'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Leave Approvals
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employees by name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
              >
                {uniqueDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Designated Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center">Monthly Attendance</TableHead>
                  <TableHead className="text-center">Staff Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedEmployees.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold">{e.name}</TableCell>
                    <TableCell>{e.role}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell className="text-center font-mono font-bold">{e.attendance}%</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          e.status === 'active' && 'bg-success/10 text-success border-success/35',
                          e.status === 'remote' && 'bg-primary/10 text-primary border-primary/35',
                          e.status === 'on-leave' && 'bg-warning/10 text-warning border-warning/35',
                        )}
                        variant="outline"
                      >
                        {e.status === 'on-leave' ? 'On Leave' : e.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map((d, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-display">{d.name} Department</h3>
                <div className="mt-6 flex justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Department Headcount</p>
                    <p className="text-xl font-bold font-display mt-0.5">{d.headcount} Active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Open Positions</p>
                    <Badge className="mt-1" variant={d.openRoles > 0 ? 'default' : 'outline'}>
                      {d.openRoles > 0 ? `${d.openRoles} Hiring` : 'Fully Staffed'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-4">
          {[
            { name: 'Rachel Kim', dept: 'Finance', type: 'Medical Leave', dates: 'Sep 02 - Sep 06 (5 days)', reason: 'Annual checkup & surgery recovery' }
          ].map((req, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border/50 bg-background/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">{req.name} ({req.dept})</p>
                <p className="text-xs text-muted-foreground mt-1">Leave type: {req.type} • Reason: {req.reason}</p>
                <p className="text-[10px] text-primary font-semibold mt-1 font-mono">{req.dates}</p>
              </div>
              <div className="text-right flex gap-2">
                <Button size="sm" className="bg-success text-success-foreground text-xs py-1.5 px-3" onClick={() => toast.success('Leave approved.')}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 text-xs py-1.5 px-3" onClick={() => toast.error('Leave rejected.')}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
