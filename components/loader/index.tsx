"use client";
import {
  ClipLoader,
  BeatLoader,
  PulseLoader,
  MoonLoader,
  BarLoader,
  ScaleLoader,
} from "react-spinners";

type LoaderType = "clip" | "beat" | "pulse" | "moon" | "bar" | "scale";

interface LoaderProps {
  type?: LoaderType;
  loading: boolean;
  size?: number;
  color?: string;
  width?: number;
}

const Loader = ({
  type = "clip",
  loading,
  size = 30,
  color = "#000",
  width = 150,
}: LoaderProps) => {
  if (!loading) return null;

  switch (type) {
    case "beat":
      return <BeatLoader loading={loading} size={size} color={color} />;

    case "pulse":
      return <PulseLoader loading={loading} size={size} color={color} />;

    case "moon":
      return <MoonLoader loading={loading} size={size} color={color} />;

    case "bar":
      return <BarLoader loading={loading} width={width} color={color} />;

    case "scale":
      return <ScaleLoader loading={loading} height={35} color={color} />;

    case "clip":
    default:
      return <ClipLoader loading={loading} size={size} color={color} />;
  }
};

export default Loader;
