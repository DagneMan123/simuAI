import { useState, useEffect, useRef } from 'react';

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

  const [warningCount, setWarningCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const warningSoundRef = useRef<HTMLAudioElement | null>(null);

  // የማስጠንቀቂያ ድምጽ መጫን
  useEffect(() => {
    warningSoundRef.current = new Audio('/sounds/warning.mp3');
  }, []);

  // የTab ለውጥ መከታተያ
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
        const newWarningCount = warningCount + 1;
        setWarningCount(newWarningCount);
        
        // ድምጽ ማጫወት
        if (warningSoundRef.current) {
          warningSoundRef.current.play().catch(() => {
            // ድምጽ ማጫወት ላይ ስህተት ቢፈጠር ችላ ማለት
          });
        }
        
        // የማስጠንቀቂያ ተግባር ማስኬድ
        onWarning?.(newWarningCount);
        
        // ከፍተኛ የማስጠንቀቂያ ብዛት ከተደረሰ
        if (newWarningCount >= maxWarnings) {
          onForceSubmit?.();
        }
      } else {
        setIsActive(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // የሙሉ ማያ ገጽ መከታተያ
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    // የአካቢያ ጊዜ መከታተያ
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const updateActivity = () => setLastActivity(Date.now());
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // የአካቢያ ጊዜ ቼክ
    const activityInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 30000) { // 30 seconds of inactivity
        setIsActive(false);
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
  }, [warningCount, lastActivity, maxWarnings, onWarning, onForceSubmit]);

  const handleFullScreenChange = () => {
    const isFull = !!(document.fullscreenElement || 
                      (document as any).webkitFullscreenElement ||
                      (document as any).mozFullScreenElement ||
                      (document as any).msFullscreenElement);
    setIsFullScreen(isFull);
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  const resetWarnings = () => {
    setWarningCount(0);
  };

  return {
    warningCount,
    isActive,
    isFullScreen,
    requestFullScreen,
    exitFullScreen,
    resetWarnings,
  };
};