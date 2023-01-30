import { GraphQLID, GraphQLInputObjectType } from 'graphql';
import { memberType, postType, profileType, userType } from './userDataTypes';

export const userCreateType = new GraphQLInputObjectType({
  name: 'UserCreateInput',
  fields: userType,
});

export const userUpdateType = new GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: {
    id: { type: GraphQLID },
    ...userType,
  },
});

export const profileCreateType = new GraphQLInputObjectType({
  name: 'ProfileCreateInput',
  fields: profileType,
});

export const profileUpdateType = new GraphQLInputObjectType({
  name: 'ProfileUpdateInput',
  fields: {
    id: { type: GraphQLID },
    ...profileType,
  },
});

export const postCreateType = new GraphQLInputObjectType({
  name: 'PostCreateInput',
  fields: postType,
});

export const postUpdateType = new GraphQLInputObjectType({
  name: 'PostUpdateInput',
  fields: {
    id: { type: GraphQLID },
    ...postType,
  },
});

export const memberTypeUpdateType = new GraphQLInputObjectType({
  name: 'MemberTypeUpdateInput',
  fields: {
    id: { type: GraphQLID },
    ...memberType,
  },
});
