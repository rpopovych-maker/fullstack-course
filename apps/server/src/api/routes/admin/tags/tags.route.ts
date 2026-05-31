import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TagRespSchema } from 'src/api/routes/schemas/tags/TagRespSchema';
import { createTag } from 'src/controllers/tag/create-tag';
import { getTags } from 'src/controllers/tag/get-tags';
import { UpsertTagReqSchema } from 'src/api/routes/schemas/tags/UpsertTagReqSchema';
import { GetTagsQuerySchema } from 'src/api/routes/schemas/tags/GetTagsQuerySchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: GetTagsQuerySchema,
      response: {
        200: TagRespSchema.array()
      }
    }
  }, async req => {
    const tags = await getTags({
      tagRepo: fastify.repos.tagsRepo,
      search: req.query.search
    });

    return tags;
  });

  fastify.post('/', {
    schema: {
      response: {
        200: TagRespSchema
      },
      body: UpsertTagReqSchema
    }
  }, async req => {
    const tag = await createTag({
      tagRepo: fastify.repos.tagsRepo,
      name: req.body.name
    });

    return tag;
  });
};

export default routes;
