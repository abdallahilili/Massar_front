import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RequireAuth, RequireRole } from "@/components/common/RouteGuards";
import { ROUTES } from "@/constants/routes";

import { HomePage } from "@/pages/public/HomePage";
import { ServiceDetailPage } from "@/pages/public/ServiceDetailPage";
import { CheckNamePage } from "@/pages/public/CheckNamePage";
import { OnboardingPage } from "@/pages/public/OnboardingPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { VerifyLicensePage } from "@/pages/public/VerifyLicensePage";

import { InvestorDashboardPage } from "@/pages/investor/InvestorDashboardPage";
import { InspectionsListPage } from "@/pages/inspector/InspectionsListPage";
import { InspectionReportPage } from "@/pages/inspector/InspectionReportPage";
import { AdminPaymentsPage } from "@/pages/admin/AdminPaymentsPage";

import {
  ForbiddenPage,
  NotFoundPage,
  ServerErrorPage,
  UnauthorizedPage,
} from "@/pages/errors/ErrorPages";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: "/services/:serviceId", element: <ServiceDetailPage /> },
      { path: ROUTES.checkName, element: <CheckNamePage /> },
      { path: ROUTES.onboarding, element: <OnboardingPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.verifyLicense, element: <VerifyLicensePage /> },
      { path: ROUTES.unauthorized, element: <UnauthorizedPage /> },
      { path: ROUTES.forbidden, element: <ForbiddenPage /> },
      { path: ROUTES.serverError, element: <ServerErrorPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole roles={["INVESTOR"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: ROUTES.investorDashboard, element: <InvestorDashboardPage /> }],
          },
        ],
      },
      {
        element: <RequireRole roles={["INSPECTOR"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.inspectorInspections, element: <InspectionsListPage /> },
              { path: "/espace-inspecteur/:inspectionId/rapport", element: <InspectionReportPage /> },
            ],
          },
        ],
      },
      {
        element: <RequireRole roles={["ADMIN"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: ROUTES.adminPayments, element: <AdminPaymentsPage /> }],
          },
        ],
      },
    ],
  },
  { path: ROUTES.notFound, element: <NotFoundPage /> },
]);
