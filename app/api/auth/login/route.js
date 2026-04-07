// app/api/auth/login/route.js
import { ADMIN, comparePassword, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check against admin credentials from .env
    if (username !== ADMIN.username) {
      return Response.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, ADMIN.password);
    if (!valid) {
      return Response.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ username: ADMIN.username, role: "admin" });

    // Set httpOnly cookie + return token in body (client can use either)
    const response = Response.json({
      success: true,
      token,
      user: { username: ADMIN.username, role: "admin" },
    });

    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
    );

    return response;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
