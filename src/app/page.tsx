"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="flex flex-col md:flex-row gap-12 max-w-5xl w-full items-center justify-between">
        {/* Left Section */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          {/* Logo and Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            🎥 MiniVids
          </h1>

          {/* Tagline */}
          <p className="text-gray-400 text-sm md:text-base">
            Share short-form videos, explore reels, and stay inspired in seconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
            {/* Try Now Button */}
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-all duration-200"
              >
                Try Right Now
              </motion.button>
            </Link>

            {/* Sign In Button */}
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-all duration-200"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Right Section (Optional image/video preview) */}
        {/* You can leave this blank or add something later */}
      </div>
    </main>
  );
}
