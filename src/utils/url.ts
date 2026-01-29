export const getUrl = (label: string, caseType: string) => {
    let roleName = sessionStorage.getItem("roleName");

    if (caseType.toLowerCase().indexOf("fresh") > -1) {
        if (label.toLowerCase().indexOf("new") > -1) {

            if (roleName === 'Regional Manager') {
                return "/admin/freshNewCases";
            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyNewCases";
            }
            if (roleName === 'Central Manager') {
                if (label.toLowerCase().indexOf("new cases for action") > -1) {
                    return "/admin/centralNewCasesForAction";
                } else return "/admin/centralNewCases";
            }


        } else if (label.toLowerCase().indexOf("agency denied") > -1) {
            return "/admin/freshAgencyDeniedCases";
        } else if (label.toLowerCase().indexOf("central mandated") > -1) {
            return "/admin/freshCentralMandatedCases";
        } else if (label.toLowerCase().indexOf("self denied") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/freshSelfDeniedCases";
            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencySelfDeniedCases";
            }

        }
        else if (label.toLowerCase().indexOf("denied by regional") > -1) {
            return "/admin/deniedByRegional";
        }
    } else if (caseType.toLowerCase().indexOf("on field") > -1) {
        if (label.toLowerCase().indexOf("assigned to self") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/fieldAssignedToSelf";

            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyAssignedToSelf";

            }

        } else if (label.toLowerCase().indexOf("assigned to regional") > -1) {
            return "/admin/centralAssignedToRegional";

        } else if (label.toLowerCase().indexOf("assigned to fo") > -1) {
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyAssignedToFO";

            }

        } else if (label.toLowerCase().indexOf("assigned to agency") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/fieldAssignedToAgency";

            }
            if (roleName === 'Central Manager') {
                return "/admin/centralAssignedToAgency";

            }

        } else if (label.toLowerCase().indexOf("rework") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/fieldReworkCases";

            }
            if (roleName === 'Central Manager') {
                return "/admin/centralReworkCases";

            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyReworkCases";
            }
        } else if (label.toLowerCase().indexOf("reassigned") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/fieldReassignedCases";
            }
            if (roleName === 'Central Manager') {
                return "/admin/centralReassignedCases";

            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyReassignedCases";
            }

        }
    } else if (caseType.toLowerCase().indexOf("completed") > -1) {
        if (label.toLowerCase().indexOf("investigation") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/completedInvestigationCompleted";

            }
            if (roleName === 'Central Manager') {
                return "/admin/centralInvestigationCompleted";

            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyInvestigationCompleted";

            }
        } else if (label.toLowerCase().indexOf("not investigated") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/completedCaseNotInvestigated";

            }
            if (roleName === 'Central Manager') {
                return "/admin/centralCaseNotInvestigated";

            }
            if (roleName === 'Agency Spoc') {
                return "/admin/agencyCaseNotInvestigated";

            }

        }
    }
    else if (caseType.toLowerCase().indexOf("regional") > -1) {
        if (label.toLowerCase().indexOf("pending") > -1) {
            if (roleName === 'Regional Manager') {
                return "/admin/qcRegQCPending";

            }
            //console.log(label +" == "+label.toLowerCase().startsWith("qc pending"))
            if (roleName === 'Central Manager' && (label.toLowerCase().startsWith("qc pending"))) {
                return "/admin/centralQCPending";
            } else if (roleName === 'Central Manager') {
                return "/admin/centralQueryResponsePending";
            }

            if (roleName === 'Agency Spoc') {
                return "/admin/agencyQCPending";

            }

        } else if (label.toLowerCase().indexOf("central query") > -1) {
            return "/admin/qcRegCentralQuery";
        } else if (label.toLowerCase().indexOf("submitted") > -1) {
            if (roleName === 'Regional Manager') {
                return '/admin/qcRegPendingFromCentral';

            }
            if (roleName === 'Agency Spoc') {
                return '/admin/agencyPendingFromReg';

            }

        }
        else if (label.toLowerCase().indexOf("query response") > -1) {
            return "/admin/centralQueryResponse";
        } else if (label.toLowerCase().indexOf("query by claims team") > -1) {
            return '/admin/queriesByClaimsTeam';
        }
    }


    return "javascript:void(0)";
}