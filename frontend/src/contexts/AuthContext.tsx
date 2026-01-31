import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../lib/api'

// 1. የተጠቃሚ ዳታ ቅርጽ (User Interface)
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string | null
  role: 'EMPLOYER' | 'CANDIDATE' | 'ADMIN'
}

// 2. ለምዝገባ የሚያስፈልግ ዳታ ቅርጽ (any የሚለውን ለመተካት)
export interface RegisterData {
  email: string
  password?: string
  firstName: string
  lastName: string
  role: 'EMPLOYER' | 'CANDIDATE'
  company?: string
}

// 3. የContext-ኡ ተግባራት ዝርዝር
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role?: string) => Promise<void>
  register: (data: RegisterData) => Promise<void> // እዚህ ጋር any ተቀይሯል
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')
        
        if (storedUser && token) {
          // ዳታውን ወደ User Type በመቀየር safe እናደርገዋለን
          const parsedUser: User = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string, role?: string) => {
    try {
      const response = await authApi.login(email, password, role)
      const { user: userData, tokens } = response.data
      
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (data: RegisterData) => { // any በ RegisterData ተተክቷል
    try {
      const response = await authApi.register(data)
      const { user: userData, tokens } = response.data
      
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    localStorage.clear() // ሁሉንም የቆየ ዳታ ለማጽዳት
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}