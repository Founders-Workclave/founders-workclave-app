"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import ImageUpload from "../imageUpload";
import FormInput from "../formInput";
import PhoneNumberInput from "../phoneNumberInput";

interface ProfileData {
  companyName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
}

const ProfileTab: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    companyName: "Rebot business solutions",
    firstName: "Waren",
    lastName: "Waden",
    phoneNumber: "9045433344",
    countryCode: "+234",
  });

  const [profileImage, setProfileImage] = useState<string>("");

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };

  const handleSave = async () => {
    try {
      // API call to save profile
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileData, profileImage }),
      });

      if (response.ok) {
        console.log("Profile saved successfully");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Profile</h2>

      <ImageUpload
        currentImage={profileImage}
        onImageUpload={handleImageUpload}
        userName="Waden Warren"
      />

      <div className={styles.userInfo}>
        <h3 className={styles.userName}>Waden Warren</h3>
        <p className={styles.userEmail}>Einstein.oyakhilome1@gmail.com</p>
        <span className={styles.userRole}>ADMIN</span>
      </div>

      <FormInput
        label="Company name"
        value={profileData.companyName}
        onChange={(value) => handleChange("companyName", value)}
        placeholder="Enter company name"
      />

      <div className={styles.nameRow}>
        <FormInput
          label="First name"
          value={profileData.firstName}
          onChange={(value) => handleChange("firstName", value)}
          placeholder="Enter first name"
        />
        <FormInput
          label="Last name"
          value={profileData.lastName}
          onChange={(value) => handleChange("lastName", value)}
          placeholder="Enter last name"
        />
      </div>

      <PhoneNumberInput
        label="Phone number"
        value={profileData.phoneNumber}
        countryCode={profileData.countryCode}
        onPhoneChange={(value) => handleChange("phoneNumber", value)}
        onCountryCodeChange={(value) => handleChange("countryCode", value)}
      />

      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default ProfileTab;
