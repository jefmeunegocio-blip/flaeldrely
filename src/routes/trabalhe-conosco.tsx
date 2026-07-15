import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Heart, GraduationCap, Sparkles, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/SectionHeading";

export const Route = createFileRoute("/trabalhe-conosco")({
  head: () => ({
    meta: [
      { title: "Trabalhe Conosco — Elderly | Carreiras" },
      { name: "description", content: "Faça parte da Elderly. Vagas para cuidadores com propósito, capacitação e ambiente humano." },
      { property: "og:title", content: "Trabalhe Conosco — Elderly" },
      { property: "og:description", content: "Junte-se à nossa equipe de cuidadores." },
    ],
  }),
  component: Trabalhe,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  experiencia: z.string().trim().min(10, "Descreva brevemente sua experiência").max(1000),
});

const benefits = [
  { icon: Heart, title: "Propósito real", desc: "Faça a diferença na vida de famílias todos os dias." },
  { icon: GraduationCap, title: "Capacitação contínua", desc: "Treinamentos e desenvolvimento profissional." },
  { icon: Sparkles, title: "Ambiente humano", desc: "Cultura de respeito, apoio e crescimento." },
  { icon: Users, title: "Equipe acolhedora", desc: "Suporte técnico e emocional em todas as etapas." },
];

function Trabalhe() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", experiencia: "" });
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setLoading(true);
    try {
      console.log("[Elderly/Trabalhe] candidatura", { ...parsed.data, currículo: file?.name });
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Candidatura enviada! Entraremos em contato em breve.");
      setForm({ nome: "", telefone: "", email: "", experiencia: "" });
      setFile(null);
    } catch (err) {
      console.error("[Elderly/Trabalhe] erro", err);
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-hero py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold">Cuide com propósito. Cresça com a Elderly.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Procuramos cuidadores apaixonados por fazer a diferença na vida dos idosos e de suas famílias.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Benefícios" title="Por que trabalhar na Elderly" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <Card key={b.title} className="shadow-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center mb-4">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-1">{b.title}</h4>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="text-xl font-semibold mb-4">Requisitos</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {["Curso de cuidador ou técnico em enfermagem", "Experiência com idosos", "Empatia e responsabilidade", "Disponibilidade de horários", "Boas referências profissionais", "Documentação em dia"].map((r) => (
              <li key={r} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5" /> {r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading eyebrow="Candidatura" title="Envie seus dados" />
          <Card className="shadow-soft">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" inputMode="tel" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="experiencia">Experiência</Label>
                  <Textarea id="experiencia" rows={4} value={form.experiencia} onChange={(e) => setForm({ ...form, experiencia: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="cv">Currículo (PDF)</Label>
                  <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar candidatura"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
