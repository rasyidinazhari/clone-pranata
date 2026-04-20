import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/rekomendasi", label: "Rekomendasi" },
  { to: "/historis", label: "Historis" },
  { to: "/tentang", label: "Tentang" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-primary text-lg">PranataCalc</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">Kearifan Lokal × Sains</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors whitespace-nowrap data-[status=active]:text-primary data-[status=active]:bg-secondary"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
