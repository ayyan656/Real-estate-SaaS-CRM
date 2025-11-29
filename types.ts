import React from 'react';

export enum PropertyStatus {
  Draft = 'Draft',
  Active = 'Active',
  Sold = 'Sold',
}

export enum PropertyType {
  Apartment = 'Apartment',
  House = 'House',
  Commercial = 'Commercial',
  Land = 'Land',
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  type: PropertyType;
  status: PropertyStatus;
  description?: string;
}

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Viewing = 'Viewing',
  Negotiation = 'Negotiation',
  Closed = 'Closed',
}

export interface LeadActivity {
  id: string;
  type: 'status_change' | 'note' | 'creation' | 'assignment' | 'update';
  description: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: number;
  status: LeadStatus;
  interest: string; // e.g., "Looking for 2BR downtown"
  assignedTo?: string;
  avatar?: string;
  notes?: string;
  createdAt?: string;
  activities?: LeadActivity[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  phone?: string;
  bio?: string;
  location?: string;
}
