"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { testimonials } from "@/utils/data";
import Quote from "@/svgs/quote";

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Content */}
        <div className={styles.content}>
          <Quote />
          <p className={styles.quote}>{currentTestimonial.quote}</p>
          {/* Author Info */}
          <div className={styles.author}>
            <h4 className={styles.authorName}>{currentTestimonial.author}</h4>
            <p className={styles.authorRole}>{currentTestimonial.role}</p>
          </div>

          {/* Navigation Arrows */}
          <div className={styles.navigation}>
            <button
              onClick={handlePrevious}
              className={styles.navButton}
              aria-label="Previous testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className={styles.navButton}
              aria-label="Next testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {/* <div className={styles.dotsContainer}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${styles.dot} ${
              index === currentIndex ? styles.activeDot : ""
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default TestimonialSlider;
