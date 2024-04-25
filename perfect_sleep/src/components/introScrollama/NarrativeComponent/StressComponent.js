import React from "react";
import './Component.css';

const StressComponent = () => {
    return (
        <div className="componentContainer">
            <div className="textBlock">
                <h1 className="title">
                    Stress & Sleep
                </h1>
                <p className="text">
                As you can see in the graph, there’s a correlation between stress and both sleep duration and quality. Higher stress levels generally lead to shorter and poorer quality sleep.
                </p>
            </div>
        </div>
    );
}

export default StressComponent;
