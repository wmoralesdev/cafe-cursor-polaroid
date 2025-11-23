import { Github } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";

export function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16">
      <div className="bg-white border-4 border-black p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        {/* Decorative stripes */}
        <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000_0,#000_10px,transparent_0,transparent_20px)] opacity-20 border-b-4 border-black" />
        
        <h2 className="text-4xl font-black text-fg mb-6 tracking-tighter uppercase mt-4">About the Maker</h2>
        <p className="text-xl text-fg/80 mb-12 leading-relaxed max-w-xl mx-auto font-medium">
          Hi, I'm <span className="font-black text-white bg-black px-2 py-0.5">WALTER MORALES</span>. 
          I build tools and experiences for developers. This polaroid generator is a fun way to share your dev stack with the world.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="https://x.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all w-full sm:w-auto justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] border-4 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          >
            <XIcon className="w-5 h-5" />
            <span>@wmoralesdev</span>
          </a>
          <a
            href="https://github.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 bg-white text-fg border-4 border-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all w-full sm:w-auto justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
