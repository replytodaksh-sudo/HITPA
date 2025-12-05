import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../hooks/ProtectedRoute';

import Dashboard from '../pages/dashboard/dashboard';
import AssignedFo from '../pages/AssignedFo/AssignedFo';
import CentralNewCasesAction from '../pages/CentralNewCasesAction/CentralNewCasesAction';
import CentralNewCases from '../pages/CentralNewCases/CentralNewCases';
import DeniedByRegional from '../pages/DeniedByRegional/DeniedByRegional';
import CentralAssignedToRegional from '../pages/CentralAssignedToRegional/CentralAssignedToRegional';
import CentralAssignedToAgency from '../pages/CentralAssignedToAgency/CentralAssignedToAgency';
import CentralReworkCases from '../pages/CentralReworkCases/CentralReworkCases';
import CentralReassignedCases from '../pages/CentralReassignedCases/CentralReassignedCases';
import CentralCaseNotInvestigated from '../pages/CentralCaseNotInvestigated/CentralCaseNotInvestigated';
import AgencyManagement from '../pages/AgencyManagement/AgencyManagement';
import CaseAssignmentRule from '../pages/CaseAssignmentRule/CaseAssignmentRule';
import UserManagement from '../pages/UserManagement/UserManagement';
import RolesManagement from '../pages/RolesManagement/RolesManagement';
import FreshInvestigation from '../pages/FreshInvestigation/FreshInvestigation';
import AgencyDeniedCases from '../pages/AgencyDeniedCases/AgencyDeniedCases';
import FreshSelfDeniedCases from '../pages/FreshSelfDeniedCases/freshSelfDeniedCases';
import CentralMandatedCases from '../pages/CentralMandatedCases/CentralMandatedCases';
import AssignedToSelf from '../pages/AssignedToSelfComponent/assigned-to-self.component';
import FieldReassignedCases from '../pages/FieldReassignedCases/fieldReassignedCases';
import FieldReworkCases from '../pages/FieldReworkCases/FieldReworkCases';
import FieldAssignedToAgency from '../pages/FieldAssignedToAgency/FieldAssignedToAgency';
import CompletedCaseNotInvestigated from '../pages/CompletedCaseNotInvestigated/CompletedCaseNotInvestigated';
import CompletedInvestigationCompleted from '../pages/CentralInvestigationCompleted/CentralInvestigationCompleted';
import QCPendingForms from '../pages/QCPendingForms/QCPendingForms';
import CentralMandatedTabs from '../pages/CentralMandatedCasesTabs/CentralMandatedCasesTabs';
import AgencySelfDeniedTabs from '../pages/AgencySelfDeniedTabs/AgencySelfDeniedTabs';
import AssignToAgencyDetailsTabs from '../pages/AssignToAgencyDetailsTabs/AssignToAgencyDetailsTabs';
import RegionalReworkTabs from '../pages/RegionalReworkTabs/RegionalReworkTabs';
import RegionalReassignForm from '../pages/FieldReassignedForm/FieldReassignedForm';
import RegionalCompletedForm from '../pages/RegionalCompletedForm/RegionalCompletedForm';
import CentralCompletedForm from '../pages/CentralCompletedForm/CentralCompletedForm';
import RegionalCompletedForms from '../pages/RegionalCompletedCase/RegionalCompletedCase';
import AssignedSelfForms from '../pages/AssignedSelfForms/AssignedSelfForms';
import CentralAssignedAgencyTabs from '../pages/CentralAssignedToAgencyTabs/CentralAssignedToAgencyTabs';
import CentralAssignedToRegionalTabs from '../pages/CentralAssignedToRegionalTabs/CentralAssignedToRegionalTabs';
import AgencyDeniedFormTabs from '../pages/AgencyDeniedFormTabs/AgencyDeniedFormTabs ';
import FreshCaseForm from '../pages/FreshCaseForm/FreshCaseForm';
import CentralNewCasesTabs from '../pages/CentralNewCasesTabs/CentralNewCasesTabs';
import RegCentralQuery from '../pages/RegCentralQuery/RegCentralQuery';
import RegQcPending from '../pages/RegQcPending/RegQcPending';
import RegQCPendingCentral from '../pages/RegQCPendingCentral/RegQCPendingCentral';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<div>Redirecting to Keycloak...</div>} />

            {/* Protected Routes - Dashboard */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - FO (Field Officer) */}
            <Route
                path="/admin/foAssignedToFO"
                element={
                    <ProtectedRoute>
                        <AssignedFo />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Central Team */}
            <Route
                path="/admin/centralNewCasesForAction"
                element={
                    <ProtectedRoute>
                        <CentralNewCasesAction />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/centralNewCases"
                element={
                    <ProtectedRoute>
                        <CentralNewCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/deniedByRegional"
                element={
                    <ProtectedRoute>
                        <DeniedByRegional />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/centralAssignedToRegional"
                element={
                    <ProtectedRoute>
                        <CentralAssignedToRegional />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/centralAssignedToAgency"
                element={
                    <ProtectedRoute>
                        <CentralAssignedToAgency />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/centralReworkCases"
                element={
                    <ProtectedRoute>
                        <CentralReworkCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/centralReassignedCases"
                element={
                    <ProtectedRoute>
                        <CentralReassignedCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/centralCaseNotInvestigated"
                element={
                    <ProtectedRoute>
                        <CentralCaseNotInvestigated />
                    </ProtectedRoute>
                }
            />
            {/* <Route
                path="/admin/centralInvestigationCompleted"
                element={
                    <ProtectedRoute>
                        <CentralInvestigationCompleted />
                    </ProtectedRoute>
                }
            /> */}

            {/* Protected Routes - Management */}
            <Route
                path="/admin/agencyManagement"
                element={
                    <ProtectedRoute>
                        <AgencyManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/caseAssignmentRule"
                element={
                    <ProtectedRoute>
                        <CaseAssignmentRule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/userManagement"
                element={
                    <ProtectedRoute>
                        <UserManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/roleManagement"
                element={
                    <ProtectedRoute>
                        <RolesManagement />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Fresh Cases */}
            <Route
                path="/admin/freshNewCases"
                element={
                    <ProtectedRoute>
                        <FreshInvestigation />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/freshAgencyDeniedCases"
                element={
                    <ProtectedRoute>
                        <AgencyDeniedCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/freshSelfDeniedCases"
                element={
                    <ProtectedRoute>
                        <FreshSelfDeniedCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/freshCentralMandatedCases"
                element={
                    <ProtectedRoute>
                        <CentralMandatedCases />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Field Cases */}
            <Route
                path="/admin/fieldAssignedToSelf"
                element={
                    <ProtectedRoute>
                        <AssignedToSelf />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/fieldReassignedCases"
                element={
                    <ProtectedRoute>
                        <FieldReassignedCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/fieldReworkCases"
                element={
                    <ProtectedRoute>
                        <FieldReworkCases />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/fieldAssignedToAgency"
                element={
                    <ProtectedRoute>
                        <FieldAssignedToAgency />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Completed Cases */}
            <Route
                path="/admin/completedCaseNotInvestigated"
                element={
                    <ProtectedRoute>
                        <CompletedCaseNotInvestigated />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/completedInvestigationCompleted"
                element={
                    <ProtectedRoute>
                        <CompletedInvestigationCompleted />
                    </ProtectedRoute>
                }
            />


            {/* Protected Routes - QC */}
            <Route
                path="/admin/qcRegPendingFromCentral"
                element={
                    <ProtectedRoute>
                        <RegQCPendingCentral />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/qcRegQCPending"
                element={
                    <ProtectedRoute>
                        <RegQcPending />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/qcRegCentralQuery"
                element={
                    <ProtectedRoute>
                        <RegCentralQuery />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Detail/Form Pages with :investigationId */}
            <Route
                path="/admin/central-new-cases/:investigationId"
                element={
                    <ProtectedRoute>
                        <CentralNewCasesTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/fresh-case-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <FreshCaseForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/fresh-agency-denied/:investigationId"
                element={
                    <ProtectedRoute>
                        <AgencyDeniedFormTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/central-assign-regional/:investigationId"
                element={
                    <ProtectedRoute>
                        <CentralAssignedToRegionalTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/central-assign-agency/:investigationId"
                element={
                    <ProtectedRoute>
                        <CentralAssignedAgencyTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/assigned-self-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <AssignedSelfForms />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/regional-case-not-inv-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <RegionalCompletedForms />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/central-completed-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <CentralCompletedForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/regional-completed-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <RegionalCompletedForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/regional-reassign-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <RegionalReassignForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/regional-rework-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <RegionalReworkTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/assignedAgencyCashlessDetails/:investigationId"
                element={
                    <ProtectedRoute>
                        <AssignToAgencyDetailsTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/agency-self-denied-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <AgencySelfDeniedTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/fresh-central-mandate/:investigationId"
                element={
                    <ProtectedRoute>
                        <CentralMandatedTabs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/qc-pending-form/:investigationId"
                element={
                    <ProtectedRoute>
                        <QCPendingForms />
                    </ProtectedRoute>
                }
            />

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;




            // import CompletedInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';

            //             <Route path="admin/completedInvestigationCompleted" element={<CompletedInvestigationCompleted />} />



            // import CentralInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';

            // import CompletedInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';

            //             <Route path="admin/centralInvestigationCompleted" element={<CentralInvestigationCompleted />} />