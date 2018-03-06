import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Github from '@pengliheng/github-report';
import '@pengliheng/github-report/lib/index.less';

// local
import './index.less';

@inject('store')
@observer
export default class GithubReport extends Component {
  render() {
    return (
      <div className="github-report">
        <Github />
      </div>
    );
  }
}
