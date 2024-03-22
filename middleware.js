import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  return NextResponse.next();

  //   if ((!token || !userId) && pathname !== "/login") {
  //     const url = req.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.rewrite(url);
  //   }
}
// export function middleware(request) {
//   return NextResponse.redirect(new URL("/", request.url));

//   //   if ((!token || !userId) && pathname !== "/login") {
//   //     const url = req.nextUrl.clone();
//   //     url.pathname = "/login";
//   //     return NextResponse.rewrite(url);
//   //   }
// }

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };

// import { NextResponse } from "next/server";

// import { verifyToken } from "@/lib/utils";

// // This function can be marked `async` if using `await` inside
// export async function middleware(request, events) {
//   console.log("request.cookies", request.cookies);

//   const token = request ? request.cookies.get("token") : null;
//   console.log("here token", token);
//   const userId = await verifyToken(token);

//   const { pathname } = request.nextUrl;

//   if ((token && userId) || pathname.includes === "/api/login") {
//     return NextResponse.next();
//   }

//   if (!token && pathname !== "/login") {
//     return NextResponse.redirect("/login");
//   }

// }
