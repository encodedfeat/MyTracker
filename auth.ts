
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      console.log("SignIn Callback Started", { user, account });
      if (account?.provider === "google") {
        try {
          const { email, name, image } = user;
          console.log("Connecting to DB...");
          await dbConnect();
          console.log("Connected to DB. Finding user...");
          const existingUser = await User.findOne({ email });
          console.log("User found?", existingUser);

          if (!existingUser) {
            console.log("Creating new user...");
            await User.create({ email, name, image });
            console.log("New user created.");
          }
          return true;
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      console.log("Session Callback Started", session);
      if (session.user?.email) {
        try {
          await dbConnect();
          const user = await User.findOne({ email: session.user.email });
          if (user) {
            session.user.id = (user as any)._id.toString();
            console.log("User ID attached to session:", session.user.id);
          } else {
            console.log("User not found in DB during session callback");
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
})
