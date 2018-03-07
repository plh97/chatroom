import React from 'react';
import Github from '@pengliheng/github-report';
import '@pengliheng/github-report/lib/index.less';

// local
import './index.less';

const GithubReport = ({ match }) => (
  <div className="github-report">
    <Github name={(match.params.name === 'undefined' ? 'pengliheng' : match.params.name)} />
  </div>
);

export default GithubReport;
