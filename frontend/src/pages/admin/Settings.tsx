import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Shield,
  Bell,
  Globe,
  Database,
  Mail,
  Key,
  Users,
  CreditCard,
  Zap,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavbar from '@/components/admin/AdminNavbar';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'SimuAI',
      siteDescription: 'AI-Powered Assessment Platform',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false,
    },
    security: {
      requireTwoFactor: true,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      ipWhitelist: '',
      enableAuditLog: true,
    },
    notifications: {
      emailNotifications: true,
      newUserAlerts: true,
      paymentAlerts: true,
      systemAlerts: true,
      weeklyReports: true,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@simuai.com',
      fromName: 'SimuAI',
    },
    ai: {
      openaiApiKey: '',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 4000,
      enableProctoring: true,
    },
    payment: {
      currency: 'USD',
      chapaPublicKey: '',
      chapaSecretKey: '',
      enablePayments: true,
      testMode: false,
    }
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Add save logic here
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings?')) {
      console.log('Resetting settings...');
      // Add reset logic here
    }
  };

  return (
    <div className="space-y-6">
      <AdminNavbar />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Zap className="h-4 w-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteDescription: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.security.requireTwoFactor}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, requireTwoFactor: checked }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={settings.security.ipWhitelist}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, ipWhitelist: e.target.value }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Audit Log</Label>
                    <p className="text-sm text-gray-500">Log all admin activities</p>
                  </div>
                  <Switch
                    checked={settings.security.enableAuditLog}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, enableAuditLog: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">New User Alerts</Label>
                    <p className="text-sm text-gray-500">Notify when new users register</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newUserAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newUserAlerts: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Payment Alerts</Label>
                    <p className="text-sm text-gray-500">Notify on successful payments</p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, paymentAlerts: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Alerts</Label>
                    <p className="text-sm text-gray-500">Notify on system errors</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, systemAlerts: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Send weekly summary reports</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReports: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPort: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUsername: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPassword: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, fromEmail: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, fromName: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Test Email Configuration</h4>
                <p className="text-sm text-gray-600 mb-3">Send a test email to verify your configuration</p>
                <div className="flex gap-3">
                  <Input placeholder="test@example.com" className="flex-1" />
                  <Button variant="outline">Send Test</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="sk-..."
                  value={settings.ai.openaiApiKey}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, openaiApiKey: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select
                    value={settings.ai.model}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      ai: { ...settings.ai, model: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.ai.temperature}
                    onChange={(e) => setSettings({
                      ...settings,
                      ai: { ...settings.ai, temperature: parseFloat(e.target.value) }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="100"
                    max="8000"
                    value={settings.ai.maxTokens}
                    onChange={(e) => setSettings({
                      ...settings,
                      ai: { ...settings.ai, maxTokens: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable AI Proctoring</Label>
                  <p className="text-sm text-gray-500">Monitor test sessions with AI</p>
                </div>
                <Switch
                  checked={settings.ai.enableProctoring}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, enableProctoring: checked }
                  })}
                />
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">API Usage</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Requests Today</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tokens Used</p>
                    <p className="text-2xl font-bold">2.4M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cost Today</p>
                    <p className="text-2xl font-bold">$12.45</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.payment.currency}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, currency: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="ETB">ETB (ብር)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="chapaPublicKey">Chapa Public Key</Label>
                  <Input
                    id="chapaPublicKey"
                    type="password"
                    placeholder="CHAPUBK-..."
                    value={settings.payment.chapaPublicKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, chapaPublicKey: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapaSecretKey">Chapa Secret Key</Label>
                  <Input
                    id="chapaSecretKey"
                    type="password"
                    placeholder="CHASECK-..."
                    value={settings.payment.chapaSecretKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, chapaSecretKey: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Payments</Label>
                  <p className="text-sm text-gray-500">Accept payments on the platform</p>
                </div>
                <Switch
                  checked={settings.payment.enablePayments}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, enablePayments: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Test Mode</Label>
                  <p className="text-sm text-gray-500">Use test payment gateway</p>
                </div>
                <Switch
                  checked={settings.payment.testMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, testMode: checked }
                  })}
                />
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Payment Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Today's Revenue</p>
                    <p className="text-2xl font-bold">$1,245</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Successful Transactions</p>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-bold">68%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-red-700">Clear All Cache</h4>
                <p className="text-sm text-red-600">Clear all cached data and sessions</p>
              </div>
              <Button variant="outline" className="border-red-600 text-red-700 hover:bg-red-50">
                Clear Cache
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-red-700">Reset All Settings</h4>
                <p className="text-sm text-red-600">Reset all settings to default values</p>
              </div>
              <Button variant="outline" className="border-red-600 text-red-700 hover:bg-red-50">
                Reset Settings
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-red-700">Delete All Data</h4>
                <p className="text-sm text-red-600">Permanently delete all platform data</p>
              </div>
              <Button variant="outline" className="border-red-600 text-red-700 hover:bg-red-50">
                Delete All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;