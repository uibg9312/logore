import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Workspace } from "@/components/workspace";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />

      <section id="workspace" className="py-20 bg-background">
        <Workspace />
      </section>
    </main>
  );
}
