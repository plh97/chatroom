import React from "react"
import {Grid,Row,Form, FormGroup, Col, ControlLabel, FormControl, Checkbox, Button} from 'react-bootstrap'
import $ from 'jquery'

export default class Login extends React.Component{
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
		this.handleUserName = this.handleUserName.bind(this); 
		this.handlePassWord = this.handlePassWord.bind(this);
		this.state = {
			userName:'',
			passWord:''
		}
	}
	handleUserName(e){
		this.setState({userName:e.target.value})
	}
	handlePassWord(e){
		this.setState({passWord:e.target.value})
	}
	handleLogin(event) {
		event.preventDefault();
		if(this.state.userName.length==0){
			alert('用户名不能为空')
			$('.userName').focus()
			return 
		}else if(this.state.passWord.length==0){
			alert('密码不能为空')
			$('.passWord').focus()
			return 
		}
		let myHeaders = new Headers();
		let data = JSON.stringify(this.state);
		let that = this;
		fetch('/login',{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: data
		})
		.then(function(res){
			return res.json();
		})
		.then(function(data){
			console.log(data);
			if(data[0]=='all right'){
				that.props.onLogin(that.state.userName)
			}
		})
	}
	handleSignUp(event) {
		if(this.state.userName.length==0){
			alert('用户名不能为空')
			$('.userName').focus()
			return 
		}else if(this.state.passWord.length==0){
			alert('密码不能为空')
			$('.passWord').focus()
			return 
		}
		let myHeaders = new Headers();
		let data = JSON.stringify(this.state);
		let that = this;
		fetch('/signup',{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: data
		})
		.then(function(res){
			return res.json();
		})
		.then(function(data){
			console.log(data);
			if(data[0]=='signUp successed'){
				that.props.onLogin(that.state.userName)
			}else if(data[0]=='userName has been used'){
				alert('用户名已经被注册过')
				$('.userName').focus()
				that.setState({
					userName:'',
					passWord:''
				})
			}
		})
	}
	render(){
		return(
			<Form horizontal  onSubmit={this.handleLogin}>
				<FormGroup controlId="formHorizontalEmail">
					<Col componentClass={ControlLabel} sm={3}>
						Username
					</Col>
					<Col sm={9}>
						<FormControl className={'userName'} value={this.state.userName} onChange={this.handleUserName} type="text" placeholder="Username" />
					</Col>
				</FormGroup>
				<FormGroup controlId="formHorizontalPassword">
					<Col componentClass={ControlLabel} sm={3}>
						Password
					</Col>
					<Col sm={9}>
						<FormControl className={'passWord'} value={this.state.passWord} onChange={this.handlePassWord} type="password" placeholder="Password" />
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Checkbox>Remember me</Checkbox>
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={5}>
						<Button type="submit">
							登陆
						</Button>
					</Col>
					<Col sm={5}>
						<Button onClick={this.handleSignUp}>
							注册
						</Button>
					</Col>
				</FormGroup>
			</Form>
		)
	}
}

