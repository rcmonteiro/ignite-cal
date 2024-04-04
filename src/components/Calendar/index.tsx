import { getWeekDays } from '@/utils/get-week-days'
import { CaretCircleLeft, CaretCircleRight } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

export const Calendar = () => {
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          Abril <span>2024</span>
        </CalendarTitle>
        <CalendarActions>
          <button>
            <CaretCircleLeft />
          </button>
          <button>
            <CaretCircleRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {getWeekDays({ short: true }).map((day) => {
              return <th key={day}>{day}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
