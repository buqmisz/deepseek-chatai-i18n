"use client";

import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import { useState, useEffect } from "react";

interface Message {
  role: string;
  content: React.ReactNode;
  sender: "user" | "assistant";
  text: string;
}

interface Chat {
  id: string; // Unique ID for each chat
  title: string; // Chat title (e.g., "Chat 1")
  messages: Message[]; // Chat messages
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Load chat history from local storage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("chatHistory");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chats));
  }, [chats]);

  // Function to create a new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(), // Use a timestamp as a unique ID
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id); // Set the new chat as active
  };

  // Function to set the active chat
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  // Function to edit a chat title
  const handleEditChat = (chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  // Function to delete a chat
  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null); // Clear active chat if it was deleted
    }
  };

  // Get the messages for the active chat
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  // Function to update messages for the active chat
  const setMessages = (
    newMessages: Message[] | ((prev: Message[]) => Message[])
  ) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages:
                typeof newMessages === "function"
                  ? newMessages(chat.messages) // Handle functional updates
                  : newMessages, // Handle direct value updates
            }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onEditChat={handleEditChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Chatbot */}
      <div className="flex-1 flex flex-col">
        <Chatbot messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}
