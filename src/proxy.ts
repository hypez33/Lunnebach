import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const slugs = new Set(projects.map((p) => p.slug));

/**
 * Unbekannte Projekt-Slugs → echter HTTP-404.
 * Mit Cache Components wird die App Shell vorab gestreamt; der Status stünde damit schon auf 200,
 * bevor notFound() in der Seite greift. Der Proxy prüft deshalb vorab.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(slug)) {
    return NextResponse.rewrite(new URL("/_nicht-gefunden", request.url), { status: 404 });
  }
}

export const config = {
  matcher: ["/projekte/:slug"],
};
