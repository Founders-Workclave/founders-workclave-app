"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectComponet from "@/components/projectComp";
import ProjectStart from "@/components/projectStart";
import FounderLayout from "@/layout/founder";
import { getUser } from "@/lib/api/auth";

const UserDashboard = ({ params }: { params: { username: string } }) => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getUser();

    if (!currentUser) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    // Verify the username in URL matches the logged-in user
    if (!currentUser.username) {
      router.push("/login");
      return;
    }

    const userSlug = currentUser.username.toLowerCase().replace(/\s+/g, ".");

    if (params.username !== userSlug) {
      // Redirect to correct user dashboard
      router.push(`/${userSlug}`);
      return;
    }
  }, [params.username, router]);

  const currentUser = getUser();

  // Don't render if no user (will redirect)
  if (!currentUser) return null;

  return (
    <FounderLayout
      pageTitle="Dashboard"
      userId={currentUser.id || params.username}
      pageText="Manage and track your product ideas"
    >
      <ProjectStart />
      <ProjectComponet />
    </FounderLayout>
  );
};

export default UserDashboard;
