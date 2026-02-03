import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { 
  Clock, 
  AlertTriangle, 
  Maximize2, 
  X,
  Lock,
  EyeOff,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useIntegrity } from '@/hooks/useIntegrity';

const ArenaLayout: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { violations, enterFullscreen, exitFullscreen } = useIntegrity();
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-submit when time is up
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Integrity monitoring
  useEffect(() => {
    if (violations.length > 0) {
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [violations]);

  const handleFullscreen = async () => {
    if (!isFullscreen) {
      await enterFullscreen();
      setIsFullscreen(true);
    } else {
      await exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSubmit = () => {
    // Submit exam logic here
    alert('Exam submitted successfully!');
    navigate('/candidate/dashboard');
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate('/candidate/dashboard');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((60 * 60 - timeLeft) / (60 * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Integrity Warning */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
          <Alert variant="destructive" className="bg-red-900/80 border-red-700 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-white">
              <strong>Warning:</strong> {violations[violations.length - 1]?.message || 'Integrity violation detected'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Exam Header */}
      <header className="sticky top-0 z-40 bg-gray-800/90 backdrop-blur-md border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Simulation Assessment</h1>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secured Environment
                  </span>
                  <span className="flex items-center gap-1">
                    <EyeOff className="h-3 w-3" />
                    Proctored
                  </span>
                  <span>Exam ID: {examId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                </div>
                <Progress value={progress} className="mt-2 h-1 bg-gray-700" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFullscreen}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  <Maximize2 className="h-4 w-4" />
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExit}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                  Exit
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Exam
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 backdrop-blur-sm">
          <Outlet />
        </div>
      </main>

      {/* Integrity Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700">
        <div className="px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${violations.length === 0 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>Integrity: {violations.length === 0 ? 'Clean' : `${violations.length} violation(s)`}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Connection: Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>AI Proctoring: Active</span>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              <p>© {new Date().getFullYear()} SimuAI Assessment Platform • All activities are monitored</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Prevention Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {/* Prevent right-click */}
        <div 
          className="absolute inset-0"
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Prevent text selection */}
        <div 
          className="absolute inset-0 select-none"
          style={{ userSelect: 'none' }}
        />
      </div>
    </div>
  );
};

export default ArenaLayout;