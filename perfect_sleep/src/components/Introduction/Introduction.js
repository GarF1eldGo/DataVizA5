import React from "react";
import './Introduction.css';

const Introduction = () => {
    return (
        <div className="Container2">
            <div className="Block2">
                <p className="text2">
                Below is an interactive prototype of our sleep dashboard! Each ring represents a day in your sleep journey, with the outer ring being the most recent day. When you click on a ring, the line graphs adjust to show your stress levels, alcohol consumption, and phone usage in the past week (the red dot is the current day).
                <br></br> <br></br> 
                Fun fact! This data is provided from Apple Watch by our team member, Chengke Deng. Click on a ring to get started!
                </p>
            </div>
        </div>
    );
}

export default Introduction;