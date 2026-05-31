import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TagRespSchema } from 'src/api/routes/schemas/tags/TagRespSchema';
import { UpsertTagReqSchema } from 'src/api/routes/schemas/tags/UpsertTagReqSchema';
import { deleteTag } from 'src/controllers/tag/delete-tag';
import { updateTag } from 'src/controllers/tag/update-tag';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      response: {
        200: TagRespSchema
      },
      body: UpsertTagReqSchema,
      params: z.object({
        tagId: z.string().uuid()
      })
    }
  }, async req => {
    const tag = await updateTag({
      tagRepo: fastify.repos.tagsRepo,
      name: req.body.name,
      id: req.params.tagId
    });

    return tag;
  });

  fastify.delete('/', {
    schema: {
      response: {
        200: TagRespSchema
      },
      params: z.object({
        tagId: z.string().uuid()
      })
    }
  }, async req => {
    const tag = await deleteTag({
      tagRepo: fastify.repos.tagsRepo,
      id: req.params.tagId
    });

    return tag;
  });
};

export default routes;
