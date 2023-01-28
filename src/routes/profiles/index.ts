import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });
      return profile ? profile : reply.code(404);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const body = request.body;
      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: body.userId,
      });
      if (profile) return reply.code(400);
      const newProfile = await fastify.db.profiles.create(body);
      return newProfile ? newProfile : reply.code(400);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      try {
        return await fastify.db.profiles.delete(id);
      } catch (error) {
        return reply.code(400);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      try {
        return await fastify.db.profiles.change(id, request.body);
      } catch (error) {
        return reply.code(400);
      }
    }
  );
};

export default plugin;
