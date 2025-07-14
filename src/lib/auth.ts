import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "Enter your email here" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required"); 
          }
          // Here you would typically validate the credentials against your database
          try {
            await connectToDatabase();
            const { email, password } = credentials;
            const user  = await User.findOne({ email }); 
            if (!user) {
              throw new Error("User not found");
            }
            
            // we have used bcrypt to hash the password so we need to compare the hashed password with the provided password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
              throw new Error("Invalid password");
            }
            // If the credentials are valid, return the user object
            return { 
              id: user._id.toString(),
              email: user.email
            };

          } catch (error) {
            console.error("Error during authorization:", error);
            throw new Error("Invalid credentials");
          }
        }
      }),
  //     GithubProvider({
  //     clientId: process.env.GITHUB_ID!,
  //     clientSecret: process.env.GITHUB_SECRET!,
  //   }),
  //   GoogleProvider({
  //   clientId: process.env.GOOGLE_CLIENT_ID!,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  // })
    // ...add more providers here
  ],
  callbacks: {
    // handle JWT token creation and session management

    //Here we are using the JWT callback to add the user id to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Here we are using the session callback to add the user id to the session 
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; // Ensure the id is a string 
      }
      return session;
    },
    // redirect callback to handle redirects after sign in to the home page
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login', // Displays signin buttons
    error: '/login', // Error code passed in query string as ?error=error_code
  },
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET, // Use a secret for signing the session

}