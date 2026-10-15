import { img } from "@/content/images";
import { getProject, projects, worldLabel } from "@/content/projects";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Projekt der Tischlerei Lunnebach";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug) ?? projects[0];
  return renderOg({
    eyebrow: `Projekt · ${worldLabel[project.world]} · ${project.category}`,
    title: project.title,
    image: img(project.heroImage).src.replace(/^\//, ""),
  });
}
