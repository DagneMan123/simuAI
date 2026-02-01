import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter text-primary">404</CardTitle>
          <CardDescription className="text-xl font-semibold mt-2">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved to a new address.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full py-6 text-lg font-bold shadow-lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full py-6 text-lg font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>Need help? Contact SimuAI Support</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default NotFound