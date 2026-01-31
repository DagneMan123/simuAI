import { z } from 'zod'

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['EMPLOYER', 'CANDIDATE', 'ADMIN']).optional(),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  company: z.string().optional(),
  role: z.enum(['EMPLOYER', 'CANDIDATE', 'ADMIN']).default('CANDIDATE'),
})

export const simulationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration: z.number().min(5, 'Minimum 5 minutes').max(240, 'Maximum 4 hours'),
  isBlindMode: z.boolean().default(true),
  steps: z.array(z.object({
    type: z.enum(['AI_CHAT', 'CODE_REVIEW', 'DOCUMENT_ANALYSIS', 'MULTIPLE_CHOICE']),
    title: z.string().min(1, 'Step title is required'),
    instructions: z.string().min(1, 'Instructions are required'),
    content: z.any().optional(),
    aiPersona: z.string().optional(),
    expectedOutput: z.any().optional(),
  })).min(1, 'At least one step is required'),
  rubric: z.object({
    criteria: z.array(z.object({
      name: z.string().min(1, 'Criteria name is required'),
      description: z.string().min(1, 'Criteria description is required'),
      weight: z.number().min(0).max(1),
    })).min(1, 'At least one criteria is required'),
    passingScore: z.number().min(0).max(100).default(70),
  }).optional(),
})

export const invitationSchema = z.object({
  emails: z.array(z.string().email('Invalid email address')).min(1, 'At least one email is required'),
  expiryHours: z.number().min(1).max(720).default(168), // 7 days default
})

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  company: z.string().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type SimulationFormData = z.infer<typeof simulationSchema>
export type InvitationFormData = z.infer<typeof invitationSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>