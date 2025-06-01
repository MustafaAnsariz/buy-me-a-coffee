import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { mongoose } from "mongoose";
import User from "@/models/User";
import DiscordProvider from "next-auth/providers/discord";


const authop = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        const userEmail = profile.email;

        if (!userEmail) {
          console.error("Email is undefined or invalid.");
          return false;
        }

        // Check if email is verified for Google accounts
        if (account.provider === "google" && !profile.email_verified) {
          return false;
        }

        const userExists = await User.findOne({ email: userEmail });
        if (!userExists) {
          const newUser = new User({
            email: userEmail,
            username: userEmail.split("@")[0],
            name: profile.name,
            profilePicture: profile.picture || profile.avatar_url,
          });
          await newUser.save();
          user.name = newUser.username;
        } else {
          user.name = userExists.username;
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
  },
});

export { authop as GET, authop as POST };
