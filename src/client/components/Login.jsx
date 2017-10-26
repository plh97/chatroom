import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Button } from 'antd';
import { inject, observer } from "mobx-react"
import '../less/registerLogin.less'

@inject("store")
@observer
export default class Login extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			type: 'login',
			token: localStorage.token
		}
	}
	componentDidMount() {
		localStorage.token ? this.props.store.socket({url:'login',...this.state}) : ""
		this.props.store.tipFunc("请登录")
		this._input.focus();
	}

	onUserNameChange = (e) => {
		this.setState({
			userName:e.target.value
		})
	}

	onPassWordChange = (e) => {
		this.setState({
			passWord:e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
    if(!this.state.userName){
        this.props.store.tipFunc("用户名不能为空")
    }else if(!this.state.passWord){
        this.props.store.tipFunc("密码不能为空")
    }else{
			this.props.store.socket({
				url:'login',
				...this.state
			})
		}
	}

	render() {
		const { tip } = this.props.store
		return (
			<form onSubmit={this.handleSubmit} className="login-form">
				<h1 className = 'header'>
					&nbsp;
					{ tip }
				</h1>
				<div className="userName">
					<Icon className="prefix" type="user" style={{ fontSize: 13 }} />
					<input id="userName"
						ref={ (c)=> this._input = c }
						onChange={this.onUserNameChange}
						placeholder="用户名" />
				</div>
				<div className="passWord">
					<Icon className="prefix" type="lock" style={{ fontSize: 13 }} />
					<input
						onChange={this.onPassWordChange}
						type="password"
						placeholder="Password" />
				</div>
				<div className="button">
					<Button type="primary" htmlType="submit" className="login-form-button">
						登 陆
					</Button>
					Or <Link to="/register">注 册</Link>
				</div>
			</form>
		)
	}
}
