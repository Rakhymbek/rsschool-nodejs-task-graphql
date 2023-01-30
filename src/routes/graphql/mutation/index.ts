import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLObjectType } from 'graphql';
import {
  memberTypeUpdateType,
  postCreateType,
  postUpdateType,
  profileCreateType,
  profileUpdateType,
  userCreateType,
  userUpdateType,
} from '../types/inputDataTypes';
import {
  memberTypeDataType,
  postDataType,
  profileDataType,
  userDataType,
} from '../types/userDataTypes';

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
          url: `/users/${user.id}`,
          method: 'PATCH',
          payload: user,
        });
        return json();
      },
    },
    userSubscribedTo: {
      type: userDataType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (_, { id, ...restData }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/users/${id}/subscribeTo`,
          method: 'POST',
          payload: restData,
        });
        return json();
      },
    },
    userUnSubscribedFrom: {
      type: userDataType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (_, { id, ...restData }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/users/${id}/unsubscribeFrom`,
          method: 'POST',
          payload: restData,
        });
        return json();
      },
    },
    createProfile: {
      type: profileDataType,
      args: {
        profile: { type: profileCreateType },
      },
      resolve: async (_, { profile }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/profiles`,
          method: 'POST',
          payload: profile,
        });
        return json();
      },
    },
    updateProfile: {
      type: profileDataType,
      args: {
        profile: { type: profileUpdateType },
      },
      resolve: async (_, { profile }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/profiles/${profile.id}`,
          method: 'PATCH',
          payload: profile,
        });
        return json();
      },
    },
    createPost: {
      type: postDataType,
      args: {
        post: { type: postCreateType },
      },
      resolve: async (_, { post }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/posts`,
          method: 'POST',
          payload: post,
        });
        return json();
      },
    },
    updatePost: {
      type: postDataType,
      args: {
        post: { type: postUpdateType },
      },
      resolve: async (_, { post }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/posts/${post.id}`,
          method: 'PATCH',
          payload: post,
        });
        return json();
      },
    },
    updateMemberType: {
      type: memberTypeDataType,
      args: {
        memberType: { type: memberTypeUpdateType },
      },
      resolve: async (_, { memberType }, fastify: FastifyInstance) => {
        const { json } = await fastify.inject({
          url: `/member-types/${memberType.id}`,
          method: 'PATCH',
          payload: memberType,
        });
        return json();
      },
    },
  },
});
