export type TechGroup = "Frontend" | "Backend" | "Mobile" | "Data/Infra" | "Tooling";

export const TECH_STACKS: Record<TechGroup, string[]> = {
  Frontend: [
    "React",
    "Next.js",
    "Vue",
    "Svelte",
    "Tailwind",
    "SolidJS",
    "Remix",
  ],
  Backend: [
    "Node.js",
    "Express",
    "NestJS",
    "Django",
    "Spring",
    "FastAPI",
    "Laravel",
    "Rails",
  ],
  Mobile: ["React Native", "Flutter", "Swift", "Kotlin", "SwiftUI"],
  "Data/Infra": [
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "Supabase",
  ],
  Tooling: [
    "TypeScript",
    "Vite",
    "Webpack",
    "ESLint",
    "Prettier",
    "Jest",
    "Playwright",
    "Storybook",
  ],
};

