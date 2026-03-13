import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /admin routes
  // - Static files (anything with a file extension in /public)
  matcher: [
    "/((?!api|_next|admin|.*\\..*).*)"],
};
