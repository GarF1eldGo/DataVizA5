import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import './StickyLeftScrollama.css';

const StickyLeftScrollama = (props) => {
  const [dataset, setDataset] = useState({
    data: 0,
    steps: [0, 1, 2],
    progress: 0,
  });
  const LeftComponent = props.leftComponent;
  const RightComponent = props.rightComponent;

  const handleStepEnter = ({ data }) => {
    setDataset(prevData => ({ ...prevData, data: data}));
  };

  const handleStepProgress = ({ progress }) => {
    setDataset(prevData => ({ ...prevData, progress: progress}));
  };

  return (
    <div className="sectionLeftContainer">
      <div className="leftContainer">
        <LeftComponent value={dataset.data} progress={dataset.progress}/>
      </div>
      
      <div className="scrollamaContainer">
        <Scrollama 
          className="scrollama" 
          onStepEnter={handleStepEnter}
          progress
          onStepProgress={handleStepProgress}
          offset={0.6}
          // debug
          >
          {dataset.steps.map(value => {
            // const isVisible = value === dataset.data;
            // const background = isVisible
            //   ? `rgba(44,127,184, ${dataset.progress})`
            //   : 'white';
            // const visibility = isVisible ? 'visible' : 'hidden';
            return (
              <Step data={value} key={value}>
                <div className="step" >
                  <RightComponent value={value} />
                </div>
              </Step>
            );
          })}
        </Scrollama>
      </div>
    </div>
  );
};

export default StickyLeftScrollama;
