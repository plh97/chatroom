import React from 'react'
import { Link ,Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	fetchPostsIfNeeded,
	inputSubreddit
} from '../actions'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			documentCookie:{},
			url:'/login'
		}
	}

	componentDidMount() {
		const { dispatch } = this.props
		const { documentCookie } = this.state
		document.cookie.split(';').map((index,i)=>{
			documentCookie[index.split("=")[0].split(" ").join('')] = index.split("=")[1]
		})
		dispatch(inputSubreddit({ 
			url:'/islogin',
			token:documentCookie.token,
			userName:documentCookie.userName,
			avatorUrl:documentCookie.avatorUrl
		}))
		dispatch(fetchPostsIfNeeded({ 
			url:'/islogin',
			token:documentCookie.token,
			userName:documentCookie.userName,
			avatorUrl:documentCookie.avatorUrl
		}))
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
		const { dispatch } = this.props
		dispatch(inputSubreddit(this.state))
		dispatch(fetchPostsIfNeeded(this.state))
	}

	render() {
		const { posts,isFetching } = this.props
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
			},
		};
    	const tailFormItemLayout = {
 	     	wrapperCol: {
    		    xs: {
    				span: 14,
   					offset: 10,
        		},
        		sm: {
					span: 14,
					offset: 11,
        		},
      		},
    	};
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				{posts && posts.code==0  ? document.cookie='token='+posts.token : '' }
				{posts && posts.code==0  ? document.cookie='userName='+posts.userName : '' }
				{posts && posts.code==0  ? document.cookie='avatorUrl='+posts.avatorUrl : '' }
				<h1>{posts && (posts.code==0||posts.code==2)  ? <Redirect to='/chat'/> : posts.message }</h1>
				<FormItem {...formItemLayout} label="用户名">
				    <Input 
				    	onChange={this.onUserNameChange} 
				    	prefix={<Icon type="user" style={{ fontSize: 13 }} />} 
				    	placeholder="用户名" 
				    />
				</FormItem>
				<FormItem {...formItemLayout} label="密码">
				    <Input 
				    	onChange={this.onPassWordChange} 
				    	prefix={<Icon type="lock" style={{ fontSize: 13 }} />} 
				    	type="密码" 
				    	placeholder="Password" 
				    />
				</FormItem>
				<FormItem {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit" className="login-form-button">
						登 陆
					</Button>
					Or <Link to="/register">注 册</Link>
				</FormItem>
			</Form>
		)
	}
}


function mapStateToProps(state) {
	const { inputSubreddit, postsBySubreddit } = state
	const {
		isFetching,
		items: posts
	} = postsBySubreddit[inputSubreddit] || {
		items: [],
		isFetching:true
	}
	return {
		inputSubreddit,
		isFetching,
		posts
	}
}

export default connect(mapStateToProps)(Login)