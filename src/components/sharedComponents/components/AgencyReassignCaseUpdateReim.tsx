import React, { useState, useEffect } from 'react';
import AcceptDeny from './AcceptDeny';

// ==================== INTERFACES ====================
interface AgencyReassignCaseUpdateReimProps {
  investigationId: string;
}

interface PreviousData {
  activeCaseID?: string;
  boolStatusOfInsured?: boolean | null;
  createdBy?: string;
  noDataStatus?: string;
  status?: string;
  reworkCaseComments?: string | null;
  prevInvestigatorReport?: string;
  [key: string]: any;
}

// ==================== MAIN COMPONENT ====================
const AgencyReassignCaseUpdateReim: React.FC<AgencyReassignCaseUpdateReimProps> = ({
  investigationId: propInvestigationId,
}) => {
  // Get URL params (you'll need your router hooks here)
  const fieldType = 'reassign'; // Get from useSearchParams()
  const claimsType = 'reim'; // Get from useSearchParams()
  
  const [investigationId, setInvestigationId] = useState('');
  const [previousData, setPreviousData] = useState<PreviousData>({});
  const [statusInsuredVisit, setStatusInsuredVisit] = useState<string>('');
  const [checkEditable, setCheckEditable] = useState(false);
  const [assignFieldOfficer, setAssignFieldOfficer] = useState('No');
  const [accId, setAccId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const roleName = sessionStorage.getItem('roleName') || '';

  // Initialize investigation ID
  useEffect(() => {
    if (propInvestigationId) {
      // Clean investigation ID (remove suffix after space)
      const cleanId = propInvestigationId.split(' ')[0];
      setInvestigationId(cleanId);
    }
  }, [propInvestigationId]);

  // Fetch saved form data
  useEffect(() => {
    if (investigationId) {
      getSavedFormData();
    }
  }, [investigationId]);

  const getSavedFormData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await CaseUpdateService.caseUpdatePreviousDataReim(investigationId);
      
      // Mock response for demonstration
      const response = {
        statusCode: 0,
        payload: {
          activeCaseID: 'CASE123',
          boolStatusOfInsured: true,
          createdBy: 'USER123',
          noDataStatus: 'Editable',
          status: 'Draft',
          reworkCaseComments: 'Please reverify hospital documents and collect missing bills',
          prevInvestigatorReport: 'yes',
        }
      };

      if (response.statusCode === 0) {
        setPreviousData(response.payload);
        
        // Store activeCaseID in localStorage
        if (response.payload.activeCaseID) {
          localStorage.setItem('activeCaseID', response.payload.activeCaseID);
        }

        // Set status of insured visit
        if (response.payload.boolStatusOfInsured !== null && response.payload.boolStatusOfInsured !== undefined) {
          setStatusInsuredVisit(response.payload.boolStatusOfInsured ? '1' : '0');
        }

        // Check if editable
        checkIsEditable(response.payload);
      } else {
        setPreviousData(response.payload || {});
        checkIsEditable(response.payload || {});
      }
    } catch (error) {
      console.error('Error fetching saved form data:', error);
      setPreviousData({});
    } finally {
      setLoading(false);
    }
  };

  const checkIsEditable = (data: PreviousData) => {
    const globalUserCode = data.createdBy;
    const localUserCode = sessionStorage.getItem('userCode');
    const status = data.noDataStatus;

    // Editable logic based on noDataStatus
    if (data.noDataStatus === 'NonEditable') {
      setCheckEditable(true); // Read-only
    } else if (data.noDataStatus === 'Editable') {
      setCheckEditable(false); // Editable
    }

    console.log('Check Editable:', {
      noDataStatus: data.noDataStatus,
      checkEditable: data.noDataStatus === 'NonEditable',
    });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <div>Loading case update data...</div>
      </div>
    );
  }

  // Show accept/deny component for reassign cases
  const showReassignContent = 
    fieldType === 'reassign' && 
    previousData.reworkCaseComments !== null && 
    previousData.reworkCaseComments !== '' &&
    previousData.reworkCaseComments !== undefined;

  return (
    <div style={{ width: '100%', padding: '16px 0' }}>
      {showReassignContent ? (
        <div>
          {/* Rework Comments Display */}
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #D80E51',
            borderRadius: '4px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{
                color: '#D80E51',
                fontWeight: 700,
                fontSize: '14px'
              }}>
                Reassign case:
              </span>
              <span style={{
                fontWeight: 700,
                fontSize: '14px',
                flex: 1
              }}>
                {previousData.reworkCaseComments}
              </span>
            </div>
          </div>

          {/* Accept and Assign to Field Officer (Commented out in original) */}
          {previousData.prevInvestigatorReport === 'yes' && false && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              gap: '24px'
            }}>
              <div style={{ flex: '0 0 33%' }}>
                Accept and assign to Field Officer
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="assignFieldOfficer"
                    value="Yes"
                    checked={assignFieldOfficer === 'Yes'}
                    onChange={(e) => setAssignFieldOfficer(e.target.value)}
                  />
                  <span>Yes</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="assignFieldOfficer"
                    value="No"
                    checked={assignFieldOfficer === 'No'}
                    onChange={(e) => setAssignFieldOfficer(e.target.value)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          )}

          {/* Accept Agencies Component (when assign to field officer) */}
          {assignFieldOfficer === 'Yes' && (
            <div style={{ marginBottom: '24px' }}>
              {/* <AcceptAgencies accId={accId} /> */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                Accept Agencies Component (Replace with actual component)
              </div>
            </div>
          )}

           {/* Accept/Deny Component (main action) */}
          <div>
            <AcceptDeny 
              claimType={claimsType}
            />
          </div>
        </div>
      ) : (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          color: '#999'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            No rework comments available
          </div>
          <div style={{ fontSize: '14px' }}>
            This case does not have reassignment comments.
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyReassignCaseUpdateReim;