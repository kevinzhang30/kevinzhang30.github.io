import PageShell from "../components/layout/PageShell";
import SectionHeading from "../components/ui/SectionHeading";
import TimelineEntry from "../components/ui/TimelineEntry";
import { experiences } from "../data/experience";
import { personal } from "../data/personal";

export default function Experience() {
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");

  return (
    <PageShell>
      {/* Header + Resume download */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Experience
          </h1>
          <p className="mt-1 text-gray-500">
            Where I&rsquo;ve worked and what I&rsquo;ve studied.
          </p>
        </div>
        <a
          href={`/${personal.resumeFile}`}
          download
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download Resume
        </a>
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
