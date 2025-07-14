import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { loginSchema , registerSchema } from "@/schemas/auth.schema";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) { 
  try {
    const { name, email, password } = await req.json();

    // Validate the request body against the register schema
    const parsedData = registerSchema.safeParse({ name, email, password });
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.issues }, { status: 400 });
    }

    // Connect to the database
    const db = await connectToDatabase();
    
    // Check if user already exists 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}