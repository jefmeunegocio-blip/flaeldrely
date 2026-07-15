import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo-elderly.jpg";

export function Footer() {
  const { data: isAdmin } = useQuery({
    queryKey: ["footer_is_admin"],
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

  const { data: settings } = useQuery({
    queryKey: ["site_settings_footer"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return data as Record<string, string | null> | null;
    },
  });

  const logoUrl = (!settings?.logo_url || (settings?.logo_url as string).includes("logo-elderly.png")) ? logoAsset : settings.logo_url;
  const contentContact = ((settings?.content as Record<string, unknown> | null)?.contact as Record<string, string | null> | undefined) ?? {};
  const contactPhone = settings?.phone ?? contentContact.phone ?? "(11) 91041-9073";
  const contactEmail = settings?.email ?? contentContact.email ?? "elderlycuidados@hotmail.com";
  const contactAddress = settings?.address ?? contentContact.address ?? "Rua: Cachoeira Poraquê, 281";

  const whatsappLink = (() => {
    const digits = (settings?.whatsapp ?? contentContact.whatsapp ?? "").replace(/\D/g, "");
    if (!digits) return "https://wa.me/5511910419073?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.";
    const normalized = digits.startsWith("55") ? digits : `55${digits}`;
    return `https://wa.me/${normalized}?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.`;
  })();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <img
              src={logoUrl}
              alt="Elderly Cuidados Especializados"
              referrerPolicy="no-referrer"
              className="h-20 sm:h-24 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Cuidado humanizado e profissional para quem mais importa.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Navegação</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/empresa" className="hover:text-primary">Empresa</Link></li>
            <li><Link to="/cuidador" className="hover:text-primary">Cuidador</Link></li>
            <li><Link to="/trabalhe-conosco" className="hover:text-primary">Trabalhe Conosco</Link></li>
            <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
            {isAdmin && (
              <li>
                <Link to="/admin" className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                  <Shield className="h-3 w-3" /> Admin
                </Link>
              </li>
            )}
          </ul>
        </div>


        <div>
          <h4 className="font-semibold mb-3">Contato</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {contactPhone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {contactEmail}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {contactAddress}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Redes</h4>
          <div className="flex gap-3">
            <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="h-9 px-3 inline-flex items-center justify-center rounded-full bg-background border border-border hover:text-primary text-sm font-medium">WhatsApp</a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-background border border-border hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-background border border-border hover:text-primary"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-background border border-border hover:text-primary"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Elderly. Todos os direitos reservados.</span>
          <span>Cuidando com amor e profissionalismo.</span>
        </div>
      </div>
    </footer>
  );
}
