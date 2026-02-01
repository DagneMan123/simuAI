import React from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError
  maxLength?: number
  showCount?: boolean
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  register,
  error,
  maxLength,
  showCount = false,
  className,
  ...props
}) => {
  const [charCount, setCharCount] = React.useState(0)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        {showCount && maxLength && (
          <span className="text-xs text-muted-foreground">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={name}
        className={cn(className)}
        {...register(name, {
          onChange: (e) => {
            if (showCount && maxLength) {
              setCharCount(e.target.value.length)
            }
          },
        })}
        maxLength={maxLength}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormTextarea