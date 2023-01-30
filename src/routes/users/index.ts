import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });
      if (!user) throw reply.code(404);
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const body = request.body;
      return await fastify.db.users.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params as { id: string };
      const subscribers = await fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: id,
      });
      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: id,
      });
      const posts = await fastify.db.posts.findMany({
        key: 'userId',
        equals: id,
      });
      try {
        const user = await fastify.db.users.delete(id);

        subscribers.forEach(async (subscriber) => {
          await fastify.db.users.change(subscriber.id, {
            subscribedToUserIds: subscriber.subscribedToUserIds.filter(
              (userId) => userId !== id
            ),
          });
        });

        posts.forEach(async (post) => {
          await fastify.db.posts.delete(post.id);
        });

        if (profile) await fastify.db.profiles.delete(profile.id);

        return user;
      } catch (error) {
        throw reply.code(400);
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params as { id: string };
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });
      const subscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!user) {
        throw reply.code(400);
      }
      if (subscriber?.subscribedToUserIds.indexOf(id) === -1) {
        subscriber.subscribedToUserIds.push(id);
      } else {
        throw reply.code(400);
      }
      await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: subscriber.subscribedToUserIds,
      });
      return user;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params as { id: string };
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!user) {
        throw reply.code(400);
      }
      if (user.subscribedToUserIds.indexOf(id) === -1) {
        throw reply.code(400);
      }

      await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: user.subscribedToUserIds.filter(
          (userId) => userId !== id
        ),
      });
      return user;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      try {
        return await fastify.db.users.change(id, request.body);
      } catch (error) {
        throw reply.code(400);
      }
    }
  );
};

export default plugin;
