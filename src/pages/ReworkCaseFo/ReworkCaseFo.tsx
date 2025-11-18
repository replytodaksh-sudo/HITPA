import React, { useState, useEffect } from 'react';

// Placeholder for child components - replace with actual imports
const ReworkCaseFoCashless = () => <div>Cashless Component Placeholder</div>;
const ReimTable = () => <div>Reimbursement Component Placeholder</div>;

const ReworkCaseFo = () => {
  const [activeTab, setActiveTab] = useState('cashless');

  useEffect(() => {
    // Initialize with empty string on component mount (similar to ngOnInit)
    toggleCaseType('');
  }, []);

  const toggleCaseType = (type = '') => {
    localStorage.setItem('activeCaseType', type);
  };

  const handleTabClick = (tab:any, caseType = '') => {
    setActiveTab(tab);
    toggleCaseType(caseType);
  };

  return (
    <div className="container fiori-container">
      <div className="main-card mb-3 card mt-4">
        <div className="card-body">
          <ul className="tabs-animated-shadow tabs-animated nav">
            <li className="nav-item">
              <a
                role="tab"
                className={`nav-link ${activeTab === 'cashless' ? 'active show' : 'show'}`}
                id="tab-c-0"
                href="#tab-cashless"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('cashless', '');
                }}
                aria-selected={activeTab === 'cashless'}
              >
                <span>Cashless</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                role="tab"
                className={`nav-link ${activeTab === 'reimbursement' ? 'active show' : 'show'}`}
                id="tab-c-1"
                href="#tab-reimbursement"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('reimbursement', 'reimtable');
                }}
                aria-selected={activeTab === 'reimbursement'}
              >
                <span>Reimbursement</span>
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className={`tab-pane ${activeTab === 'cashless' ? 'active show' : ''}`}
              id="tab-cashless"
              role="tabpanel"
            >
              <ReworkCaseFoCashless />
            </div>
            <div
              className={`tab-pane ${activeTab === 'reimbursement' ? 'active show' : ''}`}
              id="tab-reimbursement"
              role="tabpanel"
            >
              <ReimTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReworkCaseFo;