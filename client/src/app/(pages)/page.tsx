import InfoBar from "@/components/global/InfoBar";
import Footer from "./_components/Footer";
import HeroSection from "./_components/hero";
import Main from "./_components/main";
import NavComponent from "./_components/Nav";

export default function Home() {
  return (
    <div className="  bg-[#0B0C14]  overflow-auto">
      <InfoBar />
      <NavComponent />
      <HeroSection />
      <Main />
      <Footer />
    </div>
  );
}
