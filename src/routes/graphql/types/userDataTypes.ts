import { FastifyInstance } from 'fastify';
import { GraphQLString, GraphQLInt } from 'graphql';
import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql/type';

export const userType = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  email: { type: GraphQLString },
};

export const profileType = {
  avatar: { type: GraphQLString },
  sex: { type: GraphQLString },
  birthday: { type: GraphQLInt },
  country: { type: GraphQLString },
  street: { type: GraphQLString },
  city: { type: GraphQLString },
  memberTypeId: { type: GraphQLString },
  userId: { type: GraphQLID },
};

export const profileDataType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: GraphQLID },
    ...profileType,
  },
});

export const postType = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  userId: { type: GraphQLString },
};

export const postDataType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
    ...postType,
  },
});

export const memberType = {
  discount: { type: GraphQLInt },
  monthPostsLimit: { type: GraphQLInt },
};

export const memberTypeDataType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: GraphQLString },
    ...memberType,
  },
});

export const userDataType = new GraphQLObjectType({
  name: 'User',
  fields: {
    ...userType,
    id: { type: GraphQLID },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
  },
});

export const userFullDataType = new GraphQLObjectType({
  name: 'UserFullDataType',
  fields: {
    ...userType,
    id: { type: GraphQLID },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    profile: {
      type: profileDataType,
      resolve: async (user, _, fastify: FastifyInstance) => {
        return await fastify.db.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });
      },
    },
    posts: {
      type: new GraphQLList(postDataType),
      resolve: async (user, _, fastify: FastifyInstance) => {
        return await fastify.db.posts.findMany({
          key: 'userId',
          equals: user.id,
        });
      },
    },
    memberType: {
      type: memberTypeDataType,
      resolve: async (user, _, fastify: FastifyInstance) => {
        const profile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });

        if (profile === null) return Promise.resolve([]);

        return await fastify.db.memberTypes.findMany({
          key: 'id',
          equals: profile.memberTypeId,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userDataType),
      resolve: async (user, _, fastify: FastifyInstance) => {
        return await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: user.id,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userDataType),
      resolve: async (user, _, fastify: FastifyInstance) => {
        return await fastify.db.users.findMany({
          key: 'id',
          equals: user.subscribedToUserIds,
        });
      },
    },
  },
});
