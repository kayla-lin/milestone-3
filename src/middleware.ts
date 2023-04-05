import { withAuth } from "next-auth/middleware";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;

      // `/instructor` requires admin role
      if (pathname.startsWith("/app/instructor") && token?.user?.roleID === 2) {
        console.log("true");
        return false;
      }

      if (pathname.startsWith("/app/student") && token?.user?.roleID === 1) {
        console.log("true");
        return false;
      }

      // `/me` only requires the user to be logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/app/instructor/:path*", "/app/student/:path*"],
};
