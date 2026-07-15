-- Add content and draft_content columns to site_settings table if they don't exist
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS content jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS draft_content jsonb;

-- Populate default values for site_settings row id=1
DO $$
DECLARE
  default_data jsonb;
BEGIN
  default_data := '{
    "logo": {
      "type": "text",
      "text": "Elderly",
      "imageUrl": "",
      "height": "h-9",
      "alignment": "justify-start"
    },
    "theme": {
      "primary": "#1A8F8A",
      "accent": "#D64545",
      "secondary": "#F3F4F6",
      "fontName": "Inter",
      "fontSize": "16"
    },
    "contact": {
      "phone": "(11) 99999-0000",
      "email": "contato@elderly.com.br",
      "address": "Av. Paulista, 1000 — São Paulo, SP",
      "whatsapp": "https://wa.me/5511999990000",
      "instagram": "https://instagram.com/elderly",
      "facebook": "https://facebook.com/elderly",
      "linkedin": "https://linkedin.com/company/elderly",
      "hours": "Seg a Sex: 8h–20h · Sáb: 9h–14h",
      "mapsUrl": "https://www.google.com/maps?q=Av.%20Paulista%2C%201000%2C%20S%C3%A3o%20Paulo&output=embed"
    },
    "seo": {
      "home": {
        "title": "Elderly — Cuidado humanizado para quem mais importa",
        "description": "Profissionais qualificados oferecem conforto, segurança e atenção especializada aos idosos. Atendimento domiciliar, hospitalar e contínuo."
      },
      "empresa": {
        "title": "Empresa — Elderly | Quem somos",
        "description": "Conheça a Elderly: nossa história, missão, valores e o compromisso com cuidado humanizado para idosos."
      },
      "cuidador": {
        "title": "Cuidador — Elderly | Nossos serviços",
        "description": "Cuidados domiciliares, acompanhamento hospitalar, atendimento contínuo e personalizado para idosos."
      },
      "trabalhe": {
        "title": "Trabalhe Conosco — Elderly | Carreiras",
        "description": "Faça parte da Elderly. Vagas para cuidadores com propósito, capacitação e ambiente humano."
      },
      "contato": {
        "title": "Contato — Elderly",
        "description": "Fale com a Elderly: telefone, WhatsApp, e-mail, endereço e formulário de contato."
      }
    },
    "sectionsVisibility": {
      "homeHero": true,
      "homeBenefits": true,
      "homeSteps": true,
      "homeTestimonials": true,
      "homeCta": true,
      "cuidadorHero": true,
      "cuidadorServices": true,
      "cuidadorTrust": true,
      "cuidadorFaq": true,
      "empresaHero": true,
      "empresaMission": true,
      "empresaValues": true,
      "empresaStats": true
    },
    "home": {
      "hero": {
        "badge": "Cuidado profissional · Atenção familiar",
        "title": "Cuidado humanizado para quem mais importa",
        "description": "Profissionais qualificados para oferecer conforto, segurança e atenção especializada aos idosos — onde e quando sua família precisar.",
        "btn1Text": "Solicitar Atendimento",
        "btn2Text": "Trabalhe Conosco",
        "trustVerify": "Profissionais verificados",
        "trustRating": "4.9/5 de avaliação",
        "imageUrl": ""
      },
      "benefits": {
        "eyebrow": "Por que a Elderly",
        "title": "Cuidado completo, pensado para sua família",
        "subtitle": "Profissionais especializados e processos transparentes para garantir o melhor atendimento.",
        "items": [
          { "icon": "HeartHandshake", "title": "Atendimento humanizado", "desc": "Acolhimento, empatia e respeito em cada cuidado prestado." },
          { "icon": "GraduationCap", "title": "Profissionais capacitados", "desc": "Equipe treinada e certificada em cuidados com idosos." },
          { "icon": "Users", "title": "Suporte familiar", "desc": "Acompanhamento e orientação contínua para toda a família." },
          { "icon": "ShieldCheck", "title": "Segurança e confiança", "desc": "Protocolos rigorosos e profissionais verificados." },
          { "icon": "HomeIcon", "title": "Atendimento domiciliar", "desc": "Cuidado completo no conforto da própria casa." },
          { "icon": "Clock", "title": "Disponibilidade flexível", "desc": "Plantões, períodos parciais e 24h conforme a necessidade." }
        ]
      },
      "steps": {
        "eyebrow": "Como funciona",
        "title": "Simples, rápido e seguro",
        "items": [
          { "icon": "PhoneCall", "title": "Entre em contato", "desc": "Conte-nos sobre as necessidades do seu familiar." },
          { "icon": "ClipboardList", "title": "Escolha o atendimento ideal", "desc": "Montamos um plano personalizado de cuidados." },
          { "icon": "Stethoscope", "title": "Receba cuidado especializado", "desc": "Profissional preparado vai até sua casa com excelência." }
        ]
      },
      "testimonials": {
        "eyebrow": "Depoimentos",
        "title": "Famílias que confiam na Elderly",
        "items": [
          { "name": "Marina Souza", "role": "Filha de paciente", "text": "Profissionalismo e carinho que mudaram a rotina da minha mãe. Recomendo de olhos fechados.", "img": "https://i.pravatar.cc/120?img=47" },
          { "name": "Ricardo Lima", "role": "Familiar", "text": "Atendimento impecável e equipe muito atenciosa. Sentimos verdadeira segurança.", "img": "https://i.pravatar.cc/120?img=12" },
          { "name": "Clarice Mendes", "role": "Filha de paciente", "text": "Mais que cuidadores, ganhamos uma extensão da família. Gratidão imensa.", "img": "https://i.pravatar.cc/120?img=32" }
        ]
      },
      "cta": {
        "title": "Seu familiar merece o melhor cuidado.",
        "subtitle": "Fale com nossa equipe e receba um plano de cuidados personalizado em até 24h.",
        "btnText": "Solicitar atendimento"
      }
    },
    "cuidador": {
      "hero": {
        "title": "Serviços de cuidado especializados",
        "description": "Soluções completas para cada momento — do acompanhamento pontual ao cuidado contínuo."
      },
      "services": {
        "eyebrow": "Nossos serviços",
        "title": "Cuidado para cada necessidade",
        "items": [
          { "icon": "Home", "title": "Cuidados domiciliares", "desc": "Apoio diário no conforto do lar com atenção integral." },
          { "icon": "Hospital", "title": "Acompanhamento hospitalar", "desc": "Presença qualificada durante internações e procedimentos." },
          { "icon": "CalendarClock", "title": "Cuidados temporários", "desc": "Plantões e períodos sob demanda conforme necessidade." },
          { "icon": "Activity", "title": "Cuidados contínuos", "desc": "Acompanhamento 24h com equipe revezada e supervisão." },
          { "icon": "UserCheck", "title": "Atendimento personalizado", "desc": "Plano de cuidados feito sob medida para cada paciente." }
        ]
      },
      "trust": {
        "items": [
          { "icon": "ShieldCheck", "label": "Profissionais verificados" },
          { "icon": "Award", "label": "Equipe certificada" },
          { "icon": "Clock", "label": "Disponibilidade 24h" }
        ]
      },
      "faq": {
        "eyebrow": "FAQ",
        "title": "Perguntas frequentes",
        "items": [
          { "q": "Como funciona o primeiro atendimento?", "a": "Realizamos uma avaliação inicial gratuita para entender as necessidades e elaborar um plano de cuidados personalizado." },
          { "q": "Os cuidadores são treinados?", "a": "Sim. Toda a equipe passa por seleção rigorosa, treinamento contínuo e supervisão técnica." },
          { "q": "É possível trocar de cuidador?", "a": "Sim. Garantimos sintonia com a família — se necessário, fazemos a substituição com agilidade." },
          { "q": "Atendem em qual região?", "a": "Atendemos toda a região metropolitana. Consulte disponibilidade pelo nosso contato." }
        ]
      }
    },
    "empresa": {
      "hero": {
        "badge": "Sobre nós",
        "title": "Cuidar é a nossa vocação",
        "description": "Há mais de uma década, a Elderly conecta famílias a profissionais preparados para oferecer um cuidado verdadeiramente humano."
      },
      "mission": {
        "title": "Nossa missão",
        "description": "Promover dignidade, conforto e bem-estar a idosos através de cuidados profissionais e afetuosos, fortalecendo o apoio às famílias."
      },
      "vision": {
        "title": "Nossa visão",
        "description": "Ser referência nacional em cuidado humanizado, transformando a forma como o envelhecimento é vivido no Brasil."
      },
      "values": {
        "eyebrow": "Nossos valores",
        "title": "O que nos guia todos os dias",
        "items": [
          { "icon": "HeartHandshake", "title": "Humanização", "desc": "Cada pessoa é única e merece atenção plena." },
          { "icon": "ShieldCheck", "title": "Confiança", "desc": "Transparência e segurança em todas as relações." },
          { "icon": "Award", "title": "Excelência", "desc": "Padrões elevados de qualidade no cuidado." },
          { "icon": "Users", "title": "Família", "desc": "Acolhemos como se fosse da nossa casa." }
        ]
      },
      "stats": {
        "items": [
          { "value": "10+", "label": "anos de experiência" },
          { "value": "500+", "label": "famílias atendidas" },
          { "value": "120+", "label": "cuidadores ativos" },
          { "value": "4.9/5", "label": "satisfação média" }
        ]
      }
    },
    "trabalhe": {
      "hero": {
        "title": "Cuide com propósito. Cresça com a Elderly.",
        "description": "Procuramos cuidadores apaixonados por fazer a diferença na vida dos idosos e de suas famílias."
      }
    },
    "contato": {
      "hero": {
        "title": "Vamos conversar",
        "description": "Tire suas dúvidas e receba um plano de cuidados personalizado para sua família."
      }
    }
  }';

  -- Update row 1 with content and draft_content if they are null
  UPDATE public.site_settings
  SET content = COALESCE(content, default_data),
      draft_content = COALESCE(draft_content, default_data)
  WHERE id = 1;

END $$;
