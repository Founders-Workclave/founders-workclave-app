"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, Conversation, ChatMode } from "@/types/bridge";
import { bridgeService } from "@/lib/api/bridgeService";

import styles from "./styles.module.css";
import Sidebar from "../sideBar";
import Topbar from "../topBar";
import MessageList from "../messageList";
import MessageInput from "../messageInput";
import PRDModal from "../prdModal";

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

  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);

  const [prdModalOpen, setPrdModalOpen] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  const showToast = useCallback((msg: string, duration = 3500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const addMessage = useCallback(
    (role: Message["role"], content: string): Message => {
      const message: Message = {
        id: generateId(),
        role,
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
      return message;
    },
    []
  );

  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const data = await bridgeService.getConversations();
      const mapped: Conversation[] = data.conversations.map((c) => ({
        id: c.id,
        title: c.title,
        mode: c.mode,
        createdAt: new Date(c.created_at),
      }));
      setConversations(mapped);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load conversations.";
      showToast(`❌ ${message}`);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  async function fetchConversationMessages(id: string, convMode: ChatMode) {
    setIsLoadingMessages(true);
    setPrdContent(null);
    try {
      const data = await bridgeService.getConversationMessages(id);
      const mapped: Message[] = data.conversation.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
      }));
      setMessages(mapped);
      setConversationId(id);
      setMode(convMode);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load messages.";
      showToast(`❌ ${message}`);
    } finally {
      setIsLoadingMessages(false);
    }
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
          if (isFirstMessage) {
            const newConv: Conversation = {
              id: response.conversation_id,
              title: text.substring(0, 40) + (text.length > 40 ? "…" : ""),
              mode,
              createdAt: new Date(),
            };
            setConversations((prev) => [newConv, ...prev]);
          }
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
    [isLoading, messages.length, mode, conversationId, addMessage]
  );

  async function handleGeneratePRD() {
    if (!conversationId) {
      showToast("⚠️ Start a conversation first before generating a PRD.");
      return;
    }

    setGeneratedPdfUrl(null);
    setPrdModalOpen(true);
    setIsGeneratingPRD(true);

    try {
      const response = await bridgeService.generatePRD(conversationId);

      if (response.status === "Success") {
        setGeneratedPdfUrl(response.pdf_url);
      } else {
        setPrdModalOpen(false);
        showToast(`⚠️ ${response.pdf_url}`);
      }
    } catch (err) {
      setPrdModalOpen(false);
      const message =
        err instanceof Error ? err.message : "PRD generation failed.";
      showToast(`❌ ${message}`);
    } finally {
      setIsGeneratingPRD(false);
    }
  }

  async function handleDeleteConversation(id: string) {
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    setDeletingConversationId(id);
    try {
      await bridgeService.deleteConversation(id);

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
        setPrdContent(null);
      }

      showToast("🗑️ Conversation deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete conversation.";
      showToast(`❌ ${message}`);
    } finally {
      setDeletingConversationId(null);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setConversationId(null);
    setPrdContent(null);
  }

  function handleMenuToggle() {
    setSidebarOpen((prev) => !prev);
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
        isLoadingConversations={isLoadingConversations}
        deletingId={deletingConversationId}
        onModeChange={setMode}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        onSelectConversation={(id) => {
          const selected = conversations.find((c) => c.id === id);
          if (selected) {
            fetchConversationMessages(id, selected.mode);
          }
          setSidebarOpen(false);
        }}
        onDeleteConversation={handleDeleteConversation}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={styles.main}>
        <Topbar
          hasConversation={!!conversationId}
          isGeneratingPRD={isGeneratingPRD}
          isGeneratingPRDPdf={isGeneratingPRD}
          onGeneratePRD={handleGeneratePRD}
          onGeneratePRDPdf={handleGeneratePRD}
          onClearChat={handleNewChat}
          onMenuToggle={handleMenuToggle}
        />

        <MessageList
          messages={messages}
          prdContent={prdContent}
          isLoading={isLoading || isLoadingMessages}
          onStarterClick={(text) => handleSend(text)}
        />

        <MessageInput mode={mode} isLoading={isLoading} onSend={handleSend} />
      </main>

      <PRDModal
        key={String(prdModalOpen)}
        isOpen={prdModalOpen}
        pdfUrl={generatedPdfUrl}
        onClose={() => {
          setPrdModalOpen(false);
          setGeneratedPdfUrl(null);
        }}
      />

      {toast && (
        <div className={styles.toast}>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
