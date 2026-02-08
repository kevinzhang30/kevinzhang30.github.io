import PageShell from "../components/layout/PageShell";
import SectionHeading from "../components/ui/SectionHeading";
import TimelineEntry from "../components/ui/TimelineEntry";
import { experiences } from "../data/experience";

export default function Experience() {
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");

  return (
    <PageShell>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Experience
        </h1>
        <p className="mt-1 text-gray-500">
          Where I&rsquo;ve worked and what I&rsquo;ve studied.
        </p>
      </div>

      {/* Work experience */}
      <section className="mt-12">
        <SectionHeading title="Work" />
        <div>
          {work.map((entry) => (
            <TimelineEntry key={entry.company + entry.role} entry={entry} />
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-12">
        <SectionHeading title="Education" />
        <div>
          {education.map((entry) => (
            <TimelineEntry key={entry.company + entry.role} entry={entry} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
