import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_EMAIL = "mdimam.cse9.bu@gmail.com";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email === ADMIN_EMAIL) navigate("/admin", { replace: true });
    };
    void check();
  }, [navigate]);

  const sendMagicLink = async () => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setMessage("This login is restricted.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    setMessage(error ? error.message : "Magic link sent. Check your inbox.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold">Admin Sign In</h1>
        <p className="mt-1 text-sm text-white/70">Magic link access only.</p>
        <div className="mt-4 space-y-3">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="border-white/20 bg-white/10" />
          <Button className="w-full" onClick={sendMagicLink} disabled={loading}>{loading ? "Sending..." : "Send Magic Link"}</Button>
          {message ? <p className="text-sm text-white/80">{message}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Login;
