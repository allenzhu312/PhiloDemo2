import React from 'react';
import { Philosopher } from '../types';
import { MessageSquare, Heart } from 'lucide-react';

interface PhilosopherCardProps {
  philosopher: Philosopher;
  onClick: (philosopher: Philosopher) => void;
}

const PhilosopherCard: React.FC<PhilosopherCardProps> = ({ philosopher, onClick }) => {
  return (
    <div 
      onClick={() => onClick(philosopher)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-stone-200 flex flex-col h-full transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={philosopher.imageUrl} 
          alt={philosopher.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter sepia-[0.2]"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
          {philosopher.school}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-xl font-serif font-bold text-ink group-hover:text-accent transition-colors">
            {philosopher.name}
          </h3>
          <span className="text-xs text-stone-500 font-mono">{philosopher.dates}</span>
        </div>
        
        <p className="text-stone-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {philosopher.shortBio}
        </p>

        <div className="mt-auto flex items-center justify-between text-stone-400 text-xs pt-4 border-t border-stone-100">
          <div className="flex items-center gap-1">
             <MessageSquare size={14} />
             <span>{philosopher.comments.length} comments</span>
          </div>
          <div className="flex items-center gap-1 group-hover:text-accent transition-colors">
            <span className="font-semibold uppercase tracking-wider">Read More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherCard;