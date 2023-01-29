import { FastifyInstance } from 'fastify';
import { GraphQLObjectType } from 'graphql';
import { userCreateType, userUpdateType } from '../types/inputDataTypes';
import { userDataType } from '../types/userDataTypes';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userDataType,
      args: {
        user: { type: userCreateType },
      },
      resolve: async (_, { user }, fastify: FastifyInstance) => {
        return await fastify.db.users.create(user);
      },
    },
    updateUser: {
      type: userDataType,
      args: {
        user: { type: userUpdateType },
      },
      resolve: async (_, { user }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `users/${user.id}`,
          method: 'PATCH',
          payload: user,
        });
        return json();
      },
    },
  },
});
