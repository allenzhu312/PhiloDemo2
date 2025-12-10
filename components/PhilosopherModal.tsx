// components/PhilosopherModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { Philosopher, ChatMessage } from "../types";
import { X, MessageCircle, Send, User, Quote, Sparkles } from "lucide-react";
import { streamPhilosopherChat } from "../services/geminiService";

interface PhilosopherModalProps {
  philosopher: Philosopher;
  onClose: () => void;
  onAddComment: (philosopherId: string, text: string, author: string) => void;
}

enum Tab {
  BIO = "BIO",
  CHAT = "CHAT",
  COMMENTS = "COMMENTS",
}

const PhilosopherModal: React.FC<PhilosopherModalProps> = ({
  philosopher,
  onClose,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.BIO);

  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Comment state
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  // 自动滚动到底部
  useEffect(() => {
    if (chatEndRef.current && activeTab === Tab.CHAT) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const historyBefore = [...chatHistory, userMsg];

    setChatHistory(historyBefore);
    setChatInput("");
    setIsTyping(true);

    try {
      const stream = streamPhilosopherChat(
        philosopher.name,
        historyBefore.map((m) => ({ role: m.role, content: m.content })),
        userMsg.content
      );

      let fullResponse = "";
      // 占位的 model 消息
      setChatHistory((prev) => [...prev, { role: "model", content: "" }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setChatHistory((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "model") {
            last.content = fullResponse;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "我似乎陷入了过于深刻的思考之中，现在暂时无法回答（可能是 API Key 或网络出现了问题）。",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;
    onAddComment(philosopher.id, newComment, authorName);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#e2c9a5] bg-[#fbf4e6] shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-[#f5e6cf] p-1.5 text-[#6c4a3c] shadow-sm hover:bg-[#f0d6b4]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] md:p-8">
          {/* 左侧：图片 & 基本信息 */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-2xl border border-[#e2c9a5] bg-[#fdf6e8]">
              <img
                src={philosopher.imageUrl}
                alt={philosopher.name}
                className="h-64 w-full object-cover"
              />
            </div>

            <div className="space-y-2 rounded-2xl border border-[#e2c9a5] bg-[#fff7eb] px-4 py-3 text-sm text-[#6c4a3c]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08a6f]">
                {philosopher.school}
              </p>
              <h2 className="text-xl font-bold text-[#2b190f]">
                {philosopher.name}
              </h2>
              <p className="text-xs text-[#8a674f]">{philosopher.dates}</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#e2c9a5] bg-[#fffaf0] px-4 py-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#b08a6f]">
                <Sparkles className="h-4 w-4" />
                Key Ideas
              </h3>
              <ul className="space-y-1 text-sm text-[#4a2b1a]">
                {philosopher.keyIdeas.slice(0, 4).map((idea, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#c47f3b]" />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧：Tab + 内容 */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="border-b border-[#e2c9a5] pb-2">
              <div className="flex gap-4 text-xs font-semibold tracking-wide">
                <button
                  onClick={() => setActiveTab(Tab.BIO)}
                  className={`pb-1 transition-colors ${
                    activeTab === Tab.BIO
                      ? "border-b-2 border-[#c47f3b] text-[#c47f3b]"
                      : "text-[#8a674f] hover:text-[#c47f3b]"
                  }`}
                >
                  BIOGRAPHY
                </button>
                <button
                  onClick={() => setActiveTab(Tab.CHAT)}
                  className={`flex items-center gap-1 pb-1 transition-colors ${
                    activeTab === Tab.CHAT
                      ? "border-b-2 border-[#c47f3b] text-[#c47f3b]"
                      : "text-[#8a674f] hover:text-[#c47f3b]"
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  CHAT WITH AI
                </button>
                <button
                  onClick={() => setActiveTab(Tab.COMMENTS)}
                  className={`flex items-center gap-1 pb-1 transition-colors ${
                    activeTab === Tab.COMMENTS
                      ? "border-b-2 border-[#c47f3b] text-[#c47f3b]"
                      : "text-[#8a674f] hover:text-[#c47f3b]"
                  }`}
                >
                  COMMENTS ({philosopher.comments.length})
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-[#3b2418]">
              {activeTab === Tab.BIO && (
                <div className="space-y-4">
                  <section>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#b08a6f]">
                      About
                    </h3>
                    <p>
                      {philosopher.fullBio || philosopher.shortBio}
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#b08a6f]">
                      <Quote className="h-4 w-4" />
                      Famous Quotes
                    </h3>
                    <ul className="space-y-2">
                      {philosopher.famousQuotes.map((quote, idx) => (
                        <li
                          key={idx}
                          className="rounded-xl bg-[#fffaf0] px-3 py-2 text-sm italic text-[#4a2b1a]"
                        >
                          “{quote}”
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}

              {activeTab === Tab.CHAT && (
                <div className="flex h-full flex-col">
                  <div className="mb-3 rounded-xl bg-[#fff7eb] px-3 py-2 text-xs text-[#6c4a3c]">
                    和一个模拟的「{philosopher.name}」聊天。
                    可以问人生、伦理、存在、政治、科学等任何问题。
                    <br />
                    <span className="text-[11px] opacity-80">
                      * AI 生成内容可能不完全符合历史事实，仅供学习与思考参考。
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto rounded-xl bg-[#fffaf0] p-3">
                    {chatHistory.length === 0 && (
                      <p className="text-xs text-[#8a674f]">
                        先发一条消息试试：
                        「你如何看待幸福？」或者「用高中生能听懂的话解释一下你的核心思想」。
                      </p>
                    )}

                    {chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                            msg.role === "user"
                              ? "bg-[#f3e0c3] text-[#2b190f]"
                              : "bg-white/90 text-[#3b2418]"
                          }`}
                        >
                          <div className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-[#8a674f]">
                            {msg.role === "user" ? (
                              <>
                                <User className="h-3 w-3" />
                                你
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" />
                                {philosopher.name}
                              </>
                            )}
                          </div>
                          <div className="whitespace-pre-wrap">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="mt-2 text-xs text-[#8a674f]">
                        {philosopher.name} 正在思考…
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* 输入框 */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !isTyping && handleSendMessage()
                        }
                        placeholder={
                          isTyping
                            ? "哲学家正在思考..."
                            : "问一个哲学问题，比如：什么是有意义的人生？"
                        }
                        disabled={isTyping}
                        className="w-full rounded-full border border-[#e2c9a5] bg-white py-2.5 pl-4 pr-10 text-sm text-[#2b190f] placeholder:text-[#b08a6f] focus:border-[#c47f3b] focus:outline-none focus:ring-2 focus:ring-[#f0cf9e]"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isTyping || !chatInput.trim()}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#c47f3b] text-white shadow-sm disabled:cursor-not-allowed disabled:bg-[#e2c9a5]"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === Tab.COMMENTS && (
                <div className="space-y-4">
                  {philosopher.comments.length === 0 ? (
                    <p className="text-sm text-[#8a674f]">
                      还没有评论，写下你的想法吧。
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {philosopher.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-xl bg-[#fffaf0] px-3 py-2"
                        >
                          <div className="mb-1 flex items-center justify-between text-xs text-[#8a674f]">
                            <span className="inline-flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {comment.author}
                            </span>
                            <span>
                              {new Date(
                                comment.timestamp
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#3b2418]">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleCommentSubmit} className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b08a6f]">
                      Add a Comment
                    </h4>
                    <input
                      type="text"
                      placeholder="你的名字"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full rounded-full border border-[#e2c9a5] bg-white px-3 py-2 text-sm text-[#2b190f] placeholder:text-[#b08a6f] focus:border-[#c47f3b] focus:outline-none focus:ring-2 focus:ring-[#f0cf9e]"
                      required
                    />
                    <textarea
                      placeholder="写下你的想法、感受或问题…"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="h-20 w-full rounded-2xl border border-[#e2c9a5] bg-white px-3 py-2 text-sm text-[#2b190f] placeholder:text-[#b08a6f] focus:border-[#c47f3b] focus:outline-none focus:ring-2 focus:ring-[#f0cf9e]"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#c47f3b] py-2 text-sm font-medium text-white shadow-sm hover:bg-[#b56f2f]"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherModal;