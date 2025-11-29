import React, { useState, useRef } from 'react';
import { Property, PropertyStatus, PropertyType } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Search, Sparkles, X, Save, Upload, Image as ImageIcon, Trash2, AlertTriangle } from 'lucide-react';
import { generatePropertyDescription } from '../services/geminiService';

// Mock Data
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    address: '123 Main St, Downtown, Seattle',
    price: 450000,
    image: 'https://picsum.photos/400/300?random=1',
    beds: 1,
    baths: 1,
    sqft: 850,
    type: PropertyType.Apartment,
    status: PropertyStatus.Active,
    description: 'A stunning loft in the heart of the city.'
  },
  {
    id: '2',
    title: 'Family Home with Garden',
    address: '456 Oak Ave, Suburbia, Portland',
    price: 850000,
    image: 'https://picsum.photos/400/300?random=2',
    beds: 4,
    baths: 2.5,
    sqft: 2400,
    type: PropertyType.House,
    status: PropertyStatus.Active,
    description: 'Perfect for growing families.'
  },
  {
    id: '3',
    title: 'Luxury Penthouse Suite',
    address: '789 High Rise Blvd, Metropolis',
    price: 1200000,
    image: 'https://picsum.photos/400/300?random=3',
    beds: 3,
    baths: 3,
    sqft: 1800,
    type: PropertyType.Apartment,
    status: PropertyStatus.Sold,
    description: 'Experience luxury living at its finest.'
  },
  {
    id: '4',
    title: 'Cozy Cottage',
    address: '101 Pine Ln, Forest Edge',
    price: 350000,
    image: 'https://picsum.photos/400/300?random=4',
    beds: 2,
    baths: 1,
    sqft: 950,
    type: PropertyType.House,
    status: PropertyStatus.Draft,
    description: 'A quiet retreat in the woods.'
  },
];

const INITIAL_FORM_STATE = {
  title: '',
  address: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  status: PropertyStatus.Active,
  specs: '', // For AI context
  vibe: '', // For AI context
  description: '',
  image: '',
};

export const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to track if we are editing an existing property
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Property Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.address.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAiGenerate = async () => {
    if (!formData.title || !formData.specs) return;
    setIsGenerating(true);
    try {
      const desc = await generatePropertyDescription(formData.title, formData.specs, formData.vibe || 'Professional and inviting');
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      alert('Failed to generate description. Check console or API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const openEditModal = (property: Property) => {
    setEditingId(property.id);
    setFormData({
      title: property.title,
      address: property.address,
      price: property.price.toString(),
      beds: property.beds.toString(),
      baths: property.baths.toString(),
      sqft: property.sqft.toString(),
      status: property.status,
      specs: '', // Reset AI helpers
      vibe: '',
      description: property.description || '',
      image: property.image,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback image if none provided
    const propertyImage = formData.image || `https://picsum.photos/400/300?random=${Date.now()}`;

    if (editingId) {
      // Update Existing
      setProperties(prev => prev.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            title: formData.title,
            address: formData.address,
            price: Number(formData.price),
            beds: Number(formData.beds),
            baths: Number(formData.baths),
            sqft: Number(formData.sqft),
            status: formData.status,
            description: formData.description,
            image: propertyImage
          };
        }
        return p;
      }));
    } else {
      // Create New
      const p: Property = {
        id: Date.now().toString(),
        title: formData.title,
        address: formData.address,
        price: Number(formData.price),
        image: propertyImage,
        beds: Number(formData.beds) || 3,
        baths: Number(formData.baths) || 2,
        sqft: Number(formData.sqft) || 1500,
        type: PropertyType.House, // Defaulting type for simplicity
        status: formData.status,
        description: formData.description
      };
      setProperties([p, ...properties]);
    }
    
    setIsModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setProperties(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Search properties..." 
            className="pl-10" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button onClick={openAddModal} icon={<Plus size={18} />}>
          Add Property
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onClick={() => openEditModal(property)}
            onDelete={(e) => {
              e.stopPropagation();
              setDeleteId(property.id);
            }}
          />
        ))}
      </div>

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingId ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Property Image</label>
                <div className="flex items-start gap-5">
                    {formData.image ? (
                        <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 group shadow-sm">
                            <img src={formData.image} alt="Property" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-black/50"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-40 h-28 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                            <ImageIcon size={28} />
                            <span className="text-xs mt-2 font-medium">No Image</span>
                        </div>
                    )}
                    
                    <div className="flex-1 pt-1">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                icon={<Upload size={16} />}
                            >
                                Upload Photo
                            </Button>
                            {formData.image && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveImage}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                              Recommended size: 800x600px. Supports JPG, PNG.
                          </p>
                        </div>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Property Title" 
                  placeholder="e.g. Sunny Villa" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
                <Input 
                  label="Price ($)" 
                  type="number" 
                  placeholder="500000" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                />
                <Input 
                  label="Address" 
                  className="md:col-span-2" 
                  placeholder="123 Street Name" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                 <Input 
                  label="Beds" 
                  type="number" 
                  value={formData.beds}
                  onChange={e => setFormData({...formData, beds: e.target.value})}
                  required
                />
                 <Input 
                  label="Baths" 
                  type="number" 
                  step="0.5"
                  value={formData.baths}
                  onChange={e => setFormData({...formData, baths: e.target.value})}
                  required
                />
                 <Input 
                  label="Sqft" 
                  type="number" 
                  value={formData.sqft}
                  onChange={e => setFormData({...formData, sqft: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select 
                   label="Status"
                   value={formData.status}
                   onChange={e => setFormData({...formData, status: e.target.value as PropertyStatus})}
                   options={[
                     { label: 'Active', value: PropertyStatus.Active },
                     { label: 'Draft', value: PropertyStatus.Draft },
                     { label: 'Sold', value: PropertyStatus.Sold },
                   ]}
                 />
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">AI Description Generator</h3>
                  <Badge variant="info">Gemini 2.5 Flash</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <Input 
                    label="Key Features/Specs" 
                    placeholder="3 bed, 2 bath, garden, renovated kitchen" 
                    value={formData.specs}
                    onChange={e => setFormData({...formData, specs: e.target.value})}
                  />
                  <Input 
                    label="Vibe/Tone" 
                    placeholder="Luxury, Cozy, Modern, Family-friendly" 
                    value={formData.vibe}
                    onChange={e => setFormData({...formData, vibe: e.target.value})}
                  />
                </div>

                <div className="flex justify-end mb-4">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAiGenerate}
                    isLoading={isGenerating}
                    icon={<Sparkles size={16} className="text-purple-600" />}
                    disabled={!formData.title || !formData.specs}
                  >
                    Generate Description
                  </Button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent h-32"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Property description will appear here..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" icon={<Save size={18} />}>
                  {editingId ? 'Save Changes' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Delete Property?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};