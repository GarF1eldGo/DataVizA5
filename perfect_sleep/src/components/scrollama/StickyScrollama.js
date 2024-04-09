import React, { useEffect, useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import './StickyScrollama.css';


export default class StickyScrollama extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0
    };
  }

  handleStepEnter = ({ data }) => {
    this.setState({ currentStepIndex: data });
  };

  render() {
    const { currentStepIndex } = this.state;

    return (
      <div className="section">
        <div className="scrollama-container">
          <Scrollama className="scrollama" onStepEnter={this.handleStepEnter} offset={0.2}>
            <Step data={0}>
              <div className="step">Step 1</div>
            </Step>
            <Step data={1}>
              <div className="step">Step 2</div>
            </Step>
            <Step data={2}>
              <div className="step">Step 3</div>
            </Step>
          </Scrollama>
        </div>

        <div className="right-container">
          Current step: {currentStepIndex + 1}
        </div>
      </div>
    );
  }
}
