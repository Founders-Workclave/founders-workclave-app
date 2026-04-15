"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/bridge";

import styles from "./styles.module.css";
import EmptyState from "../emptyState";
import MessageBubble from "../messageBubble";
import PRDBlock from "../prdBlock";
import TypingIndicator from "../typingIndicatior";

interface MessageListProps {
  messages: Message[];
  prdContent: string | null;
  isLoading: boolean;
  onStarterClick: (text: string) => void;
}

export default function MessageList({
  messages,
  prdContent,
  isLoading,
  onStarterClick,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, prdContent, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className={styles.area}>
      {isEmpty && !isLoading ? (
        <EmptyState onStarterClick={onStarterClick} />
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {prdContent && <PRDBlock content={prdContent} />}

          {isLoading && <TypingIndicator />}
        </>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
