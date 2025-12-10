import React, { useState, useEffect, useRef } from 'react';
import { Philosopher, Comment, ChatMessage } from '../types';
import { X, MessageCircle, Send, User, Quote, Sparkles } from 'lucide-react';
import { streamPhilosopherChat } from '../services/geminiService';

interface PhilosopherModalProps {
  philosopher: Philosopher;
  onClose: () => void;
  onAddComment: (philosopherId: string, text: string, author: string) => void;
}

enum Tab {
  BIO = 'BIO',
  CHAT = 'CHAT',
  COMMENTS = 'COMMENTS'
}

const PhilosopherModal: React.FC<PhilosopherModalProps> = ({ philosopher, onClose, onAddComment }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.BIO);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Comment State
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Convert internal ChatMessage to the format service expects if needed, or just pass history
      const stream = streamPhilosopherChat(
        philosopher.name, 
        chatHistory.map(m => ({ role: m.role, content: m.content })), 
        userMsg.content
      );

      let fullResponse = '';
      setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = fullResponse;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat error", error);
      setChatHistory(prev => [...prev, { role: 'model', content: "I am currently lost in deep contemplation and cannot respond. (API Error)" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && authorName.trim()) {
      onAddComment(philosopher.id, newComment, authorName);
      setNewComment('');
      // Keep author name for convenience
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-antique w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        
        {/* Left Panel: Image & Quick Stats */}
        <div className="md:w-1/3 bg-stone-200/50 relative">
            <div className="h-64 md:h-full w-full relative">
                <img 
                    src={philosopher.imageUrl} 
                    alt={philosopher.name} 
                    className="w-full h-full object-cover filter sepia-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent md:bg-gradient-to-r" />
                
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <h2 className="text-3xl font-serif font-bold mb-1">{philosopher.name}</h2>
                    <p className="font-mono text-sm text-stone-300 mb-4">{philosopher.dates}</p>
                    <div className="flex flex-wrap gap-2">
                        {philosopher.keyIdeas.slice(0, 3).map((idea, idx) => (
                            <span key={idx} className="bg-white/20 backdrop-blur px-2 py-1 rounded text-xs">
                                {idea}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:hidden bg-black/20 text-white p-2 rounded-full backdrop-blur z-20"
            >
                <X size={20} />
            </button>
        </div>

        {/* Right Panel: Content */}
        <div className="md:w-2/3 flex flex-col bg-antique h-full">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between border-b border-stone-300 px-6 py-4 bg-white/50">
                <div className="flex space-x-6">
                    <button 
                        onClick={() => setActiveTab(Tab.BIO)}
                        className={`pb-1 text-sm font-semibold tracking-wide transition-colors ${activeTab === Tab.BIO ? 'text-accent border-b-2 border-accent' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        BIOGRAPHY
                    </button>
                    <button 
                        onClick={() => setActiveTab(Tab.CHAT)}
                        className={`pb-1 text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 ${activeTab === Tab.CHAT ? 'text-accent border-b-2 border-accent' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        <Sparkles size={14} /> CHAT WITH AI
                    </button>
                    <button 
                        onClick={() => setActiveTab(Tab.COMMENTS)}
                        className={`pb-1 text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 ${activeTab === Tab.COMMENTS ? 'text-accent border-b-2 border-accent' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                         COMMENTS ({philosopher.comments.length})
                    </button>
                </div>
                <button onClick={onClose} className="hidden md:block text-stone-400 hover:text-ink transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {activeTab === Tab.BIO && (
                    <div className="space-y-8 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold font-serif text-ink mb-3 flex items-center gap-2">
                                About
                            </h3>
                            <p className="text-stone-700 leading-relaxed text-lg font-serif">
                                {philosopher.fullBio || philosopher.shortBio}
                            </p>
                        </div>

                        <div className="bg-stone-100 p-6 rounded-xl border border-stone-200">
                            <h3 className="text-lg font-bold font-serif text-ink mb-4 flex items-center gap-2">
                                <Quote size={18} className="text-accent" /> Famous Quotes
                            </h3>
                            <ul className="space-y-4">
                                {philosopher.famousQuotes.map((quote, idx) => (
                                    <li key={idx} className="italic text-stone-600 border-l-4 border-accent pl-4 py-1">
                                        "{quote}"
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold font-serif text-ink mb-3">Key Concepts</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {philosopher.keyIdeas.map((idea, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-stone-700">
                                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                                        {idea}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === Tab.CHAT && (
                    <div className="flex flex-col h-full animate-fadeIn">
                        <div className="flex-grow space-y-4 mb-4">
                            {chatHistory.length === 0 && (
                                <div className="text-center text-stone-500 py-12">
                                    <Sparkles className="mx-auto mb-2 text-accent" size={32} />
                                    <p>Start a conversation with a simulated {philosopher.name}.</p>
                                    <p className="text-sm opacity-70">Ask about their views on life, ethics, or existence.</p>
                                </div>
                            )}
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-accent text-white rounded-br-none' 
                                        : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                                    }`}>
                                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-stone-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                                    placeholder={isTyping ? "Philosopher is thinking..." : "Ask a philosophical question..."}
                                    disabled={isTyping}
                                    className="w-full bg-white border border-stone-300 rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isTyping || !chatInput.trim()}
                                    className="absolute right-2 top-2 p-1.5 bg-ink text-white rounded-full hover:bg-accent disabled:opacity-50 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-xs text-center text-stone-400 mt-2">AI-generated responses may not be historically accurate.</p>
                        </div>
                    </div>
                )}

                {activeTab === Tab.COMMENTS && (
                    <div className="h-full flex flex-col animate-fadeIn">
                        <div className="flex-grow space-y-6 mb-6">
                            {philosopher.comments.length === 0 ? (
                                <div className="text-center text-stone-400 py-10">
                                    <MessageCircle className="mx-auto mb-2 opacity-50" size={32} />
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                philosopher.comments.map((comment) => (
                                    <div key={comment.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-stone-200 p-1.5 rounded-full">
                                                <User size={14} className="text-stone-500" />
                                            </div>
                                            <span className="font-bold text-stone-800 text-sm">{comment.author}</span>
                                            <span className="text-xs text-stone-400">
                                                {new Date(comment.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-stone-700 text-sm">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="bg-stone-100 p-4 rounded-xl border border-stone-200">
                            <h4 className="text-sm font-bold text-stone-600 mb-3">Add a Comment</h4>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    className="w-full p-2 rounded border border-stone-300 text-sm focus:outline-none focus:border-accent"
                                    value={authorName}
                                    onChange={e => setAuthorName(e.target.value)}
                                    required
                                />
                                <textarea 
                                    placeholder="Share your insights..." 
                                    className="w-full p-2 rounded border border-stone-300 text-sm focus:outline-none focus:border-accent min-h-[80px]"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    required
                                />
                                <button 
                                    type="submit" 
                                    className="w-full bg-ink text-white py-2 rounded font-medium hover:bg-accent transition-colors text-sm"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherModal;