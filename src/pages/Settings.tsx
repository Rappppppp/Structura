import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const tabs = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
];

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: 'Settings Saved', description: 'Your settings have been updated successfully.' });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-7 w-7 text-primary" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="rounded-lg border border-border bg-card p-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                activeTab === tab.key
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg border border-border bg-card p-6 lg:col-span-3 animate-fade-in">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-card-foreground">Profile Settings</h3>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                  <input defaultValue={user?.name} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <input defaultValue={user?.email} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
                  <input defaultValue={user?.role} disabled className="h-10 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground capitalize" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                  <input placeholder="+1 (555) 000-0000" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
              </div>
              <Button onClick={handleSave}><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-card-foreground">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive project updates via email' },
                  { label: 'Push Notifications', desc: 'Browser push notifications for urgent items' },
                  { label: 'Task Assignments', desc: 'Get notified when tasks are assigned to you' },
                  { label: 'Payment Reminders', desc: 'Receive reminders for upcoming payments' },
                  { label: 'Chat Messages', desc: 'Notify on new messages in project chats' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border border-border p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleSave}><Save className="h-4 w-4" /> Save Preferences</Button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-card-foreground">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
                  <input type="password" placeholder="Enter current password" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
                  <input type="password" placeholder="Enter new password" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
              </div>
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: '2FA', description: 'Two-factor authentication setup initiated.' })}>Enable</Button>
                </div>
              </div>
              <Button onClick={handleSave}><Save className="h-4 w-4" /> Update Password</Button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-card-foreground">Appearance Settings</h3>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button
                      key={theme}
                      className={`rounded-md border px-4 py-3 text-sm font-medium transition-all ${
                        theme === 'Light'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Sidebar Position</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Left', 'Right'].map(pos => (
                    <button
                      key={pos}
                      className={`rounded-md border px-4 py-3 text-sm font-medium transition-all ${
                        pos === 'Left'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave}><Save className="h-4 w-4" /> Save Appearance</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
