"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = (props) => {
  const { children } = props;

  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">(
    "loading"
  );
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(function checkAuthSession() {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.authenticated ? "unlocked" : "locked");
      })
      .catch(() => setStatus("locked"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.message);
      } else {
        setStatus("unlocked");
      }
    } catch {
      setErrorMsg("網路錯誤，請重試");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-text-teritary">載入中...</div>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs space-y-4 rounded-2xl bg-card p-8 shadow-lg ring-1 ring-gray-200"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text-primary">
              驗證存取權限
            </h2>
            <p className="mt-1 text-xs text-text-teritary">
              請輸入存取碼以繼續
            </p>
          </div>

          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="請輸入存取碼"
            autoFocus
            className={cn(
              "w-full rounded-lg border px-3 py-2.5 text-center text-sm tracking-widest outline-none transition-colors",
              "border-input focus:border-gray-400 focus:ring-1 focus:ring-ring"
            )}
          />

          {errorMsg && (
            <p className="text-center text-xs text-error">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !passcode}
            className={cn(
              "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              "bg-btn-secondary text-btn-white-text hover:bg-gray-700",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {submitting ? "驗證中..." : "確認"}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
};
