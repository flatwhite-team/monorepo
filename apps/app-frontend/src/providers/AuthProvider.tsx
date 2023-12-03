import React, { createContext, ReactNode, useContext } from "react";
import { Session } from "@supabase/supabase-js";

import { useSupabaseAuthSession } from "~/hooks/useAuthSession";

const AuthContext = createContext<Session | null | undefined>(null);

interface Props {
  children: ReactNode;
}

export function AuthSessionProvider(props: Props) {
  const { data: session } = useSupabaseAuthSession();

  return (
    <AuthContext.Provider value={session}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthSession() {
  return useContext(AuthContext);
}
