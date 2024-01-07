import { withAuth } from "next-auth/middleware";
import { Role } from "@prisma/client";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      const res = await fetch(`http://localhost:3000/api/users/${token?.id}`);
      const user = await res.json();

      if (pathname.startsWith("/api/users")) return false;

      if (pathname.startsWith("/dashboard")) {
        const role = user?.value?.role;

        if (!role) return false;
        if (role === Role.OWNER) return true;
        if (role === Role.PACKAGER && pathname.startsWith("/dashboard/orders"))
          return true;
        if (role === Role.MODERATOR && !pathname.startsWith("/dashboard/users"))
          return true;

        return false;
      }

      if (pathname.startsWith("/me")) return !!token;

      return true;
    },
  },
});
