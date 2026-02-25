"use client";
import { useRef } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Photo from "@/svgs/photo";

interface ImageUploadProps {
  currentImage: string;
  onImageUpload: (imageUrl: string) => void;
  userName: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUpload,
  userName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      {/* <label className={styles.label}>Profile Picture</label> */}
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {currentImage ? (
            <Image
              src={currentImage}
              width={80}
              height={80}
              alt="Company logo"
              className={styles.image}
            />
          ) : (
            <span className={styles.initials}>{getInitials(userName)}</span>
          )}
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <Photo />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.hiddenInput}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
