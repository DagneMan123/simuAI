import React, { useState, useEffect } from 'react';
import { 
  Search, Download, AlertTriangle, Info, CheckCircle, 
  XCircle, Calendar, RefreshCw, X, Copy, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, } from '@/components/ui/card';
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
  
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) onSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, onSearch]);

  const components = Array.from(new Set(logs.map(log => log.component)));
  const levels = ['INFO', 'WARNING', 'ERROR', 'SUCCESS', 'DEBUG'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesComponent = componentFilter === 'all' || log.component === componentFilter;
    
    return matchesSearch && matchesLevel && matchesComponent;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLevelBadgeClass = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      case 'SUCCESS': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                className="pl-10 h-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={componentFilter} onValueChange={setComponentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Components</SelectItem>
                  {components.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={onRefresh} size="icon">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={onExport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[10px] uppercase font-bold text-gray-400">Total</p><h3 className="text-xl font-bold">{logs.length}</h3></div>
            <Info className="h-6 w-6 text-blue-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[10px] uppercase font-bold text-gray-400">Errors</p><h3 className="text-xl font-bold text-red-600">{logs.filter(l => l.level === 'ERROR').length}</h3></div>
            <XCircle className="h-6 w-6 text-red-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[10px] uppercase font-bold text-gray-400">Warnings</p><h3 className="text-xl font-bold text-yellow-600">{logs.filter(l => l.level === 'WARNING').length}</h3></div>
            <AlertTriangle className="h-6 w-6 text-yellow-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[10px] uppercase font-bold text-gray-400">Success</p><h3 className="text-xl font-bold text-green-600">{logs.filter(l => l.level === 'SUCCESS').length}</h3></div>
            <CheckCircle className="h-6 w-6 text-green-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[10px] uppercase font-bold text-gray-400">Today</p><h3 className="text-xl font-bold">{logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}</h3></div>
            <Calendar className="h-6 w-6 text-purple-500 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-44 text-xs">Timestamp</TableHead>
                <TableHead className="w-24 text-xs">Level</TableHead>
                <TableHead className="w-32 text-xs">Component</TableHead>
                <TableHead className="text-xs">Message</TableHead>
                <TableHead className="w-32 text-xs">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="py-20 text-center text-gray-400 italic">Fetching logs...</TableCell></TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-20 text-center text-gray-400">No logs found</TableCell></TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className={`cursor-pointer transition-all ${
                      selectedLog?.id === log.id ? 'bg-blue-50/50 ring-1 ring-inset ring-blue-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell className="font-mono text-[11px] text-gray-500">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-bold ${getLevelBadgeClass(log.level)}`}>{log.level}</Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] font-mono">{log.component}</Badge></TableCell>
                    <TableCell className="max-w-md truncate text-sm text-gray-700">{log.message}</TableCell>
                    <TableCell className="font-mono text-[11px] text-gray-400">{log.ip}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detailed View */}
      {selectedLog && (
        <Card className="border-2 border-blue-100 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getLevelBadgeClass(selectedLog.level)}`}>
                  {selectedLog.level === 'ERROR' ? <XCircle /> : <Info />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Event Details</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>ID: {selectedLog.id}</span>
                    <button onClick={() => copyToClipboard(selectedLog.id)} className="hover:text-blue-600 transition-colors">
                      {copiedId === selectedLog.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedLog(null)}><X size={18} /></Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase text-gray-400">Message</label><p className="mt-1 text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border">{selectedLog.message}</p></div>
                <div><label className="text-[10px] font-bold uppercase text-gray-400">Technical Data</label><pre className="mt-1 p-4 bg-gray-900 text-blue-300 rounded-lg text-xs overflow-auto max-h-40 font-mono">{selectedLog.details || "No stack trace."}</pre></div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">User</p><p className="text-sm font-medium">{selectedLog.user}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">IP</p><p className="text-sm font-mono">{selectedLog.ip}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">Source</p><p className="text-sm font-bold text-blue-600 uppercase">{selectedLog.component}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">ISO Time</p><p className="text-sm">{new Date(selectedLog.timestamp).toISOString()}</p></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LogViewer;