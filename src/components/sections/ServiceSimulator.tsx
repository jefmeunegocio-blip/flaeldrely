import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Calendar, 
  Moon, 
  Sun, 
  Award,
  ArrowRight,
  Smile,
  UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const profiles = [
  {
    id: "companhia",
    title: "Companhia & Auxílio Leve",
    desc: "Idoso independente que necessita de companhia para atividades, caminhadas, consultas ou lembrete de medicações.",
    icon: Smile,
    color: "bg-primary/10 text-primary border-primary/20",
    activeColor: "ring-2 ring-primary bg-primary/5 border-primary"
  },
  {
    id: "moderado",
    title: "Assistência Moderada",
    desc: "Idoso com limitações físicas leves, precisando de auxílio com banho, mobilidade, preparo de refeições e rotina diária.",
    icon: UserCheck,
    color: "bg-primary/10 text-primary border-primary/20",
    activeColor: "ring-2 ring-primary bg-primary/5 border-primary"
  },
  {
    id: "avancado",
    title: "Cuidado Especializado / Acamado",
    desc: "Idoso com alta dependência, restrito ao leito ou necessitando de cuidados especiais como curativos, sondas e higiene completa.",
    icon: Activity,
    color: "bg-primary/10 text-primary border-primary/20",
    activeColor: "ring-2 ring-primary bg-primary/5 border-primary"
  },
  {
    id: "demencia",
    title: "Alzheimer ou Demências",
    desc: "Idoso diagnosticado com quadro demencial, necessitando de estimulação cognitiva, paciência, supervisão integral e afeto.",
    icon: Heart,
    color: "bg-accent/10 text-accent border-accent/20",
    activeColor: "ring-2 ring-accent bg-accent/5 border-accent"
  }
];

const periods = [
  {
    id: "parcial",
    title: "Período Parcial (4h a 6h)",
    desc: "Ideal para auxílio em horários específicos, como refeições, banho ou passeios pontuais.",
    icon: Sun,
  },
  {
    id: "integral",
    title: "Plantão 12h (Diurno ou Noturno)",
    desc: "Cobertura completa para o dia ou para a noite, garantindo segurança contínua.",
    icon: Clock,
  },
  {
    id: "continuo",
    title: "Acompanhamento 24h",
    desc: "Suporte completo ininterrupto, com equipe qualificada em regime de revezamento.",
    icon: ShieldCheck,
  },
  {
    id: "fds",
    title: "Apenas Fins de Semana",
    desc: "Descanso familiar ou suporte pontual para garantir que o idoso nunca fique só.",
    icon: Calendar,
  }
];

const planRecommendations = {
  companhia: {
    name: "Plano Conectividade & Bem-Estar",
    desc: "Focado em qualidade de vida, estimulação mental e acompanhamento social ativo. O cuidador atua como um companheiro dedicado.",
    benefits: [
      "Companhia para conversas, leitura e atividades manuais",
      "Estímulo cognitivo leve e caminhadas seguras",
      "Acompanhamento em consultas médicas e exames",
      "Organização e lembrete pontual de medicamentos de uso contínuo",
      "Preparação de pequenos lanches nutritivos"
    ],
    highlight: "Companhia afetuosa"
  },
  moderado: {
    name: "Plano Assistência Ativa",
    desc: "Ideal para idosos que desejam manter sua autonomia mas precisam de suporte físico seguro e supervisão diária dedicada.",
    benefits: [
      "Auxílio seguro para banho, higiene pessoal e vestimenta",
      "Suporte na locomoção segura para evitar quedas dentro de casa",
      "Preparo de refeições saudáveis prescritas pelo nutricionista",
      "Administração rigorosa de medicamentos nos horários corretos",
      "Estímulo à realização de exercícios recomendados por fisioterapeuta"
    ],
    highlight: "Autonomia com segurança"
  },
  avancado: {
    name: "Plano Cuidado Integral",
    desc: "Suporte especializado para idosos acamados, em reabilitação pós-cirúrgica ou com limitações de saúde muito severas.",
    benefits: [
      "Mudança de decúbito frequente para prevenção de lesões por pressão (escaras)",
      "Banho no leito e higiene corporal minuciosa",
      "Auxílio na alimentação via sondas ou dietas pastosas com paciência",
      "Monitoramento constante de sinais vitais (pressão, glicemia, saturação)",
      "Acompanhamento e suporte pós-alta hospitalar recente"
    ],
    highlight: "Supervisão técnica dedicada"
  },
  demencia: {
    name: "Plano Estímulo & Proteção Cognitiva",
    desc: "Desenvolvido especificamente para lidar com as flutuações de humor e comportamento típicas de quadros demenciais, garantindo afeto e paciência.",
    benefits: [
      "Abordagem afetuosa baseada em paciência, empatia e sem confrontos",
      "Jogos cognitivos, atividades de memória e estímulo musical personalizado",
      "Supervisão vigilante 100% do tempo para evitar desorientação ou fuga",
      "Criação e manutenção de uma rotina estruturada de sono e alimentação",
      "Suporte familiar com orientações sobre como conviver melhor com a condição"
    ],
    highlight: "Cuidado especializado em demências"
  }
};

export function ServiceSimulator() {
  const [selectedProfile, setSelectedProfile] = useState("companhia");
  const [selectedPeriod, setSelectedPeriod] = useState("parcial");
  const [recommendation, setRecommendation] = useState(planRecommendations.companhia);

  useEffect(() => {
    const key = selectedProfile as keyof typeof planRecommendations;
    setRecommendation(planRecommendations[key] || planRecommendations.companhia);
  }, [selectedProfile]);

  const activeProfileData = profiles.find(p => p.id === selectedProfile);
  const activePeriodData = periods.find(p => p.id === selectedPeriod);

  // Pre-formatted message query parameters
  const getContactLink = () => {
    const profileText = activeProfileData?.title || "";
    const periodText = activePeriodData?.title || "";
    const planName = recommendation.name;
    return `/contato?plano=${encodeURIComponent(planName)}&perfil=${encodeURIComponent(profileText)}&periodo=${encodeURIComponent(periodText)}`;
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-background to-secondary/30" id="service-simulator">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-4">
            Simulador de Atendimento
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Encontre o plano de cuidados perfeito para seu familiar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecione o perfil do idoso e a frequência necessária para ver nossa recomendação ideal instantaneamente.
          </p>
        </div>

        {/* Wizard Main Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Selector Options Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  1
                </span>
                <h3 className="text-xl font-bold text-foreground">Como você descreveria o perfil do idoso?</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {profiles.map((p) => {
                  const Icon = p.icon;
                  const isActive = selectedProfile === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProfile(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedProfile(p.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`text-left rounded-2xl border p-5 transition-all duration-300 outline-none hover:shadow-md cursor-pointer ${
                        isActive 
                          ? `${p.activeColor} shadow-soft` 
                          : "bg-background border-border hover:border-primary/40"
                      }`}
                      id={`btn-profile-${p.id}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl transition-colors ${p.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{p.title}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  2
                </span>
                <h3 className="text-xl font-bold text-foreground">Qual o período de cuidado ideal?</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {periods.map((p) => {
                  const Icon = p.icon;
                  const isActive = selectedPeriod === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPeriod(p.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`text-left rounded-2xl border p-5 transition-all duration-300 outline-none hover:shadow-md cursor-pointer ${
                        isActive 
                          ? "ring-2 ring-primary bg-primary/5 border-primary shadow-soft" 
                          : "bg-background border-border hover:border-primary/40"
                      }`}
                      id={`btn-period-${p.id}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl bg-primary/10 text-primary`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{p.title}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Recommendation Plan Output Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Card className="border-2 border-primary/20 shadow-soft overflow-hidden rounded-3xl">
              <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-bold tracking-wide uppercase text-xs">RECOMENDAÇÃO DE PLANO</span>
                </div>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {recommendation.highlight}
                </span>
              </div>
              
              <CardContent className="p-6 sm:p-8 space-y-6 bg-background">
                <div>
                  <h3 className="text-2xl font-bold text-foreground leading-tight">
                    {recommendation.name}
                  </h3>
                  <div className="mt-2 text-xs text-primary font-semibold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Frequência sugerida: {activePeriodData?.title}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed border-b border-border pb-4">
                  {recommendation.desc}
                </p>

                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    O que está incluso neste atendimento:
                  </h4>
                  <ul className="space-y-3">
                    {recommendation.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Button asChild size="lg" className="w-full text-base font-semibold group py-6 rounded-2xl">
                    <Link to={getContactLink()}>
                      Solicitar este Atendimento
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground mt-3">
                    Você será direcionado ao formulário com sua escolha pré-preenchida.
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
}
