/**
 * Demo data for Portal Academy.
 * All content is fictional and for demonstration only.
 *
 * role_target: roles that can see this course. If length === 1, the course is
 * exclusive to that role (e.g. only Motorista, only Colaborador/RH, only Hub Ops).
 */

import type { PortalRole } from "@/lib/authClient";

// ---- Categories (Matérias) ----
export const ACADEMY_CATEGORIES = [
  { id: "cultura-valores", name_pt: "Cultura & Valores", name_en: "Culture & Values" },
  { id: "sustentabilidade-esg", name_pt: "Sustentabilidade & ESG", name_en: "Sustainability & ESG" },
  { id: "seguranca-compliance", name_pt: "Segurança & Compliance", name_en: "Safety & Compliance" },
  { id: "operacao-processos", name_pt: "Operação & Processos", name_en: "Operations & Processes" },
  { id: "atendimento-cliente", name_pt: "Atendimento ao Cliente", name_en: "Customer Service" },
  { id: "mobilidade-eletrica", name_pt: "Mobilidade Elétrica (EV)", name_en: "Electric Mobility (EV)" },
  { id: "ferramentas-sistemas", name_pt: "Ferramentas & Sistemas", name_en: "Tools & Systems" },
  { id: "lideranca", name_pt: "Liderança", name_en: "Leadership" },
  { id: "admin-portal", name_pt: "Administração do Portal", name_en: "Portal Administration" },
] as const;

export type CategoryId = (typeof ACADEMY_CATEGORIES)[number]["id"];

// ---- Module type ----
export interface AcademyModule {
  id: string;
  title_pt: string;
  title_en: string;
  summary_pt: string;
  summary_en: string;
  objectives_pt: string[];
  objectives_en: string[];
}

// ---- Course type ----
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type CourseProgressDemo = "not_started" | "in_progress" | "completed";

export interface AcademyCourse {
  id: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  category: CategoryId;
  duration_minutes: number;
  difficulty: Difficulty;
  role_target: PortalRole[];
  mandatory_for_roles: PortalRole[];
  modules: AcademyModule[];
  quizPlaceholder: boolean;
  progressDemo: CourseProgressDemo;
}

// ---- Mandatory course IDs by role (for filtering) ----
const GENERAL_MANDATORY_IDS = [
  "como-funciona-tdg",
  "valores-cultura",
  "sustentabilidade-impacto",
  "seguranca-conduta",
  "privacidade-boas-praticas",
];

const DRIVER_MANDATORY_IDS = [
  "autonomia-recarga",
  "direcao-defensiva",
  "procedimentos-entrega-reentrega",
  "atendimento-cliente-padrao",
  "registro-ocorrencias",
];

const HUB_OPS_MANDATORY_IDS = [
  "triagem-conferencia",
  "checklists-operacao",
  "roteirizacao-basica",
  "ocorrencias-devolucoes-reversa",
  "seguranca-hub",
];

const EMPLOYEE_MANDATORY_IDS = [
  "processos-internos-essenciais",
  "comunicacao-atendimento-interno",
  "ferramentas-fluxo-trabalho",
];

const MANAGER_MANDATORY_IDS = [
  "gestao-operacao",
  "indicadores-metas-kpis",
  "lideranca-feedback",
  "gestao-incidentes",
];

const ADMIN_MANDATORY_IDS = [
  "administracao-portal",
  "seguranca-sistema",
  "auditoria-governanca",
];

// ---- Helper to create a module ----
function mod(
  id: string,
  title_pt: string,
  title_en: string,
  summary_pt: string,
  summary_en: string,
  objectives_pt: string[],
  objectives_en: string[]
): AcademyModule {
  return {
    id,
    title_pt,
    title_en,
    summary_pt,
    summary_en,
    objectives_pt,
    objectives_en,
  };
}

// ---- All demo courses (30+) ----
export const DEMO_ACADEMY_COURSES: AcademyCourse[] = [
  // General (all roles)
  {
    id: "como-funciona-tdg",
    title_pt: "Como a To Do Green funciona",
    title_en: "How To Do Green works",
    description_pt: "Visão geral da operação, modelo de negócio e seu papel na rede.",
    description_en: "Overview of operations, business model and your role in the network.",
    category: "cultura-valores",
    duration_minutes: 20,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    progressDemo: "completed",
    modules: [
      mod("m1", "Visão geral", "Overview", "O que é a To Do Green.", "What To Do Green is.", ["Entender o propósito da empresa", "Conhecer o modelo de operação"], ["Understand company purpose", "Know the operation model"]),
      mod("m2", "Sua função na rede", "Your role in the network", "Como você se conecta ao todo.", "How you connect to the whole.", ["Identificar seu impacto", "Conhecer outros papéis"], ["Identify your impact", "Know other roles"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "valores-cultura",
    title_pt: "Valores e cultura",
    title_en: "Values and culture",
    description_pt: "Nossos valores e como colocá-los em prática no dia a dia.",
    description_en: "Our values and how to put them into practice.",
    category: "cultura-valores",
    duration_minutes: 25,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "Nossos valores", "Our values", "Os pilares da To Do Green.", "The pillars of To Do Green.", ["Listar os valores", "Dar exemplos práticos"], ["List values", "Give practical examples"]),
      mod("m2", "Cultura no dia a dia", "Culture in daily life", "Como vivemos os valores.", "How we live the values.", ["Aplicar valores em situações reais", "Reconhecer boas práticas"], ["Apply values in real situations", "Recognize good practices"]),
      mod("m3", "Respeito e diversidade", "Respect and diversity", "Ambiente inclusivo.", "Inclusive environment.", ["Promover respeito", "Agir com inclusão"], ["Promote respect", "Act inclusively"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "sustentabilidade-impacto",
    title_pt: "Sustentabilidade e impacto (ESG)",
    title_en: "Sustainability and impact (ESG)",
    description_pt: "O papel da To Do Green em sustentabilidade e métricas ESG.",
    description_en: "To Do Green's role in sustainability and ESG metrics.",
    category: "sustentabilidade-esg",
    duration_minutes: 35,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "O que é ESG", "What is ESG", "Environmental, Social, Governance.", "Environmental, Social, Governance.", ["Definir ESG", "Relacionar com a empresa"], ["Define ESG", "Relate to the company"]),
      mod("m2", "Nossa pegada", "Our footprint", "Métricas e redução de impacto.", "Metrics and impact reduction.", ["Conhecer métricas", "Saber como contribuir"], ["Know metrics", "Know how to contribute"]),
      mod("m3", "Boas práticas no dia a dia", "Daily best practices", "Ações concretas.", "Concrete actions.", ["Aplicar práticas sustentáveis", "Comunicar impacto"], ["Apply sustainable practices", "Communicate impact"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "seguranca-conduta",
    title_pt: "Segurança e conduta (compliance básico)",
    title_en: "Safety and conduct (basic compliance)",
    description_pt: "Normas de segurança e conduta esperada de todos.",
    description_en: "Safety standards and expected conduct for everyone.",
    category: "seguranca-compliance",
    duration_minutes: 30,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Normas de segurança", "Safety rules", "O que todos devem seguir.", "What everyone must follow.", ["Conhecer normas", "Identificar riscos"], ["Know rules", "Identify risks"]),
      mod("m2", "Conduta e ética", "Conduct and ethics", "Comportamento esperado.", "Expected behavior.", ["Agir com integridade", "Reportar irregularidades"], ["Act with integrity", "Report irregularities"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "privacidade-boas-praticas",
    title_pt: "Privacidade e boas práticas (básico)",
    title_en: "Privacy and best practices (basic)",
    description_pt: "Uso de dados, senhas e boas práticas no ambiente digital.",
    description_en: "Data use, passwords and best practices in the digital environment.",
    category: "seguranca-compliance",
    duration_minutes: 20,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Proteção de dados", "Data protection", "LGPD e uso de dados.", "LGPD and data use.", ["Conhecer princípios", "Proteger dados de terceiros"], ["Know principles", "Protect third-party data"]),
      mod("m2", "Senhas e acesso", "Passwords and access", "Como manter acesso seguro.", "How to keep access secure.", ["Criar senhas fortes", "Não compartilhar acessos"], ["Create strong passwords", "Do not share access"]),
    ],
    quizPlaceholder: true,
  },
  // Driver-specific (some exclusive to DRIVER only)
  {
    id: "autonomia-recarga",
    title_pt: "Autonomia e recarga (prática)",
    title_en: "Range and charging (practice)",
    description_pt: "Boas práticas de recarga e planejamento de rotas com veículo elétrico.",
    description_en: "Charging best practices and route planning with electric vehicle.",
    category: "mobilidade-eletrica",
    duration_minutes: 45,
    difficulty: "intermediate",
    role_target: ["DRIVER"],
    mandatory_for_roles: ["DRIVER"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "Entendendo a autonomia", "Understanding range", "Fatores que afetam a bateria.", "Factors that affect the battery.", ["Estimar autonomia", "Planejar paradas"], ["Estimate range", "Plan stops"]),
      mod("m2", "Pontos de recarga", "Charging points", "Onde e como recarregar.", "Where and how to charge.", ["Localizar pontos", "Usar o app de recarga"], ["Locate points", "Use charging app"]),
      mod("m3", "Prática de recarga", "Charging practice", "Passo a passo seguro.", "Safe step-by-step.", ["Conectar com segurança", "Registrar na operação"], ["Connect safely", "Log in operations"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "direcao-defensiva",
    title_pt: "Direção defensiva e segurança",
    title_en: "Defensive driving and safety",
    description_pt: "Técnicas de direção defensiva e segurança no trânsito.",
    description_en: "Defensive driving techniques and road safety.",
    category: "seguranca-compliance",
    duration_minutes: 40,
    difficulty: "intermediate",
    role_target: ["DRIVER"],
    mandatory_for_roles: ["DRIVER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Conceitos de direção defensiva", "Defensive driving concepts", "O que é e por quê.", "What it is and why.", ["Definir direção defensiva", "Reconhecer riscos"], ["Define defensive driving", "Recognize risks"]),
      mod("m2", "Sinalização e ultrapassagem", "Signage and overtaking", "Regras e segurança.", "Rules and safety.", ["Respeitar sinalização", "Ultrapassar com segurança"], ["Respect signage", "Overtake safely"]),
      mod("m3", "Condições adversas", "Adverse conditions", "Chuva, noite, trânsito.", "Rain, night, traffic.", ["Adaptar a direção", "Reduzir velocidade"], ["Adapt driving", "Reduce speed"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "procedimentos-entrega-reentrega",
    title_pt: "Procedimentos de entrega e reentrega",
    title_en: "Delivery and return procedures",
    description_pt: "Fluxo completo de entrega, reentrega e documentação.",
    description_en: "Full delivery, return and documentation flow.",
    category: "operacao-processos",
    duration_minutes: 30,
    difficulty: "beginner",
    role_target: ["DRIVER"],
    mandatory_for_roles: ["DRIVER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Checklist pré-entrega", "Pre-delivery checklist", "O que conferir antes de sair.", "What to check before leaving.", ["Executar checklist", "Registrar no app"], ["Run checklist", "Log in app"]),
      mod("m2", "No endereço", "At the address", "Contato com cliente e entrega.", "Customer contact and delivery.", ["Seguir padrão de atendimento", "Coletar assinatura/evidência"], ["Follow service standard", "Collect signature/evidence"]),
      mod("m3", "Reentrega e devoluções", "Return and send-backs", "Quando e como reentregar ou devolver.", "When and how to redeliver or return.", ["Registrar ocorrência", "Seguir fluxo de devolução"], ["Log incident", "Follow return flow"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "atendimento-cliente-padrao",
    title_pt: "Atendimento ao cliente (padrão To Do Green)",
    title_en: "Customer service (To Do Green standard)",
    description_pt: "Como representar a marca e atender o cliente no padrão To Do Green.",
    description_en: "How to represent the brand and serve the customer to To Do Green standard.",
    category: "atendimento-cliente",
    duration_minutes: 25,
    difficulty: "beginner",
    role_target: ["DRIVER"],
    mandatory_for_roles: ["DRIVER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Padrão de comunicação", "Communication standard", "Tom e linguagem.", "Tone and language.", ["Usar linguagem clara", "Ser cordial"], ["Use clear language", "Be courteous"]),
      mod("m2", "Situações difíceis", "Difficult situations", "Como agir em reclamações.", "How to act on complaints.", ["Manter calma", "Escalar quando necessário"], ["Stay calm", "Escalate when needed"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "registro-ocorrencias",
    title_pt: "Registro de ocorrências",
    title_en: "Incident reporting",
    description_pt: "Como e quando registrar ocorrências no app e para a operação.",
    description_en: "How and when to log incidents in the app and to operations.",
    category: "operacao-processos",
    duration_minutes: 20,
    difficulty: "beginner",
    role_target: ["DRIVER"],
    mandatory_for_roles: ["DRIVER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Tipos de ocorrência", "Types of incident", "Entrega, veículo, cliente.", "Delivery, vehicle, customer.", ["Identificar tipo", "Preencher corretamente"], ["Identify type", "Fill correctly"]),
      mod("m2", "Fluxo no app", "App flow", "Passo a passo do registro.", "Step-by-step logging.", ["Registrar no app", "Anexar fotos se aplicável"], ["Log in app", "Attach photos if applicable"]),
    ],
    quizPlaceholder: true,
  },
  // Hub Ops
  {
    id: "triagem-conferencia",
    title_pt: "Triagem e conferência",
    title_en: "Sorting and checking",
    description_pt: "Processos de triagem e conferência no hub.",
    description_en: "Sorting and checking processes at the hub.",
    category: "operacao-processos",
    duration_minutes: 40,
    difficulty: "beginner",
    role_target: ["HUB_OPS"],
    mandatory_for_roles: ["HUB_OPS"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "Fluxo de triagem", "Sorting flow", "Ordem e critérios.", "Order and criteria.", ["Executar triagem", "Separar por rota"], ["Perform sorting", "Separate by route"]),
      mod("m2", "Conferência de pacotes", "Package checking", "Checklist de conferência.", "Checking checklist.", ["Conferir volumes", "Registrar divergências"], ["Check volumes", "Log discrepancies"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "checklists-operacao",
    title_pt: "Checklists de operação",
    title_en: "Operation checklists",
    description_pt: "Uso dos checklists no dia a dia do hub.",
    description_en: "Using checklists in daily hub operations.",
    category: "operacao-processos",
    duration_minutes: 25,
    difficulty: "beginner",
    role_target: ["HUB_OPS"],
    mandatory_for_roles: ["HUB_OPS"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Checklist de abertura", "Opening checklist", "Início do turno.", "Start of shift.", ["Completar abertura", "Registrar no sistema"], ["Complete opening", "Log in system"]),
      mod("m2", "Checklist de fechamento", "Closing checklist", "Fim do turno.", "End of shift.", ["Completar fechamento", "Deixar área segura"], ["Complete closing", "Leave area safe"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "roteirizacao-basica",
    title_pt: "Roteirização básica e prioridades",
    title_en: "Basic routing and priorities",
    description_pt: "Noções de roteirização e priorização de entregas.",
    description_en: "Basics of routing and delivery prioritization.",
    category: "operacao-processos",
    duration_minutes: 35,
    difficulty: "beginner",
    role_target: ["HUB_OPS"],
    mandatory_for_roles: ["HUB_OPS"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Prioridades de entrega", "Delivery priorities", "O que priorizar e por quê.", "What to prioritize and why.", ["Identificar prioridades", "Comunicar ao motorista"], ["Identify priorities", "Communicate to driver"]),
      mod("m2", "Ferramenta de rota", "Routing tool", "Uso básico do sistema.", "Basic use of the system.", ["Consultar rotas", "Ajustar quando necessário"], ["Consult routes", "Adjust when needed"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "ocorrencias-devolucoes-reversa",
    title_pt: "Ocorrências, devoluções e reversa",
    title_en: "Incidents, returns and reverse flow",
    description_pt: "Como tratar ocorrências, devoluções e fluxo reverso no hub.",
    description_en: "How to handle incidents, returns and reverse flow at the hub.",
    category: "operacao-processos",
    duration_minutes: 30,
    difficulty: "intermediate",
    role_target: ["HUB_OPS"],
    mandatory_for_roles: ["HUB_OPS"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Registro de ocorrências", "Incident logging", "Quando e como registrar.", "When and how to log.", ["Registrar no sistema", "Comunicar gestor"], ["Log in system", "Inform manager"]),
      mod("m2", "Fluxo de devolução", "Return flow", "Recebimento e destinação.", "Receipt and destination.", ["Receber devoluções", "Seguir procedimento"], ["Receive returns", "Follow procedure"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "seguranca-hub",
    title_pt: "Segurança do hub",
    title_en: "Hub safety",
    description_pt: "Normas de segurança específicas do ambiente do hub.",
    description_en: "Safety rules specific to the hub environment.",
    category: "seguranca-compliance",
    duration_minutes: 25,
    difficulty: "beginner",
    role_target: ["HUB_OPS"],
    mandatory_for_roles: ["HUB_OPS"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Riscos no hub", "Risks at the hub", "Identificação de riscos.", "Risk identification.", ["Reconhecer riscos", "Prevenir acidentes"], ["Recognize risks", "Prevent accidents"]),
      mod("m2", "EPIs e procedimentos", "PPE and procedures", "Uso de EPI e evacuação.", "PPE use and evacuation.", ["Usar EPIs corretos", "Conhecer rota de fuga"], ["Use correct PPE", "Know escape route"]),
    ],
    quizPlaceholder: true,
  },
  // Employee
  {
    id: "processos-internos-essenciais",
    title_pt: "Processos internos essenciais",
    title_en: "Essential internal processes",
    description_pt: "Conheça os principais processos da área interna.",
    description_en: "Learn the main internal area processes.",
    category: "operacao-processos",
    duration_minutes: 35,
    difficulty: "beginner",
    role_target: ["EMPLOYEE"],
    mandatory_for_roles: ["EMPLOYEE"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "Processos da sua área", "Your area processes", "Fluxos principais.", "Main flows.", ["Mapear processos", "Saber a quem recorrer"], ["Map processes", "Know who to turn to"]),
      mod("m2", "Documentação", "Documentation", "Onde encontrar e como atualizar.", "Where to find and how to update.", ["Consultar documentação", "Manter atualizado"], ["Consult documentation", "Keep updated"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "comunicacao-atendimento-interno",
    title_pt: "Comunicação e atendimento interno",
    title_en: "Internal communication and support",
    description_pt: "Padrões de comunicação e atendimento interno.",
    description_en: "Internal communication and support standards.",
    category: "atendimento-cliente",
    duration_minutes: 30,
    difficulty: "beginner",
    role_target: ["EMPLOYEE"],
    mandatory_for_roles: ["EMPLOYEE"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Canais de comunicação", "Communication channels", "Quando usar cada canal.", "When to use each channel.", ["Escolher o canal certo", "Responder no prazo"], ["Choose the right channel", "Reply on time"]),
      mod("m2", "Padrão de atendimento", "Support standard", "Tom e formato de resposta.", "Tone and response format.", ["Responder com clareza", "Registrar demandas"], ["Reply clearly", "Log requests"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "ferramentas-fluxo-trabalho",
    title_pt: "Ferramentas e fluxo de trabalho",
    title_en: "Tools and workflow",
    description_pt: "Ferramentas do dia a dia e fluxo de trabalho.",
    description_en: "Daily tools and workflow.",
    category: "ferramentas-sistemas",
    duration_minutes: 30,
    difficulty: "beginner",
    role_target: ["EMPLOYEE"],
    mandatory_for_roles: ["EMPLOYEE"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Ferramentas principais", "Main tools", "Portal, e-mail, sistemas.", "Portal, email, systems.", ["Acessar ferramentas", "Usar com segurança"], ["Access tools", "Use securely"]),
      mod("m2", "Fluxo de tarefas", "Task flow", "Do pedido à conclusão.", "From request to completion.", ["Organizar tarefas", "Comunicar conclusão"], ["Organize tasks", "Communicate completion"]),
    ],
    quizPlaceholder: true,
  },
  // Manager
  {
    id: "gestao-operacao",
    title_pt: "Gestão de operação",
    title_en: "Operations management",
    description_pt: "Indicadores e acompanhamento da operação.",
    description_en: "Metrics and operations follow-up.",
    category: "operacao-processos",
    duration_minutes: 50,
    difficulty: "intermediate",
    role_target: ["MANAGER", "ADMIN"],
    mandatory_for_roles: ["MANAGER"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "KPIs da operação", "Operation KPIs", "Quais acompanhar.", "Which to track.", ["Ler indicadores", "Identificar desvios"], ["Read metrics", "Identify deviations"]),
      mod("m2", "Acompanhamento diário", "Daily follow-up", "Rotina de gestão.", "Management routine.", ["Fazer reuniões de alinhamento", "Ajustar prioridades"], ["Run alignment meetings", "Adjust priorities"]),
      mod("m3", "Comunicação com a equipe", "Team communication", "Como passar metas e feedback.", "How to share goals and feedback.", ["Comunicar com clareza", "Dar feedback constante"], ["Communicate clearly", "Give constant feedback"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "indicadores-metas-kpis",
    title_pt: "Indicadores e metas (KPIs de treinamento e operação)",
    title_en: "Metrics and goals (training and operations KPIs)",
    description_pt: "Como definir e acompanhar metas de treinamento e operação.",
    description_en: "How to set and track training and operations goals.",
    category: "lideranca",
    duration_minutes: 40,
    difficulty: "intermediate",
    role_target: ["MANAGER", "ADMIN"],
    mandatory_for_roles: ["MANAGER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Metas de treinamento", "Training goals", "Definir e acompanhar.", "Set and track.", ["Definir metas por equipe", "Acompanhar conclusão"], ["Set goals per team", "Track completion"]),
      mod("m2", "Uso do portal para gestão", "Using the portal for management", "Relatórios e progresso.", "Reports and progress.", ["Consultar progresso da equipe", "Identificar gargalos"], ["Check team progress", "Identify bottlenecks"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "lideranca-feedback",
    title_pt: "Liderança e feedback",
    title_en: "Leadership and feedback",
    description_pt: "Práticas de liderança e como dar feedback efetivo.",
    description_en: "Leadership practices and how to give effective feedback.",
    category: "lideranca",
    duration_minutes: 45,
    difficulty: "intermediate",
    role_target: ["MANAGER", "ADMIN"],
    mandatory_for_roles: ["MANAGER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Estilos de liderança", "Leadership styles", "Quando usar cada abordagem.", "When to use each approach.", ["Adaptar estilo à situação", "Desenvolver a equipe"], ["Adapt style to situation", "Develop the team"]),
      mod("m2", "Feedback que gera resultado", "Feedback that gets results", "Modelo e prática.", "Model and practice.", ["Dar feedback construtivo", "Receber feedback"], ["Give constructive feedback", "Receive feedback"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "gestao-incidentes",
    title_pt: "Gestão de incidentes",
    title_en: "Incident management",
    description_pt: "Como gerir e escalar incidentes na operação.",
    description_en: "How to manage and escalate incidents in operations.",
    category: "operacao-processos",
    duration_minutes: 35,
    difficulty: "intermediate",
    role_target: ["MANAGER", "ADMIN"],
    mandatory_for_roles: ["MANAGER"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Classificação de incidentes", "Incident classification", "Gravidade e tipo.", "Severity and type.", ["Classificar corretamente", "Acionar o nível certo"], ["Classify correctly", "Escalate to right level"]),
      mod("m2", "Fluxo de escalação", "Escalation flow", "Quando e para quem escalar.", "When and to whom to escalate.", ["Seguir fluxo", "Documentar decisões"], ["Follow flow", "Document decisions"]),
    ],
    quizPlaceholder: true,
  },
  // Admin
  {
    id: "administracao-portal",
    title_pt: "Administração do portal (permissões e conteúdo)",
    title_en: "Portal administration (permissions and content)",
    description_pt: "Como gerenciar usuários, permissões e conteúdo do portal.",
    description_en: "How to manage users, permissions and portal content.",
    category: "admin-portal",
    duration_minutes: 45,
    difficulty: "advanced",
    role_target: ["ADMIN"],
    mandatory_for_roles: ["ADMIN"],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "Gestão de usuários", "User management", "Criar, editar, desativar.", "Create, edit, deactivate.", ["Gerenciar usuários", "Atribuir funções"], ["Manage users", "Assign roles"]),
      mod("m2", "Permissões e funções", "Permissions and roles", "RBAC e custom claims.", "RBAC and custom claims.", ["Configurar funções", "Testar acessos"], ["Configure roles", "Test access"]),
      mod("m3", "Conteúdo e trilhas", "Content and tracks", "Visão geral da estrutura.", "Overview of structure.", ["Entender estrutura de conteúdo", "Solicitar alterações"], ["Understand content structure", "Request changes"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "seguranca-sistema",
    title_pt: "Boas práticas de segurança do sistema",
    title_en: "System security best practices",
    description_pt: "Segurança e auditoria no uso do portal.",
    description_en: "Security and audit when using the portal.",
    category: "admin-portal",
    duration_minutes: 35,
    difficulty: "advanced",
    role_target: ["ADMIN"],
    mandatory_for_roles: ["ADMIN"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Segurança de acesso", "Access security", "Políticas e boas práticas.", "Policies and best practices.", ["Aplicar políticas", "Revisar acessos"], ["Apply policies", "Review access"]),
      mod("m2", "Auditoria", "Audit", "O que é registrado e como consultar.", "What is logged and how to query.", ["Consultar logs", "Responder a incidentes"], ["Query logs", "Respond to incidents"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "auditoria-governanca",
    title_pt: "Auditoria e governança (demo)",
    title_en: "Audit and governance (demo)",
    description_pt: "Noções de auditoria e governança no contexto do portal.",
    description_en: "Audit and governance in the context of the portal.",
    category: "admin-portal",
    duration_minutes: 30,
    difficulty: "advanced",
    role_target: ["ADMIN"],
    mandatory_for_roles: ["ADMIN"],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Governança de TI", "IT governance", "Princípios e responsabilidades.", "Principles and responsibilities.", ["Conhecer princípios", "Aplicar na rotina"], ["Know principles", "Apply in routine"]),
      mod("m2", "Preparação para auditoria", "Audit preparation", "Documentação e evidências.", "Documentation and evidence.", ["Manter documentação", "Preparar evidências"], ["Keep documentation", "Prepare evidence"]),
    ],
    quizPlaceholder: true,
  },
  // Extra general courses (to reach 30+)
  {
    id: "gen-1",
    title_pt: "Valores e cultura To Do Green",
    title_en: "To Do Green values and culture",
    description_pt: "Nossos valores e como colocá-los em prática no dia a dia.",
    description_en: "Our values and how to put them into practice.",
    category: "cultura-valores",
    duration_minutes: 25,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: [],
    progressDemo: "completed",
    modules: [
      mod("m1", "Nossos valores", "Our values", "Os pilares da To Do Green.", "The pillars of To Do Green.", ["Listar os valores", "Dar exemplos práticos"], ["List values", "Give practical examples"]),
      mod("m2", "Cultura no dia a dia", "Culture in daily life", "Como vivemos os valores.", "How we live the values.", ["Aplicar valores em situações reais", "Reconhecer boas práticas"], ["Apply values in real situations", "Recognize good practices"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "gen-2",
    title_pt: "Sustentabilidade e impacto (ESG)",
    title_en: "Sustainability and impact (ESG)",
    description_pt: "O papel da To Do Green em sustentabilidade e métricas ESG.",
    description_en: "To Do Green's role in sustainability and ESG metrics.",
    category: "sustentabilidade-esg",
    duration_minutes: 35,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: [],
    progressDemo: "in_progress",
    modules: [
      mod("m1", "O que é ESG", "What is ESG", "Environmental, Social, Governance.", "Environmental, Social, Governance.", ["Definir ESG", "Relacionar com a empresa"], ["Define ESG", "Relate to the company"]),
      mod("m2", "Nossa pegada", "Our footprint", "Métricas e redução de impacto.", "Metrics and impact reduction.", ["Conhecer métricas", "Saber como contribuir"], ["Know metrics", "Know how to contribute"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "ev-basico",
    title_pt: "Introdução à mobilidade elétrica",
    title_en: "Introduction to electric mobility",
    description_pt: "Conceitos básicos de veículos elétricos e mobilidade sustentável.",
    description_en: "Basic concepts of electric vehicles and sustainable mobility.",
    category: "mobilidade-eletrica",
    duration_minutes: 30,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: [],
    progressDemo: "not_started",
    modules: [
      mod("m1", "O que é um VE", "What is an EV", "Características e benefícios.", "Features and benefits.", ["Entender diferenças do combustível", "Conhecer benefícios"], ["Understand fuel differences", "Know benefits"]),
      mod("m2", "Infraestrutura", "Infrastructure", "Recarga e rede.", "Charging and network.", ["Conhecer tipos de recarga", "Saber onde recarregar"], ["Know charging types", "Know where to charge"]),
    ],
    quizPlaceholder: true,
  },
  {
    id: "ferramentas-sistemas",
    title_pt: "Ferramentas e sistemas do portal",
    title_en: "Portal tools and systems",
    description_pt: "Visão geral das ferramentas disponíveis no portal.",
    description_en: "Overview of tools available in the portal.",
    category: "ferramentas-sistemas",
    duration_minutes: 20,
    difficulty: "beginner",
    role_target: ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"],
    mandatory_for_roles: [],
    progressDemo: "not_started",
    modules: [
      mod("m1", "Navegação no portal", "Portal navigation", "Menu e áreas.", "Menu and areas.", ["Navegar pelo portal", "Encontrar conteúdo"], ["Navigate the portal", "Find content"]),
      mod("m2", "Academia e perfil", "Academy and profile", "Cursos e progresso.", "Courses and progress.", ["Acessar Academia", "Ver seu progresso"], ["Access Academy", "See your progress"]),
    ],
    quizPlaceholder: true,
  },
];

export function getCoursesForRole(role: PortalRole): AcademyCourse[] {
  return DEMO_ACADEMY_COURSES.filter(
    (c) => c.role_target.includes(role) || c.role_target.length === 0
  );
}
export function getCoursesByCategory(categoryId: CategoryId): AcademyCourse[] {
  return DEMO_ACADEMY_COURSES.filter((c) => c.category === categoryId);
}

export function getMandatoryForRole(role: PortalRole): AcademyCourse[] {
  const allMandatoryIds: string[] = [
    ...GENERAL_MANDATORY_IDS,
    ...(role === "DRIVER" ? DRIVER_MANDATORY_IDS : []),
    ...(role === "HUB_OPS" ? HUB_OPS_MANDATORY_IDS : []),
    ...(role === "EMPLOYEE" ? EMPLOYEE_MANDATORY_IDS : []),
    ...(role === "MANAGER" ? MANAGER_MANDATORY_IDS : []),
    ...(role === "ADMIN" ? ADMIN_MANDATORY_IDS : []),
  ];
  const idSet = new Set(allMandatoryIds);
  return DEMO_ACADEMY_COURSES.filter((c) => idSet.has(c.id));
}

export function getFeaturedForRole(role: PortalRole): AcademyCourse[] {
  const mandatory = getMandatoryForRole(role);
  const general = DEMO_ACADEMY_COURSES.filter(
    (c) => c.category === "cultura-valores" || c.category === "sustentabilidade-esg"
  ).filter((c) => !c.mandatory_for_roles.length || c.mandatory_for_roles.includes(role));
  const twoMandatory = mandatory.slice(0, 2);
  const twoGeneral = general.slice(0, 2);
  return [...twoMandatory, ...twoGeneral];
}

export function getCourseById(id: string): AcademyCourse | undefined {
  return DEMO_ACADEMY_COURSES.find((c) => c.id === id);
}
