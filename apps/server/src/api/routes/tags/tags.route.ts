import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TagRespSchema } from 'src/api/routes/schemas/tags/TagRespSchema';
import { getTags } from 'src/controllers/tag/get-tags';
import { GetTagsQuerySchema } from 'src/api/routes/schemas/tags/GetTagsQuerySchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: GetTagsQuerySchema,
      response: {
        200: TagRespSchema.array()
      }
    },
    config: {
      skipAuth: true
    }
  }, async req => {
    const tags = await getTags({
      tagRepo: fastify.repos.tagsRepo,
      search: req.query.search
    });

    return tags;
  });
};

export default routes;
