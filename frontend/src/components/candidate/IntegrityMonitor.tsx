import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  EyeOff, 
  Shield, 
  Lock, 
  XCircle, 
  CheckCircle,
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
import { INTEGRITY_RULES, INTEGRITY_MESSAGES, IntegrityViolation } from '@/constants/integrity';

interface Violation {
  id: string;
  type: IntegrityViolation;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  message: string;
  resolved: boolean;
}

const IntegrityMonitor: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([
    {
      id: '1',
      type: IntegrityViolation.TAB_SWITCH,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      severity: 'medium',
      message: 'Browser tab switch detected',
      resolved: true
    },
    {
      id: '2',
      type: IntegrityViolation.COPY_PASTE,
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      severity: 'high',
      message: 'Copy attempt detected',
      resolved: false
    }
  ]);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeActive, setTimeActive] = useState(0); // in seconds
  const [showWarning, setShowWarning] = useState(false);
  const [currentWarning, setCurrentWarning] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [eyeTracking, setEyeTracking] = useState(true);

  useEffect(() => {
    // Simulate monitoring
    const interval = setInterval(() => {
      setTimeActive(prev => prev + 1);
      
      // Simulate random violations (for demo)
      if (Math.random() > 0.95 && violations.length < 5) {
        const newViolation: Violation = {
          id: Date.now().toString(),
          type: IntegrityViolation.TAB_SWITCH,
          timestamp: new Date(),
          severity: 'medium',
          message: 'Potential tab switch detected',
          resolved: false
        };
        setViolations(prev => [...prev, newViolation]);
        showViolationWarning(newViolation.message);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [violations.length]);

  useEffect(() => {
    // Setup event listeners for integrity monitoring
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        const violation: Violation = {
          id: Date.now().toString(),
          type: IntegrityViolation.TAB_SWITCH,
          timestamp: new Date(),
          severity: 'medium',
          message: `Tab switch detected (${tabSwitches + 1}/${INTEGRITY_RULES.MAX_TAB_SWITCHES})`,
          resolved: false
        };
        setViolations(prev => [...prev, violation]);
        showViolationWarning(violation.message);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const violation: Violation = {
        id: Date.now().toString(),
        type: IntegrityViolation.COPY_PASTE,
        timestamp: new Date(),
        severity: 'high',
        message: 'Right-click disabled to prevent cheating',
        resolved: false
      };
      setViolations(prev => [...prev, violation]);
      showViolationWarning(violation.message);
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (!INTEGRITY_RULES.ALLOW_COPY) {
        e.preventDefault();
        const violation: Violation = {
          id: Date.now().toString(),
          type: IntegrityViolation.COPY_PASTE,
          timestamp: new Date(),
          severity: 'high',
          message: 'Copy action blocked',
          resolved: false
        };
        setViolations(prev => [...prev, violation]);
        showViolationWarning(violation.message);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = ['F12', 'PrintScreen', 'Escape'];
      const blockedCombos = [
        { keys: ['Control', 'c'], prevent: !INTEGRITY_RULES.ALLOW_COPY },
        { keys: ['Control', 'v'], prevent: !INTEGRITY_RULES.ALLOW_PASTE },
        { keys: ['Control', 'p'], prevent: true },
        { keys: ['Control', 's'], prevent: true },
      ];

      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        showViolationWarning(`Blocked key: ${e.key}`);
      }

      blockedCombos.forEach(combo => {
        if (combo.keys.every(key => 
          (key.toLowerCase() === 'control' && e.ctrlKey) ||
          (key.toLowerCase() === 'alt' && e.altKey) ||
          (key.toLowerCase() === 'shift' && e.shiftKey) ||
          key.toLowerCase() === e.key.toLowerCase()
        )) {
          if (combo.prevent) {
            e.preventDefault();
            showViolationWarning(`Blocked shortcut: ${combo.keys.join('+')}`);
          }
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tabSwitches]);

  const showViolationWarning = (message: string) => {
    setCurrentWarning(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000);
  };

  const handleFullscreenToggle = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resolveViolation = (id: string) => {
    setViolations(prev => 
      prev.map(v => v.id === id ? { ...v, resolved: true } : v)
    );
  };

  const getViolationIcon = (type: IntegrityViolation) => {
    switch (type) {
      case IntegrityViolation.TAB_SWITCH:
        return <Maximize2 className="h-4 w-4" />;
      case IntegrityViolation.COPY_PASTE:
        return <Copy className="h-4 w-4" />;
      case IntegrityViolation.SCREENSHOT:
        return <Camera className="h-4 w-4" />;
      case IntegrityViolation.MULTIPLE_INSTANCES:
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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

  const activeViolations = violations.filter(v => !v.resolved);
  const integrityScore = Math.max(100 - (activeViolations.length * 20), 0);

  return (
    <div className="space-y-6">
      {/* Warning Alert */}
      {showWarning && (
        <Alert variant="destructive" className="animate-in slide-in-from-top">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Integrity Warning</AlertTitle>
          <AlertDescription>
            {currentWarning}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Integrity Monitor</h2>
          <p className="text-gray-600">AI-powered proctoring to ensure test integrity</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`
            ${isMonitoring 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
            }
          `}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isMonitoring ? 'Active Monitoring' : 'Monitoring Paused'}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Integrity Score</p>
                <h3 className="text-2xl font-bold mt-1">{integrityScore}%</h3>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <Progress value={integrityScore} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Violations</p>
                <h3 className="text-2xl font-bold mt-1">{activeViolations.length}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {activeViolations.length === 0 ? 'No active violations' : 'Review violations below'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Session Time</p>
                <h3 className="text-2xl font-bold mt-1">{formatTime(timeActive)}</h3>
              </div>
              <Timer className="h-8 w-8 text-green-400" />
            </div>
            <div className="text-xs text-gray-500 mt-3">
              Active for {Math.floor(timeActive / 60)} minutes
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tab Switches</p>
                <h3 className="text-2xl font-bold mt-1">{tabSwitches}</h3>
              </div>
              <Maximize2 className="h-8 w-8 text-purple-400" />
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {INTEGRITY_RULES.MAX_TAB_SWITCHES - tabSwitches} remaining
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Live Monitor Tab */}
        <TabsContent value="monitor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Monitoring Status */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Monitoring Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Monitoring Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border flex flex-col items-center ${
                      eyeTracking ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className={`p-3 rounded-full mb-3 ${
                        eyeTracking ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <EyeOff className={`h-6 w-6 ${eyeTracking ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <span className="font-medium">Eye Tracking</span>
                      <span className={`text-sm mt-1 ${eyeTracking ? 'text-green-600' : 'text-gray-500'}`}>
                        {eyeTracking ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-lg border flex flex-col items-center border-blue-200 bg-blue-50">
                      <div className="p-3 rounded-full mb-3 bg-blue-100">
                        <Camera className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="font-medium">Screen Recording</span>
                      <span className="text-sm mt-1 text-blue-600">Active</span>
                    </div>
                    
                    <div className="p-4 rounded-lg border flex flex-col items-center border-purple-200 bg-purple-50">
                      <div className="p-3 rounded-full mb-3 bg-purple-100">
                        <Bell className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="font-medium">Audio Monitoring</span>
                      <span className="text-sm mt-1 text-purple-600">Active</span>
                    </div>
                  </div>

                  {/* Current View */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-900 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-gray-300 text-sm ml-2">Candidate View</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleFullscreenToggle}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        {isFullscreen ? (
                          <>
                            <Minimize2 className="h-4 w-4 mr-2" />
                            Exit Fullscreen
                          </>
                        ) : (
                          <>
                            <Maximize2 className="h-4 w-4 mr-2" />
                            Enter Fullscreen
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lock className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Secure Environment</h3>
                        <p className="text-gray-400">Live monitoring active</p>
                        <div className="mt-4 flex justify-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div>
                    <h3 className="font-semibold mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Camera active</p>
                            <p className="text-sm text-gray-500">Just now</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Normal
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium">Multiple faces detected</p>
                            <p className="text-sm text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Warning
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Monitoring
                </Button>
                <Button className="w-full" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </Button>
                <Button className="w-full" variant="outline">
                  <Info className="h-4 w-4 mr-2" />
                  View Guidelines
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Test Rules</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>No tab switching allowed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Copy/paste disabled</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Camera must remain on</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>No external assistance</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Integrity Violations</CardTitle>
                <Badge variant="outline">
                  {activeViolations.length} Active • {violations.length} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {violations.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">No violations detected</h3>
                  <p className="text-gray-500 mt-1">Your test environment is secure</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {violations.map((violation) => (
                    <div
                      key={violation.id}
                      className={`border rounded-lg p-4 ${
                        violation.resolved ? 'border-gray-200' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            violation.resolved ? 'bg-gray-100' : getViolationColor(violation.severity).split(' ')[0]
                          }`}>
                            {getViolationIcon(violation.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{violation.message}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge className={getViolationColor(violation.severity)}>
                                {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {violation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!violation.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveViolation(violation.id)}
                              className="border-green-600 text-green-700 hover:bg-green-50"
                            >
                              Mark Resolved
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      {!violation.resolved && (
                        <div className="ml-11">
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span>This violation affects your integrity score</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Monitoring Preferences</h3>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Camera Monitoring</p>
                      <p className="text-sm text-gray-500">Track face and eye movements</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${
                        eyeTracking ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          eyeTracking ? 'left-7' : 'left-1'
                        }`} />
                      </div>
                      <span className="text-sm">{eyeTracking ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Audio Monitoring</p>
                      <p className="text-sm text-gray-500">Detect background conversations</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-6 rounded-full bg-green-500 relative">
                        <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
                      </div>
                      <span className="text-sm">On</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Screen Recording</p>
                      <p className="text-sm text-gray-500">Record test session for review</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-6 rounded-full bg-green-500 relative">
                        <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
                      </div>
                      <span className="text-sm">On</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-semibold">Privacy Settings</h3>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Data Usage</p>
                    <p className="text-sm text-gray-500 mb-3">
                      Your monitoring data is only used for test integrity purposes and is deleted after 30 days.
                    </p>
                    <Button variant="outline" size="sm">View Privacy Policy</Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Run Security Check
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Warning */}
      <Alert variant="default" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <Lock className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Test Integrity Protected</AlertTitle>
        <AlertDescription className="text-blue-600">
          All monitoring is conducted to ensure a fair testing environment. Violations may result in test termination.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default IntegrityMonitor;