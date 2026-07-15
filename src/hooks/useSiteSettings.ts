import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Exact static default fallback structure to avoid breaking visual components
export const DEFAULT_SITE_SETTINGS = {
  logo: {
    type: "text",
    text: "Elderly",
    imageUrl: "",
    height: "h-9",
    alignment: "justify-start"
  },
  theme: {
    primary: "#1A8F8A",
    accent: "#D64545",
    secondary: "#F3F4F6",
    fontName: "Inter",
    fontSize: "16"
  },
  contact: {
    phone: "(11) 91041-9073",
    email: "elderlycuidados@hotmail.com",
    address: "Rua: Cachoeira Poraquê, 281",
    whatsapp: "https://wa.me/5511910419073",
    instagram: "https://instagram.com/elderly",
    facebook: "https://facebook.com/elderly",
    linkedin: "https://linkedin.com/company/elderly",
    hours: "Seg a Sex: 8h–20h · Sáb: 9h–14h",
    mapsUrl: "https://www.google.com/maps?q=Rua%20Cachoeira%20Poraqu%C3%AA%2C%20281&output=embed"
  },
  seo: {
    home: {
      title: "Elderly — Cuidado humanizado para quem mais importa",
      description: "Profissionais qualificados oferecem conforto, segurança e atenção especializada aos idosos. Atendimento domiciliar, hospitalar e contínuo."
    },
    empresa: {
      title: "Empresa — Elderly | Quem somos",
      description: "Conheça a Elderly: nossa história, missão, valores e o compromisso com cuidado humanizado para idosos."
    },
    cuidador: {
      title: "Cuidador — Elderly | Nossos serviços",
      description: "Cuidados domiciliares, acompanhamento hospitalar, atendimento contínuo e personalizado para idosos."
    },
    trabalhe: {
      title: "Trabalhe Conosco — Elderly | Carreiras",
      description: "Faça parte da Elderly. Vagas para cuidadores com propósito, capacitação e ambiente humano."
    },
    contato: {
      title: "Contato — Elderly",
      description: "Fale com a Elderly: telefone, WhatsApp, e-mail, endereço e formulário de contato."
    }
  },
  sectionsVisibility: {
    homeHero: true,
    homeBenefits: true,
    homeSteps: true,
    homeTestimonials: true,
    homeCta: true,
    cuidadorHero: true,
    cuidadorServices: true,
    cuidadorTrust: true,
    cuidadorFaq: true,
    empresaHero: true,
    empresaMission: true,
    empresaVision: true,
    empresaValues: true,
    empresaStats: true
  },
  home: {
    hero: {
      badge: "Cuidado profissional · Atenção familiar",
      title: "Cuidado humanizado para quem mais importa",
      description: "Profissionais qualificados para oferecer conforto, segurança e atenção especializada aos idosos — onde e quando sua família precisar.",
      btn1Text: "Solicitar Atendimento",
      btn2Text: "Trabalhe Conosco",
      trustVerify: "Profissionais verificados",
      trustRating: "4.9/5 de avaliação",
      imageUrl: ""
    },
    benefits: {
      eyebrow: "Por que a Elderly",
      title: "Cuidado completo, pensado para sua família",
      subtitle: "Profissionais especializados e processos transparentes para garantir o melhor atendimento.",
      items: [
        { icon: "HeartHandshake", title: "Atendimento humanizado", desc: "Acolhimento, empatia e respeito em cada cuidado prestado." },
        { icon: "GraduationCap", title: "Profissionais capacitados", desc: "Equipe treinada e certificada em cuidados com idosos." },
        { icon: "Users", title: "Suporte familiar", desc: "Acompanhamento e orientação contínua para toda a família." },
        { icon: "ShieldCheck", title: "Segurança e confiança", desc: "Protocolos rigorosos e profissionais verificados." },
        { icon: "HomeIcon", title: "Atendimento domiciliar", desc: "Cuidado completo no conforto da própria casa." },
        { icon: "Clock", title: "Disponibilidade flexível", desc: "Plantões, períodos parciais e 24h conforme a necessidade." }
      ]
    },
    steps: {
      eyebrow: "Como funciona",
      title: "Simples, rápido e seguro",
      items: [
        { icon: "PhoneCall", title: "Entre em contato", desc: "Conte-nos sobre as necessidades do seu familiar." },
        { icon: "ClipboardList", "title": "Escolha o atendimento ideal", desc: "Montamos um plano personalizado de cuidados." },
        { icon: "Stethoscope", "title": "Receba cuidado especializado", desc: "Profissional preparado vai até sua casa com excelência." }
      ]
    },
    testimonials: {
      eyebrow: "Depoimentos",
      title: "Famílias que confiam na Elderly",
      items: [
        { name: "Marina Souza", role: "Filha de paciente", text: "Profissionalismo e carinho que mudaram a rotina da minha mãe. Recomendo de olhos fechados.", img: "https://i.pravatar.cc/120?img=47" },
        { name: "Ricardo Lima", role: "Familiar", text: "Atendimento impecável e equipe muito atenciosa. Sentimos verdadeira segurança.", img: "https://i.pravatar.cc/120?img=12" },
        { name: "Clarice Mendes", role: "Filha de paciente", text: "Mais que cuidadores, ganhamos uma extensão da família. Gratidão imensa.", img: "https://i.pravatar.cc/120?img=32" }
      ]
    },
    cta: {
      title: "Seu familiar merece o melhor cuidado.",
      subtitle: "Fale com nossa equipe e receba um plano de cuidados personalizado em até 24h.",
      btnText: "Solicitar atendimento"
    }
  },
  cuidador: {
    hero: {
      title: "Serviços de cuidado especializados",
      description: "Soluções completas para cada momento — do acompanhamento pontual ao cuidado contínuo."
    },
    services: {
      eyebrow: "Nossos serviços",
      title: "Cuidado para cada necessidade",
      items: [
        { icon: "Home", title: "Cuidados domiciliares", desc: "Apoio diário no conforto do lar com atenção integral." },
        { icon: "Hospital", title: "Acompanhamento hospitalar", desc: "Presença qualificada durante internações e procedimentos." },
        { icon: "CalendarClock", title: "Cuidados temporários", desc: "Plantões e períodos sob demanda conforme necessidade." },
        { icon: "Activity", title: "Cuidados contínuos", desc: "Acompanhamento 24h com equipe revezada e supervisão." },
        { icon: "UserCheck", title: "Atendimento personalizado", desc: "Plano de cuidados feito sob medida para cada paciente." }
      ]
    },
    trust: {
      items: [
        { icon: "ShieldCheck", label: "Profissionais verificados" },
        { icon: "Award", label: "Equipe certificada" },
        { icon: "Clock", label: "Disponibilidade 24h" }
      ]
    },
    faq: {
      eyebrow: "FAQ",
      title: "Perguntas frequentes",
      items: [
        { q: "Como funciona o primeiro atendimento?", a: "Realizamos uma avaliação inicial gratuita para entender as necessidades e elaborar um plano de cuidados personalizado." },
        { q: "Os cuidadores são treinados?", a: "Sim. Toda a equipe passa por seleção rigorosa, treinamento contínuo e supervisão técnica." },
        { q: "É possível trocar de cuidador?", a: "Sim. Garantimos sintonia com a família — se necessário, fazemos a substituição com agilidade." },
        { q: "Atendem em qual região?", a: "Atendemos toda a região metropolitana. Consulte disponibilidade pelo nosso contato." }
      ]
    }
  },
  empresa: {
    hero: {
      badge: "Sobre nós",
      title: "Cuidar é a nossa vocação",
      description: "Há mais de uma década, a Elderly conecta famílias a profissionais preparados para oferecer um cuidado verdadeiramente humano."
    },
    mission: {
      title: "Nossa missão",
      description: "Promover dignidade, conforto e bem-estar a idosos através de cuidados profissionais e afetuosos, fortalecendo o apoio às famílias."
    },
    vision: {
      title: "Nossa visão",
      description: "Ser referência nacional em cuidado humanizado, transformando a forma como o envelhecimento é vivido no Brasil."
    },
    values: {
      eyebrow: "Nossos valores",
      title: "O que nos guia todos os dias",
      items: [
        { icon: "HeartHandshake", title: "Humanização", desc: "Cada pessoa é única e merece atenção plena." },
        { icon: "ShieldCheck", title: "Confiança", desc: "Transparência e segurança em todas as relações." },
        { icon: "Award", title: "Excelência", desc: "Padrões elevados de qualidade no cuidado." },
        { icon: "Users", title: "Família", desc: "Acolhemos como se fosse da nossa casa." }
      ]
    },
    stats: {
      items: [
        { value: "10+", label: "anos de experiência" },
        { value: "500+", label: "famílias atendidas" },
        { value: "120+", label: "cuidadores ativos" },
        { value: "4.9/5", label: "satisfação média" }
      ]
    }
  },
  trabalhe: {
    hero: {
      title: "Cuide com propósito. Cresça com a Elderly.",
      description: "Procuramos cuidadores apaixonados por fazer a diferença na vida dos idosos e de suas famílias."
    }
  },
  contato: {
    hero: {
      title: "Vamos conversar",
      description: "Tire suas dúvidas e receba um plano de cuidados personalizado para sua família."
    }
  }
};

export type SiteSettingsType = typeof DEFAULT_SITE_SETTINGS;

export function useSiteSettings() {
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState<"public" | "draft">("public");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("elderly_preview_mode") as "public" | "draft";
      if (savedMode && savedMode !== "public") {
        setPreviewMode(savedMode);
      }
    }
  }, []);

  const { data: dbSettings, isLoading, error } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from("site_settings")
        .select("content, draft_content, hero_image_url")
        .eq("id", 1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data;
    },
  });

  // Get current active settings node based on previewMode
  const rawSettings = dbSettings
    ? previewMode === "draft"
      ? dbSettings.draft_content
      : dbSettings.content
    : null;

  // Merge loaded database settings with default settings as fallback
  const settings: SiteSettingsType = rawSettings
    ? {
        ...DEFAULT_SITE_SETTINGS,
        ...(rawSettings as any),
        // Deep merge sub-objects to ensure no keys are missing
        logo: { ...DEFAULT_SITE_SETTINGS.logo, ...((rawSettings as any).logo || {}) },
        theme: { ...DEFAULT_SITE_SETTINGS.theme, ...((rawSettings as any).theme || {}) },
        contact: { ...DEFAULT_SITE_SETTINGS.contact, ...((rawSettings as any).contact || {}) },
        seo: {
          home: { ...DEFAULT_SITE_SETTINGS.seo.home, ...((rawSettings as any).seo?.home || {}) },
          empresa: { ...DEFAULT_SITE_SETTINGS.seo.empresa, ...((rawSettings as any).seo?.empresa || {}) },
          cuidador: { ...DEFAULT_SITE_SETTINGS.seo.cuidador, ...((rawSettings as any).seo?.cuidador || {}) },
          trabalhe: { ...DEFAULT_SITE_SETTINGS.seo.trabalhe, ...((rawSettings as any).seo?.trabalhe || {}) },
          contato: { ...DEFAULT_SITE_SETTINGS.seo.contato, ...((rawSettings as any).seo?.contato || {}) }
        },
        sectionsVisibility: { ...DEFAULT_SITE_SETTINGS.sectionsVisibility, ...((rawSettings as any).sectionsVisibility || {}) },
        home: {
          ...DEFAULT_SITE_SETTINGS.home,
          ...((rawSettings as any).home || {}),
          hero: { ...DEFAULT_SITE_SETTINGS.home.hero, ...((rawSettings as any).home?.hero || {}) },
          benefits: { ...DEFAULT_SITE_SETTINGS.home.benefits, ...((rawSettings as any).home?.benefits || {}) },
          steps: { ...DEFAULT_SITE_SETTINGS.home.steps, ...((rawSettings as any).home?.steps || {}) },
          testimonials: { ...DEFAULT_SITE_SETTINGS.home.testimonials, ...((rawSettings as any).home?.testimonials || {}) },
          cta: { ...DEFAULT_SITE_SETTINGS.home.cta, ...((rawSettings as any).home?.cta || {}) }
        },
        cuidador: {
          ...DEFAULT_SITE_SETTINGS.cuidador,
          ...((rawSettings as any).cuidador || {}),
          hero: { ...DEFAULT_SITE_SETTINGS.cuidador.hero, ...((rawSettings as any).cuidador?.hero || {}) },
          services: { ...DEFAULT_SITE_SETTINGS.cuidador.services, ...((rawSettings as any).cuidador?.services || {}) },
          trust: { ...DEFAULT_SITE_SETTINGS.cuidador.trust, ...((rawSettings as any).cuidador?.trust || {}) },
          faq: { ...DEFAULT_SITE_SETTINGS.cuidador.faq, ...((rawSettings as any).cuidador?.faq || {}) }
        },
        empresa: {
          ...DEFAULT_SITE_SETTINGS.empresa,
          ...((rawSettings as any).empresa || {}),
          hero: { ...DEFAULT_SITE_SETTINGS.empresa.hero, ...((rawSettings as any).empresa?.hero || {}) },
          mission: { ...DEFAULT_SITE_SETTINGS.empresa.mission, ...((rawSettings as any).empresa?.mission || {}) },
          vision: { ...DEFAULT_SITE_SETTINGS.empresa.vision, ...((rawSettings as any).empresa?.vision || {}) },
          values: { ...DEFAULT_SITE_SETTINGS.empresa.values, ...((rawSettings as any).empresa?.values || {}) },
          stats: { ...DEFAULT_SITE_SETTINGS.empresa.stats, ...((rawSettings as any).empresa?.stats || {}) }
        },
        trabalhe: {
          ...DEFAULT_SITE_SETTINGS.trabalhe,
          ...((rawSettings as any).trabalhe || {}),
          hero: { ...DEFAULT_SITE_SETTINGS.trabalhe.hero, ...((rawSettings as any).trabalhe?.hero || {}) }
        },
        contato: {
          ...DEFAULT_SITE_SETTINGS.contato,
          ...((rawSettings as any).contato || {}),
          hero: { ...DEFAULT_SITE_SETTINGS.contato.hero, ...((rawSettings as any).contato?.hero || {}) }
        }
      }
    : DEFAULT_SITE_SETTINGS;

  // Toggle preview mode helper
  const togglePreviewMode = (mode: "public" | "draft") => {
    setPreviewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("elderly_preview_mode", mode);
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    }
  };

  // Sync styling overrides to the DOM
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Manage fonts
    const fontId = "dynamic-google-font";
    let fontLink = document.getElementById(fontId) as HTMLLinkElement | null;
    const fontName = settings.theme.fontName;

    const systemFonts = ["Inter", "system-ui", "sans-serif", "Roboto", "Arial"];
    if (!systemFonts.includes(fontName)) {
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = fontId;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
      }
      fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@400;500;600;700;800&display=swap`;
    } else if (fontLink) {
      fontLink.remove();
    }

    // 2. Manage CSS variables
    const styleId = "dynamic-theme-css";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const primaryColor = settings.theme.primary;
    const accentColor = settings.theme.accent;
    const secondaryColor = settings.theme.secondary;

    styleTag.innerHTML = `
      :root {
        --primary: ${primaryColor} !important;
        --ring: ${primaryColor} !important;
        --accent: ${accentColor} !important;
        --secondary: ${secondaryColor} !important;
        --font-sans: "${fontName}", "Inter", ui-sans-serif, system-ui, sans-serif !important;
        --shadow-soft: 0 10px 30px -12px color-mix(in oklab, ${primaryColor} 18%, transparent) !important;
        --shadow-card: 0 4px 18px -8px color-mix(in oklab, ${primaryColor} 14%, transparent) !important;
        --gradient-hero: linear-gradient(135deg, color-mix(in oklab, ${primaryColor} 10%, transparent), color-mix(in oklab, ${accentColor} 14%, transparent)) !important;
      }
    `;
  }, [settings.theme.primary, settings.theme.accent, settings.theme.secondary, settings.theme.fontName]);

  return {
    settings,
    previewMode,
    togglePreviewMode,
    isLoading,
    error
  };
}
