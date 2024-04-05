import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, Header } from '../styles'
import { AuthError, ConnectBox, ConnectItem } from './styles'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const isAuthenticated = session.status === 'authenticated'
  const hasAuthError = !!router.query.error && !isAuthenticated

  const handleConnectCalendar = () => {
    signIn('google')
  }

  const handleNextStep = async () => {
    await router.push('/register/time-intervals')
  }
  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep size={4} currentStep={2} />
        </Header>
        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isAuthenticated ? (
              <Button size="sm" disabled>
                Conectado <Check weight="bold" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleConnectCalendar}
              >
                Conectar
                <ArrowRight weight="bold" />
              </Button>
            )}
          </ConnectItem>
          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </AuthError>
          )}

          <Button onClick={handleNextStep} disabled={!isAuthenticated}>
            Próximo passo
            <ArrowRight weight="bold" />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
