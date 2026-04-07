// app/api/auth/logout/route.js
export async function POST() {
  const response = Response.json({ success: true, message: "Logged out" });
  // Clear the cookie
  response.headers.set(
    "Set-Cookie",
    "auth_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
  );
  return response;
}
