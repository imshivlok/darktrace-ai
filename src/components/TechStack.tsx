// USE: "Built with" badge row for Home page. Simple pill badges, no logo
// images (keeps it dependency-free). Placed between concept cards and
// the ProjectOverview section.

const techStack = [
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "AWS EC2",
  "AWS Bedrock",
  "Claude Sonnet 5",
  "Docker",
  "Scrapy",
  "Tor",
  "Cloudflare",
];

export default function TechStack() {
  return (
    <div>
      <p className="text-center text-xs uppercase tracking-widest text-slate-500">
        Built with
      </p>
      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-3">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-cyan-500/30 bg-[#111214]/70 px-4 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_12px_-2px_rgba(34,211,238,0.4)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
