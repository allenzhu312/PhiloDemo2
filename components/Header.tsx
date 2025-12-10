// components/Header.tsx
import React from "react";
import { BookOpen, Search } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onHome }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      if (value.trim()) {
        onSearch(value);
      }
      (e.target as HTMLInputElement).value = "";
    }
  };

  return (
    <header className="rounded-2xl border border-[#e2c9a5] bg-[#fdf6e8] px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c47f3b] text-[#fdf6e8] shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#2b190f]">
              PhiloSophia
            </h1>
            <p className="text-xs text-[#8a674f]">
              用 AI 探索哲学家与他们的思想宇宙
            </p>
          </div>
        </button>

        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#c47f3b]" />
          <input
            type="text"
            placeholder="搜索哲学家名称，例如：Kant / 庄子..."
            onKeyDown={handleKeyDown}
            className="w-full rounded-full border border-[#e2c9a5] bg-[#fffaf0] py-2.5 pl-9 pr-3 text-sm text-[#2b190f] placeholder:text-[#b08a6f] focus:border-[#c47f3b] focus:outline-none focus:ring-2 focus:ring-[#f0cf9e]"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;