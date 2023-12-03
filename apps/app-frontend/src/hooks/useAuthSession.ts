import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "~/utils/supabase";

export function useSupabaseAuthSession() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      return queryClient.invalidateQueries(useSupabaseAuthSession.key);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return useQuery(useSupabaseAuthSession.key, async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  });
}

useSupabaseAuthSession.key = ["authSession"];
