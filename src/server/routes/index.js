const Auth = require('./auth.js')
const Puppeteer = require('./puppeteer.js')
// const Graphql = require('./graphql.js')
const debug = require('debug')('koa-router');
const router = require('koa-router')()


const graphqlHTTP = require('koa-graphql');
const {apolloServer} = require ('graphql-tools')
const {schema} = require ('../models/GraphQL.model')

// exports.getCode = apolloServer({
// 	schema:schema,
// 	// rootValue: root,
// 	graphiql: true,
// 	pretty:true
// })



router
      .get('/auth', Auth.getCode)
      .all('/g', graphqlHTTP({
            schema:schema,
            // rootValue: root,
            graphiql: true,
            pretty:true
      }))
      .get('/p', Puppeteer.getCode)
module.exports = router;
