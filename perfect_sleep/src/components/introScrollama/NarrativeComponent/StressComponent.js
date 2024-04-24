import React from "react";
import './Component.css';

const StressComponent = () => {
    return (
        <div className="componentContainer">
            <div className="textBlock">
                <h1 className="title">
                Stress
                </h1>
                <p className="text">
                As you can see in the graph, there’s a correlation between stress and both sleep duration and quality. Higher stress levels generally lead to shorter and poorer quality sleep. The introduction of a linear regression line makes this relationship clearer. As stress increases, both sleep duration and quality decrease. Our app includes stress tracking to help users understand how stress might be affecting their sleep. It also provides suggestions for practices like yoga, meditation that can improve mental health and sleep.
                </p>
            </div>
        </div>
    );
}

export default StressComponent;