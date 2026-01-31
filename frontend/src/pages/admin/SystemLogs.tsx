import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Server,
  Database,
  Shield,
  Clock
} from 'lucide-react'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/EmptyState'

interface LogEntry {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  source: string
  userId?: string
  metadata?: Record<string, any>
}

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('24h')

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['system-logs', levelFilter, sourceFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: levelFilter !== 'all' ? levelFilter : '',
        source: sourceFilter !== 'all' ? sourceFilter : '',
        period: dateRange,
      })
      
      const response = await api.get(`/admin/logs?${params}`)
      return response.data.logs as LogEntry[]
    },
  })

  // Mock system metrics
  const systemMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Memory Usage', value: 68, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disk Usage', value: 82, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Database Connections', value: 24, unit: '', status: 'healthy', trend: 'stable' },
    { name: 'API Response Time', value: 128, unit: 'ms', status: 'healthy', trend: 'down' },
    { name: 'Error Rate', value: 0.2, unit: '%', status: 'healthy', trend: 'stable' },
  ]

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'warn':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>
      case 'debug':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Debug</Badge>
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'debug':
        return <Database className="h-4 w-4 text-purple-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'critical':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const exportLogs = () => {
    const csvContent = logs?.map(log => 
      `${log.timestamp},${log.level},${log.source},${log.message}`
    ).join('\n')
    
    const blob = new Blob([csvContent || ''], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
              <p className="text-muted-foreground">
                Monitor system health and view application logs
              </p>
            </div>
            <Button onClick={exportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="metrics">System Metrics</TabsTrigger>
            <TabsTrigger value="logs">Application Logs</TabsTrigger>
            <TabsTrigger value="security">Security Logs</TabsTrigger>
          </TabsList>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {systemMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.name}
                        </p>
                        <div className="mt-2 flex items-baseline">
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <span className="ml-1 text-sm text-muted-foreground">
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Trend</span>
                        <span className={`font-medium ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {metric.trend === 'up' ? '↗ Increasing' :
                           metric.trend === 'down' ? '↘ Decreasing' :
                           '→ Stable'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Overview of system components and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">API Server</p>
                        <p className="text-sm text-muted-foreground">
                          Status: Running • Uptime: 99.8%
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-muted-foreground">
                          PostgreSQL 15 • 24 active connections
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Security Monitoring</p>
                        <p className="text-sm text-muted-foreground">
                          12 failed login attempts in last hour
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-50 text-yellow-700">Warning</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Application Logs</CardTitle>
                <CardDescription>
                  Monitor application events and errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                  <div>
                    <Label>Search</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Level</Label>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Errors</SelectItem>
                        <SelectItem value="warn">Warnings</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Source</Label>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="auth">Authentication</SelectItem>
                        <SelectItem value="ai">AI Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Time Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last hour</SelectItem>
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Logs Table */}
                {logsLoading ? (
                  <div className="flex justify-center p-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : logs?.length === 0 ? (
                  <EmptyState
                    icon={Info}
                    title="No logs found"
                    description="Try adjusting your filters or check back later."
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>User</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs?.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-mono">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getLevelIcon(log.level)}
                                {getLevelBadge(log.level)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.source}</Badge>
                            </TableCell>
                            <TableCell className="max-w-md">
                              <p className="truncate font-mono text-sm">
                                {log.message}
                              </p>
                            </TableCell>
                            <TableCell>
                              {log.userId ? (
                                <Badge variant="secondary">User: {log.userId.slice(0, 8)}...</Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">System</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SystemLogs