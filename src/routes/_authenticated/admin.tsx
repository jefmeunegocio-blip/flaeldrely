import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, LogOut, ImageIcon, Save, UserPlus, MessageSquareQuote, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useServerFn } from "@tanstack/react-start";
import { grantAdminByEmail, saveContactSettings } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel administrativo — Elderly" }] }),
  component: AdminPage,
});

const SIGNED_URL_TTL = 60 * 60 * 24 * 365;

type SlotKey =
  | "hero_image_url"
  | "logo_url"
  | "testimonial_1_image_url"
  | "testimonial_2_image_url"
  | "testimonial_3_image_url";

type Slot = {
  key: SlotKey;
  label: string;
  folder: string;
  hint: string;
  aspect: string;
};

const SLOTS: Slot[] = [
  { key: "logo_url", label: "Logo do site", folder: "logo", hint: "PNG transparente recomendado. Altura ideal: 64px.", aspect: "aspect-[3/1]" },
  { key: "hero_image_url", label: "Imagem do hero (página inicial)", folder: "hero", hint: "Recomendado 1536×1152px. Máx. 8MB.", aspect: "aspect-[4/3]" },
  { key: "testimonial_1_image_url", label: "Foto — Depoimento 1", folder: "testimonials", hint: "Foto quadrada. Recomendado 240×240px.", aspect: "aspect-square" },
  { key: "testimonial_2_image_url", label: "Foto — Depoimento 2", folder: "testimonials", hint: "Foto quadrada. Recomendado 240×240px.", aspect: "aspect-square" },
  { key: "testimonial_3_image_url", label: "Foto — Depoimento 3", folder: "testimonials", hint: "Foto quadrada. Recomendado 240×240px.", aspect: "aspect-square" },
];

type TestimonialFields = {
  name: string;
  role: string;
  text: string;
};

type ContactFields = {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  hours: string;
};

const EMPTY_T: TestimonialFields = { name: "", role: "", text: "" };
const EMPTY_CONTACT: ContactFields = {
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  hours: "",
};

async function persistSiteSettings(payload: Record<string, unknown>) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        updated_at: new Date().toISOString(),
        updated_by: userData.user?.id ?? null,
        ...payload,
      } as never,
      { onConflict: "id" },
    );

  if (error) throw error;
}

function getContactFromSettings(settings: Record<string, unknown> | null | undefined): ContactFields {
  const contentContact = ((settings?.content as Record<string, unknown> | null)?.contact as Record<string, string | null> | undefined) ?? {};

  return {
    phone: (settings?.phone as string | null) ?? contentContact.phone ?? "",
    email: (settings?.email as string | null) ?? contentContact.email ?? "",
    address: (settings?.address as string | null) ?? contentContact.address ?? "",
    whatsapp: (settings?.whatsapp as string | null) ?? contentContact.whatsapp ?? "",
    instagram: (settings?.instagram as string | null) ?? contentContact.instagram ?? "",
    facebook: (settings?.facebook as string | null) ?? contentContact.facebook ?? "",
    linkedin: (settings?.linkedin as string | null) ?? contentContact.linkedin ?? "",
    hours: (settings?.hours as string | null) ?? contentContact.hours ?? "",
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [urls, setUrls] = useState<Record<SlotKey, string | null>>({
    hero_image_url: null,
    logo_url: null,
    testimonial_1_image_url: null,
    testimonial_2_image_url: null,
    testimonial_3_image_url: null,
  });
  const [testimonials, setTestimonials] = useState<[TestimonialFields, TestimonialFields, TestimonialFields]>([
    { ...EMPTY_T }, { ...EMPTY_T }, { ...EMPTY_T },
  ]);
  const [contact, setContact] = useState<ContactFields>({ ...EMPTY_CONTACT });
  const [savingT, setSavingT] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [busy, setBusy] = useState<SlotKey | null>(null);

  const [grantEmail, setGrantEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const grantFn = useServerFn(grantAdminByEmail);
  const saveContactFn = useServerFn(saveContactSettings);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);

      const { data: settings, error: settingsError } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (settingsError) {
        console.error(settingsError);
        return;
      }
      if (!settings) {
        await persistSiteSettings({});
        return;
      }

      setUrls({
        hero_image_url: settings.hero_image_url ?? null,
        logo_url: settings.logo_url ?? null,
        testimonial_1_image_url: settings.testimonial_1_image_url ?? null,
        testimonial_2_image_url: settings.testimonial_2_image_url ?? null,
        testimonial_3_image_url: settings.testimonial_3_image_url ?? null,
      });
      const s = settings as unknown as Record<string, string | null>;
      setTestimonials([
        { name: s.testimonial_1_name ?? "", role: s.testimonial_1_role ?? "", text: s.testimonial_1_text ?? "" },
        { name: s.testimonial_2_name ?? "", role: s.testimonial_2_role ?? "", text: s.testimonial_2_text ?? "" },
        { name: s.testimonial_3_name ?? "", role: s.testimonial_3_role ?? "", text: s.testimonial_3_text ?? "" },
      ]);
      setContact(getContactFromSettings(settings as Record<string, unknown> | null));
    })();
  }, [navigate]);

  const handleFile = async (slot: Slot, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máx. 8MB)");
      return;
    }
    setBusy(slot.key);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${slot.folder}/${slot.key}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;

      const { data: signed, error: sErr } = await supabase.storage
        .from("site-assets")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (sErr || !signed) throw sErr ?? new Error("URL não gerada");

      const payload: Record<string, string> = {};
      payload[slot.key] = signed.signedUrl;
      await persistSiteSettings(payload);

      setUrls((u) => ({ ...u, [slot.key]: signed.signedUrl }));
      toast.success(`${slot.label} atualizado!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Falha no upload");
    } finally {
      setBusy(null);
    }
  };

  const handleRemove = async (slot: Slot) => {
    if (!confirm(`Remover ${slot.label}?`)) return;
    setBusy(slot.key);
    try {
      const payload: Record<string, null> = {};
      payload[slot.key] = null;
      await persistSiteSettings(payload);
      setUrls((u) => ({ ...u, [slot.key]: null }));
      toast.success(`${slot.label} removido!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Falha ao remover");
    } finally {
      setBusy(null);
    }
  };

  const saveTestimonials = async () => {
    setSavingT(true);
    try {
      const payload: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
        testimonial_1_name: testimonials[0].name || null,
        testimonial_1_role: testimonials[0].role || null,
        testimonial_1_text: testimonials[0].text || null,
        testimonial_2_name: testimonials[1].name || null,
        testimonial_2_role: testimonials[1].role || null,
        testimonial_2_text: testimonials[1].text || null,
        testimonial_3_name: testimonials[2].name || null,
        testimonial_3_role: testimonials[2].role || null,
        testimonial_3_text: testimonials[2].text || null,
      };
      await persistSiteSettings(payload);
      toast.success("Depoimentos atualizados!");
    } catch (err: any) {
      toast.error(err?.message ?? "Falha ao salvar");
    } finally {
      setSavingT(false);
    }
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGranting(true);
    try {
      const res = await grantFn({ data: { email: grantEmail.trim() } });
      toast.success(`${res.email} agora é administrador.`);
      setGrantEmail("");
    } catch (err: any) {
      toast.error(err?.message ?? "Falha ao conceder acesso");
    } finally {
      setGranting(false);
    }
  };

  const updateT = (i: 0 | 1 | 2, field: keyof TestimonialFields, value: string) => {
    setTestimonials((prev) => {
      const next = [...prev] as [TestimonialFields, TestimonialFields, TestimonialFields];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const updateContact = (field: keyof ContactFields, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const saveContact = async () => {
    setSavingContact(true);
    try {
      await saveContactFn({
        data: {
          contact: {
            phone: contact.phone || null,
            email: contact.email || null,
            address: contact.address || null,
            whatsapp: contact.whatsapp || null,
            instagram: contact.instagram || null,
            facebook: contact.facebook || null,
            linkedin: contact.linkedin || null,
            hours: contact.hours || null,
          },
        },
      });
      toast.success("Dados de contato atualizados!");
    } catch (err: any) {
      console.error("[Admin/Contact] save error", err);
      toast.error(err?.message ?? "Falha ao salvar os dados de contato");
    } finally {
      setSavingContact(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <div className="min-h-[60vh] grid place-items-center text-muted-foreground">Carregando…</div>;
  }

  if (!isAdmin) {
    return (
      <section className="min-h-[60vh] grid place-items-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold mb-2">Acesso restrito</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua conta não tem permissão de administrador.
            </p>
            <Button variant="outline" onClick={signOut}>Sair</Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel administrativo</h1>
            <p className="text-sm text-muted-foreground">Gerencie o conteúdo do site.</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Imagens</h2>
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {SLOTS.map((slot) => (
            <SlotCard
              key={slot.key}
              slot={slot}
              url={urls[slot.key]}
              busy={busy === slot.key}
              onFile={(f) => handleFile(slot, f)}
              onRemove={() => handleRemove(slot)}
            />
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquareQuote className="h-5 w-5 text-primary" /> Depoimentos (textos)
        </h2>
        <Card className="shadow-soft mb-12">
          <CardContent className="p-6 space-y-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="space-y-3 pb-6 border-b last:border-b-0 last:pb-0">
                <h3 className="font-semibold text-sm text-muted-foreground">Depoimento {idx + 1}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`t${idx}-name`}>Nome</Label>
                    <Input
                      id={`t${idx}-name`}
                      value={t.name}
                      placeholder="Ex.: Marina Souza"
                      onChange={(e) => updateT(idx as 0 | 1 | 2, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`t${idx}-role`}>Relação / Função</Label>
                    <Input
                      id={`t${idx}-role`}
                      value={t.role}
                      placeholder="Ex.: Filha de paciente"
                      onChange={(e) => updateT(idx as 0 | 1 | 2, "role", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`t${idx}-text`}>Depoimento</Label>
                  <Textarea
                    id={`t${idx}-text`}
                    rows={3}
                    value={t.text}
                    placeholder="O que a família escreveu sobre o serviço..."
                    onChange={(e) => updateT(idx as 0 | 1 | 2, "text", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button onClick={saveTestimonials} disabled={savingT}>
                <Save className="h-4 w-4 mr-2" />
                {savingT ? "Salvando…" : "Salvar depoimentos"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" /> Dados de contato
        </h2>
        <Card className="shadow-soft mb-12">
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contact-phone">Telefone</Label>
                <Input
                  id="contact-phone"
                  value={contact.phone}
                  onChange={(e) => updateContact("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact-email">E-mail</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contact-address">Endereço</Label>
                <Input
                  id="contact-address"
                  value={contact.address}
                  onChange={(e) => updateContact("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                <Input
                  id="contact-whatsapp"
                  value={contact.whatsapp}
                  onChange={(e) => updateContact("whatsapp", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact-hours">Horário</Label>
                <Input
                  id="contact-hours"
                  value={contact.hours}
                  onChange={(e) => updateContact("hours", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact-instagram">Instagram</Label>
                <Input
                  id="contact-instagram"
                  value={contact.instagram}
                  onChange={(e) => updateContact("instagram", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact-facebook">Facebook</Label>
                <Input
                  id="contact-facebook"
                  value={contact.facebook}
                  onChange={(e) => updateContact("facebook", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contact-linkedin">LinkedIn</Label>
                <Input
                  id="contact-linkedin"
                  value={contact.linkedin}
                  onChange={(e) => updateContact("linkedin", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveContact} disabled={savingContact}>
                <Save className="h-4 w-4 mr-2" />
                {savingContact ? "Salvando…" : "Salvar dados de contato"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" /> Adicionar administrador
        </h2>
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              O usuário precisa ter criado uma conta no site antes. Informe o e-mail dele para conceder acesso de administrador.
            </p>
            <form onSubmit={handleGrantAdmin} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                placeholder="email@exemplo.com"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
              />
              <Button type="submit" disabled={granting}>
                <UserPlus className="h-4 w-4 mr-2" />
                {granting ? "Concedendo…" : "Tornar admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SlotCard({
  slot,
  url,
  busy,
  onFile,
  onRemove,
}: {
  slot: Slot;
  url: string | null;
  busy: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">{slot.label}</h2>
        </div>
        <div className={`rounded-2xl border bg-secondary/30 overflow-hidden mb-4 ${slot.aspect} flex items-center justify-center`}>
          {url ? (
            <img src={url} alt={slot.label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-muted-foreground px-3 text-center">Nenhuma imagem personalizada.</span>
          )}
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            if (ref.current) ref.current.value = "";
          }}
        />
        <div className="flex gap-2">
          <Button onClick={() => ref.current?.click()} disabled={busy} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            {busy ? "Enviando…" : url ? "Substituir" : "Enviar imagem"}
          </Button>
          {url && (
            <Button
              type="button"
              variant="outline"
              onClick={onRemove}
              disabled={busy}
              aria-label={`Remover ${slot.label}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">{slot.hint}</p>
      </CardContent>
    </Card>
  );
}
