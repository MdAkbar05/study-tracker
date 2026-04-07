// app/layout.jsx
import "@/app/globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "StudyTracker — Stay on top of your studies",
    template: "%s | StudyTracker",
  },
  description:
    "A focused study task manager to track assignments, exams, lab reports, class tests and more — with live countdowns, priority sorting and dark mode.",
  keywords: [
    "study tracker",
    "assignment tracker",
    "exam countdown",
    "student planner",
    "task manager",
    "study schedule",
  ],
  authors: [{ name: "MD. Akbar Hossan" }],
  creator: "StudyTracker",

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "StudyTracker",
    title: "StudyTracker — Stay on top of your studies",
    description:
      "Track assignments, exams, lab reports & more with live countdowns and priority sorting.",
    images: [
      {
        url: "/api/og", // dynamic OG image
        width: 1200,
        height: 630,
        alt: "StudyTracker — Stay on top of your studies",
      },
    ],
  },

  // ── Twitter / X card ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "StudyTracker — Stay on top of your studies",
    description:
      "Track assignments, exams, lab reports & more with live countdowns and priority sorting.",
    images: ["/api/og"],
  },

  // ── Robots ──────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* SVG favicon — works in all modern browsers */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
