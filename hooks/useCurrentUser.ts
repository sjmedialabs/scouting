"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth/jwt";

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser(); // Calls the server action
      setUser(u);
      setLoading(false);
    })();
  }, []);

  return { user, loading };
}
