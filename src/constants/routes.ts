export const ROUTES = {
  home: "/",
  serviceDetail: (id: string | number = ":serviceId") => `/services/${id}`,
  checkName: "/verifier-nom",
  onboarding: "/inscription",
  login: "/connexion",
  verifyLicense: "/verifier-licence",

  investorDashboard: "/espace-investisseur",
  inspectorInspections: "/espace-inspecteur",
  inspectorReport: (id: string | number = ":inspectionId") =>
    `/espace-inspecteur/${id}/rapport`,
  adminPayments: "/espace-administration/paiements",

  forbidden: "/403",
  unauthorized: "/401",
  serverError: "/500",
  notFound: "*",
} as const;
