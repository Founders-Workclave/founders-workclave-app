"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface PRDModalProps {
  isOpen: boolean;
  pdfUrl: string | null;
  onClose: () => void;
}

const steps = [
  "Analysing conversation…",
  "Structuring requirements…",
  "Writing PRD sections…",
  "Formatting document…",
  "Generating PDF…",
];

export default function PRDModal({ isOpen, pdfUrl, onClose }: PRDModalProps) {
  const [stepIndex, setStepIndex] = useState(0);

  // ✅ Derived — no state needed, no effect needed
  const done = !!pdfUrl;

  // ✅ Only sets state inside the interval callback, never synchronously
  useEffect(() => {
    if (!isOpen || done) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 9000 / steps.length);

    return () => clearInterval(interval);
  }, [isOpen, done]);

  if (!isOpen) return null;

  function handleOpen() {
    if (pdfUrl) window.open(pdfUrl, "_blank");
    onClose();
  }

  return (
    <div className={styles.backdrop} onClick={done ? onClose : undefined}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="PRD Generation"
      >
        <div className={styles.rings}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.iconWrap}>
          {done ? (
            <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="11"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 12.5l3.5 3.5 6.5-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className={styles.docIcon} viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <polyline
                points="14 2 14 8 20 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="13"
                x2="16"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="17"
                x2="13"
                y2="17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <div className={styles.content}>
          {done ? (
            <>
              <h2 className={styles.title}>Your PRD is ready</h2>
              <p className={styles.subtitle}>
                The document has been generated and is ready to view.
              </p>
              <button className={styles.openBtn} onClick={handleOpen}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open PDF
              </button>
              <button className={styles.dismissBtn} onClick={onClose}>
                Dismiss
              </button>
            </>
          ) : (
            <>
              <h2 className={styles.title}>Generating your PRD</h2>
              <p className={styles.subtitle}>
                This usually takes up to a minute. Hang tight!
              </p>
              <div className={styles.stepList}>
                {steps.map((step, i) => (
                  <div
                    key={step}
                    className={`${styles.step} ${
                      i < stepIndex
                        ? styles.stepDone
                        : i === stepIndex
                        ? styles.stepActive
                        : styles.stepPending
                    }`}
                  >
                    <span className={styles.stepDot} />
                    <span className={styles.stepLabel}>{step}</span>
                  </div>
                ))}
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${((stepIndex + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
