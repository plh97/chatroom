import React from 'react';
import Github from '@pengliheng/github-report';
import '@pengliheng/github-report/lib/index.less';

// local
import './index.less';

const GithubReport = props => (
  <div className="github-report">
    <Github {...props} />
  </div>
);

export default GithubReport;
