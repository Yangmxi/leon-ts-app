import * as React from 'react'
import './index.less'
import Utils from '@utils'
import Tools from './tools'
import { Icon } from 'antd'

interface IStates {
  row: number,
  column: number,
  screen: number[][],
  playboard: number[][],
  cBlock: string,
  interval?: any,
  y: number,
  x: number,
  rotate: number,
  intervalTime: number,
  couldMove: boolean,
  pause: boolean
}

interface IProps {
  isMobile: boolean
}

const keyCode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
}

const blocks = ['I', 'L', 'J', 'T', 'Z', 'S', 'O']

class Tetris extends React.Component<IProps, IStates> {

  interval

  componentWillMount() {
    const row = 20
    const column = 10
    const screen = this.calculateScreen({ row, column })
    document.addEventListener('keydown', this.keydown)
    document.addEventListener('visibilitychange', this.visibilitychange)
    this.setState({
      row, column, screen,
      playboard: screen,
      cBlock: blocks[Utils.random(0, 7)],
      y: 0,
      x: 0,
      rotate: 0,
      intervalTime: 1000,
      pause: false
    })
  }

  visibilitychange = () => {
    if ((!this.state.pause && document.visibilityState === 'hidden')
        || (this.state.pause && document.visibilityState !== 'hidden')) {
      this.togglePause()
    }
  }

  clearRow = playboard => {
    const result = Utils.clone(playboard).map(row => row.map(item => item ? 2 : 0))
    playboard.forEach((row, i) => {
      if (row.every(item => item)) {
        result.splice(i, 1)
        result.unshift(new Array(10).fill(0))
      }
    })
    return result
  }

  keydown = e => this.doMove(e.keyCode)

  doMove = code => {
    const { x: cx, y: my, screen, cBlock, row, rotate, pause } = this.state
    if (pause) { return }
    let playboard = [[]]
    let x = cx
    switch(code) {
      case keyCode.left:
        x = cx - 1
        const { 
          playboard: lp, 
          x: lx, 
          couldMove: lc 
        } = Tools.getCurrPosition({ x, y: my ? my : 20, cBlock, screen, rotate, moveTo: keyCode.left })
        if (lc) { 
          x = lx 
          playboard = lp
          this.setState({ playboard, x })
        }
        return
      case keyCode.right:
        x = cx + 1
        const { 
          playboard: rp, 
          x: rx, 
          couldMove: rc 
        } = Tools.getCurrPosition({ x, y: my ? my : 20, cBlock, screen, rotate, moveTo: keyCode.right })
        if (rc) { 
          x = rx 
          playboard = rp
          this.setState({ playboard, x })
        }
        return
      case keyCode.down: 
        if (my > row) { return }
        const { couldMove, playboard: dp } = Tools.getCurrPosition({ x, y: my + 1, cBlock, screen, rotate, moveTo: keyCode.down })
        if (couldMove) {
          this.newInterval()
          this.setState({ y: my + 1, playboard: dp})
        } else {
          this.reset()
        }
        return
      case keyCode.up:
        let r = rotate
        r = r >= 3 ? 0 : r + 1
        const { 
          playboard: up, 
          couldMove: uc 
        } = Tools.getCurrPosition({ x: cx, y: my ? my : 20, cBlock, screen, rotate: r, moveTo: keyCode.up })
        if (uc) {
          playboard = up
          this.setState({ playboard, rotate: r })
        }
        return
      default:
        
    }
  }

  newInterval = (next?) => {
    if (this.interval) { clearTimeout(this.interval)}
    this.doMovePlayboard(next)
  }

  componentDidMount() {
    this.doMovePlayboard()
  }

  doMovePlayboard = (next?) => {
    if (next) {
      const { x: ix, y: iy } = this.state
      this.movePlayboard({ x: ix, y: iy})
    }
    this.doTimeout()
  }

  doTimeout = () => {
    this.interval = setTimeout(() => {
      const { x, y } = this.state
      this.movePlayboard({ x, y })
      this.doTimeout()
    }, this.state.intervalTime)
  }

  movePlayboard = ({ x, y }) => {
    const { screen, cBlock, rotate } = this.state
    const { playboard, couldMove } = Tools.getCurrPosition({ x, y: y + 1, cBlock, screen, rotate, moveTo: keyCode.down })
    if (couldMove) {
      this.setState({ playboard, y: y + 1 })
    } else {
      this.reset()
    }
  }

  reset = () => {
    this.setState({
      cBlock: blocks[Utils.random(0, 7)],
      y: 0, x: 0, rotate: 0,
      screen: this.clearRow(this.state.playboard)
    }, () => this.newInterval(true))
  }

  componentWillUnmount() {
    if (this.interval) { clearTimeout(this.interval) }
    document.removeEventListener('keydown', this.keydown)
    document.removeEventListener('visibilitychange', this.visibilitychange)
  }

  // state 
  // 0: empty, 1: full
  calculateScreen = ({ row: r, column: c }) => {
    const result: number[][] = []
    for (let i = 0; i < r; i++) {
      const row: number[] = []
      for (let j = 0; j < c; j++) { row.push(0) }
      result.push(row)
    }
    return result
  }

  renderPlayboard = () => this.state.playboard.map((r, i) => (
    <div className='row' key={i}>
      { r.map((c, j) => <div key={j} className={`item ${c ? c === 1 ? 'block' : 'full' : ''}`}/>) }
    </div>
  ))

  togglePause = () => {
    const { pause } = this.state
    if (!pause) {
      if (this.interval) { clearTimeout(this.interval)}
    } else {
      this.newInterval()
    }
    this.setState({ pause: !pause})
  }

  
  render() {
    const { isMobile } = this.props
    const { pause } = this.state
    return (
      <div className={`tetris-wrapper ${isMobile ? 'mobile' : ''}`}>
        <div className='tetris-screen'>
          { this.renderPlayboard() }
        </div>
        <div className='btn-wrapper'>
          <div className='functional-btn'>
            <Icon type={`ts-app icon-${pause ? 'play' : 'pause'}`} onClick={this.togglePause}/>
            <Icon type={`ts-app icon-down`}/>
          </div>
          <div className='direction'>
            <Icon type='ts-app icon-up-circle' onClick={Utils.handle(this.doMove, keyCode.up)}/>
            <div className='middle'>
              <Icon type='ts-app icon-left-circle' onClick={Utils.handle(this.doMove, keyCode.left)}/>
              <Icon type='ts-app icon-right-circle' onClick={Utils.handle(this.doMove, keyCode.right)}/>
            </div>
            <Icon type='ts-app icon-down-circle' onClick={Utils.handle(this.doMove, keyCode.down)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: Tetris,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})