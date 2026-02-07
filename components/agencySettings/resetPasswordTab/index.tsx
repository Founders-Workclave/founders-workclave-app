import styles from "./styles.module.css";
import PasswordChangeComponent from "@/components/changePassword";

const ResetPasswordTab: React.FC = () => {
  return (
    <div className={styles.container}>
      <PasswordChangeComponent />
    </div>
  );
};

export default ResetPasswordTab;
