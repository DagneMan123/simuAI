import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, Clock } from 'lucide-react'

interface SessionTimeoutProps {
  timeoutInMinutes: number
  warningInMinutes?: number
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({
  timeoutInMinutes,
  warningInMinutes = 5,
}) => {
  const { logout } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeoutInMinutes * 60)
  const [isActive, setIsActive] = useState(true)

  // አእምሮው እንዲታደስ (Timer Reset)
  const resetTimer = useCallback(() => {
    setTimeLeft(timeoutInMinutes * 60)
    setShowWarning(false)
    setIsActive(true)
  }, [timeoutInMinutes])

  useEffect(() => {
    // እዚህ ጋር 'any' ወይም 'number' በመጠቀም የ NodeJS ስህተትን እናጠፋለን
    let interval: any 

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            logout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, logout])

  // ማስጠንቀቂያ ለማሳየት
  useEffect(() => {
    const warningTime = warningInMinutes * 60
    if (timeLeft <= warningTime && timeLeft > 0) {
      setShowWarning(true)
    } else if (timeLeft > warningTime) {
      setShowWarning(false)
    }
  }, [timeLeft, warningInMinutes])

  // የተጠቃሚውን እንቅስቃሴ ለመከታተል
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      resetTimer()
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [resetTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressValue = (timeLeft / (timeoutInMinutes * 60)) * 100

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Session About to Expire</DialogTitle>
          </div>
          <DialogDescription>
            Your session will expire in {formatTime(timeLeft)} due to inactivity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-4 w-4" />
                Time remaining
              </span>
              <span className="font-mono font-bold text-primary">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
          
          <div className="rounded-md bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            For security reasons, your session will expire soon. 
            Please click "Extend Session" to continue working.
          </div>
        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <Button
            variant="outline"
            onClick={() => logout()}
            className="w-full sm:w-auto"
          >
            Logout Now
          </Button>
          <Button
            onClick={() => resetTimer()}
            className="w-full sm:w-auto"
          >
            Extend Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SessionTimeout