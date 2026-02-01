import React from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError
  icon?: React.ReactNode
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  register,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={name}
          className={cn(icon && 'pl-10', className)}
          {...register(name)}
          {...props}
          aria-invalid={error ? 'true' : 'false'}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormInput