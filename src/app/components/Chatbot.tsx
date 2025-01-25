"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown"; // For rendering Markdown
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown

import { useTranslations } from "next-intl";

interface Message {
  role: string;
  content: ReactNode;
  sender: "user" | "assistant";
  text: string;
}

interface ChatbotProps {
  messages: Message[]; // Define the messages prop
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void; // Update setMessages to accept a function
}

export default function Chatbot({ messages, setMessages }: ChatbotProps) {
  const t = useTranslations("Chatbot");
  const [input, setInput] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (typeof window !== "undefined") {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSummit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isloading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]); // Use functional update
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        sender: "assistant",
        text: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]); // Use functional update
    } catch (error: any) {
      console.log("Error", error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message}. Please try again`,
        sender: "assistant",
        text: `Error: ${error.message}. Please try again`,
      };
      setMessages((prev) => [...prev, errorMessage]); // Use functional update
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 items-start ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {/* Render Markdown for Assistant's Messages */}
              {message.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-invert text-sm"
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
            {message.role === "user" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isloading && (
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-150"></div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSummit}
        className="border-t border-zinc-800 flex pt-4 gap-2 justify-center p-4"
        dir="rtl"
      >
        <div className="flex gap-2 w-full items-end">
          <textarea
            ref={textareaRef}
            placeholder={t("placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-800 px-4 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none overflow-hidden"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "200px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSummit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isloading}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
