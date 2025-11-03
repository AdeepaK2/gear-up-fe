"use client";

import { AuthProvider } from "../../lib/context/AuthContext";

export default function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}