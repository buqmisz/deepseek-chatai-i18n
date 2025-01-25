"use client";

import { useState } from "react";
import { Plus, Menu, Edit, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

interface Chat {
  id: string;
  title: string;
  messages: any[]; // Adjust the type as needed
}

interface SidebarProps {
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onEditChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export default function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
  onEditChat,
  onDeleteChat,
}: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const t = useTranslations("Sidebar");

  const handleEditClick = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = (chatId: string) => {
    if (editedTitle.trim()) {
      onEditChat(chatId, editedTitle);
      setEditingChatId(null);
      setEditedTitle("");
    }
  };

  return (
    <>
      {/* Hamburger Icon (Mobile Only) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-zinc-800 rounded-lg md:hidden"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-zinc-800 p-4 border-r border-zinc-700 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
        style={{ zIndex: 40 }} // Ensure sidebar is above other content
      >
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>{t("new_chat")}</span>
        </button>

        {/* Chat History */}
        <div className="mt-4 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="group flex items-center justify-between p-2 hover:bg-zinc-700 rounded-lg cursor-pointer"
            >
              {editingChatId === chat.id ? (
                // Edit mode
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit(chat.id);
                    }
                  }}
                  className="flex-1 bg-transparent text-white focus:outline-none"
                  autoFocus
                />
              ) : (
                // Display mode
                <div
                  onClick={() => {
                    onSelectChat(chat.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selecting a chat
                  }}
                  className="flex-1"
                >
                  {chat.title}
                </div>
              )}

              {/* Edit and Delete Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent chat selection
                    handleEditClick(chat.id, chat.title);
                  }}
                  className="p-1 hover:bg-zinc-600 rounded"
                >
                  <Edit className="w-4 h-4 text-zinc-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent chat selection
                    onDeleteChat(chat.id);
                  }}
                  className="p-1 hover:bg-zinc-600 rounded"
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          style={{ zIndex: 30 }} // Ensure overlay is below sidebar but above other content
        />
      )}
    </>
  );
}
