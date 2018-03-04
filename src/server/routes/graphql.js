const graphqlHTTP = require('koa-graphql');
const { apolloServer } = require('graphql-tools');
const { schema } = require('../models/GraphQL.model');

exports.getCode = apolloServer({
  schema,
  // rootValue: root,
  graphiql: true,
  pretty: true,
});
