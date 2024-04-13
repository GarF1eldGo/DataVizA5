import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import './StickyScrollama.css';

const StickyScrollama = () => {
  const [dataset, setDataset] = useState({
    data: 0,
    steps: [10, 20, 30],
    progress: 0,
  });

  const handleStepEnter = ({ data }) => {
    setDataset(prevData => ({ ...prevData, data: data}));
  };

  const handleStepProgress = ({ progress }) => {
    setDataset(prevData => ({ ...prevData, progress: progress}));
  };

  return (
    <div className="sectionContainer">
      <div className="scrollamaContainer">
        <Scrollama 
          className="scrollama" 
          onStepEnter={handleStepEnter}
          progress
          onStepProgress={handleStepProgress}
          offset={0.4}
          // debug
          >
          {dataset.steps.map(value => {
            const isVisible = value === dataset.data;
            const background = isVisible
              ? `rgba(44,127,184, ${dataset.progress})`
              : 'white';
            const visibility = isVisible ? 'visible' : 'hidden';
            return (
              <Step data={value} key={value}>
                <div className="step" style={{ background }}>
                  <p>step value: {value}</p>
                  <p style={{ visibility }}>
                    {Math.round(dataset.progress * 1000) / 10 + '%'}
                  </p>
                </div>
              </Step>
            );
          })}
        </Scrollama>
      </div>

      <div className="rightContainer">
        Current step: {dataset.data}
      </div>
    </div>
  );
};

export default StickyScrollama;
