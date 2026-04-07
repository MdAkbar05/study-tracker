// app/api/auth/me/route.js
import { getAuthPayload } from "@/lib/auth";

export async function GET(request) {
  const payload = getAuthPayload(request);
  if (!payload) {
    return Response.json({ success: false, user: null }, { status: 401 });
  }
  return Response.json({
    success: true,
    user: { username: payload.username, role: payload.role },
  });
}
