"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";

interface AvailabilityDay {
  id: number;
  date: string;
  time: string;
}

interface Booking {
  id: number;
  title: string;
  time: string;
}

const CalendarComponent: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 7)); // August 2024
  const [showModal, setShowModal] = useState(false);
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([
    { id: 1, date: "", time: "" },
  ]);

  // Mock bookings data
  const bookings: Record<number, Booking[]> = {
    16: [
      { id: 1, title: "With John Doe", time: "1am - 4 pm" },
      { id: 2, title: "Booking", time: "1am - 4 pm" },
      { id: 3, title: "Booking", time: "1am - 4 pm" },
    ],
    21: [
      { id: 1, title: "Booking", time: "1am - 4 pm" },
      { id: 2, title: "Booking", time: "1am - 4 pm" },
      { id: 3, title: "Booking", time: "1am - 4 pm" },
    ],
  };

  const slots: Record<number, number> = {
    6: 0,
    21: 3,
  };

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ day: number; isCurrentMonth: boolean }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({ day: prevMonthLastDay - i + 1, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Next month days to fill the grid
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, isCurrentMonth: false });
      }
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const addAvailabilityDay = () => {
    setAvailabilityDays([
      ...availabilityDays,
      { id: Date.now(), date: "", time: "" },
    ]);
  };

  const removeAvailabilityDay = (id: number) => {
    if (availabilityDays.length > 1) {
      setAvailabilityDays(availabilityDays.filter((day) => day.id !== id));
    }
  };

  const handleSetupAvailability = () => {
    console.log("Setting up availability:", availabilityDays);
    setShowModal(false);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button className={styles.navButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="#6366F1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className={styles.monthLabel}>This month</span>
          <button className={styles.navButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#6366F1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={styles.setupButton}
        >
          Setup Availability
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 6L8 10L4 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendar}>
        {/* Day Headers */}
        <div className={styles.dayHeaders}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={styles.daysGrid}>
          {days.map((dayObj, index) => {
            const hasBookings = bookings[dayObj.day];
            const slotCount = slots[dayObj.day];
            const isToday = dayObj.day === 6 && dayObj.isCurrentMonth;

            return (
              <div
                key={index}
                className={`${styles.dayCell} ${
                  !dayObj.isCurrentMonth ? styles.otherMonth : ""
                } ${isToday ? styles.today : ""}`}
              >
                <div className={styles.dayNumber}>
                  {dayObj.isCurrentMonth && dayObj.day >= 1 ? (
                    <>
                      {getMonthName(currentMonth)} {dayObj.day}
                    </>
                  ) : (
                    dayObj.day
                  )}
                </div>

                {slotCount !== undefined && (
                  <div className={styles.slotBadge}>
                    <span className={styles.slotIndicator}></span>
                    {slotCount} Slot
                  </div>
                )}

                {isToday && (
                  <div className={styles.todayIndicator}>{dayObj.day}</div>
                )}

                {hasBookings && (
                  <div className={styles.bookings}>
                    {hasBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`${styles.booking} ${
                          booking.title === "With John Doe"
                            ? styles.bookingSpecial
                            : ""
                        }`}
                      >
                        {booking.title === "With John Doe" && (
                          <div className={styles.bookingLabel}>
                            {booking.title}
                            <div className={styles.avatarSmall}>JD</div>
                          </div>
                        )}
                        <div className={styles.bookingTime}>
                          <span className={styles.dot}>●</span> {booking.time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Availability Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <button
                onClick={() => setShowModal(false)}
                className={styles.backButton}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h2 className={styles.modalTitle}>Set Up Your Availability</h2>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeButton}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <p className={styles.modalDescription}>
              Choose the days and times you&apos;re available for bookings
            </p>

            <div className={styles.availabilityList}>
              {availabilityDays.map((day, index) => (
                <div key={day.id} className={styles.availabilityDay}>
                  <div className={styles.dayLabel}>Day {index + 1}</div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Date</label>
                      <select className={styles.select}>
                        <option>Select Date</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Time</label>
                      <select className={styles.select}>
                        <option>Select Time</option>
                      </select>
                    </div>
                  </div>
                  {availabilityDays.length > 1 && (
                    <button
                      onClick={() => removeAvailabilityDay(day.id)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addAvailabilityDay} className={styles.addButton}>
              + Add Another
            </button>

            <button
              onClick={handleSetupAvailability}
              className={styles.submitButton}
            >
              Set Up Availability
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
