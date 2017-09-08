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
			url:'/login'
		}
	}

	componentDidMount() {
		const { dispatch } = this.props
		dispatch(inputSubreddit({ url:'/islogin',token:document.cookie.split(';')[0].split('=')[1] }))
		dispatch(fetchPostsIfNeeded({ url:'/islogin',token:document.cookie.split(';')[0].split('=')[1] }))
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
    				span: 24,
   					offset: 0,
        		},
        		sm: {
					span: 14,
					offset: 6,
        		},
      		},
    	};
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				{posts && posts.code==0  ? document.cookie='token='+posts.token : '' }
				{posts && posts.code==0  ? document.cookie='userName='+posts.userName : '' }
				<h1>{posts && (posts.code==0||posts.code==2)  ? <Redirect to='/chat'/> : posts.message }</h1>
				<FormItem
				>
				    <Input onChange={this.onUserNameChange} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
				</FormItem>
				<FormItem
				>
				    <Input onChange={this.onPassWordChange} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="密码" placeholder="Password" />
				</FormItem>
				<FormItem
					{...tailFormItemLayout}
				>
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