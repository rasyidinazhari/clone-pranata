import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mongso ini tidak ada di kalender kami.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pranata Calculator — Kearifan Lokal, Divalidasi Sains" },
      { name: "description", content: "Validasi ilmiah kalender tani Pranata Mongso dengan data cuaca real-time untuk petani Indonesia." },
      { property: "og:title", content: "Pranata Calculator — Kearifan Lokal, Divalidasi Sains" },
      { name: "twitter:title", content: "Pranata Calculator — Kearifan Lokal, Divalidasi Sains" },
      { property: "og:description", content: "Validasi ilmiah kalender tani Pranata Mongso dengan data cuaca real-time untuk petani Indonesia." },
      { name: "twitter:description", content: "Validasi ilmiah kalender tani Pranata Mongso dengan data cuaca real-time untuk petani Indonesia." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d6fa0b81-138f-4d3b-9e73-3bc00d2dd819/id-preview-d8e563dc--1eae002c-de26-4265-b3b6-be02f72ac4b8.lovable.app-1777627047958.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d6fa0b81-138f-4d3b-9e73-3bc00d2dd819/id-preview-d8e563dc--1eae002c-de26-4265-b3b6-be02f72ac4b8.lovable.app-1777627047958.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PranataCalc — Kearifan Lokal × Sains Modern
      </footer>
    </div>
  );
}
