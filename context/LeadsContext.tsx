import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, LeadStatus, LeadActivity } from '../types';

const MOCK_LEADS: Lead[] = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    phone: '(555) 123-4567', 
    budget: 450000, 
    status: LeadStatus.New, 
    interest: '2BR Condo in Downtown',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'First time home buyer. Pre-approved for $450k. Interested in amenities like gym and pool. Available for viewings on weekends only.',
    assignedTo: 'Sarah Miller',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    activities: [
      { id: 'a1', type: 'creation', description: 'Lead captured from Landing Page', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: 'a2', type: 'assignment', description: 'Assigned to Sarah Miller', date: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString() }
    ]
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    email: 'bob@example.com', 
    phone: '(555) 987-6543', 
    budget: 600000, 
    status: LeadStatus.New, 
    interest: 'Family House with backyard',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Looking for a school district area. Needs a fenced yard for dogs. Prefer move-in ready but open to minor renovations.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    activities: [
      { id: 'b1', type: 'creation', description: 'Lead added manually', date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() }
    ]
  },
  { 
    id: '3', 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    phone: '(555) 456-7890', 
    budget: 300000, 
    status: LeadStatus.Contacted, 
    interest: 'Fixer upper investment',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Cash buyer. Looking for ROI properties. Experienced investor.',
    assignedTo: 'Mike Ross',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    activities: [
      { id: 'c1', type: 'creation', description: 'Lead registered', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: 'c2', type: 'status_change', description: 'Status changed to Contacted', date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
      { id: 'c3', type: 'note', description: 'Call logged: Interested in 123 Pine St', date: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString() }
    ]
  },
  { 
    id: '4', 
    name: 'Diana Prince', 
    email: 'diana@example.com', 
    phone: '(555) 222-3333', 
    budget: 1200000, 
    status: LeadStatus.Viewing, 
    interest: 'Luxury Penthouse',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'High net worth client. Requires 24/7 security building. Wants a view of the water.',
    assignedTo: 'Sarah Miller',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    activities: [
      { id: 'd1', type: 'creation', description: 'Lead created', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
      { id: 'd2', type: 'status_change', description: 'Moved to Viewing stage', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
    ]
  },
  { 
    id: '5', 
    name: 'Evan Wright', 
    email: 'evan@example.com', 
    phone: '(555) 777-8888', 
    budget: 500000, 
    status: LeadStatus.Negotiation, 
    interest: 'Suburban Home',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Offer submitted on 123 Maple Dr. Negotiating closing costs.',
    assignedTo: 'Jessica Pearson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    activities: [
      { id: 'e1', type: 'creation', description: 'Lead created', date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
      { id: 'e2', type: 'assignment', description: 'Assigned to Jessica Pearson', date: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString() },
      { id: 'e3', type: 'status_change', description: 'Offer drafted', date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() }
    ]
  },
];

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const addLead = (lead: Lead) => {
    // Initialize with a creation activity
    const newActivity: LeadActivity = {
      id: Date.now().toString(),
      type: 'creation',
      description: 'Lead created',
      date: new Date().toISOString()
    };

    const newLead = { 
      ...lead, 
      createdAt: lead.createdAt || new Date().toISOString(),
      activities: [newActivity, ...(lead.activities || [])]
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id && l.status !== status) {
        // Create activity log
        const activity: LeadActivity = {
          id: Date.now().toString(),
          type: 'status_change',
          description: `Status updated to ${status}`,
          date: new Date().toISOString()
        };
        return { 
          ...l, 
          status, 
          activities: [activity, ...(l.activities || [])] 
        };
      }
      return l;
    }));
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        const newActivities: LeadActivity[] = [...(l.activities || [])];
        
        // Check for specific updates to log
        if (updates.assignedTo && updates.assignedTo !== l.assignedTo) {
          newActivities.unshift({
            id: Date.now().toString() + 'assign',
            type: 'assignment',
            description: updates.assignedTo ? `Assigned to ${updates.assignedTo}` : 'Unassigned',
            date: new Date().toISOString()
          });
        }

        if (updates.budget && updates.budget !== l.budget) {
           newActivities.unshift({
            id: Date.now().toString() + 'budget',
            type: 'update',
            description: `Budget updated to $${updates.budget.toLocaleString()}`,
            date: new Date().toISOString()
          });
        }
        
        return { 
          ...l, 
          ...updates, 
          activities: newActivities
        };
      }
      return l;
    }));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLeadStatus, updateLead }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};