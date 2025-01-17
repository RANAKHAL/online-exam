import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token");
  const currentUrl = request.nextUrl.pathname;
  const nextToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("token from middleware", nextToken);
  //   const roles = {
  //     admin: ["/dashboard", "/server", "/client"],
  //     doctor: ["/client"],
  //     manager: ["/server", "/client"],
  //   };

  //   const pathsOfRole = roles?.[nextToken?.roles];

  // authnicate
  if (!token) return NextResponse.rewrite(new URL("/login", request.url));

  //   // role based access level
  //   if (pathsOfRole?.indexOf(currentUrl) === -1)
  //     return NextResponse.redirect(new URL("/denied", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/server", "/client", "/dashboard"],
};

const permissionList = ["add_prodcut"];
