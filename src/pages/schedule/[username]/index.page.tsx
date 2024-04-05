import { prisma } from '@/lib/prisma'
import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { ScheduleSteps } from './scheduleSteps'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatar_url: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />
      <Container>
        <UserHeader>
          <Avatar src={user.avatar_url} alt="" />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>
        <ScheduleSteps />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // apenas gerar cache estático depois do acesso
    fallback: 'blocking', // vai ser sempre gerado o cache estático
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)
  const INTERVAL_1H = 60 * 60 * 1
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      bio: true,
      avatar_url: true,
    },
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
    revalidate: INTERVAL_1H,
  }
}
