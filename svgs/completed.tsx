import React from "react";

const Completed = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="#E1FFED" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#00B049" />
      <path
        d="M16 23.5C20.125 23.5 23.5 20.125 23.5 16C23.5 11.875 20.125 8.5 16 8.5C11.875 8.5 8.5 11.875 8.5 16C8.5 20.125 11.875 23.5 16 23.5Z"
        stroke="#00B049"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8125 16L14.935 18.1225L19.1875 13.8775"
        stroke="#00B049"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Completed;
