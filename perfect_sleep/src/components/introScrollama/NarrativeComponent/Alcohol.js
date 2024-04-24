import React from "react";
import './Component.css';

const Alcohol = () => {
    return (
        <div className="componentContainer">
            <div className="textBlock">
                <h1 className="title">
                Alcohol Consumption
                </h1>
                <p className="text">
                We see that alcohol consumption affects both sleep duration and REM sleep percentage. Research. From the data, we further see that any amount of alcohol tends to have similar negative effects on sleep, so we will use alcohol as categorical yes/no tracking in our sleep app, which is easier for users to track.
                </p>
            </div>
        </div>
    );
}

export default Alcohol;