import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year and/or Month not provided' })
  }

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

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      week_day: true,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.DATE) AS date,
      DATE_FORMAT(S.DATE, "%Y-%m") AS X,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size,
      COUNT(S.date) AS amount
    FROM schedulings S
    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))
    WHERE 
      S.user_id = ${user.id}
      AND DATE_FORMAT(S.DATE, "%Y-%m") = ${`${year}-${month}`}
    GROUP BY 
      1, 2, 3
    HAVING amount >= size 
  `
  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return res.json({ blockedWeekDays, blockedDates })
}
