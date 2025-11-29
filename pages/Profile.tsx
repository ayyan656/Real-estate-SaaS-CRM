import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Camera, MapPin, Mail, Phone, Building, Lock } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock state for form (in real app, this would come from User context/API)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: 'Senior Agent',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced real estate professional with a passion for luxury properties and client satisfaction. Over 10 years in the market.',
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Cover Image */}
      <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-16 relative shadow-md">
        <button className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg text-sm backdrop-blur-sm transition-colors flex items-center gap-2">
          <Camera size={16} /> Change Cover
        </button>
      </div>

      <div className="px-4 sm:px-10">
        {/* Header Section with Avatar */}
        <div className="flex flex-col sm:flex-row items-end -mt-24 mb-8 gap-6 relative">
           <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-xl object-cover border-4 border-white dark:border-slate-900 shadow-lg bg-white" />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-accent text-white flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-slate-900 shadow-lg">
                  {user.name.charAt(0)}
                </div>
              )}
              <button className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shadow-md border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <Camera size={16} />
              </button>
           </div>
           
           <div className="flex-1 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                {formData.role} • <MapPin size={14} /> {formData.location}
              </p>
           </div>

           <div className="mb-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                </div>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Stats & Contact */}
          <div className="space-y-6">
             <Card>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Contact Info</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Mail size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Email</p>
                        <p className="text-slate-900 dark:text-slate-100 truncate">{formData.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Phone</p>
                        <p className="text-slate-900 dark:text-slate-100">{formData.phone}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                        <Building size={16} />
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Agency</p>
                        <p className="text-slate-900 dark:text-slate-100">EstateFlow HQ</p>
                      </div>
                   </div>
                </div>
             </Card>

             <Card>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Security</h3>
                <Button variant="secondary" className="w-full justify-start" icon={<Lock size={16} />}>
                   Change Password
                </Button>
             </Card>
          </div>

          {/* Right Column: Details Form */}
          <div className="md:col-span-2 space-y-6">
             <Card>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <Input 
                     label="Full Name" 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     disabled={!isEditing}
                   />
                   <Input 
                     label="Role / Title" 
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     disabled={!isEditing}
                   />
                   <Input 
                     label="Phone Number" 
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                     disabled={!isEditing}
                   />
                   <Input 
                     label="Location" 
                     value={formData.location}
                     onChange={e => setFormData({...formData, location: e.target.value})}
                     disabled={!isEditing}
                   />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                   {isEditing ? (
                     <Textarea 
                       value={formData.bio}
                       onChange={e => setFormData({...formData, bio: e.target.value})}
                       className="h-32"
                     />
                   ) : (
                     <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-100 dark:border-slate-800">
                       {formData.bio}
                     </p>
                   )}
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
