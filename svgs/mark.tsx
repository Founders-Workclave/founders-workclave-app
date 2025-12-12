import React from "react";

const Mark = () => {
  return (
    <div>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="120" height="120" rx="60" fill="#40B773" />
        <mask
          id="mask0_120_3312"
          //   style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="40"
          y="40"
          width="41"
          height="41"
        >
          <rect x="40.5" y="40.5" width="40" height="40" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_120_3312)">
          <path
            d="M56.4173 71.8331L45.584 60.9997L49.334 57.2497L56.4173 64.3331L71.6673 49.0831L75.4173 52.8331L56.4173 71.8331Z"
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
};

export default Mark;
