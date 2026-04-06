import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSession(null);
        setLoading(false);
        return;
      }

      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at <= nowInSeconds) {
        await supabase.auth.signOut({ scope: "local" });
        setSession(null);
      } else {
        setSession(session);
      }

      setLoading(false);
    };

    hydrateSession();

    // Listen for auth changes (logout, login, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // If session is missing, redirect to /auth
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Session present, render children
  return children;
}
