const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const mongoose = require('mongoose');
const Router = require('koa-router');
const router = new Router();
const Student = require('./model/Student.model');
const Login = require('./model/Login.model');
const db = 'mongodb://localhost/sampsite';
const serve = require('koa-static');
const path = require('path');
const webpack = require('webpack');

const webpackMiddleware = require("koa-webpack-dev-middleware");
const config = require('../../../webpack.config')





mongoose.connect(db, {useMongoClient: true});
app.use(bodyParser());


router.post('/signup',async (ctx,next) => new Promise((resolve, reject) => {
	let postData = ctx.request.body
	console.log(postData)
	Login
		.find({userName: postData.userName})
		.exec(function(err,db){
			console.log(db)
			if(db.length==1){
				//如果能查找到，用户名被注册了
				ctx.body = ['userName has been used']
				resolve()
			}else{
				//用户名未被注册
				var signUp = new Login({
					userName: postData.userName,
					passWord: postData.passWord
				});
				signUp.save(function(err) {});
				ctx.body = ['signUp successed']
				resolve()
			}
		})
}))

router.post('/login',async (ctx,next) => new Promise((resolve, reject) => {
	let postData = ctx.request.body
	Login
		.find({userName: postData.userName})
		.exec(function(err,db){
			if(db.length==1){
				//用户名对了
				if(postData.passWord==db[0].passWord){
					ctx.body = ['all right']
					resolve()
				}else{
					ctx.body = ['passWord wrong']
					resolve()
				}
			}else{
				//用户名错误
				ctx.body = ['userName wrong']
				resolve()
			}
		})
}))





router.post('/list',async (ctx,next) => {
	let postData = ctx.request.body
	ctx.body = postData
	let postObjectData = (postData);
	// 插入数据库
	var sam = new Student({
		name: postData.name,
		age: postData.age,
		sex: postData.sex,
		address: postData.address,
		email: postData.email,
		moneny: postData.moneny
	});
	sam.save(function(err) {});
})

router.get('/list',async ctx => {
	ctx.body = await Student.find({})
})

app
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve(path.join(__dirname,'../../../dist')))

app.listen(3001,function(){
	console.log('app listen on port 3001')
});
app.use(webpackMiddleware(webpack(config), {
    // all options optional

    noInfo: false,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    headers: { "X-Custom-Header": "yes" },
    // custom headers

    stats: {
        colors: true
    }
    // options for formating the statistics
}));
app.use(require("webpack-hot-middleware")(webpack(config)));