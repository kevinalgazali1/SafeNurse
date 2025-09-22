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

    // Cari role prefix yang sesuai
    const allowedPrefixes = roleToPrefix[decoded.role];

    if (allowedPrefixes) {
      const match = allowedPrefixes.some((prefix) =>
        currentPath.startsWith(`/${prefix}`)
      );

      if (!match) {
        // Redirect ke dashboard role masing-masing
        return NextResponse.redirect(new URL(`/${allowedPrefixes[0]}`, req.url));
      }
    } else {
      // Role tidak dikenali
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Terapkan ke semua route yang butuh proteksi
export const config = {
  matcher: [
    // Semua route, kecuali login, forgot, reset, api, _next (assets), favicon, images
    "/((?!login|forgot-password|reset-password|api|_next|favicon.ico|images).*)",
  ],
};
