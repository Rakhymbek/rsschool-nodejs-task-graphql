import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import mutation from './mutation';
import query from './query';
import { graphqlBodySchema } from './schema';

const schema = new GraphQLSchema({ query, mutation});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;
      return await graphql({
        schema,
        source: query!.toString(),
        contextValue: fastify,
        variableValues: variables,
      });
    }
  );
};

export default plugin;
