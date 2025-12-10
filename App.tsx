import React, { useState } from 'react';
import Header from './components/Header';
import PhilosopherCard from './components/PhilosopherCard';
import PhilosopherModal from './components/PhilosopherModal';
import { INITIAL_PHILOSOPHERS } from './constants';
import { Philosopher } from './types';
import { generateNewPhilosopher } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>(INITIAL_PHILOSOPHERS);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setError(null);

    // 1. Check if already exists (case insensitive)
    const existing = philosophers.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (existing) {
      setSelectedPhilosopher(existing);
      return;
    }

    // 2. If not, generate via AI
    setLoading(true);
    try {
      const newPhilosopher = await generateNewPhilosopher(query);
      setPhilosophers(prev => [newPhilosopher, ...prev]);
      setSelectedPhilosopher(newPhilosopher);
    } catch (err) {
      console.error(err);
      setError("Could not find or generate a philosopher with that name. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = (philosopherId: string, text: string, author: string) => {
    setPhilosophers(prev => prev.map(p => {
      if (p.id === philosopherId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: Date.now().toString(),
              text,
              author,
              timestamp: Date.now()
            }
          ]
        };
      }
      return p;
    }));
    
    // Also update selected if it's open so UI updates immediately
    if (selectedPhilosopher && selectedPhilosopher.id === philosopherId) {
      setSelectedPhilosopher(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [
            ...prev.comments,
            {
              id: Date.now().toString(),
              text,
              author,
              timestamp: Date.now()
            }
          ]
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-antique flex flex-col font-sans text-ink">
      <Header onSearch={handleSearch} onHome={() => setSelectedPhilosopher(null)} />
      
      <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-4">Explore Great Minds</h2>
          <p className="text-stone-600 text-lg leading-relaxed">
            Discover the wisdom of the ages. Browse our collection or search for any philosopher to dynamically generate their profile and chat with them using AI.
          </p>
        </div>

        {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-center gap-2">
                <AlertCircle size={20} />
                {error}
            </div>
        )}

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-accent mb-4" size={48} />
             <p className="text-stone-500 font-serif text-xl animate-pulse">Summoning wisdom from the ether...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {philosophers.map(philosopher => (
              <PhilosopherCard 
                key={philosopher.id} 
                philosopher={philosopher} 
                onClick={setSelectedPhilosopher} 
              />
            ))}
          </div>
        )}

        <footer className="mt-20 text-center text-stone-500 text-sm border-t border-stone-300 pt-8 pb-8">
          <p>&copy; {new Date().getFullYear()} PhiloSophia. Built with React & Gemini.</p>
        </footer>

      </main>

      {selectedPhilosopher && (
        <PhilosopherModal 
          philosopher={selectedPhilosopher} 
          onClose={() => setSelectedPhilosopher(null)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default App;