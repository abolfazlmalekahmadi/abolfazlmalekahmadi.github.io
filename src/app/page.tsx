import Experience from "@/components/Experience";
import About from "@/sections/About";
import Archive from "@/sections/archive/Archive";
import Finale from "@/sections/Finale";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import Journey from "@/sections/Journey";
import Mind from "@/sections/Mind";
import Publications from "@/sections/Publications";
import Research from "@/sections/Research";
import Engineering from "@/sections/Engineering";

export default function Page() {
  return (
    <Experience>
      <Hero />
      <Mind />
      <Research />
      <Archive />
      <Publications />
      <Engineering />
      <Journey />
      <About />
      <Finale />
      <Footer />
    </Experience>
  );
}
