import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'DEBUG';
  component: string;
  message: string;
  user: string;
  ip: string;
  details?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  onRefresh?: () => void;
  onExport?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: { level: string; component: string }) => void;
  loading?: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  onRefresh,
  onExport,
  onSearch,
  onFilter,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const components = Array.from(new Set(logs.map(log => log.component)));
  const levels = ['INFO', 'WARNING', 'ERROR', 'SUCCESS', 'DEBUG'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesComponent = componentFilter === 'all' || log.component === componentFilter;
    
    return matchesSearch && matchesLevel && matchesComponent;
  });

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return <Info className="h-4 w-4 text-blue-500" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DEBUG': return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      case 'SUCCESS': return 'bg-green-100 text-green-800 border-green-200';
      case 'DEBUG': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilterChange = () => {
    onFilter?.({
      level: levelFilter,
      component: componentFilter
    });
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs by message, user, or IP..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map(level => (
                <SelectItem key={level} value={level.toLowerCase()}>
                  <div className="flex items-center gap-2">
                    {getLevelIcon(level as LogEntry['level'])}
                    {level}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={componentFilter} onValueChange={setComponentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Component" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Components</SelectItem>
              {components.map(component => (
                <SelectItem key={component} value={component}>{component}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleFilterChange}>
            <Filter className="mr-2 h-4 w-4" />
            Apply
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Logs</p>
              <h3 className="text-2xl font-bold mt-1">{logs.length}</h3>
            </div>
            <Info className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Errors</p>
              <h3 className="text-2xl font-bold mt-1">
                {logs.filter(l => l.level === 'ERROR').length}
              </h3>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Warnings</p>
              <h3 className="text-2xl font-bold mt-1">
                {logs.filter(l => l.level === 'WARNING').length}
              </h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Success</p>
              <h3 className="text-2xl font-bold mt-1">
                {logs.filter(l => l.level === 'SUCCESS').length}
              </h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <h3 className="text-2xl font-bold mt-1">
                {logs.filter(l => {
                  const logDate = new Date(l.timestamp);
                  const today = new Date();
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Timestamp</TableHead>
                <TableHead className="w-24">Level</TableHead>
                <TableHead className="w-32">Component</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-40">User</TableHead>
                <TableHead className="w-32">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedLog?.id === log.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="font-mono text-sm">{formatDateTime(log.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-1 ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {log.component}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={log.message}>
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">{log.user}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{log.ip}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Log Details */}
      {selectedLog && (
        <div className="border rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Log Details</h3>
              <p className="text-sm text-gray-600">ID: {selectedLog.id}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Message:</p>
              <p className="text-sm text-gray-600 bg-white p-3 rounded border">{selectedLog.message}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Details:</p>
              <pre className="text-sm text-gray-600 bg-white p-3 rounded border overflow-auto max-h-40">
                {selectedLog.details || 'No additional details available'}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Full Timestamp:</p>
              <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                {new Date(selectedLog.timestamp).toISOString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Metadata:</p>
              <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                <p>User Agent: Not available</p>
                <p>Session ID: Not available</p>
                <p>Request ID: Not available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-blue-50">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;