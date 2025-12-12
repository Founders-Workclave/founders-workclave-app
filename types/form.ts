export interface SignupFormData {
  firstName: string | number | readonly string[] | undefined;
  lastName: string;
  fullName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  agreedToTerms: boolean;
}
