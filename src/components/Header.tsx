import { Link } from "@tanstack/react-router";
import { BarChart3, Clock3, Home, Info, Leaf, Sprout } from "lucide-react";

const links = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/rekomendasi", label: "Rekomendasi", icon: Leaf },
  { to: "/historis", label: "Historis", icon: Clock3 },
  { to: "/tentang", label: "Tentang", icon: Info },
] as const;

export function Header() {
  return (
    <header className="lg:sticky lg:top-0 lg:z-50 lg:backdrop-blur-md lg:bg-background/80 lg:border-b lg:border-border">
      <div className="hidden max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:flex items-center justify-between">
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
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-elevated backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary data-[status=active]:bg-secondary data-[status=active]:text-primary"
              >
                <Icon className="h-5 w-5" strokeWidth={2.25} />
                <span className="max-w-full truncate leading-none">{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
