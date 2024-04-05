import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  if (!username) {
    return res.status(400).json({ message: 'Bad Request, user not provided' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')
  const isPastDate = schedulingDate.isBefore(new Date())

  if (isPastDate) {
    return res.status(400).json({ message: 'Scheduling date is in the past' })
  }

  const dateAlreadyScheduled = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
    select: {
      id: true,
    },
  })

  if (dateAlreadyScheduled) {
    return res.status(400).json({ message: 'This date is already scheduled' })
  }

  await prisma.scheduling.create({
    data: {
      user_id: user.id,
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
    },
  })

  return res.status(201).end()
}
