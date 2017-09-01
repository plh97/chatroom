import React from "react"
import {Grid,Row,Form, FormGroup, Col, ControlLabel, FormControl, Checkbox, Button} from 'react-bootstrap'
import _ from 'lodash'
import Login from './component/Login.jsx'
import Avator from './component/Avator.jsx'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'



class AddButton extends React.Component{
	constructor(props){
		super(props);
		this.name = this.name.bind(this); 
		this.age = this.age.bind(this); 
		this.sex = this.sex.bind(this); 
		this.address = this.address.bind(this); 
		this.email = this.email.bind(this); 
		this.moneny = this.moneny.bind(this); 
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			name:'',
			age:'',
			sex:'',
			address:'',
			email:'',
			moneny:'',
		}
	}
	name(e){
		this.setState({name:e.target.value})
	}
	age(e){
		this.setState({age:e.target.value})
	}
	sex(e){
		this.setState({sex:e.target.value})
	}
	address(e){
		this.setState({address:e.target.value})
	}
	email(e){
		this.setState({email:e.target.value})
	}
	moneny(e){
		this.setState({moneny:e.target.value})
	}

	handleSubmit(event) {
		this.props.handleChange(this.state)
		event.preventDefault();
	}
	render(){
		return(
			<form onSubmit={this.handleSubmit}>
				<FormGroup controlId="formControlsText">
					<Col componentClass={ControlLabel} sm={2}>
						name
					</Col>
					<Col sm={4}>
						<FormControl type="text" 
							onChange={this.name}
							placeholder="Name" />
					</Col>
				</FormGroup>
				<FormGroup controlId="formControlsText">
					<Col componentClass={ControlLabel} sm={2}>
						age
					</Col>
					<Col sm={4}>
						<FormControl type="text"
							onChange={this.age}
							placeholder="Age" />
					</Col>
				</FormGroup>
				<FormGroup controlId="formControlsText">
					<Col componentClass={ControlLabel} sm={2}>
						sex
					</Col>
					<Col sm={4}>
						<FormControl type="text" 
							onChange={this.sex}
							placeholder="Sex" />
					</Col>
				</FormGroup>
				<FormGroup controlId="formControlsText">
					<Col componentClass={ControlLabel} sm={2}>
						address
					</Col>
					<Col sm={4}>
						<FormControl type="text" 
							onChange={this.address}
							placeholder="Address" />
					</Col>
				</FormGroup>
				<FormGroup controlId="formHorizontalEmail">
					<Col componentClass={ControlLabel} sm={2}>
						Email
					</Col>
					<Col sm={4}>
						<FormControl type="email" 
							onChange={this.email}
							placeholder="Email" />
					</Col>
				</FormGroup>
				<FormGroup controlId="formControlsText">
					<Col componentClass={ControlLabel} sm={2}>
						Moneny
					</Col>
					<Col sm={4}>
						<FormControl type="text" 
							onChange={this.moneny}
							placeholder="Moneny" />
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={4}>
						<Button type="submit">
							submit
						</Button>
					</Col>
				</FormGroup>
			</form>
		)
	}
}
class TestComponent extends React.Component{
	constructor(){
		super();
		this.state = {list:[]};
	}
	componentDidMount(){
		fetch("./list",{method:"GET"}).then((respond) => {
			return respond.json();
		}).then((data) => {
			this.state.list = data;
			this.setState(this.state);
		})
	}
	render(){
		const addHtmls = _.values(this.props.person);
		let addHtml;
		addHtmls.length == 0 ? addHtml = null : addHtml = (
			<Col sm={6} md={4} lg={3}>
				<ol>
					<h2>{addHtmls[0]}</h2>
					<li>age: {addHtmls[1]}</li>
					<li>sex: {addHtmls[2]}</li>
					<li>address: {addHtmls[3]}</li>
					<li>email: {addHtmls[4]}</li>
					<li>moneny: {addHtmls[5]}</li>
				</ol>
			</Col>
		);


		const numbers = _.values(this.state.list);
		const listItems = numbers.reverse().map((number,i) =>
			<Col key={i} sm={6} md={4} lg={3}>
				<ol >
					<h2>{number.name}</h2>
					<li>age: {number.age}</li>
					<li>sex: {number.sex}</li>
					<li>address: {number.address}</li>
					<li>email: {number.email}</li>
					<li>moneny: {number.moneny}</li>
				</ol>
			</Col>
		);
		return (
			<Row>
				{addHtml}
				{listItems}
			</Row>
		)
	}
}

export default class Layout extends React.Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleIslogin = this.handleIslogin.bind(this);
		this.state = {
			person:null,
			islogin:false,
			userName:null
		}
	}
	handleIslogin(e){
		this.setState({
			islogin:!this.state.islogin,
			userName:e
		})
	}
	handleChange(e){
		this.setState({
			person:e
		})
		let myHeaders = new Headers();
		let data = JSON.stringify( e );
		fetch('/list',{
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
		})
	}
	render(){
		return (
			<Grid>
				<Row>
					<Col lg={4} md={6} sm={6} xs={6}>
						{this.state.islogin ? <Avator userName={this.state.userName} onLogin={this.handleIslogin}/> : <Login onLogin={this.handleIslogin}/>}
					</Col>
				</Row>
				<Row>
					<Col md={10}>
						<AddButton handleChange={this.handleChange}/>
					</Col>
				</Row>
				<TestComponent person={this.state.person}/>
			</Grid>
		);
	}
}

