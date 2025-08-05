import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  const handleConsultClick = () => {
    console.log("Consult Now clicked");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://placehold.co/1920x1080/000000/FFFFFF?text=Legal+Port')`,
        }}
      />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Get Expert Legal Advice Anytime, Anywhere
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
          Connect with trusted lawyers instantly via chat, call, or video.
        </p>
        <Button
          size="lg"
          onClick={handleConsultClick}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <span>Consult Now</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      <button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-teal-400 transition-colors duration-300"
        aria-label="Scroll down"
      >
        <div className="w-12 h-12 rounded-full border-2 border-teal-600 flex items-center justify-center animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </div>
      </button>
    </section>
  );
}