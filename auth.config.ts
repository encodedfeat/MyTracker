import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// This is an Edge-compatible auth config — NO mongoose/dbConnect here.
// Used only by middleware.ts for route protection.
export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtected =
                nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/manage');

            if (isProtected && !isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl.origin));
            }
            return true;
        },
    },
    pages: {
        signIn: '/',
    },
}
