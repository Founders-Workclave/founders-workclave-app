"use client";

import Brain from "@/svgs/brain";
import styles from "./styles.module.css";
import { Lightbulb, Ruler, Search } from "lucide-react";

const STARTERS = [
  {
    icon: <Lightbulb size={25} color="#5865F2" />,
    text: "I have an idea for a platform that connects freelancers with startups",
  },
  {
    icon: <Search size={25} color="#5865F2" />,
    text: "Help me validate whether my SaaS idea has real market demand",
  },
  {
    icon: <Ruler size={25} color="#5865F2" />,
    text: "I need help defining the MVP scope for my product",
  },
];

interface EmptyStateProps {
  onStarterClick: (text: string) => void;
}

export default function EmptyState({ onStarterClick }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Brain />
      </div>
      <h2 className={styles.title}>
        Hey, I&apos;m <em>Bridge</em>
      </h2>
      <p className={styles.subtitle}>
        Your AI product manager with 15 years in the field. Tell me your idea
        and I&apos;ll help you sharpen it — then we&apos;ll turn it into a PRD
        your engineers can actually build from.
      </p>

      <div className={styles.chips}>
        {STARTERS.map((s, i) => (
          <button
            key={i}
            className={styles.chip}
            onClick={() => onStarterClick(s.text)}
          >
            <span className={styles.chipIcon}>{s.icon}</span>
            <span className={styles.chipText}>{s.text}</span>
            <span className={styles.chipArrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
