"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectComponet from "@/components/projectComp";
import ProjectStart from "@/components/projectStart";
import FounderLayout from "@/layout/founder";
import { getUser } from "@/lib/api/auth";

const UserDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();

    if (!currentUser || !currentUser.username) {
      router.push("/login");
      return;
    }
  }, [router]);

  return (
    <FounderLayout
      pageTitle="Dashboard"
      pageText="Manage and track your product ideas"
    >
      <ProjectStart />
      <ProjectComponet />
    </FounderLayout>
  );
};

export default UserDashboard;
