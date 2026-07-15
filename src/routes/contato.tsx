import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/SectionHeading";

const contactSearchSchema = z.object({
  plano: z.string().optional(),
  perfil: z.string().optional(),
  periodo: z.string().optional(),
});

export const Route = createFileRoute("/contato")({
  validateSearch: (search) => contactSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Contato — Elderly" },
      { name: "description", content: "Fale com a Elderly: telefone, WhatsApp, e-mail, endereço e formulário de contato." },
      { property: "og:title", content: "Contato — Elderly" },
      { property: "og:description", content: "Estamos prontos para atender sua família." },
    ],
  }),
  component: Contato,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  mensagem: z.string().trim().min(5, "Mensagem muito curta").max(1000),
});

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
    [a && `(${a}`, a.length === 2 ? ") " : "", b, c && `-${c}`].filter(Boolean).join(""));
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
}

function toWhatsAppLink(rawValue: string | null | undefined) {
  const digits = (rawValue ?? "").replace(/\D/g, "");
  if (!digits) return "https://wa.me/5511910419073?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.";
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${normalized}?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.`;
}

function Contato() {
  const { plano, perfil, periodo } = Route.useSearch();
  const { data: settings } = useQuery({
    queryKey: ["site_settings_contact"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return data as Record<string, string | null> | null;
    },
  });

  const contentContact = ((settings?.content as Record<string, unknown> | null)?.contact as Record<string, string | null> | undefined) ?? {};
  const contactPhone = settings?.phone ?? contentContact.phone ?? "(11) 91041-9073";
  const contactEmail = settings?.email ?? contentContact.email ?? "elderlycuidados@hotmail.com";
  const contactAddress = settings?.address ?? contentContact.address ?? "Rua: Cachoeira Poraquê, 281";
  const contactHours = settings?.hours ?? contentContact.hours ?? "Seg a Sex: 8h–20h · Sáb: 9h–14h";
  const whatsappLink = toWhatsAppLink(settings?.whatsapp ?? contentContact.whatsapp);
  const mapAddress = encodeURIComponent(settings?.address ?? contentContact.address ?? "Rua Cachoeira Poraquê, 281, São Paulo, SP");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", mensagem: "" });

  useEffect(() => {
    if (plano || perfil || periodo) {
      const defaultMessage = `Olá! Utilizei o simulador do site e gostaria de solicitar um orçamento para o plano:\n\n` +
        `• Plano sugerido: ${plano || "Não especificado"}\n` +
        `• Perfil do Idoso: ${perfil || "Não especificado"}\n` +
        `• Período desejado: ${periodo || "Não especificado"}\n\n` +
        `Gostaria de agendar uma conversa com a equipe da Elderly.`;
      setForm((f) => ({ ...f, mensagem: defaultMessage }));
    }
  }, [plano, perfil, periodo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setLoading(true);
    try {
      console.log("[Elderly/Contato] mensagem", parsed.data);
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Mensagem enviada! Retornaremos em breve.");
      setForm({ nome: "", telefone: "", email: "", mensagem: "" });
    } catch (err) {
      console.error("[Elderly/Contato] erro", err);
      toast.error("Não foi possível enviar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-hero py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold">Vamos conversar</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Tire suas dúvidas e receba um plano de cuidados personalizado para sua família.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-soft">
              <CardContent className="p-6 sm:p-8">
                <SectionHeading title="Envie sua mensagem" align="left" />
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" inputMode="tel" value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <Textarea id="mensagem" rows={5} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} required />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Informações</h3>
                <div className="flex items-start gap-3 text-sm"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium">Telefone</div><div className="text-muted-foreground">{contactPhone}</div></div></div>
                <div className="flex items-start gap-3 text-sm"><Mail className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium">E-mail</div><div className="text-muted-foreground">{contactEmail}</div></div></div>
                <div className="flex items-start gap-3 text-sm"><MapPin className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium">Endereço</div><div className="text-muted-foreground">{contactAddress}</div></div></div>
                <div className="flex items-start gap-3 text-sm"><Clock className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium">Atendimento</div><div className="text-muted-foreground">{contactHours}</div></div></div>
              </CardContent>
            </Card>
            <a href={whatsappLink} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-accent text-accent-foreground p-5 font-semibold shadow-card hover:opacity-90 transition">
              <MessageCircle className="h-5 w-5" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl overflow-hidden shadow-card border border-border">
            <iframe
              title="Mapa Elderly"
              src={`https://www.google.com/maps?q=${mapAddress}&output=embed`}
              className="w-full h-80 border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
