import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Tidak ada token → ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Mapping role ke dashboard path
    const roleToPath: Record<string, string> = {
      super_admin: "/dashboard-superadmin",
      perawat: "/dashboard-perawat",
      kepala_ruangan: "/dashboard-kepala-ruangan",
      chief_nursing: "/dashboard-chiefnursing",
      verifikator: "/dashboard-verifikator",
    };

    const currentPath = req.nextUrl.pathname;

    // Kalau role tidak cocok dengan path → redirect
    if (roleToPath[decoded.role] && !currentPath.startsWith(roleToPath[decoded.role])) {
      return NextResponse.redirect(new URL(roleToPath[decoded.role], req.url));
    }
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard-superadmin",
    "/dashboard-perawat",
    "/dashboard-kepala-ruangan",
    "/dashboard-chiefnursing",
    "/dashboard-verifikator",
  ],
};
