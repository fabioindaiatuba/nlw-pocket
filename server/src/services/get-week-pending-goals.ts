import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import { lte } from 'drizzle-orm'
import { db } from '../db/index.js'
import { goals } from '../db/schema.js'

dayjs.extend(weekOfYear)

export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )
}
