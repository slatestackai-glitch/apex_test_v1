"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";

const DEMO_PASSWORD = "apexengati29";
const SESSION_KEY = "apex-auth";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "1");
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (unlocked) return <>{children}</>;
  return <PasswordScreen onUnlock={() => setUnlocked(true)} />;
}

function PasswordScreen({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 1800);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8102E] shadow-sm mb-4">
            <Shield className="text-white" style={{ width: 26, height: 26 }} />
          </div>
          <p className="text-lg font-bold text-[#0A2540] tracking-tight">APEX Studio</p>
          <p className="text-xs text-gray-400 mt-1">by Engati</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <h1 className="text-xl font-bold text-[#0A2540] mb-1">Enter access code</h1>
          <p className="text-sm text-gray-400 mb-6">This tool is password protected.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPw ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Access code"
                autoComplete="off"
                className={`w-full h-11 rounded-xl border px-4 pr-11 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? "border-red-400 ring-2 ring-red-200 bg-red-50"
                    : "border-gray-200 focus:border-[#C8102E] focus:ring-[#C8102E]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 -mt-2">Incorrect access code. Try again.</p>
            )}

            <button
              type="submit"
              disabled={!value.trim()}
              className="h-11 rounded-xl bg-[#C8102E] text-sm font-semibold text-white hover:bg-[#a00d24] disabled:opacity-40 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          Shared securely by your Engati representative.
        </p>
      </div>
    </div>
  );
}
