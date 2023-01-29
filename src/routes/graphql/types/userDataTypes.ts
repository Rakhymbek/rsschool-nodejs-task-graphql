import { GraphQLString, GraphQLInt } from 'graphql';
import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql/type';

export const userType = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  email: { type: GraphQLString },
};

export const userDataType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    ...userType,
  },
});

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
