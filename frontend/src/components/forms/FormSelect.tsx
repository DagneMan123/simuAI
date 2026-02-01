import React from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Option {
  value: string
  label: string
  description?: string
}

interface FormSelectProps {
  label: string
  name: string
  control: Control<any> // 'register' ፈንታ 'control' እንጠቀማለን
  error?: FieldError
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  control,
  error,
  options,
  placeholder = 'Select an option',
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select 
            onValueChange={field.onChange} // እዚህ ጋር 'value' በትክክል ይተላለፋል
            value={field.value} 
            disabled={disabled}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormSelect