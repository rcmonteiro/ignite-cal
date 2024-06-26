import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export const CalendarStep = ({ onSelectDateTime }: CalendarStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const username = String(router.query?.username)
  const isDateSelected = !!selectedDate
  const selectedWeekDay = selectedDate
    ? dayjs(selectedDate).format('dddd')
    : null
  const selectedDescribedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const handleSelectDateTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()
    onSelectDateTime(dateWithTime)
  }

  const { data: availability } = useQuery<Availability>(
    ['availability', selectDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
          timezoneOffset: selectedDate ? selectedDate.getTimezoneOffset() : 0,
        },
      })
      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {selectedWeekDay} <span>{selectedDescribedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  onClick={() => handleSelectDateTime(hour)}
                  disabled={!availability?.availableTimes.includes(hour)}
                >
                  {`${String(hour).padStart(2, '0')}:00h`}
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
