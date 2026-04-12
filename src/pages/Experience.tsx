import BackToStation from "../components/ui/BackToStation";
import SpacePageShell from "../components/ui/SpacePageShell";
import SpaceSectionHeading from "../components/ui/SpaceSectionHeading";
import SpaceTimelineEntry from "../components/ui/SpaceTimelineEntry";
import { useExperiences } from "../hooks/useExperiences";

export default function Experience() {
  const { experiences } = useExperiences();
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");

  return (
  <>
    <SpacePageShell>
      {/* Header */}
      <div>
        <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
          Experience
        </h1>
        <p className="mt-1 text-gray-400">
          Where I&rsquo;ve worked and what I&rsquo;ve studied.
        </p>
      </div>

      {/* Work experience */}
      <section className="mt-12">
        <SpaceSectionHeading title="Work" />
        <div>
          {work.map((entry) => (
            <SpaceTimelineEntry key={entry.company + entry.role} entry={entry} />
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-12">
        <SpaceSectionHeading title="Education" />
        <div>
          {education.map((entry) => (
            <SpaceTimelineEntry key={entry.company + entry.role} entry={entry} />
          ))}
        </div>
      </section>
    </SpacePageShell>
    <BackToStation />
  </>
  );
}
