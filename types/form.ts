export interface SignupFormData {
  firstName: string | number | readonly string[] | undefined;
  lastName: string;
  fullName: string;
  email: string;
  company: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  agreedToTerms: boolean;
}
