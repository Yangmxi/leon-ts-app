import React from 'react'
import Vector from './Vector'

interface IProps {
  ventorList: number[][];
  editable: boolean;
  transformRow: any;
  opacity: number;
  onInput(e): void;
  onBlur(e): void;
  btnEdit(e): void;
  innerRef: any
}

class Vector1 extends React.Component<IProps> {
  render() {
    const { opacity, btnEdit, innerRef } = this.props
    return (
      <div className="v-wrapper" ref={innerRef}>
        <div className="btn-wrapper vertical left" style={{ opacity }}>
          <div className="btn" data-id="1" onClick={btnEdit}>
            -
          </div>
          <div className="btn" data-id="2" onClick={btnEdit}>
            +
          </div>
        </div>
        <div className="v-inner">
          <Vector {...this.props} ventor="v1" hasShadow={true} />
          <div className="btn-wrapper horizontal" style={{ opacity }}>
            <div className="btn" data-id="3" onClick={btnEdit}>
              -
            </div>
            <div className="btn" data-id="4" onClick={btnEdit}>
              +
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Vector1
