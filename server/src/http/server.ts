import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createGoalCompletion } from '../services/create-goal-completion.js'
import { createGoal } from '../services/create-goal.js'
import { getWeekPendingGoals } from '../services/get-week-pending-goals.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals()
  return { pendingGoals }
})

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async request => {
    const { title, desiredWeeklyFrequency } = request.body
    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

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

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
