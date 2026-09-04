import { ArrowUp } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollPosition";

export default function FloatingScrollTop() {
  const { show, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center
                  shadow-lg hover:bg-royal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-royal-300
                  ${show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
