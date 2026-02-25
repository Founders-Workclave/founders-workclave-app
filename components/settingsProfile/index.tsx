"use client";
import { useState, useEffect } from "react";
import styles from "../agencySettings/profileTab/styles.module.css";

import {
  profileService,
  UserProfile,
  ApiError,
} from "@/lib/api/clientsService/clientsProfile";
import FormInput from "../agencySettings/formInput";
import PhoneNumberInput from "../agencySettings/phoneNumberInput";
import AllLoading from "@/layout/Loader";
import PasswordChangeComponent from "../changePassword";
import ProfileUploadWithService from "../agencySettings/imageUpload/profileUpload";

interface ProfileData {
  companyName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  email: string;
}

const SettingsPage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    companyName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "+234",
    email: "",
  });

  const [profileImage, setProfileImage] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load user data from server on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch fresh data from server
        const user = await profileService.fetchUserProfile();

        if (user) {
          setUserInfo(user);

          console.log("User data loaded:", user);

          // Parse phone number to separate country code and number
          let phoneNumber = user.phoneNumber || "";
          let countryCode = "+234"; // default

          if (phoneNumber && phoneNumber.startsWith("+")) {
            if (phoneNumber.startsWith("+234")) {
              countryCode = "+234";
              phoneNumber = phoneNumber.substring(4);
            } else if (phoneNumber.startsWith("+1")) {
              countryCode = "+1";
              phoneNumber = phoneNumber.substring(2);
            } else if (phoneNumber.startsWith("+44")) {
              countryCode = "+44";
              phoneNumber = phoneNumber.substring(3);
            } else {
              const match = phoneNumber.match(/^(\+\d{1,3})(\d+)$/);
              if (match) {
                countryCode = match[1];
                phoneNumber = match[2];
              }
            }
          }

          console.log("Setting profile data with:", {
            companyName: user.companyName || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            email: user.email || "",
          });

          setProfileData({
            companyName: user.companyName || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            email: user.email || "",
          });
          setProfileImage(user.profileImage || "");
        } else {
          setError("User profile not found. Please log in again.");
        }
      } catch (err) {
        // Show error message
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(`Failed to load profile: ${err.message}`);
        } else {
          setError("Failed to load profile data. Please try again.");
        }
        console.error("Error fetching profile from server:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    // Clear messages when user makes changes
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Format phone number with country code
      const fullPhoneNumber = `${profileData.countryCode}${profileData.phoneNumber}`;

      // Call the new API endpoint to update profile on server
      await profileService.updateProfileOnServer({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: fullPhoneNumber,
        company: profileData.companyName,
      });

      // Update local state with the updated profile
      const updatedUser = profileService.getUserProfile();
      if (updatedUser) {
        setUserInfo(updatedUser);
      }

      setSuccessMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save profile changes");
      }
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container} style={{ margin: "20px" }}>
        <div className={styles.loadingState}>
          <AllLoading text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className={styles.container} style={{ margin: "20px" }}>
        <div className={styles.errorState}>
          <p>Unable to load profile. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.allContain}>
      <div className={styles.container} style={{ margin: "20px" }}>
        <h2 className={styles.title}>Profile</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <ProfileUploadWithService
          currentImage={profileImage}
          userName={userInfo.name}
          onUploadSuccess={(imageUrl) => {
            setProfileImage(imageUrl);
            setSuccessMessage("Profile image updated!");
            setTimeout(() => setSuccessMessage(null), 3000);
          }}
          onUploadError={(errorMsg) => {
            setError(errorMsg);
            setTimeout(() => setError(null), 5000);
          }}
          onUploadStart={() => {
            setError(null);
            setSuccessMessage(null);
          }}
        />

        {isUploadingLogo && (
          <div className={styles.uploadingIndicator}>
            <span className={styles.spinner}></span>
            <span>Uploading logo...</span>
          </div>
        )}

        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{userInfo.name}</h3>
          <p className={styles.userEmail}>{userInfo.email}</p>
          <span className={styles.userRole}>
            {userInfo.role?.toUpperCase() || "USER"}
          </span>
        </div>

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

        <FormInput
          label="Email"
          value={profileData.email}
          onChange={(value) => handleChange("email", value)}
          placeholder="Enter email address"
          type="email"
        />

        <PhoneNumberInput
          label="Phone number"
          value={profileData.phoneNumber}
          countryCode={profileData.countryCode}
          onPhoneChange={(value) => handleChange("phoneNumber", value)}
          onCountryCodeChange={(value) => handleChange("countryCode", value)}
        />

        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving || isUploadingLogo}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className={styles.changePassword}>
        <PasswordChangeComponent />
      </div>
    </div>
  );
};

export default SettingsPage;
