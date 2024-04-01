import previewImg from '@/assets/app-preview.png'
import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { ClainUsernameForm } from './components/ClaimUsernameForm'
import { Container, Hero, Preview } from './styles'
export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>
        <ClainUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={previewImg}
          height={400}
          quality={100}
          priority
          alt="Calendário ilustrando a aplicação em funcionamento"
        />
      </Preview>
    </Container>
  )
}
