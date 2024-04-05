import { useState } from 'react'
import { CalendarStep } from './calendarStep'
import { ConfirmStep } from './confirmStep'

export const ScheduleSteps = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  const onSelectDateTime = (date: Date) => {
    setSelectedDateTime(date)
  }

  const onCancelDateTime = () => {
    setSelectedDateTime(null)
  }

  return selectedDateTime ? (
    <ConfirmStep
      schedulingDate={selectedDateTime}
      onCancelDateTime={onCancelDateTime}
    />
  ) : (
    <CalendarStep onSelectDateTime={onSelectDateTime} />
  )
}
