import React from 'react';
import { Property, PropertyStatus } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Bed, Bath, Ruler, MapPin, Edit2, Trash2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div onClick={onClick} className="h-full">
      <Card noPadding className="h-full flex flex-col hover:shadow-md transition-all cursor-pointer group hover:ring-2 hover:ring-accent/50 relative">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex gap-2">
             <Badge variant={property.status === PropertyStatus.Active ? 'success' : 'neutral'}>
              {property.status}
            </Badge>
          </div>
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg hover:bg-white">
               <Edit2 size={16} /> Edit
             </div>
             {onDelete && (
               <button 
                onClick={onDelete}
                className="bg-red-500/90 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg hover:bg-red-600"
               >
                 <Trash2 size={16} /> Delete
               </button>
             )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 group-hover:opacity-0 transition-opacity">
             <p className="text-white font-bold text-lg">{formatPrice(property.price)}</p>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
             <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 truncate flex-1">{property.title}</h3>
             <p className="text-accent font-bold text-sm md:hidden">{formatPrice(property.price)}</p>
          </div>
          
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{property.address}</span>
          </div>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{property.beds}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{property.baths}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler size={16} />
              <span>{property.sqft}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};