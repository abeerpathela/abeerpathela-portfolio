import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abeer Pathela // 3D Portfolio" },
      { name: "description", content: "Cinematic 3D space-mission portfolio — projects, hackathons, tech stack, and contact terminal." },
      { property: "og:title", content: "Abeer Pathela // 3D Portfolio" },
      { property: "og:description", content: "Destination-based 3D portfolio rendered with React Three Fiber." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Portfolio />;
}
