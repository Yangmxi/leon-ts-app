import * as React from 'react'
import Util from '@utils'
import './index.less'
import { Icon } from 'antd'

interface IState {
  year: number,
  month: number,
  step: number,
  title: string[],
  fromDate?: {
    year: number,
    month: number,
    day: number
  },
  toDate?: {
    year: number,
    month: number,
    day: number
  }
}

class DatePicker extends React.Component<{}, IState> {
  componentWillMount() {
    const date = new Date()
    this.setState({
      step: 0,
      year: date.getFullYear(),
      month: date.getMonth(),
      title: ['日', '一', '二', '三', '四', '五', '六']
    })
  }

  next = () => {
    const { year, month} = this.nextMonth()
    this.setState({ year, month })
  }

  pre = () => {
    const { year, month} = this.preMonth()
    this.setState({ year, month })
  }

  nextMonth = () => {
    const { year, month } = this.state
    if (month >= 11) {
      return {
        year: year + 1,
        month: 0
      }
    } else {
      return {
        year,
        month: month + 1
      }
    }
  }

  preMonth = () => {
    const { year, month } = this.state
    if (month === 0) {
      return {
        year: year - 1,
        month: 11
      }
    } else {
      return {
        year,
        month: month - 1
      }
    }
  }

  renderTitle = () => {
    const { title } = this.state
    return (
      <tr className='c-row'>
        {title.map((item, i) => <td className='item' key={i}>{item}</td>)}
      </tr>
    )
  }

  itemClick = ({ year, month, day }) => {
    if (!day) { return }
    const { fromDate, step } = this.state
    if (!fromDate) {
      this.setState({ fromDate: { year, month, day }, step: 1 })
    } else {
      if (step === 2) {
        this.setState({ fromDate: { year, month, day }, toDate: undefined, step: 0 })
      } else {
        const { year: fromYear, month: fromMonth, day: fromDay } = fromDate
        if (new Date(fromYear, fromMonth, fromDay) > new Date(year, month, day)) {
          this.setState({ fromDate: { year, month, day }, step: 1 })
        } else {
          this.setState({ toDate: { year, month, day }, step: 2 })
        }
      }
    }
  }

  itemMouseEnter = ({ year, month, day }) => {
    const { fromDate, step } = this.state
    if (!fromDate || step === 2 || !day) { return }
    this.setState({ toDate: { year, month, day } })
  }

  isSelected = ({ year, month, day, date }) => {
    if (!date) { return false }
    const { year: dYear, month: dMonth, day: dDay } = date
    return year === dYear && month === dMonth && day === dDay
  }

  isInRange = ({ year, month, day }) => {
    const { fromDate, toDate } = this.state
    if (fromDate && toDate && day) {
      const { year: fromYear, month: fromMonth, day: fromDay } = fromDate
      const { year: toYear, month: toMonth, day: toDay } = toDate
      return new Date(year, month, day) > new Date(fromYear, fromMonth, fromDay) 
          && new Date(year, month, day) < new Date(toYear, toMonth, toDay)
    } 
    return false
  }

  renderRow = ({ row, rowIdx, year, month }) => (
    <tr className='c-row' key={rowIdx}>
      {row.map((day, itemIdx) => {
        return (
          <td className={`
              item
              ${day ? 'date' : ''}
              ${this.isInRange({ year, month, day }) ? 'in-range' : ''}
              ${this.isSelected({ year, month, day, date: this.state.fromDate }) ? 'selectedFrom': '' }
              ${this.isSelected({ year, month, day, date: this.state.toDate }) ? 'selectedTo': '' }
            `} 
            key={itemIdx}
            onClick={Util.handle(this.itemClick, { year, month, day })}
            onMouseEnter={Util.handle(this.itemMouseEnter, { year, month, day })}
          >
            <span className='item-inner'>{day || ''}</span>
          </td>
        )
      })}
    </tr>
  )

  renderCalender = ({ list, year, month }) => (
    <div className='calender'>
      <div className='year-month'>{year}-{month}</div>
      <table>
        <thead>
          {this.renderTitle()}
        </thead>
        <tbody>
          {list.map((row, rowIdx) => this.renderRow({ row, rowIdx, year, month }))}
        </tbody>
      </table>
    </div>
  )

  render() {
    const { year: leftYear, month: leftMonth } = this.state
    const { year: rightYear, month: rightMonth } = this.nextMonth()
    const left = Util.getMonthList(leftYear, leftMonth + 1)
    const right = Util.getMonthList(rightYear, rightMonth + 1)

    return (
      <div className='calender-wrapper'>
        <Icon type="left" className='left' onClick={this.pre}/>
        <Icon type="right" className='right' onClick={this.next}/>
        {this.renderCalender(left)}
        {this.renderCalender(right)}
      </div>
    )
  }
}

export default DatePicker