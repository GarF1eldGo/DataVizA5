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
                We found that alcohol intake reduces sleep efficiency. As shown in the box plot on the left, without drinking alcohol, sleep efficiency is concentrated around 0.86. However, after drinking alcohol, regardless of the amount consumed, sleep efficiency drops sharply to around 0.72.
                </p>
            </div>
        </div>
    );
}

export default Alcohol;