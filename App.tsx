// App.tsx
import React, { useState } from "react";
import Header from "./components/Header";
import PhilosopherCard from "./components/PhilosopherCard";
import PhilosopherModal from "./components/PhilosopherModal";
import { INITIAL_PHILOSOPHERS } from "./constants";
import { Philosopher } from "./types";
import { generateNewPhilosopher } from "./services/geminiService";
import { Loader2, AlertCircle } from "lucide-react";

const App: React.FC = () => {
  const [philosophers, setPhilosophers] =
    useState<Philosopher[]>(INITIAL_PHILOSOPHERS);
  const [selectedPhilosopher, setSelectedPhilosopher] =
    useState<Philosopher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setError(null);

    // 1. 先看是不是现有卡片里已经有
    const existing = philosophers.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (existing) {
      setSelectedPhilosopher(existing);
      return;
    }

    // 2. 否则走 Gemini 生成新哲学家
    setLoading(true);
    try {
      const newPhilosopher = await generateNewPhilosopher(query);
      setPhilosophers((prev) => [newPhilosopher, ...prev]);
      setSelectedPhilosopher(newPhilosopher);
    } catch (e) {
      console.error(e);
      setError(
        "无法通过 Gemini 生成这个哲学家的信息，请检查 API Key 或稍后再试。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = (
    philosopherId: string,
    text: string,
    author: string
  ) => {
    const newComment = {
      id: Date.now().toString(),
      text,
      author,
      timestamp: Date.now(),
    };

    setPhilosophers((prev) =>
      prev.map((p) =>
        p.id === philosopherId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );

    setSelectedPhilosopher((prev) =>
      prev && prev.id === philosopherId
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-[#f5efe2] text-[#2b190f]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <Header
          onSearch={handleSearch}
          onHome={() => setSelectedPhilosopher(null)}
        />

        <main className="mt-6 md:mt-10">
          {/* 顶部介绍卡片 */}
          <section className="mb-6 rounded-2xl border border-[#e2c9a5] bg-[#fbf4e6] px-5 py-4 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">
              探索伟大思想
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#6c4a3c]">
              从经典哲学家开始，也可以搜索任意名字，Gemini 会为你生成对应的哲学家档案，
              并支持与你进行「AI 对话」。
            </p>
          </section>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* 主列表 */}
          {loading ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-[#c47f3b]" />
              <p className="text-sm text-[#6c4a3c]">
                正在向宇宙召唤新的哲学家…
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {philosophers.map((philosopher) => (
                <PhilosopherCard
                  key={philosopher.id}
                  philosopher={philosopher}
                  onClick={setSelectedPhilosopher}
                />
              ))}
            </div>
          )}

          <footer className="mt-10 border-t border-[#e2c9a5] pt-4 text-xs text-[#8a674f]">
            © {new Date().getFullYear()} PhiloSophia · Made with React, Vite &
            Gemini
          </footer>
        </main>
      </div>

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