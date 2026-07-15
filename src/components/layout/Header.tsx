import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo-elderly.jpg";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/empresa", label: "Empresa" },
  { to: "/cuidador", label: "Cuidador" },
  { to: "/trabalhe-conosco", label: "Trabalhe Conosco" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: settings } = useQuery({
    queryKey: ["site_settings_logo"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("logo_url").eq("id", 1).maybeSingle();
      return data;
    },
  });
  const logoUrl = settings?.logo_url;

  const { data: isAdmin } = useQuery({
    queryKey: ["is_admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id);
      return !!roles?.some((r) => r.role === "admin");
    },
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-card"
          : "bg-background/50 backdrop-blur-sm"
      }`}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? "py-1 sm:py-2" : "py-3 sm:py-5"}`}>
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg" onClick={() => setOpen(false)}>
          <img
            src={(!logoUrl || logoUrl.includes("logo-elderly.png")) ? logoAsset : logoUrl}
            alt="Elderly Cuidados Especializados"
            referrerPolicy="no-referrer"
            className={`w-auto object-contain transition-all duration-300 hover:scale-105 ${scrolled ? "h-20 sm:h-22" : "h-28 sm:h-34 md:h-38"}`}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={isAdmin ? "/admin" : "/auth"}><Shield className="h-4 w-4 mr-1" /> Admin</Link>
          </Button>
          <Button asChild>
            <Link to="/contato">Fale Conosco</Link>
          </Button>
        </div>

        <button
          aria-label="Abrir menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-base font-medium hover:bg-secondary"
                activeProps={{ className: "text-primary bg-secondary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="outline" className="mt-2">
              <Link
                to={isAdmin ? "/admin" : "/auth"}
                onClick={() => setOpen(false)}
              ><Shield className="h-4 w-4 mr-1" /> Admin</Link>
            </Button>
            <Button asChild className="mt-2">
              <Link to="/contato" onClick={() => setOpen(false)}>Fale Conosco</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
