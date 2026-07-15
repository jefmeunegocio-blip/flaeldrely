import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Hospital, CalendarClock, Activity, UserCheck, ShieldCheck, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/SectionHeading";

export const Route = createFileRoute("/cuidador")({
  head: () => ({
    meta: [
      { title: "Cuidador — Elderly | Nossos serviços" },
      { name: "description", content: "Cuidados domiciliares, acompanhamento hospitalar, atendimento contínuo e personalizado para idosos." },
      { property: "og:title", content: "Cuidador — Elderly" },
      { property: "og:description", content: "Serviços completos de cuidado especializado para idosos." },
    ],
  }),
  component: Cuidador,
});

const services = [
  { icon: Home, title: "Cuidados domiciliares", desc: "Apoio diário no conforto do lar com atenção integral." },
  { icon: Hospital, title: "Acompanhamento hospitalar", desc: "Presença qualificada durante internações e procedimentos." },
  { icon: CalendarClock, title: "Cuidados temporários", desc: "Plantões e períodos sob demanda conforme necessidade." },
  { icon: Activity, title: "Cuidados contínuos", desc: "Acompanhamento 24h com equipe revezada e supervisão." },
  { icon: UserCheck, title: "Atendimento personalizado", desc: "Plano de cuidados feito sob medida para cada paciente." },
];

const trust = [
  { icon: ShieldCheck, label: "Profissionais verificados" },
  { icon: Award, label: "Equipe certificada" },
  { icon: Clock, label: "Disponibilidade 24h" },
];

const faqs = [
  { q: "Como funciona o primeiro atendimento?", a: "Realizamos uma avaliação inicial gratuita para entender as necessidades e elaborar um plano de cuidados personalizado." },
  { q: "Os cuidadores são treinados?", a: "Sim. Toda a equipe passa por seleção rigorosa, treinamento contínuo e supervisão técnica." },
  { q: "É possível trocar de cuidador?", a: "Sim. Garantimos sintonia com a família — se necessário, fazemos a substituição com agilidade." },
  { q: "Atendem em qual região?", a: "Atendemos toda a região metropolitana. Consulte disponibilidade pelo nosso contato." },
];

function Cuidador() {
  return (
    <>
      <section className="bg-gradient-hero py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold">Serviços de cuidado especializados</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Soluções completas para cada momento — do acompanhamento pontual ao cuidado contínuo.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Nossos serviços" title="Cuidado para cada necessidade" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.title} className="shadow-card hover:-translate-y-1 transition-transform">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center mb-4">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 grid sm:grid-cols-3 gap-4">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-3 bg-background rounded-2xl p-5 shadow-card">
              <t.icon className="h-6 w-6 text-primary" />
              <span className="font-medium">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <Button asChild size="lg"><Link to="/contato">Falar com a equipe</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
