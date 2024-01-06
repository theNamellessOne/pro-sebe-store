import { withAuth } from "next-auth/middleware";
import { Role } from "@prisma/client";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/dashboard")) {
        const role = token?.role;

        if (role === Role.OWNER) return true;
        else if (
          role === Role.PACKAGER &&
          pathname.startsWith("/dashboard/orders")
        )
          return true;
        else if (
          role === Role.MODERATOR &&
          !pathname.startsWith("/dashboard/users")
        )
          return true;

        return false;
      }

      if (pathname.startsWith("/me")) return !!token;

      return true;
    },
  },
});
