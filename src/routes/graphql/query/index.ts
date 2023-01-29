import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLObjectType } from 'graphql';
import { userDataType } from '../types/userDataTypes';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(userDataType),
      resolve: async (_, __, fastify: FastifyInstance) => {
        return await fastify.db.users.findMany();
      },
    },
  },
});
