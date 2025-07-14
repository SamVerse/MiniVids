import { Mongoose } from "mongoose";

// This global declaration is used to maintain a single connection to the MongoDB database across the application.
// So that we don't create multiple connections when the application is restarted or when hot reloading occurs in development mode.
declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

// Extend NextAuth types to include id in User and Session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export {};