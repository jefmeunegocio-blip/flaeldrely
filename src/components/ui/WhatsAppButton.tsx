import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const { settings } = useSiteSettings();
  const rawWhatsapp = settings?.contact?.whatsapp;
  
  const whatsappLink = (() => {
    if (!rawWhatsapp) {
      return "https://wa.me/5511910419073?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.";
    }
    if (rawWhatsapp.startsWith("http")) {
      return rawWhatsapp;
    }
    
    const digits = rawWhatsapp.replace(/\D/g, "");
    const normalized = digits.startsWith("55") ? digits : `55${digits}`;
    return `https://wa.me/${normalized}?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.`;
  })();

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-soft hover:scale-110 transition-transform duration-300 group hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2"
      aria-label="Falar no WhatsApp"
      id="whatsapp-floating-button"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping -z-10" />
      
      {/* Tooltip */}
      <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-background text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg shadow-card border border-border">
        Fale conosco no WhatsApp
      </span>
      
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
}
