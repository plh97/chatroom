// pkg
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import { defaultUserAvatar } from '../../../../config/server';

@inject('store')
@observer
export default class Avatar extends Component {
  render() {
    console.log(styles, this.props, defaultUserAvatar);
    const {
      id, className, shape, src, size, badge,
    } = this.props;
    return (
      <div className={`self-avatar ${className} ${size} ${badge || ''}`} data-id={this.props['data-id']} id={id}>
        <img className={`${size} ${shape}`} src={this.props.src ? this.props.src : defaultUserAvatar} alt="头像" />
        {badge && <sup className={badge || ''} data-show="true" />}
      </div>
    );
  }
}
