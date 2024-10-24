import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createGoalCompletion } from '../services/create-goal-completion.js'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request, response) => {
      const { goalId } = request.body
      await createGoalCompletion({
        goalId,
      })
      response.status(204).send()
    }
  )
}
