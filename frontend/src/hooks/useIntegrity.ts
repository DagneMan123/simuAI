import { useState, useEffect, useRef, useCallback } from 'react';

interface Violation {
  message: string;
  timestamp: number;
}

interface IntegrityOptions {
  onWarning?: (warningCount: number) => void;
  onForceSubmit?: () => void;
  maxWarnings?: number;
}

export const useIntegrity = (options: IntegrityOptions = {}) => {
  const {
    onWarning,
    onForceSubmit,
    maxWarnings = 3,
  } = options;

  // Changed warningCount (number) to violations (array) to match ArenaLayout
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const warningSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    warningSoundRef.current = new Audio('/sounds/warning.mp3');
  }, []);

  // Use useCallback to prevent unnecessary re-renders and handle logic
  const addViolation = useCallback((message: string) => {
    setViolations((prev) => {
      const newViolations = [...prev, { message, timestamp: Date.now() }];
      
      // Play Audio
      if (warningSoundRef.current) {
        warningSoundRef.current.play().catch(() => {});
      }

      // Call external callbacks
      onWarning?.(newViolations.length);

      if (newViolations.length >= maxWarnings) {
        onForceSubmit?.();
      }
      
      return newViolations;
    });
  }, [maxWarnings, onWarning, onForceSubmit]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
        addViolation("Tab switch detected! This activity is monitored.");
      } else {
        setIsActive(true);
      }
    };

    const handleFullScreenChange = () => {
      const isFull = !!(
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullScreen(isFull);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    // Activity tracking logic
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const updateActivity = () => setLastActivity(Date.now());
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    const activityInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 30000) { // 30 seconds
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    }, 5000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      
      clearInterval(activityInterval);
    };
  }, [lastActivity, addViolation]);

  // Naming adjusted to match your ArenaLayout component
  const enterFullscreen = async () => {
    const element = document.documentElement;
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      }
      setIsFullScreen(true);
    } catch (err) {
      console.error("Fullscreen error", err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (err) {
      console.error("Exit fullscreen error", err);
    }
  };

  const resetWarnings = () => {
    setViolations([]);
  };

  return {
    violations,            // Array for ArenaLayout compatibility
    warningCount: violations.length, 
    isActive,
    isFullScreen,
    enterFullscreen,       // Renamed for ArenaLayout compatibility
    exitFullscreen,        // Renamed for ArenaLayout compatibility
    resetWarnings,
  };
};