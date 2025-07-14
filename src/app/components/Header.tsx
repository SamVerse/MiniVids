import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, Menu, X } from "lucide-react"; // Import the X icon
import { useNotification } from "./Notification";
import { useState, useEffect } from "react"; // Import useEffect

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  // Effect to prevent scrolling when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scrolling when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-base-300 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold hover:opacity-80"
          onClick={() =>
            showNotification("Welcome to ImageKit ReelsPro", "info")
          }
        >
          <Home className="w-5 h-5" />
          <span>MiniVids</span>
        </Link>

        {/* Right: Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-500">
                Hi, {session.user?.email?.split("@")[0]}
              </span>
              <Link
                href="/upload"
                className="px-4 py-2 bg-white text-black rounded-full hover:bg-yellow-300"
              >
                Upload
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-yellow-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Right: Hamburger for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="btn btn-ghost btn-circle"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-base-200 border-t border-base-300">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {session ? (
              <>
                <div className="px-2 py-2 text-sm text-gray-500">
                  Welcome {session.user?.email?.split("@")[0]} 👋
                </div>
                <Link
                  href="/upload"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-base-300"
                  onClick={() => {
                    showNotification("Go upload a reel!", "info");
                    setIsMenuOpen(false);
                  }}
                >
                  Upload
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-base-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-base-300"
                onClick={() => {
                  showNotification("Please sign in to continue", "info");
                  setIsMenuOpen(false);
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
