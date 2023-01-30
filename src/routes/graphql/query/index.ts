import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql';
import {
  memberTypeDataType,
  postDataType,
  profileDataType,
  userDataType,
} from '../types/userDataTypes';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(userDataType),
      resolve: async (_, __, fastify: FastifyInstance) => {
        return await fastify.db.users.findMany();
      },
    },
    user: {
      type: userDataType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify: FastifyInstance) => {
        return await fastify.db.users.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
    profiles: {
      type: new GraphQLList(profileDataType),
      resolve: async (_, __, fastify: FastifyInstance) => {
        return await fastify.db.profiles.findMany();
      },
    },
    profile: {
      type: profileDataType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify: FastifyInstance) => {
        return await fastify.db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
    posts: {
      type: new GraphQLList(postDataType),
      resolve: async (_, __, fastify: FastifyInstance) => {
        return await fastify.db.posts.findMany();
      },
    },
    post: {
      type: postDataType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify: FastifyInstance) => {
        return await fastify.db.posts.findOne({ key: 'id', equals: args.id });
      },
    },
    memberTypes: {
      type: new GraphQLList(memberTypeDataType),
      resolve: async (_, __, fastify: FastifyInstance) => {
        return await fastify.db.memberTypes.findMany();
      },
    },
    memberType: {
      type: memberTypeDataType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify: FastifyInstance) => {
        return await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
  },
});
