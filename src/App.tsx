import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './components/MainLayout';
import { authService } from './services/auth.service';
import Dashboard from './pages/dashboard/dashboard';
import { theme } from './theme';
import AssignedFo from './pages/AssignedFo/AssignedFo';
import GlobalNotification from './utils/GlobalNotification';
import Login from './pages/login/Login';
import CentralNewCasesAction from './pages/CentralNewCasesAction/CentralNewCasesAction';
import CentralNewCases from './pages/CentralNewCases/CentralNewCases';
import CentralAssignedToRegional from './pages/CentralAssignedToRegional/CentralAssignedToRegional';
import CentralAssignedToAgency from './pages/CentralAssignedToAgency/CentralAssignedToAgency';
import CentralCaseNotInvestigated from './pages/CentralCaseNotInvestigated/CentralCaseNotInvestigated';
import CentralInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';
import CentralReassignedCases from './pages/CentralReassignedCases/CentralReassignedCases';
import CentralReworkCases from './pages/CentralReworkCases/CentralReworkCases';
import DeniedByRegional from './pages/DeniedByRegional/DeniedByRegional';
import AgencyManagement from './pages/AgencyManagement/AgencyManagement';
import CaseAssignmentRule from './pages/CaseAssignmentRule/CaseAssignmentRule';
import UserManagement from './pages/UserManagement/UserManagement';
import RolesManagement from './pages/RolesManagement/RolesManagement';
import CentralNewCasesTabs from './pages/CentralNewCasesTabs/CentralNewCasesTabs';
import FreshInvestigation from './pages/FreshInvestigation/FreshInvestigation';
import FreshCaseForm from './pages/FreshCaseForm/FreshCaseForm';
import AgencyDeniedCases from './pages/AgencyDeniedCases/AgencyDeniedCases';
import AgencyDeniedFormTabs from './pages/AgencyDeniedFormTabs/AgencyDeniedFormTabs ';
import AssignedToSelf from './pages/AssignedToSelfComponent/assigned-to-self.component';
import CentralAssignedToRegionalTabs from './pages/CentralAssignedToRegionalTabs/CentralAssignedToRegionalTabs';
import CentralAssignedAgencyTabs from './pages/CentralAssignedToAgencyTabs/CentralAssignedToAgencyTabs';
import AssignedSelfForms from './pages/AssignedSelfForms/AssignedSelfForms';
import RegionalCompletedForms from './pages/RegionalCompletedCase/RegionalCompletedCase';
import CentralCompletedForm from './pages/CentralCompletedForm/CentralCompletedForm';
import CompletedCaseNotInvestigated from './pages/CompletedCaseNotInvestigated/CompletedCaseNotInvestigated';
import CompletedInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';
import RegionalCompletedForm from './pages/RegionalCompletedForm/RegionalCompletedForm';
import FieldReassignedCases from './pages/FieldReassignedCases/fieldReassignedCases';
import RegionalReassignForm from './pages/FieldReassignedForm/FieldReassignedForm';
import FieldReworkCases from './pages/FieldReworkCases/FieldReworkCases';
import RegionalReworkTabs from './pages/RegionalReworkTabs/RegionalReworkTabs';
import FieldAssignedToAgency from './pages/FieldAssignedToAgency/FieldAssignedToAgency';
import AssignToAgencyDetailsTabs from './pages/AssignToAgencyDetailsTabs/AssignToAgencyDetailsTabs';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalNotification />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin/foAssignedToFO" element={<AssignedFo />} />
            <Route path="admin/centralNewCasesForAction" element={<CentralNewCasesAction />} />
            <Route path="admin/centralNewCases" element={<CentralNewCases />} />
            <Route path="admin/deniedByRegional" element={<DeniedByRegional />} />
            <Route path="admin/centralAssignedToRegional" element={<CentralAssignedToRegional />} />
            <Route path="admin/centralAssignedToAgency" element={<CentralAssignedToAgency />} />
            <Route path="admin/centralReworkCases" element={<CentralReworkCases />} />
            <Route path="admin/centralReassignedCases" element={<CentralReassignedCases />} />
            <Route path="admin/centralCaseNotInvestigated" element={<CentralCaseNotInvestigated />} />
            <Route path="admin/centralInvestigationCompleted" element={<CentralInvestigationCompleted />} />
            <Route path="admin/agencyManagement" element={<AgencyManagement />} />
            <Route path="admin/caseAssignmentRule" element={<CaseAssignmentRule />} />
            <Route path="admin/userManagement" element={<UserManagement />} />
            <Route path="admin/roleManagement" element={<RolesManagement />} />
            <Route path="admin/freshNewCases" element={<FreshInvestigation />} />
            <Route path="admin/freshAgencyDeniedCases" element={<AgencyDeniedCases />} />
            <Route path="admin/fieldAssignedToSelf" element={<AssignedToSelf />} />
            <Route path="admin/completedCaseNotInvestigated" element={<CompletedCaseNotInvestigated />} />
            <Route path="admin/completedInvestigationCompleted" element={<CompletedInvestigationCompleted />} />
            <Route path="admin/fieldReassignedCases" element={<FieldReassignedCases />} />
            <Route path="admin/fieldReworkCases" element={<FieldReworkCases />} />
            <Route path="admin/fieldAssignedToAgency" element={<FieldAssignedToAgency />} />
            <Route
              path="admin/central-new-cases/:investigationId"
              element={<CentralNewCasesTabs />}
            />
            <Route
              path="admin/fresh-case-form/:investigationId"
              element={<FreshCaseForm />}
            />
            <Route
              path="admin/fresh-agency-denied/:investigationId"
              element={<AgencyDeniedFormTabs />}
            />
            <Route
              path="admin/central-assign-regional/:investigationId"
              element={<CentralAssignedToRegionalTabs />}
            />
            <Route
              path="admin/central-assign-agency/:investigationId"
              element={<CentralAssignedAgencyTabs />}
            />
            <Route
              path="admin/assigned-self-form/:investigationId"
              element={<AssignedSelfForms />}
            />
            <Route
              path="admin/regional-case-not-inv-form/:investigationId"
              element={<RegionalCompletedForms />}
            />
            <Route
              path="admin/central-completed-form/:investigationId"
              element={<CentralCompletedForm />}
            />
            <Route
              path="admin/regional-completed-form/:investigationId"
              element={<RegionalCompletedForm />}
            />
            <Route
              path="admin/regional-reassign-form/:investigationId"
              element={<RegionalReassignForm />}
            />
            <Route
              path="admin/regional-rework-form/:investigationId"
              element={<RegionalReworkTabs />}
            />
            <Route
              path="admin/assignedAgencyCashlessDetails/:investigationId"
              element={<AssignToAgencyDetailsTabs />}
            />
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;