import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const slugs = new Set(projects.map((p) => p.slug));

/**
 * Unbekannte Projekt-Slugs → echter HTTP-404.
 * Die Detailseite streamt ihren Inhalt in <Suspense> (instant Navigation); dabei wäre der Status
 * bereits 200, bevor notFound() greift. Der Proxy prüft deshalb vorab.
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
