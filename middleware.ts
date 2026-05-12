import {NextRequest, NextResponse} from "next/server";
import {decode} from "@auth/core/jwt";

const ADMIN_ROLES = ["MODERATOR", "ADMINISTRATOR"];

export async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    const token = await decode({
        token: req.cookies.get(
            process.env.NODE_ENV === "production"
                ? "__Secure-authjs.session-token"
                : "authjs.session-token"
        )?.value,
        secret: process.env.AUTH_SECRET!,
        salt:
            process.env.NODE_ENV === "production"
                ? "__Secure-authjs.session-token"
                : "authjs.session-token",
    });

    const role = token?.role as string | undefined;

    if (!token || !role || !ADMIN_ROLES.includes(role)) {
        // Redirect na login ili 403 po želji
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};