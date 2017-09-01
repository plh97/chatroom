import React from "react"
import {Grid,Row,Form, FormGroup, Col, ControlLabel, FormControl, Checkbox, Button} from 'react-bootstrap'


export default class Avator extends React.Component{
	constructor(props){
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
	}
	handleLogout(){
		this.props.onLogin('userName')
	}
	render(){
		return(
			<div>
				<p>userName: {this.props.userName}</p>
				<Button onClick={this.handleLogout}>Logout</Button>
			</div>
		)
	}
}
