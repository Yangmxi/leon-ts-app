
import * as React from 'react'
import Ventor from './Ventor'

interface IMatrixProps { 
  ventorList: number[][],
  editable: boolean,
  onInput(e): void
}

class Vector1 extends React.Component<IMatrixProps> {
  render() {
    return <Ventor {...this.props} ventor='v1'/>
  }
}

export default Vector1
