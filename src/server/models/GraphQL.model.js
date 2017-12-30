const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require ('graphql');
const axios = require ('axios');
const mongoose = require ('mongoose');

const {
    Model,
    Schema,
} = mongoose;

const graphqlSchema = new Schema({
	id: { type: GraphQLString },
	name: { type: GraphQLString },
	email: { type: GraphQLString },
});

const graphqlModel = mongoose.model('graphql', graphqlSchema);


//Customer Type
const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		_id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
	})
});

const query = new GraphQLObjectType({
	name: 'QueryType',
	fields: {
		allCats: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args) {
				return graphqlModel.find({})
			}
		}
	}
});

const mutation = new GraphQLObjectType({
	name: 'createCat',
	fields: {
		createCat: {
			type: CustomerType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parentValue, args) {
				return graphqlModel.create({
					name: args.name,
					email: args.email,
					age: args.age
				})
			}
		}
	}
})

const schema = new GraphQLSchema({
	query,
	mutation
})

module.exports = {
	schema
}