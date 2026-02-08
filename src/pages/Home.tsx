import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { personal } from "../data/personal";
import { cn } from "../lib/cn";

const navCards = [
  {
    to: "/experience",
    title: "Experience",
    description: "Work history & education",
  },
  {
    to: "/projects",
    title: "Projects",
    description: "Things I've built",
  },
  {
    to: "/gallery",
    title: "Gallery",
    description: "Photos & moments",
  },
  {
    to: "/map",
    title: "Map",
    description: "Places I've been",
  },
];

export default function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="py-12 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {personal.name}
        </h1>
        <p className="mt-3 text-lg text-primary-500 font-medium">
          {personal.tagline}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600">
          {personal.about}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          {personal.athletics}
        </p>
      </section>

      {/* Nav cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {navCards.map((card, i) => (
          <Link
            key={card.to}
            to={card.to}
            className={cn(
              "group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md",
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-gray-400">{card.description}</p>
            <span className="mt-4 inline-block text-xs text-gray-300 transition-colors group-hover:text-primary-400">
              &rarr;
            </span>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
