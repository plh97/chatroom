const Auth = require('./auth.js');
const Test = require('./test.js');
const debug = require('debug')('koa-router');
const router = require('koa-router')();


const graphqlHTTP = require('koa-graphql');
const {apolloServer} = require ('graphql-tools');
const {schema} = require ('../models/GraphQL.model');

// exports.getCode = apolloServer({
// 	schema:schema,
// 	// rootValue: root,
// 	graphiql: true,
// 	pretty:true
// })



router
      .get('/auth', Auth.getCode)
      .get('/test', Test.getCode)
module.exports = router;
