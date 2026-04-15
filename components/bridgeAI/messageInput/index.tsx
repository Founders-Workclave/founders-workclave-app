"use client";

import { useRef, useState, KeyboardEvent } from "react";
import { ChatMode } from "@/types/bridge";
import styles from "./styles.module.css";

interface MessageInputProps {
  mode: ChatMode;
  isLoading: boolean;
  onSend: (text: string) => void;
}

export default function MessageInput({
  mode,
  isLoading,
  onSend,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholder =
    mode === "prd_generation"
      ? "Describe what you want the PRD to cover…"
      : "Tell Bridge Ai about your idea…";

  const canSend = value.trim().length > 0 && !isLoading;

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "22px";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    autoResize();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  }

  function handleSend() {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "22px";
  }

  return (
    <div className={styles.area}>
      <div className={styles.wrap}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <div className={styles.hint}>
        <span>Bridge AI is your confidential PM advisor</span>
        <span>
          <kbd className={styles.kbd}>Enter</kbd> to send ·{" "}
          <kbd className={styles.kbd}>Shift+Enter</kbd> for new line
        </span>
      </div>
    </div>
  );
}
