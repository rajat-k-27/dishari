import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAdminLogin = req.nextUrl.pathname === "/admin/login";
    const isUserAuthPage = req.nextUrl.pathname.startsWith("/auth/signin");
    const isCheckout = req.nextUrl.pathname.startsWith("/checkout");
    const isCart = req.nextUrl.pathname.startsWith("/cart");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    
    // Allow admin login page to be accessed without redirects
    if (isAdminLogin) {
      // If already logged in as admin, redirect to dashboard
      if (token && isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }
    
    // Allow API routes to pass through
    if (isApiRoute) {
      return NextResponse.next();
    }
    
    // If logged in user (non-admin) tries to access admin routes
    if (isAdminRoute && token && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // If not logged in user tries to access admin routes (except login)
    if (isAdminRoute && !token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    
    // If admin tries to access user pages (home, shop, cart, checkout, etc.)
    // Redirect to admin dashboard
    if (isAdmin && !isAdminRoute && !isUserAuthPage && !isApiRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    // If user tries to access cart without being logged in
    if (isCart && !token) {
      const loginUrl = new URL("/auth/signin", req.url);
      loginUrl.searchParams.set("callbackUrl", "/cart");
      return NextResponse.redirect(loginUrl);
    }
    
    // If user tries to checkout without being logged in
    if (isCheckout && !token) {
      const loginUrl = new URL("/auth/signin", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isAdminLogin = req.nextUrl.pathname === "/admin/login";
        const isCheckout = req.nextUrl.pathname.startsWith("/checkout");
        const isCart = req.nextUrl.pathname.startsWith("/cart");
        
        // Allow admin login page without auth
        if (isAdminLogin) {
          return true;
        }
        
        // Admin routes require admin role
        if (isAdminRoute) {
          return token?.role === "admin";
        }
        
        // Cart and Checkout require any logged-in user
        if (isCheckout || isCart) {
          return !!token;
        }
        
        // All other routes are public
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/cart/:path*",
    "/",
    "/shop/:path*",
    "/about",
    "/services",
    "/contact",
  ],
};
