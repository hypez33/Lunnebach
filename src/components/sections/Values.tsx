import { Eyebrow } from "@/components/ui/Eyebrow";
import { home } from "@/content/pages";
import { values } from "@/content/values";

export function Values() {
  return (
    <section aria-labelledby="values-title" className="section-y">
      <div className="container-site">
        <div className="grid-12 gap-y-6">
          <Eyebrow className="col-span-4 text-ink-muted md:col-span-8 lg:col-span-3">
            {home.values.eyebrow}
          </Eyebrow>
          <h2 id="values-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
            {home.values.title}
          </h2>
        </div>
        <ol className="mt-[clamp(3rem,6vw,6rem)] grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <li key={v.number} className="relative flex flex-col justify-end gap-6 border-b md:min-h-[15rem] md:gap-10 border-r border-line p-[clamp(1.5rem,2.5vw,2.5rem)]">
              <div>
                <h3 className="text-h3">{v.title}</h3>
                <p className="mt-3 max-w-[36ch] text-ink-muted">{v.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
