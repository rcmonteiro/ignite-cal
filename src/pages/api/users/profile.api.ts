import type { NextApiRequest, NextApiResponse } from 'next'
// import { parseCookies } from 'nookies'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const profileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') return res.status(405).end()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) return res.status(401).end()

  const userId = session.user.id

  const { bio } = profileBodySchema.parse(req.body)

  await prisma.user.update({
    data: {
      bio,
    },
    where: {
      id: userId,
    },
  })

  return res.status(204).end()
}
