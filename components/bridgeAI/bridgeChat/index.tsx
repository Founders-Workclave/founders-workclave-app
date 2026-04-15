"use client";

import { useState, useCallback } from "react";
import { Message, Conversation, ChatMode } from "@/types/bridge";
import { bridgeService } from "@/lib/api/bridgeService";

import styles from "./styles.module.css";
import Sidebar from "../sideBar";
import Topbar from "../topBar";
import MessageList from "../messageList";
import MessageInput from "../messageInput";

let messageCounter = 0;
function generateId() {
  return `msg_${Date.now()}_${++messageCounter}`;
}

export default function AlexChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("idea_refinement");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPRD, setIsGeneratingPRD] = useState(false);
  const [prdContent, setPrdContent] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function showToast(msg: string, duration = 3500) {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }

  function addMessage(role: Message["role"], content: string): Message {
    const message: Message = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }

  function registerConversation(id: string, firstMessage: string) {
    const conv: Conversation = {
      id,
      title:
        firstMessage.substring(0, 40) + (firstMessage.length > 40 ? "…" : ""),
      mode,
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
  }

  const handleSend = useCallback(
    async (text: string) => {
      if (isLoading) return;
      const isFirstMessage = messages.length === 0;
      addMessage("user", text);
      setIsLoading(true);
      try {
        const response = await bridgeService.sendMessage({
          message: text,
          mode,
          ...(conversationId ? { conversation_id: conversationId } : {}),
        });
        if (!conversationId) {
          setConversationId(response.conversation_id);
          if (isFirstMessage)
            registerConversation(response.conversation_id, text);
        }
        addMessage("assistant", response.message.content);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        addMessage(
          "assistant",
          `Sorry, I ran into an issue: _${message}_ — please try again.`
        );
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, messages.length, mode, conversationId]
  );

  async function handleGeneratePRD() {
    if (!conversationId) {
      showToast("⚠️ Start a conversation first before generating a PRD.");
      return;
    }
    setIsGeneratingPRD(true);
    showToast("📄 Generating your PRD…");
    try {
      const response = await bridgeService.generatePRD({
        conversation_id: conversationId,
      });
      setPrdContent(response.prd_content);
      showToast("✅ PRD generated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "PRD generation failed.";
      showToast(`❌ ${message}`);
    } finally {
      setIsGeneratingPRD(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setConversationId(null);
    setPrdContent(null);
  }

  function handleSelectConversation(id: string) {
    setConversationId(id);
  }

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        activeId={conversationId}
        mode={mode}
        onModeChange={setMode}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        onSelectConversation={(id) => {
          handleSelectConversation(id);
          setSidebarOpen(false);
        }}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <main className={styles.main}>
        <Topbar
          hasConversation={!!conversationId}
          isGeneratingPRD={isGeneratingPRD}
          onGeneratePRD={handleGeneratePRD}
          onClearChat={handleNewChat}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <MessageList
          messages={messages}
          prdContent={prdContent}
          isLoading={isLoading}
          onStarterClick={(text) => handleSend(text)}
        />

        <MessageInput mode={mode} isLoading={isLoading} onSend={handleSend} />
      </main>

      {toast && (
        <div className={styles.toast}>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
