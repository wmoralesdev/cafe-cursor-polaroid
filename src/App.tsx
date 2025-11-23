import { AppShell } from "@/components/layout/app-shell";
import { EditorSection } from "@/components/sections/editor-section";
import { AboutSection } from "@/components/sections/about-section";

function App() {
  return (
    <AppShell>
      <EditorSection />
      <div className="h-px bg-card-04 my-8 w-full" />
      <AboutSection />
    </AppShell>
  );
}

export default App;
