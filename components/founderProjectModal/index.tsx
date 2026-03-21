"use client";
import { useState } from "react";
import styles from "./styles.module.css";

const CATEGORIES = [
  "Mobile App",
  "Web App",
  "SAAS Tool",
  "Marketplace",
  "AI Product",
  "Others",
];

const STEPS = ["Your Idea", "Your Vision", "Review"];

export default function FounderProjectModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("");
  const [vision, setVision] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setIdea("");
      setCategory("");
      setVision("");
      setSubmitted(false);
      setSubmitError(null);
    }, 300);
  };

  const handleContinue = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/submit-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, category, vision }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
      setTimeout(() => handleClose(), 2000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinueStep0 = idea.trim().length > 0 && category.length > 0;
  const canContinueStep1 = vision.trim().length > 0;

  const isContinueDisabled =
    (step === 0 && !canContinueStep0) ||
    (step === 1 && !canContinueStep1) ||
    isSubmitting;

  return (
    <>
      <div className={styles.page}>
        <button className={styles.triggerBtn} onClick={() => setOpen(true)}>
          + Submit Your Ideas
        </button>
      </div>
      {open && (
        <div className={styles.backdrop} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>What are you building?</h2>
              <button className={styles.closeBtn} onClick={handleClose}>
                ✕
              </button>
            </div>
            <p className={styles.stepLabel}>
              Step {step + 1} of {STEPS.length}
              <span className={styles.stepDivider}> | </span>
              {STEPS[step]}
            </p>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
              <div
                className={styles.avatarDot}
                style={{ left: `calc(${progress}% - 18px)` }}
              >
                <span className={styles.avatarInner}>👤</span>
              </div>
            </div>
            <div className={styles.body}>
              {submitted ? (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}>✓</span>
                  <p className={styles.successText}>Project submitted!</p>
                </div>
              ) : step === 0 ? (
                <>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g a marketplace for freelance designers"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                  />
                  <p className={styles.categoryLabel}>CATEGORY</p>
                  <div className={styles.pills}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        className={`${styles.pill} ${
                          category === cat ? styles.pillActive : ""
                        }`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              ) : step === 1 ? (
                <>
                  <p className={styles.fieldLabel}>Your Vision</p>
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe your vision for this project..."
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    rows={6}
                  />
                </>
              ) : (
                <>
                  <p className={styles.reviewLabel}>REVIEW PROJECT</p>
                  <div className={styles.reviewCard}>
                    <p className={styles.reviewFieldLabel}>Your Idea</p>
                    <p className={styles.reviewFieldValue}>{idea}</p>
                  </div>
                  <div className={styles.reviewCard}>
                    <p className={styles.reviewFieldLabel}>Category</p>
                    <p className={styles.reviewFieldValue}>{category}</p>
                  </div>
                  <div className={styles.reviewCard}>
                    <p className={styles.reviewFieldLabel}>Your Vision</p>
                    <p className={styles.reviewFieldValue}>{vision}</p>
                  </div>
                </>
              )}
            </div>
            {submitError && <p className={styles.errorText}>{submitError}</p>}
            {!submitted && (
              <button
                className={`${styles.continueBtn} ${
                  isContinueDisabled ? styles.continueBtnDisabled : ""
                }`}
                disabled={isContinueDisabled}
                onClick={
                  step === STEPS.length - 1 ? handleSubmit : handleContinue
                }
              >
                {step === STEPS.length - 1
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit"
                  : "Continue"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
