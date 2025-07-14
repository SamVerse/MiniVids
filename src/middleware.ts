import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },{
    callbacks: {
        authorized({ req , token }) {
            const {pathname} = req.nextUrl;
            // Allow access to the root path and the login page
           if (pathname.startsWith("/api/auth")
                || pathname === "/login"
                || pathname === "/register"
                || pathname === "/home"
                || pathname.startsWith("/api/video") // Allow public access to the video API
            ) {
                return true;
            }

            if(pathname === "/" || pathname.startsWith("/api/videos")) {
                return true;
            }

            return !!token; // Allow access if the user is authenticated
        }
    }
    }
);

export const config = {
  // Match all paths except for the ones specified
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}