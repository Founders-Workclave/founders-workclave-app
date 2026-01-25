import styles from "./styles.module.css";

interface PhoneNumberInputProps {
  label: string;
  value: string;
  countryCode: string;
  onPhoneChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  countryCode,
  onPhoneChange,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <button type="button" className={styles.countrySelector}>
          <span className={styles.flag}>🇳🇬</span>
          <span className={styles.code}>{countryCode}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        <input
          type="tel"
          className={styles.input}
          value={value}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;
