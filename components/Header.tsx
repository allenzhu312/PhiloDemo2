import React from 'react';
import { BookOpen, Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onHome }) => {
  return (
    <header className="sticky top-0 z-10 bg-antique-dark/95 backdrop-blur-sm border-b border-stone-300 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHome}
        >
          <div className="bg-ink text-white p-2 rounded-lg group-hover:bg-accent transition-colors duration-300">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-ink">PhiloSophia</h1>
            <p className="text-xs text-stone-600 font-sans tracking-widest uppercase">The Interactive Wisdom Wiki</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Find or generate a philosopher..." 
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent font-sans text-sm transition-all shadow-inner"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;