// components/PhilosopherCard.tsx
import React from "react";
import { Philosopher } from "../types";
import { MessageSquare, Heart } from "lucide-react";

interface PhilosopherCardProps {
  philosopher: Philosopher;
  onClick: (philosopher: Philosopher) => void;
}

const PhilosopherCard: React.FC<PhilosopherCardProps> = ({
  philosopher,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(philosopher)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e2c9a5] bg-[#fbf4e6] text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={philosopher.imageUrl}
          alt={philosopher.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#b08a6f]">
          {philosopher.school}
        </p>
        <h3 className="text-lg font-semibold text-[#2b190f]">
          {philosopher.name}
        </h3>
        <p className="text-xs text-[#8a674f]">{philosopher.dates}</p>

        <p className="mt-1 line-clamp-3 text-sm text-[#4a2b1a]">
          {philosopher.shortBio}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[#8a674f]">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {philosopher.comments.length} 条评论
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            阅读更多
          </span>
        </div>
      </div>
    </button>
  );
};

export default PhilosopherCard;