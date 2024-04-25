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
                "How much did you sleep last night?" This seemingly simple question is a surprisingly accurate indicator of stress levels. Anxiety can thwart our ability to both initiate and maintain sleep, while the lack of sleep can also activate our body's stress response systems. This results in a surge of stress hormones like cortisol, which in turn further disrupts sleep, creating a negative sleep cycle.
                <br /><br />
                Our exploration of the <a href={"https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset/data"} target="_blank" >Sleep, Health, and Lifestyle Dataset</a> supports this interconnection, which shows that higher stress levels tend to be associated with shorter and poorer quality sleep.
                </p>
            </div>
        </div>
    );
}

export default StressComponent;
