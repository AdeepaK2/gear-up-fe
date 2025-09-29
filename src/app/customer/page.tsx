"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new dashboard
    router.replace("/customer/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
