import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HeartHandshake,
  GraduationCap,
  Users,
  ShieldCheck,
  Home as HomeIcon,
  Clock,
  PhoneCall,
  ClipboardList,
  Stethoscope,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-caregiver.jpg";
import { ServiceSimulator } from "@/components/sections/ServiceSimulator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elderly — Cuidado humanizado para quem mais importa" },
      { name: "description", content: "Profissionais qualificados oferecem conforto, segurança e atenção especializada aos idosos. Atendimento domiciliar, hospitalar e contínuo." },
      { property: "og:title", content: "Elderly — Cuidado humanizado para idosos" },
      { property: "og:description", content: "Conforto, segurança e atenção especializada para sua família." },
    ],
  }),
  component: Home,
});

const benefits = [
  { icon: HeartHandshake, title: "Atendimento humanizado", desc: "Acolhimento, empatia e respeito em cada cuidado prestado." },
  { icon: GraduationCap, title: "Profissionais capacitados", desc: "Equipe treinada e certificada em cuidados com idosos." },
  { icon: Users, title: "Suporte familiar", desc: "Acompanhamento e orientação contínua para toda a família." },
  { icon: ShieldCheck, title: "Segurança e confiança", desc: "Protocolos rigorosos e profissionais verificados." },
  { icon: HomeIcon, title: "Atendimento domiciliar", desc: "Cuidado completo no conforto da própria casa." },
  { icon: Clock, title: "Disponibilidade flexível", desc: "Plantões, períodos parciais e 24h conforme a necessidade." },
];

const steps = [
  { icon: PhoneCall, title: "Entre em contato", desc: "Conte-nos sobre as necessidades do seu familiar." },
  { icon: ClipboardList, title: "Escolha o atendimento ideal", desc: "Montamos um plano personalizado de cuidados." },
  { icon: Stethoscope, title: "Receba cuidado especializado", desc: "Profissional preparado vai até sua casa com excelência." },
];

const testimonials = [
  { name: "Marina Souza", role: "Filha de paciente", text: "Profissionalismo e carinho que mudaram a rotina da minha mãe. Recomendo de olhos fechados.", img: "https://i.pravatar.cc/120?img=47" },
  { name: "Ricardo Lima", role: "Familiar", text: "Atendimento impecável e equipe muito atenciosa. Sentimos verdadeira segurança.", img: "https://i.pravatar.cc/120?img=12" },
  { name: "Clarice Mendes", role: "Filha de paciente", text: "Mais que cuidadores, ganhamos uma extensão da família. Gratidão imensa.", img: "https://i.pravatar.cc/120?img=32" },
];

function Home() {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      return data;
    },
  });
  const currentHero = settings?.hero_image_url || heroImg;
  const s = (settings ?? {}) as Record<string, string | null>;
  const testimonialPhotos = [
    s.testimonial_1_image_url,
    s.testimonial_2_image_url,
    s.testimonial_3_image_url,
  ];
  const testimonialOverrides = [
    { name: s.testimonial_1_name, role: s.testimonial_1_role, text: s.testimonial_1_text },
    { name: s.testimonial_2_name, role: s.testimonial_2_role, text: s.testimonial_2_text },
    { name: s.testimonial_3_name, role: s.testimonial_3_role, text: s.testimonial_3_text },
  ];
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-5">
              Cuidado profissional · Atenção familiar
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
              Cuidado humanizado para quem mais importa
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Profissionais qualificados para oferecer conforto, segurança e atenção
              especializada aos idosos — onde e quando sua família precisar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link to="/contato">Solicitar Atendimento <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/trabalhe-conosco">Trabalhe Conosco</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent" /> Profissionais verificados</div>
              <div className="hidden sm:flex items-center gap-2"><Star className="h-5 w-5 text-accent" /> 4.9/5 de avaliação</div>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
            <img
              src={currentHero}
              alt="Cuidadora sorrindo e segurando as mãos de uma idosa em ambiente acolhedor"
              width={1536}
              height={1152}
              className="relative rounded-3xl shadow-soft object-cover w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* SERVICE SIMULATOR */}
      <ServiceSimulator />

      {/* BENEFITS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Por que a Elderly"
            title="Cuidado completo, pensado para sua família"
            subtitle="Profissionais especializados e processos transparentes para garantir o melhor atendimento."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <Card key={b.title} className="shadow-card hover:-translate-y-1 hover:shadow-soft transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center mb-4">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Como funciona" title="Simples, rápido e seguro" />
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.title} className="relative bg-background rounded-2xl p-6 shadow-card">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="h-12 w-12 rounded-xl bg-accent/20 text-accent-foreground inline-flex items-center justify-center mb-4 mt-2">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Depoimentos" title="Famílias que confiam na Elderly" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => {
              const ov = testimonialOverrides[idx];
              const name = ov.name || t.name;
              const role = ov.role || t.role;
              const text = ov.text || t.text;
              return (
                <Card key={name} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 text-accent mb-3">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-foreground/90 mb-5">"{text}"</p>
                    <div className="flex items-center gap-3">
                      <img src={testimonialPhotos[idx] || t.img} alt={name} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="text-xs text-muted-foreground">{role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary text-primary-foreground p-10 sm:p-14 text-center shadow-soft">
            <h2 className="text-3xl sm:text-4xl font-bold">Seu familiar merece o melhor cuidado.</h2>
            <p className="mt-3 text-primary-foreground/90 max-w-2xl mx-auto">
              Fale com nossa equipe e receba um plano de cuidados personalizado em até 24h.
            </p>
            <div className="mt-7">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contato">Solicitar atendimento</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
