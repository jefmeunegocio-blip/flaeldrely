import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Target, Eye, Award, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/SectionHeading";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Empresa — Elderly | Quem somos" },
      { name: "description", content: "Conheça a Elderly: nossa história, missão, valores e o compromisso com cuidado humanizado para idosos." },
      { property: "og:title", content: "Empresa — Elderly" },
      { property: "og:description", content: "Nossa missão é cuidar com dignidade, profissionalismo e amor." },
    ],
  }),
  component: Empresa,
});

const values = [
  { icon: HeartHandshake, title: "Humanização", desc: "Cada pessoa é única e merece atenção plena." },
  { icon: ShieldCheck, title: "Confiança", desc: "Transparência e segurança em todas as relações." },
  { icon: Award, title: "Excelência", desc: "Padrões elevados de qualidade no cuidado." },
  { icon: Users, title: "Família", desc: "Acolhemos como se fosse da nossa casa." },
];

const stats = [
  { value: "10+", label: "anos de experiência" },
  { value: "500+", label: "famílias atendidas" },
  { value: "120+", label: "cuidadores ativos" },
  { value: "4.9/5", label: "satisfação média" },
];

function Empresa() {
  return (
    <>
      <section className="bg-gradient-hero py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-4">
            Sobre nós
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold">Cuidar é a nossa vocação</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Há mais de uma década, a Elderly conecta famílias a profissionais
            preparados para oferecer um cuidado verdadeiramente humano.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <Target className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Nossa missão</h3>
              <p className="text-muted-foreground">
                Promover dignidade, conforto e bem-estar a idosos através de cuidados
                profissionais e afetuosos, fortalecendo o apoio às famílias.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-8">
              <Eye className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Nossa visão</h3>
              <p className="text-muted-foreground">
                Ser referência nacional em cuidado humanizado, transformando a forma
                como o envelhecimento é vivido no Brasil.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Nossos valores" title="O que nos guia todos os dias" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="shadow-card hover:-translate-y-1 transition-transform">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/20 text-accent-foreground inline-flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-1">{v.title}</h4>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center rounded-2xl bg-background shadow-card p-6">
              <div className="text-3xl sm:text-4xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
