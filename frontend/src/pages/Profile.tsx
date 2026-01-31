import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Building, Save, Camera, Shield, Bell, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assessmentInvites: true,
    assessmentReminders: true,
    resultNotifications: true,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // In a real app, you would call an API endpoint here
      // For now, we'll just update the local state
      updateUser({
        ...user!,
        ...profileData
      })
      
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to your server
    console.log('Uploading file:', file)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" alt={user?.firstName} />
                      <AvatarFallback className="text-xl">
                        {getInitials(user?.firstName || '', user?.lastName || '')}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-white">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2">
                      {user?.role}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="w-full space-y-1">
                    <Button
                      variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('notifications')}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button
                      variant={activeTab === 'security' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('security')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                    <Button
                      variant={activeTab === 'privacy' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('privacy')}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Privacy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              className="pl-10"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              className="pl-10"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      {user?.role === 'EMPLOYER' && (
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="company"
                              className="pl-10"
                              value={profileData.company}
                              onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive important updates via email
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked
                          })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Assessment Invitations</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when invited to new assessments
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={notificationSettings.assessmentInvites}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            assessmentInvites: e.target.checked
                          })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Assessment Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Reminders for upcoming assessments
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={notificationSettings.assessmentReminders}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            assessmentReminders: e.target.checked
                          })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Result Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when assessment results are available
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={notificationSettings.resultNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            resultNotifications: e.target.checked
                          })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Communications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about new features and promotions
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={notificationSettings.marketingEmails}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            marketingEmails: e.target.checked
                          })}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and access
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: e.target.checked
                          })}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Login Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified of new sign-ins from unknown devices
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            loginAlerts: e.target.checked
                          })}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Session Timeout</p>
                            <p className="text-sm text-muted-foreground">
                              Automatically log out after inactivity
                            </p>
                          </div>
                          <span className="font-semibold">{securitySettings.sessionTimeout} minutes</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="120"
                          step="5"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: parseInt(e.target.value)
                          })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5 min</span>
                          <span>2 hours</span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="mb-2 font-medium">Change Password</p>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile