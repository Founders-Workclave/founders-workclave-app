import Preloader from "@/layout/preLoader";
import React from "react";

const Loading = () => {
  return (
    <div>
      <Preloader style="bars" duration={2000} />
    </div>
  );
};

export default Loading;
