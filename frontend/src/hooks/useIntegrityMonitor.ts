import { useEffect, useRef, useCallback, useState } from 'react' // useState ጨምር
import { useToast } from './use-toast'

interface UseIntegrityMonitorProps {
  simulationId: string
  onViolation?: (type: string) => void
  enabled?: boolean
}

export const useIntegrityMonitor = ({
  simulationId,
  onViolation,
  enabled = true,
}: UseIntegrityMonitorProps) => {
  const { toast } = useToast()
  
  // ከ useRef ይልቅ useState ተጠቀም (ለ reactivity)
  const [violations, setViolations] = useState<string[]>([])
  const socketRef = useRef<WebSocket | null>(null)

  const addViolation = useCallback((type: string, message: string) => {
    if (!enabled) return

    // State-ኡን አዘምን (ይህ ስክሪኑ እንዲቀየር ያደርጋል)
    setViolations((prev) => [...prev, type])
    
    toast({
      title: "Integrity Warning",
      description: message,
      variant: "destructive",
    })

    onViolation?.(type)

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'VIOLATION',
        simulationId,
        violationType: type,
        timestamp: new Date().toISOString(),
      }))
    }
  }, [enabled, simulationId, onViolation, toast])

  useEffect(() => {
    if (!enabled) return

    // WebSocket ግንኙነት (አድራሻውን አስተካክል)
    socketRef.current = new WebSocket(`ws://localhost:5000?simulationId=${simulationId}`)

    // ... (ሌሎቹ የኢቨንት ሊስተነሮች እንዳሉ ይቀጥላሉ)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('TAB_SWITCH', 'Tab switch detected during assessment')
      }
    }

    // Copy/Paste መከልከል
    const handleCopy = (e: ClipboardEvent) => { e.preventDefault(); addViolation('COPY_ATTEMPT', 'Copy blocked'); }
    const handlePaste = (e: ClipboardEvent) => { e.preventDefault(); addViolation('PASTE_ATTEMPT', 'Paste blocked'); }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      if (socketRef.current) socketRef.current.close()
    }
  }, [addViolation, enabled, simulationId])
  return {
    violations,
    clearViolations: () => setViolations([]),
  }
}