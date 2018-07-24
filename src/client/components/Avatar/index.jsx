// pkg
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.less';
import { personalDefaultAvator } from '../../../../config/project';

@inject('store')
@observer
export default class Avatar extends Component {
  render() {
    const {
      id, className, shape, src, size, badge,
    } = this.props;
    return (
      <div className={`self-avatar ${className} ${size} ${badge || ''}`} data-id={this.props['data-id']} id={id}>
        <img className={`${size} ${shape}`} src={this.props.src} alt="头像" onError={(e) => { e.target.src = personalDefaultAvator; }} />
        {badge && <sup className={badge || ''} data-show="true" />}
      </div>
    );
  }
}
