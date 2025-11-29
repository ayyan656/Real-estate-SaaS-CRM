import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { 
  Bell, 
  Shield, 
  Users, 
  CreditCard, 
  Mail, 
  Smartphone, 
  Globe, 
  Moon, 
  Save,
  Check
} from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: <Globe size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'team', label: 'Team', icon: <Users size={18} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
           <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and workspace settings.</p>
        </div>
        <Button onClick={handleSave} isLoading={isLoading} icon={<Save size={16} />}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-accent shadow-sm ring-1 ring-gray-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Appearance & Display</h2>
                <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Moon size={20} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Dark Mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark theme for the interface</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Regional Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select 
                    label="Language"
                    options={[
                      { label: 'English (US)', value: 'en-us' },
                      { label: 'English (UK)', value: 'en-uk' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'French', value: 'fr' },
                    ]}
                  />
                  <Select 
                    label="Timezone"
                    options={[
                      { label: 'Pacific Time (PT)', value: 'pst' },
                      { label: 'Eastern Time (ET)', value: 'est' },
                      { label: 'UTC', value: 'utc' },
                    ]}
                  />
                  <Select 
                    label="Currency"
                    options={[
                      { label: 'USD ($)', value: 'usd' },
                      { label: 'EUR (€)', value: 'eur' },
                      { label: 'GBP (£)', value: 'gbp' },
                    ]}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <Card>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'New Lead Alerts', desc: 'Get notified when a new lead is captured.', icon: <Users size={18} /> },
                      { title: 'Task Reminders', desc: 'Receive reminders for upcoming viewings and tasks.', icon: <Bell size={18} /> },
                      { title: 'System Updates', desc: 'News about feature updates and maintenance.', icon: <Shield size={18} /> },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-slate-800 last:border-0">
                         <div className="flex gap-3">
                            <div className="mt-1 text-slate-400">{item.icon}</div>
                            <div>
                               <p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" defaultChecked className="rounded border-gray-300 text-accent focus:ring-accent" />
                               <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" defaultChecked className="rounded border-gray-300 text-accent focus:ring-accent" />
                               <span className="text-sm text-slate-600 dark:text-slate-400">Push</span>
                            </label>
                         </div>
                      </div>
                    ))}
                  </div>
               </Card>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Card>
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Members</h2>
                      <Button size="sm" variant="secondary" icon={<Users size={16} />}>Invite Member</Button>
                   </div>
                   
                   <div className="space-y-4">
                      {[
                        { name: 'Sarah Miller', role: 'Admin', email: 'sarah@estateflow.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80' },
                        { name: 'Mike Ross', role: 'Agent', email: 'mike@estateflow.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80' },
                        { name: 'Jessica Pearson', role: 'Manager', email: 'jessica@estateflow.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64&q=80' },
                      ].map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                           <div className="flex items-center gap-3">
                              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                 <p className="font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <Badge variant={member.role === 'Admin' ? 'info' : 'neutral'}>{member.role}</Badge>
                              <Button size="sm" variant="ghost">Edit</Button>
                           </div>
                        </div>
                      ))}
                   </div>
                </Card>
             </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="bg-gradient-to-br from-primary to-slate-800 text-white">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <p className="text-slate-300 text-sm">Current Plan</p>
                            <h3 className="text-2xl font-bold mt-1">Pro Plan</h3>
                         </div>
                         <Badge variant="info" className="bg-white/20 text-white border-none">Active</Badge>
                      </div>
                      <div className="mb-6">
                         <p className="text-3xl font-bold">$49<span className="text-lg text-slate-400 font-normal">/month</span></p>
                         <p className="text-sm text-slate-300 mt-1">Next billing date: Oct 24, 2023</p>
                      </div>
                      <Button variant="secondary" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">Manage Subscription</Button>
                   </Card>

                   <Card>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Payment Method</h3>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-slate-700 rounded-lg mb-4">
                         <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600">
                            <CreditCard size={24} />
                         </div>
                         <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-slate-100">•••• •••• •••• 4242</p>
                            <p className="text-xs text-slate-500">Expires 12/24</p>
                         </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-accent">Update Payment Method</Button>
                   </Card>
                </div>

                <Card>
                   <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Billing History</h3>
                   <div className="space-y-2">
                      {[
                        { date: 'Sep 24, 2023', amount: '$49.00', status: 'Paid', invoice: '#INV-2023-009' },
                        { date: 'Aug 24, 2023', amount: '$49.00', status: 'Paid', invoice: '#INV-2023-008' },
                        { date: 'Jul 24, 2023', amount: '$49.00', status: 'Paid', invoice: '#INV-2023-007' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800 last:border-0">
                           <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.date}</p>
                              <p className="text-xs text-slate-500">{item.invoice}</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.amount}</span>
                              <Badge variant="success" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{item.status}</Badge>
                              <Button variant="ghost" size="sm" icon={<Mail size={14} />} />
                           </div>
                        </div>
                      ))}
                   </div>
                </Card>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
