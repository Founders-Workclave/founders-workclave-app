import AgenciesIcon from "@/svgs/agenciesIcon";
import CalenderAdmin from "@/svgs/calender";
import ClientsAdmin from "@/svgs/clients";
import Dashboard from "@/svgs/dashboard";
import FounderIcon from "@/svgs/founderIcon";
import Logout from "@/svgs/logout";
import Messages from "@/svgs/messages";
import Payments from "@/svgs/payments";
import Prd from "@/svgs/prd";
import Projects from "@/svgs/projects";
import Settings from "@/svgs/settings";
import Subscriptions from "@/svgs/subscriptions";
import Wallets from "@/svgs/wallets";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "I came in with only a rough concept, and Founders Workclave transformed it into a complete PRD and project plan. The clarity and speed saved me weeks of back-and-forth.",
    author: "Amara O",
    role: "Startup Founder",
  },
  {
    id: 2,
    quote:
      "We switched from scattered tools to Founders Workclave and now manage PRDs, clients, and payments in one place. Our workflow has never been this organized.",
    author: "Yvonne A",
    role: "PrimeStack Digital Agency",
  },
  {
    id: 3,
    quote:
      "The AI consultant and milestone dashboard helped me understand my product better than I expected. It simplified everything from requirements to payment",
    author: "Dapo K.",
    role: "SaaS Founder",
  },
];

export const countryCodes = [
  { code: "+234", country: "Nigeria" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
];

export interface SignupFormData {
  firstName: string | number | readonly string[] | undefined;
  lastName: string | number | readonly string[] | undefined;
  email: string;
  companyName: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  agreedToTerms: boolean;
}

export interface SignupFounder {
  firstName: string | number | readonly string[] | undefined;
  lastName: string | number | readonly string[] | undefined;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  agreedToTerms: boolean;
}

export const founderMenuItems = (userId: string, projectId: string) => [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    link: `/${userId}`,
    match: [`/${userId}/${projectId}`],
  },
  {
    icon: <Prd />,
    label: "My PRDs",
    link: `/${userId}/prds`,
  },
  {
    icon: <Projects />,
    label: "My Projects",
    link: `/${userId}/my-projects`,
  },
  {
    icon: <Messages />,
    label: "Messages",
    link: `/${userId}/messages`,
  },
  {
    icon: <Wallets />,
    label: "Wallet",
    link: `/${userId}/wallet`,
  },
  {
    icon: <Payments />,
    label: "Payments",
    link: `/${userId}/payments`,
  },
  {
    icon: <Settings />,
    label: "Settings",
    link: `/${userId}/profile`,
  },
  {
    icon: <Logout />,
    label: "",
    link: "/login",
  },
];

export const agencyMenuItems = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    link: `/agency`,
  },
  {
    icon: <Projects />,
    label: "All Projects",
    link: `#`,
  },
  {
    icon: <Prd />,
    label: "All PRDs",
    link: `#`,
  },
  {
    icon: <ClientsAdmin />,
    label: "Clients",
    link: `#`,
  },
  {
    icon: <ClientsAdmin />,
    label: "Product Managers",
    link: `#`,
  },
  {
    icon: <Messages />,
    label: "Messages",
    link: `#`,
  },
  {
    icon: <CalenderAdmin />,
    label: "Calender",
    link: `#`,
  },
  {
    icon: <Wallets />,
    label: "Wallet",
    link: `#`,
  },
  {
    icon: <Payments />,
    label: "Payments",
    link: `#`,
  },
  {
    icon: <Settings />,
    label: "Settings",
    link: `#`,
  },
  {
    icon: <Logout />,
    label: "",
    link: "/login",
  },
];

export const superAdminMenuItems = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    link: "/admin",
  },
  {
    icon: <FounderIcon />,
    label: "Founders",
    link: "/admin/founders",
  },
  {
    icon: <AgenciesIcon />,
    label: "Agencies",
    link: "/admin/agencies",
  },
  {
    icon: <Messages />,
    label: "Messages",
    link: "/admin/messages",
  },
  {
    icon: <Subscriptions />,
    label: "Subscriptions",
    link: "/admin/subscriptions",
  },
  {
    icon: <Settings />,
    label: "Settings",
    link: "admin/settings",
  },
  {
    icon: <Logout />,
    label: "",
    link: "/login",
  },
];
