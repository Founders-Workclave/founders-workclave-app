import UserDashboard from "@/components/userDashboardComp/page";

interface DashboardProps {
  params: { username: string };
}

const Dashboard = ({ params }: DashboardProps) => {
  return <UserDashboard params={params} />;
};

export default Dashboard;
