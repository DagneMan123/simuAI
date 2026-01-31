import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SimulationStep {
  id: string
  type: 'AI_CHAT' | 'CODE_REVIEW' | 'DOCUMENT_ANALYSIS' | 'MULTIPLE_CHOICE'
  title: string
  instructions: string
  content: any
  aiPersona?: string
}

interface Simulation {
  id: string
  title: string
  description: string
  duration: number
  isPublished: boolean
  isBlindMode: boolean
  steps: SimulationStep[]
  createdAt: string
}

interface Submission {
  id: string
  userId: string
  simulationId: string
  stepId: string
  content: any
  aiFeedback: any
  score: number | null
  completedAt: string
  integrityFlags: string[]
}

interface SimulationState {
  currentSimulation: Simulation | null
  simulations: Simulation[]
  submissions: Submission[]
  activeStep: number
  isLoading: boolean
  error: string | null
}

const initialState: SimulationState = {
  currentSimulation: null,
  simulations: [],
  submissions: [],
  activeStep: 0,
  isLoading: false,
  error: null,
}

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setSimulations: (state, action: PayloadAction<Simulation[]>) => {
      state.simulations = action.payload
    },
    setCurrentSimulation: (state, action: PayloadAction<Simulation>) => {
      state.currentSimulation = action.payload
    },
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload
    },
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload
    },
    nextStep: (state) => {
      if (state.currentSimulation && state.activeStep < state.currentSimulation.steps.length - 1) {
        state.activeStep += 1
      }
    },
    prevStep: (state) => {
      if (state.activeStep > 0) {
        state.activeStep -= 1
      }
    },
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload)
    },
    updateSubmission: (state, action: PayloadAction<{ id: string; updates: Partial<Submission> }>) => {
      const index = state.submissions.findIndex(sub => sub.id === action.payload.id)
      if (index !== -1) {
        state.submissions[index] = { ...state.submissions[index], ...action.payload.updates }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetSimulation: (state) => {
      state.currentSimulation = null
      state.activeStep = 0
    },
  },
})

export const {
  setSimulations,
  setCurrentSimulation,
  setSubmissions,
  setActiveStep,
  nextStep,
  prevStep,
  addSubmission,
  updateSubmission,
  setLoading,
  setError,
  clearError,
  resetSimulation,
} = simulationSlice.actions

export default simulationSlice.reducer