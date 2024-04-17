import React, {forwardRef} from 'react';
import * as d3 from 'd3';
import { Scrollama, Step } from 'react-scrollama';

const SnapScroll = (props) => {
    const components = props.components;

    const handleStepEnter = (response) => {
        const { element, direction, index } = response;

        if (direction === 'up') { // disable snap effect for up.
            return ;
        }

        const rect = element.getBoundingClientRect();
        const topOffset = rect.top + window.scrollY;

        const scrollToOffset = topOffset; 

        window.scrollTo({
            top: scrollToOffset,
            behavior: 'smooth'
        });
    };

    return (
      <div className='snapScrollContainer'>
        <Scrollama 
            className="scrollama" 
            onStepEnter={handleStepEnter}
            progress
            offset={0.9}
            >
            {components.map((Component, index) => {
                console.log("hello: ", typeof Component);
                return (
                    <Step key={index}>
                        <div className="step" >
                            <Component value={index}/>
                        </div>
                    </Step>
                );
            })}
        </Scrollama>
      </div>  
    );
}

const RefForwardingComponent = forwardRef((props, ref) => {
    return props.children(ref);
  });

export default SnapScroll;