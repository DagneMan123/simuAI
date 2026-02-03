import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  EyeOff, 
  Shield, 
  Lock, 
  
  Timer, 
  Maximize2, 
  Minimize2, 
  Bell, 
  Camera, 
  Copy, 
  Zap, 
  AlertCircle, 
  RefreshCw, 
  Info 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INTEGRITY_RULES, IntegrityViolation } from '@/constants/integrity';

interface Violation {
  id: string;
  type: IntegrityViolation;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  message: string;
  resolved: boolean;
}

const IntegrityMonitor: React.FC = () => {
  // State
  const [violations, setViolations] = useState<Violation[]>([
    {
      id: '1',
      type: IntegrityViolation.TAB_SWITCH,
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium',
      message: 'Browser tab switch detected',
      resolved: true
    },
    {
      id: '2',
      type: IntegrityViolation.COPY_PASTE,
      timestamp: new Date(Date.now() - 180000),
      severity: 'high',
      message: 'Copy attempt detected',
      resolved: false
    }
  ]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeActive, setTimeActive] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [currentWarning, setCurrentWarning] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [eyeTracking] = useState(true);

  // Memoized Warning Handler
  const triggerWarning = useCallback((message: string) => {
    setCurrentWarning(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000);
  }, []);

  // Timer and Random Simulation (Demo purposes)
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setTimeActive(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Event Listeners for Integrity
  useEffect(() => {
    if (!isMonitoring) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const newCount = prev + 1;
          const violation: Violation = {
            id: Date.now().toString(),
            type: IntegrityViolation.TAB_SWITCH,
            timestamp: new Date(),
            severity: 'medium',
            message: `Tab switch detected (${newCount}/${INTEGRITY_RULES.MAX_TAB_SWITCHES})`,
            resolved: false
          };
          setViolations(v => [...v, violation]);
          triggerWarning(violation.message);
          return newCount;
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const violation: Violation = {
        id: Date.now().toString(),
        type: IntegrityViolation.COPY_PASTE,
        timestamp: new Date(),
        severity: 'high',
        message: 'Right-click action blocked',
        resolved: false
      };
      setViolations(v => [...v, violation]);
      triggerWarning(violation.message);
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (!INTEGRITY_RULES.ALLOW_COPY) {
        e.preventDefault();
        const violation: Violation = {
          id: Date.now().toString(),
          type: IntegrityViolation.COPY_PASTE,
          timestamp: new Date(),
          severity: 'high',
          message: 'Copy attempt prevented',
          resolved: false
        };
        setViolations(v => [...v, violation]);
        triggerWarning(violation.message);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = ['F12', 'PrintScreen'];
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        triggerWarning(`Restricted key pressed: ${e.key}`);
      }
      
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'p')) {
        e.preventDefault();
        triggerWarning(`Keyboard shortcut restricted`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMonitoring, triggerWarning]);

  // UI Handlers
  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen toggle failed", err);
    }
  };

  const resolveViolation = (id: string) => {
    setViolations(prev => 
      prev.map(v => v.id === id ? { ...v, resolved: true } : v)
    );
  };

  const getViolationIcon = (type: IntegrityViolation) => {
    switch (type) {
      case IntegrityViolation.TAB_SWITCH: return <Maximize2 className="h-4 w-4" />;
      case IntegrityViolation.COPY_PASTE: return <Copy className="h-4 w-4" />;
      case IntegrityViolation.SCREENSHOT: return <Camera className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getViolationColor = (severity: Violation['severity']) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeViolationsCount = violations.filter(v => !v.resolved).length;
  const integrityScore = Math.max(100 - (activeViolationsCount * 20), 0);

  return (
    <div className="space-y-6">
      {showWarning && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Integrity Warning</AlertTitle>
          <AlertDescription>{currentWarning}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrity Monitor</h2>
          <p className="text-gray-500">Security protocol active for current session</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={isMonitoring ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700'}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isMonitoring ? 'Monitoring Active' : 'System Paused'}
          </Badge>
          <Button variant="outline" onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? 'Pause System' : 'Resume System'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Integrity Score</p>
                <h3 className="text-2xl font-bold mt-1">{integrityScore}%</h3>
              </div>
              <Shield className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
            <Progress value={integrityScore} className="mt-4 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Flags</p>
                <h3 className="text-2xl font-bold mt-1">{activeViolationsCount}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Session Time</p>
                <h3 className="text-2xl font-bold mt-1">{formatTime(timeActive)}</h3>
              </div>
              <Timer className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tab Switches</p>
                <h3 className="text-2xl font-bold mt-1">{tabSwitches}</h3>
              </div>
              <Maximize2 className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="bg-white border p-1 rounded-lg">
          <TabsTrigger value="monitor">Live Feed</TabsTrigger>
          <TabsTrigger value="violations">Violation Log</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg">Proctoring Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg"><EyeOff className="h-5 w-5 text-green-600" /></div>
                      <div><p className="text-xs text-gray-500 uppercase">Eye Tracking</p><p className="font-bold text-sm">Active</p></div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg"><Camera className="h-5 w-5 text-blue-600" /></div>
                      <div><p className="text-xs text-gray-500 uppercase">Screen Feed</p><p className="font-bold text-sm">Transmitting</p></div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg"><Bell className="h-5 w-5 text-purple-600" /></div>
                      <div><p className="text-xs text-gray-500 uppercase">Audio Log</p><p className="font-bold text-sm">Monitoring</p></div>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center z-10">
                        <div className="w-16 h-16 bg-blue-600/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                          <Lock className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-white font-medium">Session Securely Encrypted</p>
                        <p className="text-gray-500 text-xs mt-1">Direct stream to evaluator active</p>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                       <Badge className="bg-red-600 border-none">REC</Badge>
                       <Badge className="bg-black/50 backdrop-blur-md border-none">LIVE</Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Button variant="outline" size="sm" onClick={handleFullscreenToggle} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className="text-md">Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-3" variant="outline"><RefreshCw className="h-4 w-4" /> Reset Calibration</Button>
                  <Button className="w-full justify-start gap-3" variant="outline"><Zap className="h-4 w-4" /> Network Sync</Button>
                  <Button className="w-full justify-start gap-3" variant="outline"><Info className="h-4 w-4" /> Security Protocol</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="violations">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Session Violations</CardTitle>
              <Badge variant="outline">{violations.length} Incident Records</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {violations.map((v) => (
                  <div key={v.id} className={`p-4 rounded-xl border transition-all ${v.resolved ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`p-2 rounded-lg ${v.resolved ? 'bg-gray-200' : 'bg-red-200'}`}>{getViolationIcon(v.type)}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{v.message}</h4>
                          <div className="flex items-center gap-3 mt-2">
                             <Badge className={getViolationColor(v.severity)}>{v.severity}</Badge>
                             <span className="text-xs text-gray-400 font-mono">{v.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!v.resolved && <Button size="sm" onClick={() => resolveViolation(v.id)} className="bg-green-600 hover:bg-green-700">Acknowledge</Button>}
                        <Button size="sm" variant="ghost">Report</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gray-900 border-none text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Shield className="h-32 w-32" /></div>
         <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-2 bg-blue-500 rounded-lg"><Lock className="h-5 w-5" /></div>
               <h3 className="text-xl font-bold">Standard Integrity Protocol</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
               This assessment session is monitored using advanced AI proctoring techniques. 
               All biometric data, screen activities, and environment metadata are processed in compliance with global security standards to ensure a fair evaluation environment.
            </p>
         </CardContent>
      </Card>
    </div>
  );
};

export default IntegrityMonitor;