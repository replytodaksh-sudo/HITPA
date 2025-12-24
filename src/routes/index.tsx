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
import MainLayout from '../components/MainLayout';
import AgencyNewCases from '../pages/AgencyNewCases/agencyNewCases';
import AgencyReworkCases from '../pages/AgencyReworkCases/AgencyReworkCases';
import AgencyReassignedCases from '../pages/AgencyReassignedCases/AgencyReassignedCases';
import AgencyCaseNotInvestigated from '../pages/AgencyCaseNotInvestigated/AgencyCaseNotInvestigated';
import AgencyInvestigationCompleted from '../pages/AgencyInvestigationCompleted/AgencyInvestigationCompleted';
import AgencySelfDeniedForms from '../pages/AgencySelfDeniedForms/AgencySelfDeniedForms';
import AgencyReworkTabs from '../pages/AgencyReworkTabs/AgencyReworkTabs';
import AgencyReassignTabs from '../pages/AgencyReassignTabs/AgencyReassignTabs';
import AgencyCaseNotInvestigatedTabs from '../pages/AgencyCaseNotInvestigatedTabs/AgencyCaseNotInvestigatedTabs';
import QCSubmitted from '../pages/QCSubmitted/QCSubmitted';
import QCSubmittedForms from '../pages/QCSubmittedForms/QCSubmittedForms';
import AgencyQCSubmittedForms from '../pages/AgencyQCSubmitted/AgencyQCSubmitted';
import AgencyQCPending from '../pages/AgencyQCPending/AgencyQCPending';
import CentralQueryResponsePending from '../pages/CentralQueryResponsePending/CentralQueryResponsePending';
import CentralQueryResponse from '../pages/CentralQueryResponse/CentralQueryResponse';
import CentralQCPending from '../pages/CentralQCPending/CentralQCPending';
import QueriesByClaimsTeam from '../pages/QueriesByClaimsTeam/QueriesByClaimsTeam';
import CentralQCForm from '../pages/CentralQCForm/CentralQCForm';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<div>Redirecting to Keycloak...</div>} />
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            > */}
            <Route path="/admin" element={<MainLayout />}>
                {/* Protected Routes - Dashboard */}
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - FO (Field Officer) */}
                <Route
                    path="foAssignedToFO"
                    element={
                        <ProtectedRoute>
                            <AssignedFo />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Central Team */}
                <Route
                    path="centralNewCasesForAction"
                    element={
                        <ProtectedRoute>
                            <CentralNewCasesAction />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralNewCases"
                    element={
                        <ProtectedRoute>
                            <CentralNewCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="deniedByRegional"
                    element={
                        <ProtectedRoute>
                            <DeniedByRegional />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralAssignedToRegional"
                    element={
                        <ProtectedRoute>
                            <CentralAssignedToRegional />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralAssignedToAgency"
                    element={
                        <ProtectedRoute>
                            <CentralAssignedToAgency />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralReworkCases"
                    element={
                        <ProtectedRoute>
                            <CentralReworkCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralReassignedCases"
                    element={
                        <ProtectedRoute>
                            <CentralReassignedCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralCaseNotInvestigated"
                    element={
                        <ProtectedRoute>
                            <CentralCaseNotInvestigated />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyCaseNotInvestigated"
                    element={
                        <ProtectedRoute>
                            <AgencyCaseNotInvestigated />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyInvestigationCompleted"
                    element={
                        <ProtectedRoute>
                            <AgencyInvestigationCompleted />
                        </ProtectedRoute>
                    }
                />
                {/* <Route
                path="centralInvestigationCompleted"
                element={
                    <ProtectedRoute>
                        <CentralInvestigationCompleted />
                    </ProtectedRoute>
                }
            /> */}

                {/* Protected Routes - Management */}
                <Route
                    path="agencyManagement"
                    element={
                        <ProtectedRoute>
                            <AgencyManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="caseAssignmentRule"
                    element={
                        <ProtectedRoute>
                            <CaseAssignmentRule />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="userManagement"
                    element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="roleManagement"
                    element={
                        <ProtectedRoute>
                            <RolesManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Fresh Cases */}
                <Route
                    path="freshNewCases"
                    element={
                        <ProtectedRoute>
                            <FreshInvestigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="freshAgencyDeniedCases"
                    element={
                        <ProtectedRoute>
                            <AgencyDeniedCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="freshSelfDeniedCases"
                    element={
                        <ProtectedRoute>
                            <FreshSelfDeniedCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencySelfDeniedCases"
                    element={
                        <ProtectedRoute>
                            <FreshSelfDeniedCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="freshCentralMandatedCases"
                    element={
                        <ProtectedRoute>
                            <CentralMandatedCases />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Field Cases */}
                <Route
                    path="fieldAssignedToSelf"
                    element={
                        <ProtectedRoute>
                            <AssignedToSelf />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyAssignedToSelf"
                    element={
                        <ProtectedRoute>
                            <AssignedToSelf />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="fieldReassignedCases"
                    element={
                        <ProtectedRoute>
                            <FieldReassignedCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyReassignedCases"
                    element={
                        <ProtectedRoute>
                            <AgencyReassignedCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="fieldReworkCases"
                    element={
                        <ProtectedRoute>
                            <FieldReworkCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyReworkCases"
                    element={
                        <ProtectedRoute>
                            <AgencyReworkCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="fieldAssignedToAgency"
                    element={
                        <ProtectedRoute>
                            <FieldAssignedToAgency />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyAssignedToFO"
                    element={
                        <ProtectedRoute>
                            <FieldAssignedToAgency />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Completed Cases */}
                <Route
                    path="completedCaseNotInvestigated"
                    element={
                        <ProtectedRoute>
                            <CompletedCaseNotInvestigated />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="completedInvestigationCompleted"
                    element={
                        <ProtectedRoute>
                            <CompletedInvestigationCompleted />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyNewCases"
                    element={
                        <ProtectedRoute>
                            <AgencyNewCases />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyPendingFromReg"
                    element={
                        <ProtectedRoute>
                            <QCSubmitted />
                        </ProtectedRoute>
                    }
                />


                {/* Protected Routes - QC */}
                <Route
                    path="qcRegPendingFromCentral"
                    element={
                        <ProtectedRoute>
                            <RegQCPendingCentral />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="qcRegQCPending"
                    element={
                        <ProtectedRoute>
                            <RegQcPending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="qcRegCentralQuery"
                    element={
                        <ProtectedRoute>
                            <RegCentralQuery />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyQCPending"
                    element={
                        <ProtectedRoute>
                            <AgencyQCPending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyQCPending"
                    element={
                        <ProtectedRoute>
                            <AgencyQCPending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyQCPending"
                    element={
                        <ProtectedRoute>
                            <AgencyQCPending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agencyQCPending"
                    element={
                        <ProtectedRoute>
                            <AgencyQCPending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="CentralQueryResponsePending"
                    element={
                        <ProtectedRoute>
                            <CentralQueryResponsePending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralQueryResponse"
                    element={
                        <ProtectedRoute>
                            <CentralQueryResponse />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="centralQCPending"
                    element={
                        <ProtectedRoute>
                            <CentralQCPending />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="queriesByClaimsTeam"
                    element={
                        <ProtectedRoute>
                            <QueriesByClaimsTeam />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Detail/Form Pages with :investigationId */}
                <Route
                    path="central-new-cases/:investigationId"
                    element={
                        <ProtectedRoute>
                            <CentralNewCasesTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="fresh-case-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <FreshCaseForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="fresh-agency-denied/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencyDeniedFormTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="central-assign-regional/:investigationId"
                    element={
                        <ProtectedRoute>
                            <CentralAssignedToRegionalTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="central-assign-agency/:investigationId"
                    element={
                        <ProtectedRoute>
                            <CentralAssignedAgencyTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="assigned-self-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AssignedSelfForms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="regional-case-not-inv-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <RegionalCompletedForms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="central-completed-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <CentralCompletedForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="regional-completed-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <RegionalCompletedForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="regional-reassign-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <RegionalReassignForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="regional-rework-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <RegionalReworkTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="assignedAgencyCashlessDetails/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AssignToAgencyDetailsTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-rework-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencyReworkTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-self-denied-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencySelfDeniedTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="fresh-central-mandate/:investigationId"
                    element={
                        <ProtectedRoute>
                            <CentralMandatedTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-self-denied-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencySelfDeniedForms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-reassign-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencyReassignTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-case-not-investigated/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencyCaseNotInvestigatedTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="qc-pending-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <QCPendingForms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-qc-submitted-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <AgencyQCSubmittedForms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="agency-qc-pending-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <QCSubmittedForms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="central-qc-form/:investigationId"
                    element={
                        <ProtectedRoute>
                            <CentralQCForm />
                        </ProtectedRoute>
                    }
                />
            </Route>
            {/* Default redirects */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
            <Route
                path="*"
                element={
                    <div>
                        <h1>404 - Page Not Found</h1>
                        <p>Current path: {location.pathname}</p>
                    </div>
                }
            />
        </Routes>
    );
};

export default AppRoutes;




// import CompletedInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';

//             <Route path="completedInvestigationCompleted" element={<CompletedInvestigationCompleted />} />



// import CentralInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';

// import CompletedInvestigationCompleted from './pages/CentralInvestigationCompleted/CentralInvestigationCompleted';

//             <Route path="centralInvestigationCompleted" element={<CentralInvestigationCompleted />} />