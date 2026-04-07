// components/LoginModal.jsx
"use client";
import { useState } from "react";
import {
  RiCloseLine,
  RiLockLine,
  RiUserLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldLine,
} from "react-icons/ri";
import { useAuth } from "@/hooks/useAuth";

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Both fields are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(username.trim(), password);
      setUsername("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-in overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ink-600 flex items-center justify-center">
              <RiShieldLine className="text-white text-sm" />
            </div>
            <div>
              <h2
                className="font-display font-bold text-base leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                Admin Login
              </h2>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Sign in to manage tasks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border-none"
            style={{
              color: "var(--text-secondary)",
              backgroundColor: "transparent",
            }}
          >
            <RiCloseLine className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Error banner */}
          {error && (
            <div
              className="text-xs font-medium px-3 py-2.5 rounded-xl animate-fade-in"
              style={{
                backgroundColor: "rgba(244,63,94,0.1)",
                color: "#f43f5e",
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Username
            </label>
            <div className="relative">
              <RiUserLine
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="input-field"
                style={{ paddingLeft: "2.25rem" }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <div className="relative">
              <RiLockLine
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="input-field"
                style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
                style={{ color: "var(--text-secondary)" }}
              >
                {showPass ? (
                  <RiEyeOffLine className="text-sm" />
                ) : (
                  <RiEyeLine className="text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* Hint */}
          <p
            className="text-[10px] text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            Only admin users can sign in. If you need access. Contact with admin{" "}
            <a style={{ color: "#4444ea" }} href="tel:++8801879808105">
              +8801879808105
            </a>{" "}
            or email at{" "}
            <a
              style={{ color: "#4444ea" }}
              href="mailto:akbar.hossan.official@gmail.com"
            >
              akbar.hossan.official@gmail.com
            </a>
            .
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-sm"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <RiShieldLine />
                Sign In as Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
