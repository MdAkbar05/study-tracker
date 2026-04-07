// app/api/og/route.js
// Generates a dynamic Open Graph image using Next.js built-in ImageResponse
// Usage: /api/og
//        /api/og?title=My+Task&type=exam&count=5
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "StudyTracker";
  const type = searchParams.get("type") || null;
  const count = searchParams.get("count") || null;
  const tagline = searchParams.get("tagline") || "Stay on top of your studies";

  // Type accent colours (match lib/constants.js)
  const typeConfig = {
    exam: { label: "Exam", accent: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
    class_test: {
      label: "Class Test",
      accent: "#f59e0b",
      bg: "rgba(245,158,11,0.15)",
    },
    assignment: {
      label: "Assignment",
      accent: "#8b5cf6",
      bg: "rgba(139,92,246,0.15)",
    },
    lab_report: {
      label: "Lab Report",
      accent: "#10b981",
      bg: "rgba(16,185,129,0.15)",
    },
    class_topic: {
      label: "Class Topic",
      accent: "#0ea5e9",
      bg: "rgba(14,165,233,0.15)",
    },
  };

  const tc = type ? typeConfig[type] : null;
  const accent = tc?.accent ?? "#5a63f5";

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d0d1a",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(68,68,234,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top border accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Icon */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 24px ${accent}66`,
            }}
          >
            {/* Book icon drawn with divs */}
            <div
              style={{
                width: "28px",
                height: "22px",
                border: "3px solid white",
                borderRadius: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "2px",
                  bottom: "2px",
                  width: "2px",
                  backgroundColor: "white",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>

          <span
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            StudyTracker
          </span>

          {/* Task count badge */}
          {count && (
            <div
              style={{
                marginLeft: "8px",
                backgroundColor: `${accent}22`,
                border: `1px solid ${accent}55`,
                borderRadius: "999px",
                padding: "4px 14px",
                fontSize: "15px",
                fontWeight: 700,
                color: accent,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: accent,
                }}
              />
              {count} tasks
            </div>
          )}
        </div>

        {/* Centre: big title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Type tag */}
          {tc && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: tc.bg,
                border: `1px solid ${tc.accent}44`,
                borderRadius: "10px",
                padding: "6px 16px",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: tc.accent,
                }}
              />
              <span
                style={{ fontSize: "16px", fontWeight: 700, color: tc.accent }}
              >
                {tc.label}
              </span>
            </div>
          )}

          <div
            style={{
              fontSize: title.length > 40 ? "48px" : "58px",
              fontWeight: 800,
              color: "#f0f0ff",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom row: tagline + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#9090b8",
              fontWeight: 400,
              maxWidth: "600px",
            }}
          >
            {tagline}
          </div>

          {/* Bottom-right: URL pill */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px",
              padding: "8px 20px",
              fontSize: "14px",
              color: "#9090b8",
              fontWeight: 500,
            }}
          >
            study-tracker.vercel.app
          </div>
        </div>
      </div>

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "10%",
          bottom: "10%",
          width: "4px",
          borderRadius: "0 4px 4px 0",
          backgroundColor: accent,
          boxShadow: `0 0 16px ${accent}`,
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
