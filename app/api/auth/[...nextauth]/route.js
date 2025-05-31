import NextAuth from "next-auth";
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from "next-auth/providers/github";
import { mongoose } from "mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";

const authop = NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET
    // }),
    // // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "github") {
        // connect to database
        const client = await mongoose.connect(
          process.env.MONGODB_URI
        );

        // Log the profile to see what data is returned
        console.log("GitHub Profile:", profile);

        // Use profile.email if email is not provided
        const userEmail = email || profile.email;

        if (userEmail) {
          const userExists = await User.findOne({ email: userEmail });
          if (!userExists) {
            // create user
            const newUser = new User({
              email: userEmail,
              username: userEmail.split("@")[0],
            });
            await newUser.save();
            user.name = newUser.username;
          } else {
            user.name = userExists.username;
          }
        } else {
          console.error("Email is undefined or invalid.");
          return false; // Return false to indicate sign-in failure
        }
        return true;
      }
    },
  },
});

export { authop as GET, authop as POST };
