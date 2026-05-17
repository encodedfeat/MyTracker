
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// proxy.ts replaces middleware.ts in Next.js 16+
// Only uses the Edge-safe authConfig — no mongoose/dbConnect here.
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
    matcher: ["/dashboard/:path*", "/manage/:path*"],
}
