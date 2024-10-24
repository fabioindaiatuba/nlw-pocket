import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createCompletionRoute } from '../routes/create-completion.js'
import { createGoalRoute } from '../routes/create-goals.js'
import { getPendingGoalRoute } from '../routes/get-pending-goals.js'
import { getWeekSumaryRoute } from '../routes/get-week-summary.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalRoute)
app.register(getWeekSumaryRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
