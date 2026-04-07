// components/Header.jsx
"use client";
import { useState } from "react";
import {
  RiBookOpenLine,
  RiMoonLine,
  RiSunLine,
  RiAddLine,
  RiShieldLine,
  RiLogoutBoxLine,
  RiUserLine,
} from "react-icons/ri";
import LoginModal from "./LoginModal";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function Header({ theme, toggleTheme, onAddTask }) {
  const { user, isAdmin, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-primary) 90%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ink-600 flex items-center justify-center shadow-sm">
              <Image
                src="/favicon.svg"
                alt="StudyTracker"
                width={100}
                height={100}
              />
            </div>
            <div>
              <h1
                className="font-display font-bold text-base leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                StudyTracker
              </h1>
              <p
                className="text-[10px] leading-none mt-0.5 hidden sm:block"
                style={{ color: "var(--text-secondary)" }}
              >
                {isAdmin ? "Admin Mode" : "Guest View — read only"}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 hover:opacity-80 cursor-pointer border-none"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <RiSunLine className="text-lg" />
              ) : (
                <RiMoonLine className="text-lg" />
              )}
            </button>

            {isAdmin ? (
              /* Admin: show Add Task + user info + logout */
              <div className="flex items-center gap-2">
                <button
                  onClick={onAddTask}
                  className="btn-primary text-sm py-2! px-3! sm:px-4!"
                >
                  <RiAddLine className="text-base" />
                  <span className="hidden sm:inline">Add Task</span>
                  <span className="sm:hidden">Add</span>
                </button>

                <div
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(68,68,234,0.1)",
                    color: "#4444ea",
                  }}
                >
                  <RiUserLine className="text-sm" />
                  {user?.username}
                </div>

                <button
                  onClick={logout}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer border-none"
                  style={{
                    color: "var(--text-secondary)",
                    backgroundColor: "transparent",
                  }}
                  title="Logout"
                >
                  <RiLogoutBoxLine className="text-lg" />
                </button>
              </div>
            ) : (
              /* Guest: show Login button */
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer border-none"
                style={{
                  backgroundColor: "rgba(68,68,234,0.1)",
                  color: "#4444ea",
                }}
              >
                <RiShieldLine className="text-sm" />
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
