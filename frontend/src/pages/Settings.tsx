import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Palette, Globe, Bell, Shield, Download, Eye, EyeOff } from 'lucide-react'
import Navbar from '@/components/Navbar'

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [themeSettings, setThemeSettings] = useState({
    theme: 'system',
    primaryColor: 'blue',
    reduceMotion: false,
    highContrast: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    allowAnalytics: true,
    allowCookies: true,
    dataRetention: '90days',
    exportData: false,
  })

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'medium',
    lineHeight: 'normal',
    colorBlindMode: false,
    screenReader: false,
  })

  const saveSettings = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Settings saved successfully!')
    } catch (err) {
      setError('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    // Implement data export
    console.log('Exporting data...')
  }

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ]

  const colors = [
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'purple', label: 'Purple', color: '#8b5cf6' },
    { value: 'green', label: 'Green', color: '#10b981' },
    { value: 'orange', label: 'Orange', color: '#f97316' },
    { value: 'red', label: 'Red', color: '#ef4444' }
  ]

  const dataRetentionOptions = [
    { value: '30days', label: '30 days' },
    { value: '90days', label: '90 days' },
    { value: '1year', label: '1 year' },
    { value: 'forever', label: 'Forever' }
  ]

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your SimuAI experience
          </p>
        </div>

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

        <div className="grid gap-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                  <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={themeSettings.theme}
                    onValueChange={(value) => setThemeSettings({
                      ...themeSettings,
                      theme: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        className={`h-10 w-10 rounded-full border-2 ${
                          themeSettings.primaryColor === color.value 
                            ? 'border-primary' 
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => setThemeSettings({
                          ...themeSettings,
                          primaryColor: color.value
                        })}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={themeSettings.reduceMotion}
                    onCheckedChange={(checked) => setThemeSettings({
                      ...themeSettings,
                      reduceMotion: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={themeSettings.highContrast}
                    onCheckedChange={(checked) => setThemeSettings({
                      ...themeSettings,
                      highContrast: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                  <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Privacy & Data</CardTitle>
                  <CardDescription>
                    Control your data and privacy settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Profile to Employers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employers to see your profile information
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showProfile}
                    onCheckedChange={(checked) => setPrivacySettings({
                      ...privacySettings,
                      showProfile: checked
                    })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help us improve by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowAnalytics}
                    onCheckedChange={(checked) => setPrivacySettings({
                      ...privacySettings,
                      allowAnalytics: checked
                    })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Cookies</Label>
                    <p className="text-sm text-muted-foreground">
                      Store cookies for a better browsing experience
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowCookies}
                    onCheckedChange={(checked) => setPrivacySettings({
                      ...privacySettings,
                      allowCookies: checked
                    })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Data Retention</Label>
                  <Select
                    value={privacySettings.dataRetention}
                    onValueChange={(value) => setPrivacySettings({
                      ...privacySettings,
                      dataRetention: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataRetentionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How long we keep your assessment data
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label>Data Export</Label>
                    <p className="text-sm text-muted-foreground">
                      Download all your personal data
                    </p>
                  </div>
                  <Button variant="outline" onClick={exportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export My Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                  <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>
                    Make SimuAI work better for you
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={accessibilitySettings.fontSize}
                    onValueChange={(value) => setAccessibilitySettings({
                      ...accessibilitySettings,
                      fontSize: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <Select
                    value={accessibilitySettings.lineHeight}
                    onValueChange={(value) => setAccessibilitySettings({
                      ...accessibilitySettings,
                      lineHeight: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                      <SelectItem value="loose">Loose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Color Blind Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust colors for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.colorBlindMode}
                    onCheckedChange={(checked) => setAccessibilitySettings({
                      ...accessibilitySettings,
                      colorBlindMode: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Screen Reader Optimized</Label>
                    <p className="text-sm text-muted-foreground">
                      Improve compatibility with screen readers
                    </p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.screenReader}
                    onCheckedChange={(checked) => setAccessibilitySettings({
                      ...accessibilitySettings,
                      screenReader: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              // Reset to defaults
              setThemeSettings({
                theme: 'system',
                primaryColor: 'blue',
                reduceMotion: false,
                highContrast: false,
              })
              setPrivacySettings({
                showProfile: true,
                allowAnalytics: true,
                allowCookies: true,
                dataRetention: '90days',
                exportData: false,
              })
              setAccessibilitySettings({
                fontSize: 'medium',
                lineHeight: 'normal',
                colorBlindMode: false,
                screenReader: false,
              })
            }}>
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save All Settings'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings