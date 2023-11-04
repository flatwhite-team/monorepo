"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@flatwhite-team/admin-auth";

interface Props {
  children: ReactNode;
}

export default function AuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
