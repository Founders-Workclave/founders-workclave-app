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
    const currentUser = getUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }
    const RESERVED_ROUTES = [
      "client",
      "clients",
      "agency",
      "admin",
      "pm",
      "manager",
    ];

    if (
      params.username &&
      RESERVED_ROUTES.includes(params.username.toLowerCase())
    ) {
      console.log("🚫 Reserved route detected in [username]:", params.username);
      console.log("Current user:", {
        username: currentUser.username,
        role: currentUser.role,
        userType: currentUser.userType,
      });
      return;
    }
    if (!currentUser.username) {
      router.push("/login");
      return;
    }

    const userSlug = currentUser.username.toLowerCase().replace(/\s+/g, ".");

    if (params.username !== userSlug) {
      console.log("Username mismatch - redirecting:", {
        paramsUsername: params.username,
        userSlug,
      });
      router.push(`/${userSlug}`);
      return;
    }
  }, [params.username, router]);

  const currentUser = getUser();

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
