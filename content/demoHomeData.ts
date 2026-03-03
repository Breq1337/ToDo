/**
 * Demo data for Portal Home (Dashboard).
 * All content is fictional and for demonstration only.
 */

import type { PortalRole } from "@/lib/authClient";

// ---- Next Best Actions (3 cards) ----
export interface NextBestAction {
  id: string;
  type: "module" | "track" | "notice";
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  cta_pt: string;
  cta_en: string;
  href: string;
}

export const DEMO_NEXT_BEST_ACTIONS: NextBestAction[] = [
  {
    id: "1",
    type: "module",
    title_pt: "Próximo módulo recomendado",
    title_en: "Recommended next module",
    description_pt: "Direção defensiva e segurança — Módulo 2: Sinalização e ultrapassagem.",
    description_en: "Defensive driving and safety — Module 2: Signage and overtaking.",
    cta_pt: "Continuar",
    cta_en: "Continue",
    href: "/portal/academy",
  },
  {
    id: "2",
    type: "track",
    title_pt: "Próxima trilha obrigatória",
    title_en: "Next mandatory track",
    description_pt: "Sustentabilidade e impacto (ESG) — complete para cumprir seus obrigatórios.",
    description_en: "Sustainability and impact (ESG) — complete to fulfill your mandatory training.",
    cta_pt: "Ver trilha",
    cta_en: "View track",
    href: "/portal/academy?filter=obrigatorios",
  },
  {
    id: "3",
    type: "notice",
    title_pt: "Aviso recente",
    title_en: "Recent notice",
    description_pt: "Novo comunicado: Atualização dos horários de recarga nos hubs a partir de segunda-feira.",
    description_en: "New notice: Charging schedule update at hubs starting Monday.",
    cta_pt: "Ver avisos",
    cta_en: "View notices",
    href: "/portal/messages",
  },
];

// ---- Progress overview (demo numbers) ----
export interface ProgressOverviewDemo {
  percent: number;
  tracksCompleted: number;
  tracksInProgress: number;
  estimatedMinutesRemaining: number;
  streakDays: number;
}

export const DEMO_PROGRESS: ProgressOverviewDemo = {
  percent: 42,
  tracksCompleted: 5,
  tracksInProgress: 3,
  estimatedMinutesRemaining: 180,
  streakDays: 4,
};

// ---- Messages preview ----
export interface MessagePreviewDemo {
  id: string;
  title_pt: string;
  title_en: string;
  excerpt_pt: string;
  excerpt_en: string;
  read: boolean;
  createdAt: string;
}

export const DEMO_MESSAGES_PREVIEW: MessagePreviewDemo[] = [
  {
    id: "m1",
    title_pt: "Atualização dos horários de recarga",
    title_en: "Charging schedule update",
    excerpt_pt: "A partir de segunda-feira os horários de recarga nos hubs…",
    excerpt_en: "Starting Monday, hub charging schedules will…",
    read: false,
    createdAt: "2025-02-24T10:00:00",
  },
  {
    id: "m2",
    title_pt: "Novo módulo na Academia: Mobilidade elétrica",
    title_en: "New Academy module: Electric mobility",
    excerpt_pt: "Confira o novo conteúdo disponível para todos os cargos.",
    excerpt_en: "Check out the new content available for all roles.",
    read: true,
    createdAt: "2025-02-23T14:30:00",
  },
  {
    id: "m3",
    title_pt: "Lembrete: Trilhas obrigatórias do trimestre",
    title_en: "Reminder: Quarterly mandatory tracks",
    excerpt_pt: "Conclua suas trilhas obrigatórias até o fim do mês.",
    excerpt_en: "Complete your mandatory tracks by end of month.",
    read: false,
    createdAt: "2025-02-22T09:15:00",
  },
];

export const DEMO_UNREAD_COUNT = DEMO_MESSAGES_PREVIEW.filter((m) => !m.read).length;

// ---- Featured courses (4: 2 mandatory for role + 2 general) ----
export interface FeaturedCourseDemo {
  id: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  duration_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "new" | "in_progress" | "completed";
  mandatory: boolean;
  href: string;
}

export function getDemoFeaturedCourses(role: PortalRole): FeaturedCourseDemo[] {
  const mandatoryByRole: Record<PortalRole, FeaturedCourseDemo[]> = {
    DRIVER: [
      {
        id: "drv-1",
        title_pt: "Autonomia e recarga (prática)",
        title_en: "Range and charging (practice)",
        description_pt: "Boas práticas de recarga e planejamento de rotas.",
        description_en: "Charging best practices and route planning.",
        duration_minutes: 45,
        difficulty: "intermediate",
        status: "in_progress",
        mandatory: true,
        href: "/portal/academy/drv-1",
      },
      {
        id: "drv-2",
        title_pt: "Procedimentos de entrega e reentrega",
        title_en: "Delivery and return procedures",
        description_pt: "Fluxo completo de entrega e documentação.",
        description_en: "Full delivery flow and documentation.",
        duration_minutes: 30,
        difficulty: "beginner",
        status: "new",
        mandatory: true,
        href: "/portal/academy/drv-2",
      },
    ],
    HUB_OPS: [
      {
        id: "hub-1",
        title_pt: "Triagem e conferência",
        title_en: "Sorting and checking",
        description_pt: "Processos de triagem e conferência no hub.",
        description_en: "Sorting and checking processes at the hub.",
        duration_minutes: 40,
        difficulty: "beginner",
        status: "in_progress",
        mandatory: true,
        href: "/portal/academy/hub-1",
      },
      {
        id: "hub-2",
        title_pt: "Checklists de operação",
        title_en: "Operation checklists",
        description_pt: "Uso dos checklists no dia a dia do hub.",
        description_en: "Using checklists in daily hub operations.",
        duration_minutes: 25,
        difficulty: "beginner",
        status: "new",
        mandatory: true,
        href: "/portal/academy/hub-2",
      },
    ],
    EMPLOYEE: [
      {
        id: "emp-1",
        title_pt: "Processos internos essenciais",
        title_en: "Essential internal processes",
        description_pt: "Conheça os principais processos da área interna.",
        description_en: "Learn the main internal area processes.",
        duration_minutes: 35,
        difficulty: "beginner",
        status: "in_progress",
        mandatory: true,
        href: "/portal/academy/emp-1",
      },
      {
        id: "emp-2",
        title_pt: "Comunicação e atendimento interno",
        title_en: "Internal communication and support",
        description_pt: "Padrões de comunicação e atendimento.",
        description_en: "Communication and support standards.",
        duration_minutes: 30,
        difficulty: "beginner",
        status: "new",
        mandatory: true,
        href: "/portal/academy/emp-2",
      },
    ],
    MANAGER: [
      {
        id: "mgr-1",
        title_pt: "Gestão de operação",
        title_en: "Operations management",
        description_pt: "Indicadores e acompanhamento da operação.",
        description_en: "Metrics and operations follow-up.",
        duration_minutes: 50,
        difficulty: "intermediate",
        status: "in_progress",
        mandatory: true,
        href: "/portal/academy/mgr-1",
      },
      {
        id: "mgr-2",
        title_pt: "Indicadores e metas (KPIs)",
        title_en: "Metrics and goals (KPIs)",
        description_pt: "Como definir e acompanhar metas de treinamento.",
        description_en: "How to set and track training goals.",
        duration_minutes: 40,
        difficulty: "intermediate",
        status: "new",
        mandatory: true,
        href: "/portal/academy/mgr-2",
      },
    ],
    ADMIN: [
      {
        id: "adm-1",
        title_pt: "Administração do portal",
        title_en: "Portal administration",
        description_pt: "Permissões, conteúdo e usuários.",
        description_en: "Permissions, content and users.",
        duration_minutes: 45,
        difficulty: "advanced",
        status: "in_progress",
        mandatory: true,
        href: "/portal/academy/adm-1",
      },
      {
        id: "adm-2",
        title_pt: "Boas práticas de segurança do sistema",
        title_en: "System security best practices",
        description_pt: "Segurança e auditoria no uso do portal.",
        description_en: "Security and audit when using the portal.",
        duration_minutes: 35,
        difficulty: "advanced",
        status: "new",
        mandatory: true,
        href: "/portal/academy/adm-2",
      },
    ],
  };

  const general: FeaturedCourseDemo[] = [
    {
      id: "gen-1",
      title_pt: "Valores e cultura To Do Green",
      title_en: "To Do Green values and culture",
      description_pt: "Nossos valores e como colocá-los em prática no dia a dia.",
      description_en: "Our values and how to put them into practice.",
      duration_minutes: 25,
      difficulty: "beginner",
      status: "completed",
      mandatory: false,
      href: "/portal/academy/gen-1",
    },
    {
      id: "gen-2",
      title_pt: "Sustentabilidade e impacto (ESG)",
      title_en: "Sustainability and impact (ESG)",
      description_pt: "O papel da To Do Green em sustentabilidade e métricas ESG.",
      description_en: "To Do Green's role in sustainability and ESG metrics.",
      duration_minutes: 35,
      difficulty: "beginner",
      status: "in_progress",
      mandatory: false,
      href: "/portal/academy/gen-2",
    },
  ];

  return [...(mandatoryByRole[role] ?? mandatoryByRole.EMPLOYEE), ...general];
}

// ---- FAQ ----
export interface FAQItemDemo {
  id: string;
  question_pt: string;
  question_en: string;
  answer_pt: string;
  answer_en: string;
}

export const DEMO_FAQ_ITEMS: FAQItemDemo[] = [
  {
    id: "faq1",
    question_pt: "Como acessar as trilhas de formação?",
    question_en: "How do I access training tracks?",
    answer_pt: "No menu do portal, clique em Academia. Você verá todas as trilhas disponíveis para seu cargo. As obrigatórias aparecem em destaque. Clique em uma trilha para ver os módulos e em \"Iniciar\" ou \"Continuar\" para seguir.",
    answer_en: "In the portal menu, click Academy. You'll see all tracks available for your role. Mandatory ones are highlighted. Click a track to see modules and \"Start\" or \"Continue\" to proceed.",
  },
  {
    id: "faq2",
    question_pt: "Como ganhar certificado?",
    question_en: "How do I earn a certificate?",
    answer_pt: "Ao concluir todos os módulos de uma trilha e o quiz final (quando houver), o certificado fica disponível na página da trilha e no seu perfil. Em breve teremos uma área dedicada de certificados.",
    answer_en: "When you complete all modules of a track and the final quiz (when applicable), the certificate is available on the track page and your profile. A dedicated certificates area is coming soon.",
  },
  {
    id: "faq3",
    question_pt: "Como tirar dúvidas sobre o conteúdo?",
    question_en: "How do I get help with the content?",
    answer_pt: "Use o Tutor Green (menu do portal) para perguntas sobre procedimentos e boas práticas. Para dúvidas sobre sua função ou benefícios, entre em contato com o RH ou seu gestor.",
    answer_en: "Use the Green Tutor (portal menu) for questions about procedures and best practices. For role or benefits questions, contact HR or your manager.",
  },
  {
    id: "faq4",
    question_pt: "Como funciona a pontuação e o ranking?",
    question_en: "How do scoring and ranking work?",
    answer_pt: "Você ganha pontos ao concluir módulos e trilhas. O ranking mostra o desempenho da equipe (respeitando a privacidade). É uma forma de reconhecer quem se dedica à formação. Os dados exibidos são apenas para fins de engajamento.",
    answer_en: "You earn points by completing modules and tracks. The ranking shows team performance (with privacy in mind). It's a way to recognize those who engage with training. Data shown is for engagement purposes only.",
  },
  {
    id: "faq5",
    question_pt: "Como falar com o suporte?",
    question_en: "How do I contact support?",
    answer_pt: "Para problemas técnicos com o portal (acesso, carregamento, erros), use o link \"Suporte\" nesta página ou envie um e-mail para suporte@todogreen.com.br. Para conteúdo ou treinamento, fale com seu gestor ou RH.",
    answer_en: "For technical issues with the portal (access, loading, errors), use the \"Support\" link on this page or email suporte@todogreen.com.br. For content or training, talk to your manager or HR.",
  },
  {
    id: "faq6",
    question_pt: "As trilhas obrigatórias têm prazo?",
    question_en: "Is there a deadline for mandatory tracks?",
    answer_pt: "Sim. Cada cargo tem trilhas obrigatórias que devem ser concluídas no período definido pela empresa (geralmente por trimestre). Acompanhe em \"Trilhas obrigatórias\" e na sua área de progresso.",
    answer_en: "Yes. Each role has mandatory tracks that must be completed within the period set by the company (usually quarterly). Check \"Mandatory tracks\" and your progress area.",
  },
  {
    id: "faq7",
    question_pt: "Posso fazer trilhas que não são do meu cargo?",
    question_en: "Can I take tracks that are not for my role?",
    answer_pt: "Sim. A Academia oferece trilhas gerais (cultura, sustentabilidade, segurança) para todos. Algumas trilhas específicas de outro cargo podem aparecer como \"gerais\" e você pode fazê-las se quiser.",
    answer_en: "Yes. The Academy offers general tracks (culture, sustainability, safety) for everyone. Some role-specific tracks may appear as \"general\" and you can take them if you wish.",
  },
  {
    id: "faq8",
    question_pt: "Onde vejo minhas mensagens e avisos?",
    question_en: "Where do I see my messages and notices?",
    answer_pt: "Clique em \"Mensagens\" no menu ou no ícone de sino. Lá você encontra comunicados da empresa e avisos importantes. Marque como lida para organizar.",
    answer_en: "Click \"Messages\" in the menu or the bell icon. There you'll find company communications and important notices. Mark as read to stay organized.",
  },
];

// ---- Role explainer (Seu papel na operação) ----
export interface RoleExplainerDemo {
  summary_pt: string;
  summary_en: string;
  responsibilities_pt: string[];
  responsibilities_en: string[];
  tips_pt: string[];
  tips_en: string[];
}

export function getRoleExplainer(role: PortalRole): RoleExplainerDemo {
  const data: Record<PortalRole, RoleExplainerDemo> = {
    DRIVER: {
      summary_pt: "Você é parte essencial da operação de entregas. Seu foco é realizar entregas e reentregas com segurança, recarregar o veículo quando necessário e representar a To Do Green com um atendimento de qualidade ao cliente.",
      summary_en: "You are an essential part of the delivery operation. Your focus is to perform deliveries and returns safely, recharge the vehicle when needed, and represent To Do Green with quality customer service.",
      responsibilities_pt: [
        "Realizar entregas e reentregas conforme rota e procedimentos.",
        "Garantir recarga do veículo e uso correto do equipamento.",
        "Atender ao cliente no padrão To Do Green e registrar ocorrências quando necessário.",
        "Seguir normas de segurança e direção defensiva.",
      ],
      responsibilities_en: [
        "Perform deliveries and returns according to route and procedures.",
        "Ensure vehicle charging and correct use of equipment.",
        "Serve the customer to To Do Green standards and log incidents when needed.",
        "Follow safety and defensive driving rules.",
      ],
      tips_pt: [
        "Planeje a rota e a recarga com antecedência.",
        "Mantenha o app e os checklists em dia.",
        "Em caso de dúvida, consulte o Tutor Green ou seu gestor.",
      ],
      tips_en: [
        "Plan route and charging in advance.",
        "Keep the app and checklists up to date.",
        "When in doubt, check the Green Tutor or your manager.",
      ],
    },
    HUB_OPS: {
      summary_pt: "Você atua no coração do hub: triagem, conferência, organização e preparação para as rotas. Sua atenção aos checklists e à segurança garante que as operações fluam e que os motoristas tenham tudo pronto.",
      summary_en: "You work at the heart of the hub: sorting, checking, organizing and preparing for routes. Your attention to checklists and safety ensures operations run smoothly and drivers have everything ready.",
      responsibilities_pt: [
        "Fazer triagem e conferência de pacotes e veículos.",
        "Seguir checklists de operação e registrar divergências.",
        "Apoiar a roteirização e priorização conforme orientação.",
        "Tratar ocorrências, devoluções e reversa conforme procedimento.",
        "Zelar pela segurança do hub e dos colegas.",
      ],
      responsibilities_en: [
        "Sort and check packages and vehicles.",
        "Follow operation checklists and log discrepancies.",
        "Support routing and prioritization as instructed.",
        "Handle incidents, returns and reverse flow per procedure.",
        "Ensure hub and team safety.",
      ],
      tips_pt: [
        "Nunca pule etapas dos checklists.",
        "Comunique qualquer anomalia na hora.",
        "Mantenha o ambiente organizado para evitar erros.",
      ],
      tips_en: [
        "Never skip checklist steps.",
        "Report any anomaly immediately.",
        "Keep the area organized to avoid errors.",
      ],
    },
    EMPLOYEE: {
      summary_pt: "Você apoia a operação e a empresa com processos internos, comunicação e uso das ferramentas certas. Seu trabalho fortalece a cultura e o dia a dia de todos.",
      summary_en: "You support the operation and the company with internal processes, communication and the right tools. Your work strengthens culture and everyone's day-to-day.",
      responsibilities_pt: [
        "Executar processos internos essenciais da sua área.",
        "Comunicar-se e atender demandas internas no padrão definido.",
        "Usar ferramentas e fluxos de trabalho conforme treinamento.",
        "Contribuir para a cultura e os valores da To Do Green.",
      ],
      responsibilities_en: [
        "Execute essential internal processes in your area.",
        "Communicate and handle internal requests to the defined standard.",
        "Use tools and workflows as per training.",
        "Contribute to To Do Green culture and values.",
      ],
      tips_pt: [
        "Documente e compartilhe aprendizados com a equipe.",
        "Mantenha canais de comunicação claros.",
        "Peça feedback ao gestor para evoluir.",
      ],
      tips_en: [
        "Document and share learnings with the team.",
        "Keep communication channels clear.",
        "Ask your manager for feedback to grow.",
      ],
    },
    MANAGER: {
      summary_pt: "Você lidera pessoas e processos: acompanha indicadores, dá feedback, gerencia incidentes e garante que a equipe tenha condições de entregar resultados. Sua visão ajuda a alinhar operação e metas.",
      summary_en: "You lead people and processes: track metrics, give feedback, manage incidents and ensure the team has what it needs to deliver. Your view helps align operations and goals.",
      responsibilities_pt: [
        "Acompanhar a operação e os indicadores (KPIs) da sua área.",
        "Definir metas de treinamento e acompanhar conclusão das trilhas.",
        "Dar feedback e desenvolver a equipe com liderança positiva.",
        "Gerir incidentes e escalações conforme procedimento.",
      ],
      responsibilities_en: [
        "Monitor operations and area KPIs.",
        "Set training goals and track track completion.",
        "Give feedback and develop the team with positive leadership.",
        "Manage incidents and escalations per procedure.",
      ],
      tips_pt: [
        "Use o portal para ver o progresso da equipe na Academia.",
        "Reúna a equipe para tirar dúvidas e reforçar prioridades.",
        "Reconheça quem se dedica à formação.",
      ],
      tips_en: [
        "Use the portal to see your team's Academy progress.",
        "Meet with the team to clarify doubts and reinforce priorities.",
        "Recognize those who engage with training.",
      ],
    },
    ADMIN: {
      summary_pt: "Você gerencia o portal: permissões, conteúdo, usuários e configurações. Sua atuação garante que todos tenham acesso correto e que o ambiente seja seguro e auditável.",
      summary_en: "You manage the portal: permissions, content, users and settings. Your work ensures everyone has the right access and the environment is secure and auditable.",
      responsibilities_pt: [
        "Administrar permissões e funções dos usuários no portal.",
        "Gerenciar conteúdo e trilhas (em conjunto com outras áreas).",
        "Aplicar boas práticas de segurança e auditoria.",
        "Garantir que políticas de privacidade e uso sejam cumpridas.",
      ],
      responsibilities_en: [
        "Manage user permissions and roles in the portal.",
        "Manage content and tracks (together with other areas).",
        "Apply security and audit best practices.",
        "Ensure privacy and usage policies are followed.",
      ],
      tips_pt: [
        "Revise acessos periodicamente e desative quem sair.",
        "Documente alterações para auditoria.",
        "Mantenha backups e procedimentos de contingência.",
      ],
      tips_en: [
        "Review access periodically and deactivate leavers.",
        "Document changes for audit.",
        "Keep backups and contingency procedures.",
      ],
    },
  };
  return data[role] ?? data.EMPLOYEE;
}
