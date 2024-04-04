import type { NextApiRequest, NextApiResponse } from 'next'
// import { parseCookies } from 'nookies'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) return res.status(401).end()

  const userId = session.user.id

  const { intervals } = timeIntervalsBodySchema.parse(req.body)
  console.log(intervals)
  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: userId,
        },
      })
    }),
  )

  return res.status(201).end()
}
