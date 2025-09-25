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

    // === ✅ Cek token expired ===
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      // Hapus token agar tidak looping
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }

    // Mapping role ke prefix folder
    const roleToPrefix: Record<string, string[]> = {
      super_admin: ["dashboard-superadmin"],
      perawat: [
        "dashboard-perawat",
        "profile-perawat",
        "notifications-perawat",
        "video-tutorial-perawat",
        "tambah-laporan",
      ],
      kepala_ruangan: [
        "dashboard-kepala-ruangan",
        "profile-kepala-ruangan",
        "laporan-masuk-kepala-ruangan",
        "notifications-kepala-ruangan",
      ],
      chief_nursing: [
        "dashboard-chiefnursing",
        "profile-chiefnursing",
        "laporan-masuk-chiefnursing",
        "notifications-chiefnursing",
      ],
      verifikator: [
        "dashboard-verifikator",
        "profile-verifikator",
        "laporan-masuk-verifikator",
        "riwayat-laporan-verifikator",
        "notifications-verifikator",
      ],
    };

    const currentPath = req.nextUrl.pathname;
    const allowedPrefixes = roleToPrefix[decoded.role];

    if (allowedPrefixes) {
      const match = allowedPrefixes.some((prefix) =>
        currentPath.startsWith(`/${prefix}`)
      );

      if (!match) {
        return NextResponse.redirect(new URL(`/${allowedPrefixes[0]}`, req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|forgot-password|reset-password|api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)).*)",
  ],
};

